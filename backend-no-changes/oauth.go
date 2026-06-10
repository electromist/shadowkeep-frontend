package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// Global OAuth2 configuration structure
var googleOAuthConfig *oauth2.Config

// A random state string to protect against CSRF attacks
const oauthStateString = "random_super_secure_state_string"

// Initialize the OAuth configuration (Call this in your main initialization)
func initOauth() {
	googleOAuthConfig = &oauth2.Config{
		RedirectURL:  os.Getenv("OAUTH_REDIRECT_URL"),
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes: []string{
			"openid",
			"profile",
			"email",
		},
		Endpoint: google.Endpoint,
	}
}

// 1. Redirect Handler: Sends the user to Google's login page
func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	// Generate the Google Auth URL using our state string
	url := googleOAuthConfig.AuthCodeURL(oauthStateString)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// 2. Callback Handler: Google sends the user back here with a code
func(s *Server) HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	// Verify state string matches to prevent CSRF attacks
	state := r.FormValue("state")
	if state != oauthStateString {
		http.Error(w, "Invalid OAuth state", http.StatusBadRequest)
		return
	}

	// Exchange the temporary code from Google for an access token
	code := r.FormValue("code")
	token, err := googleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Code exchange failed", http.StatusInternalServerError)
		return
	}

	// Use the token to fetch user profile info from Google's API
	client := googleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		http.Error(w, "Failed to fetch user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Parse the profile information
	var googleUser struct {
		ID    string `json:"sub"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		http.Error(w, "Failed to parse user info", http.StatusInternalServerError)
		return
	}

	fmt.Println(googleUser.ID, googleUser.Email, googleUser.Name)

	// 3. Process the User in your DB
	// - Search your DB for an org matching googleUser.Email or googleUser.ID.
	// - If they exist: Fetch their internal OrgID.
	// - If they don't exist: Create a new Org entry in the DB and generate a new OrgID.
	login := `SELECT org_id, name FROM organizations WHERE email = $1 AND name = $2;`

	userExists := true

	var dbOrgID, dbName string
	err = s.db.QueryRow(r.Context(), login, googleUser.Email, googleUser.Name).Scan(
		&dbOrgID,
		&dbName,
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

	var internalOrgID string
	if userExists {
		internalOrgID = dbOrgID
	} else {
		internalOrgID = uuid.New().String()

		register := `INSERT INTO organizations (org_id, name, email) VALUES ($1, $2, $3)`

			_, err = s.db.Exec(r.Context(), register, internalOrgID, googleUser.Name, googleUser.Email)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	}

	// 4. Issue your application's internal JWT Access Token
	accessTokenExpiry := time.Now().Add(15 * time.Minute)
	claims := jwt.MapClaims{
		"org_id":     internalOrgID,
		"token_type": "access",
		"exp":        jwt.NewNumericDate(accessTokenExpiry),
	}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	
	// Assuming getJWTSecret() is your secret key function from earlier steps
	var jwtSecret = []byte("your_super_secret_key_here") 
	jwtTokenString, err := jwtToken.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, "Failed to generate system token", http.StatusInternalServerError)
		return
	}

	// 5. Send your system JWT back to the client application
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    jwtTokenString,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	targetURL := fmt.Sprintf("http://localhost:3001/dashboard?orgId=%s&name=%s", url.QueryEscape(internalOrgID), url.QueryEscape(googleUser.Name))
	http.Redirect(w, r, targetURL, http.StatusSeeOther)
}
