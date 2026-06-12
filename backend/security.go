package main

import (
	"bytes"
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"mime"
	"os"
	"path/filepath"
	"strings"
    "golang.org/x/crypto/bcrypt"
)

// HashPassword creates a bcrypt hash from a plain-text password
func HashPassword(password string) (string, error) {
    // The cost determines how computationally expensive the hash is
    // Higher is more secure but slower (default is 10)
    hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return "", err
    }
    return string(hashedBytes), nil
}

// VerifyPassword checks if the provided password matches the stored hash
func VerifyPassword(hashedPassword, providedPassword string) error {
    return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
}

// GenerateSecureKey creates a 32-byte key for AES-256 (standard for production)
func GenerateSecureKey() ([]byte, error) {
	key := make([]byte, 32)
	// crypto/rand provides cryptographically secure random numbers
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return nil, err
	}
	return key, nil
}

// Encrypt performs authenticated encryption using AES-GCM
func Encrypt(plaintext []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Nonce must be unique for every operation to ensure security
	nonce := make([]byte, aesGCM.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}

	// Seal appends the ciphertext to the nonce, return format: [nonce][ciphertext]
	return aesGCM.Seal(nonce, nonce, plaintext, nil), nil
}

// getMasterKey grabs the 32-byte master key from your .env (as hex-encoded 64 chars)
func getMasterKey() []byte {
	keyStr := os.Getenv("MASTER_KEY")
	if len(keyStr) != 64 {
		log.Fatal("MASTER_KEY must be a 64-character hex string in .env")
	}
	key, err := hex.DecodeString(keyStr)
	if err != nil {
		log.Fatal("MASTER_KEY must be valid hex:", err)
	}
	return key
}

// Decrypt verifies and decrypts the data
func Decrypt(ciphertext []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := aesGCM.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, fmt.Errorf("ciphertext too short")
	}

	nonce, encryptedData := ciphertext[:nonceSize], ciphertext[nonceSize:]
	return aesGCM.Open(nil, nonce, encryptedData, nil)
}

func EncryptFile(input io.Reader, key []byte) (io.Reader, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}

	plaintext, err := io.ReadAll(input)
	if err != nil {
		return nil, err
	}

	ciphertext := aesGCM.Seal(nonce, nonce, plaintext, nil)
	return bytes.NewReader(ciphertext), nil
}

func validateAndSendFile(s3Service *S3Service, path string) {
	contentType := mime.TypeByExtension(filepath.Ext(path))
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	pathName := path
	if strings.Contains(path, "/") {
		pos := strings.LastIndex(path, "/")
		pathName = path[pos+1:]
	}

	file, err := os.Open(path)
	if err != nil {
		log.Printf("Failed to open file at %s: %v", path, err)
		return
	}
	defer file.Close()

	// Use the master key instead of a random, unsaved key
	key := getMasterKey()

	encryptedReader, err := EncryptFile(file, key)
	if err != nil {
		log.Printf("Encryption error: %v", err)
		return
	}

	err = s3Service.UploadFileToR2(context.Background(), pathName, encryptedReader, contentType)
	if err != nil {
		log.Printf("Upload error: %v", err)
		return
	}

	fmt.Println("Upload successful!")
}
