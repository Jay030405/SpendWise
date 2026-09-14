package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

func ConnectDatabase() *sql.DB {

	err := godotenv.Load()

	if err != nil {
		log.Println(
			"Warning: .env file not found",
		)
	}

	host := os.Getenv("DB_HOST")
	portText := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	port, err := strconv.Atoi(portText)

	if err != nil {
		log.Fatal(
			"Invalid DB_PORT in .env",
		)
	}

	connectionString := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host,
		port,
		user,
		password,
		dbname,
	)

	db, err := sql.Open(
		"postgres",
		connectionString,
	)

	if err != nil {
		log.Fatal(
			"Error opening database:",
			err,
		)
	}

	err = db.Ping()

	if err != nil {
		log.Fatal(
			"Error connecting to PostgreSQL:",
			err,
		)
	}

	log.Println(
		"Successfully connected to PostgreSQL!",
	)

	return db
}
