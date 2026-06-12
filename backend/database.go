package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func dbConnection() *pgxpool.Pool {
	connStr := "postgres://postgres:root@localhost:5432/tenant_db?sslmode=disable"

	ctx := context.Background()

	dbpool, err := pgxpool.New(ctx, connStr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}

	err = dbpool.Ping(ctx)
	if err != nil {
		log.Fatalf("Database ping failed: %v\n", err)
	}

	fmt.Println("✅ Successfully connected to PostgreSQL!")

	var currentTime time.Time
	err = dbpool.QueryRow(ctx, "SELECT NOW()").Scan(&currentTime)
	if err != nil {
		log.Fatalf("Query failed: %v\n", err)
	}

	fmt.Printf("PostgreSQL Server Time: %s\n", currentTime)

	return dbpool
}
