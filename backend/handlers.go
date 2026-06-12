package main

import (
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Payload struct {
	OrgName string `json:"orgName"`
	Email string `json:"email"`
	Password string `json:"password"`

}

// json being handled here
func (s *Server) handleRegisteredPath(w http.ResponseWriter, r *http.Request) {
	var p Payload
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}
	id := uuid.New().String()
	// passwordHash := fmt.Sprintf("%x", sha256.Sum256([]byte(p.Password))) 

		hashedPassword, _ := HashPassword(p.Password)


	// Print received JSON data
	fmt.Printf("Received payload - Id: %s, OrgName: %s, Email: %s, Password: %s\n", id, p.OrgName, p.Email, p.Password)

	register := `INSERT INTO organizations (org_id, name, email, password_hash) VALUES ($1, $2, $3, $4)`

	_, err = s.db.Exec(r.Context(), register, id, p.OrgName, p.Email, hashedPassword)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User added successfully"))
}

// CheckPasswordHash compares a plaintext password with its bcrypt hash
func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

type SignInPayload struct {
	Organization string `json:"orgName"`
	Password string `json:"password"`
}


var jwtKey = []byte("your_super_secret_key_here")

type CustomClaims struct {
	OrgID string `json:"org_id"`
	TokenType string `json:"token_type"`
	jwt.RegisteredClaims
}


func (s *Server) LoggedInPath(w http.ResponseWriter, r *http.Request) {
	var p SignInPayload
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	fmt.Printf("Login attempt for Organization: %s\n", p.Organization)

	login := `SELECT org_id, name, password_hash FROM organizations WHERE name = $1;`

	var existingUser User
	var passwordHash string
	userExists := true

	// QueryRow executes a query that is expected to return at most one row
	err = s.db.QueryRow(r.Context(), login, p.Organization).Scan(
		&existingUser.ID,
		&existingUser.Organization,
		&passwordHash,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			userExists = false
		} else {
			log.Printf("Database query error: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	if !userExists {
		http.Error(w, "Invalid credentials or organization not found", http.StatusUnauthorized)
		return
	}

	if !CheckPasswordHash(p.Password, passwordHash) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(15 * time.Minute)

	// Create the claims
	claims := &CustomClaims{
		OrgID: p.Organization,
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Declare the token with the algorithm and claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		// Sign the token with your secret key
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

		// 2. Generate Refresh Token (Long-lived: 7 days)
	refreshTokenExpiry := time.Now().Add(7 * 24 * time.Hour)
	refreshClaims := &CustomClaims{
		OrgID:     p.Organization,
		TokenType: "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(refreshTokenExpiry),
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, _ := refreshToken.SignedString(jwtKey)

	// Return the token to the client
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"token": "%s", "refresh_token": "%s"}`, tokenString, refreshTokenString)
}

func (s *Server) RefreshHandler(w http.ResponseWriter, r *http.Request) {
	type RefreshRequest struct {
		RefreshToken string `json:"refresh_token"`
	}

	var req RefreshRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	claims := &CustomClaims{}
	token, err := jwt.ParseWithClaims(req.RefreshToken, claims, func(t *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid || claims.TokenType != "refresh" {
		http.Error(w, "Invalid or expired refresh token", http.StatusUnauthorized)
		return
	}

	newAccessTokenExpiry := time.Now().Add(15 * time.Minute)
	newAccessClaims := &CustomClaims{
		OrgID:     claims.OrgID,
		TokenType: "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(newAccessTokenExpiry),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	newAccessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, newAccessClaims)
	newAccessTokenString, err := newAccessToken.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"access_token": "%s"}`, newAccessTokenString)
}


// 2. Auth Middleware to Protect Routes
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get token from Authorization header (Format: Bearer <token>)
		authHeader := r.Header.Get("Authorization")
		tokenString := ""
		if len(authHeader) >= 8 && authHeader[:7] == "Bearer " {
			tokenString = authHeader[7:]
		} else if cookie, err := r.Cookie("access_token"); err == nil {
			tokenString = cookie.Value
		}
		if tokenString == "" {
			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
			return
		}

		// Parse and validate the token
		claims := &CustomClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid || claims.TokenType != "access" {
			http.Error(w, "Unauthorized token", http.StatusUnauthorized)
			return
		}

		// Pass the OrgID forward (Optional: context can be used here)
		r.Header.Set("X-Org-ID", claims.OrgID)

		next.ServeHTTP(w, r)
	}
}

func (s *Server) handleFetchByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	idMu.Lock()
	path, exists := idMap[id]
	idMu.Unlock()

	if !exists {
		http.Error(w, "Invalid ID", http.StatusNotFound)
		return
	}
	w.Write([]byte("Fetching file at: " + path))

	// Call with s.s3Service
	validateAndSendFile(s.s3Service, path)
}

func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
    err := r.ParseMultipartForm(50 << 20)
    if err != nil {
        http.Error(w, "Invalid Form Data", http.StatusBadRequest)
        return
    }

	file, fileHeader, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "File is required", http.StatusBadRequest)
        return
    }
    defer file.Close()

    orgId := r.FormValue("orgId")
    if orgId == "" {
        http.Error(w, "Organization ID is required", http.StatusBadRequest)
        return
    }

    FileID := uuid.New().String()
    fileKey := fmt.Sprintf("%s/%s", orgId, FileID)

    // Generate DEK for this file
    rawDEK, _ := GenerateSecureKey()

    // Decode hex-encoded MASTER_KEY to 32 bytes
    masterKey, err := hex.DecodeString(os.Getenv("MASTER_KEY"))
    if err != nil {
        log.Printf("Invalid MASTER_KEY: %v", err)
        http.Error(w, "Server configuration error", http.StatusInternalServerError)
        return
    }

    // Encrypt DEK with master key and store in DB
    encryption_key, err := Encrypt(rawDEK, masterKey)
    if err != nil {
        log.Printf("Encryption error: %v", err)
        http.Error(w, "Failed to encrypt key", http.StatusInternalServerError)
        return
    }

	store := `INSERT INTO files (file_id, org_id, filename, encryption_key) VALUES ($1, $2, $3, $4)`
	_, err = s.db.Exec(r.Context(), store, FileID, orgId, fileHeader.Filename, encryption_key)
    if err != nil {
        log.Printf("Database insert error: %v", err)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    // Encrypt file with rawDEK, get encrypted reader
    encryptedReader, err := EncryptFile(file, rawDEK)
    if err != nil {
        log.Printf("Encryption error: %v", err)
        http.Error(w, "Failed to encrypt file", http.StatusInternalServerError)
        return
    }

    // Upload encrypted file to R2
    err = s.s3Service.UploadFileToR2(r.Context(), fileKey, encryptedReader, "application/octet-stream")
    if err != nil {
        log.Printf("Upload error: %v", err)
        http.Error(w, "Failed to upload file", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "fileKey": fileKey,
        "status":  "success",
    })
}

func (s *Server) handleListFiles(w http.ResponseWriter, r *http.Request) {
	orgId := r.FormValue("orgId")
	if orgId == "" {
		http.Error(w, "Organization ID is required", http.StatusBadRequest)
		return
	}

	query := `SELECT file_id, org_id, filename, created_at FROM files WHERE org_id = $1`
	rows, err := s.db.Query(r.Context(), query, orgId)
	if err != nil {
		log.Printf("Database query error: %v", err)
		http.Error(w, "Failed to fetch files", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var files []FileListItem
	for rows.Next() {
		var file FileListItem
		err = rows.Scan(&file.FileID, &file.OrgID, &file.FileName, &file.CreatedAt)
		if err != nil {
			log.Printf("Row scan error: %v", err)
			http.Error(w, "Failed to read files", http.StatusInternalServerError)
			return
		}
		files = append(files, file)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(files)
}

func (s *Server) handleDownload(w http.ResponseWriter, r *http.Request) {
	fileId := r.FormValue("fileId")
	if fileId == "" {
		http.Error(w, "File ID is required", http.StatusBadRequest)
		return
	}

	var encryptedKey []byte
	var orgId string

	// fetch org_id, filename and encrypted DEK, build S3 key as org_id/file_id
	var fileName string
	query := `SELECT org_id, filename, encryption_key FROM files WHERE file_id = $1`
	err := s.db.QueryRow(r.Context(), query, fileId).Scan(&orgId, &fileName, &encryptedKey)
	fileKey := fmt.Sprintf("%s/%s", orgId, fileId)
	if err != nil {
		log.Printf("Database query error: %v", err)
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Get object from R2
	obj, err := s.s3Service.s3Client.GetObject(r.Context(), &s3.GetObjectInput{
		Bucket: &s.s3Service.bucket,
		Key:    &fileKey,
	})
	if err != nil {
		log.Printf("S3 fetch error: %v", err)
		http.Error(w, "Failed to fetch file", http.StatusInternalServerError)
		return
	}
	defer obj.Body.Close()

	// Read encrypted data from R2
	encryptedData, err := io.ReadAll(obj.Body)
	if err != nil {
		log.Printf("Read error: %v", err)
		http.Error(w, "Failed to read file", http.StatusInternalServerError)
		return
	}

	// Decrypt with master key first to get the DEK
	masterKey := getMasterKey()
	rawDEK, err := Decrypt(encryptedKey, masterKey)
	if err != nil {
		log.Printf("Decryption error (DEK): %v", err)
		http.Error(w, "Failed to decrypt file key", http.StatusInternalServerError)
		return
	}

	// Decrypt the file with the DEK
	plaintext, err := Decrypt(encryptedData, rawDEK)
	if err != nil {
		log.Printf("Decryption error (file): %v", err)
		http.Error(w, "Failed to decrypt file", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	w.Write(plaintext)
}

func ProtectedDashboard(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}