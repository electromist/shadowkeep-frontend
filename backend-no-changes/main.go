package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// User represents the data retrieved from the database
type User struct {
	ID           string `json:"org_id"`
	Organization string `json:"name"`
}

type DashboardPayload struct {
	OrgID    string `json:"orgId"`
	Filename string `json:"filename"`
}

type FileListItem struct {
	FileID    string `json:"file_id"`
	OrgID     string `json:"org_id"`
	FileName  string `json:"filename"`
	CreatedAt time.Time `json:"created_at"`
}

var (
	idMap = make(map[string]string)
	idMu  sync.Mutex
)

type Server struct {
	appData   string
	s3Service *S3Service
	db        *pgxpool.Pool
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}


func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, falling back to system environment variables")
	}

	dbPool := dbConnection()
	defer dbPool.Close()

	s3Service, err := NewR2Service()
	if err != nil {
		log.Fatal(err)
	}

	/*
			{
		    	"path": "/mnt/e/golang-projects/multitenant-saas/mts.md"
			} we give this in the raw body, and headers set to Content-Type, application/json

			now on hitting send, we get {
		    	"id": "file_123"
			}

			we, client or our frontend then takes this id and gives a get request to "GET /fetch/{id}"
			then we get upload successful as a result.
	*/
	initOauth()

	// Inject s3Service here
	server := &Server{appData: "ShadowKeep", s3Service: s3Service, db: dbPool}
	mux := http.NewServeMux()

	// register an org
	mux.HandleFunc("POST /register", server.handleRegisteredPath)
	mux.HandleFunc("POST /login", server.LoggedInPath)
	mux.HandleFunc("POST /refresh", server.RefreshHandler)
	mux.HandleFunc("POST /upload", server.handleUpload)
	mux.HandleFunc("POST /files", server.handleListFiles)
	mux.HandleFunc("POST /download", server.handleDownload)

	mux.HandleFunc("/dashboard", AuthMiddleware(ProtectedDashboard))
	// mux.HandleFunc("POST /api/submit", server.handleRegisteredPath)
	mux.HandleFunc("GET /fetch/{id}", server.handleFetchByID)
	mux.HandleFunc("/auth/google/login", HandleGoogleLogin)
	mux.HandleFunc("/auth/google/callback", server.HandleGoogleCallback)
	fmt.Println("Serving on port 3000")
	log.Fatal(http.ListenAndServe(":3000", corsMiddleware(mux)))
}
