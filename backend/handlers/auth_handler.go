package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"spendwise-backend/models"
)

type AuthHandler struct {
	DB *sql.DB
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{
		DB: db,
	}
}

func (h *AuthHandler) Register(
	w http.ResponseWriter,
	r *http.Request,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	var request models.RegisterRequest

	err := json.NewDecoder(
		r.Body,
	).Decode(&request)

	if err != nil {
		http.Error(
			w,
			"Invalid request data",
			http.StatusBadRequest,
		)
		return
	}

	request.Name = strings.TrimSpace(
		request.Name,
	)

	request.Email = strings.ToLower(
		strings.TrimSpace(
			request.Email,
		),
	)

	if request.Name == "" {
		http.Error(
			w,
			"Name is required",
			http.StatusBadRequest,
		)
		return
	}

	if request.Email == "" {
		http.Error(
			w,
			"Email is required",
			http.StatusBadRequest,
		)
		return
	}

	if request.Password == "" {
		http.Error(
			w,
			"Password is required",
			http.StatusBadRequest,
		)
		return
	}

	if len(request.Password) < 6 {
		http.Error(
			w,
			"Password must be at least 6 characters",
			http.StatusBadRequest,
		)
		return
	}

	var existingID int

	err = h.DB.QueryRow(
		"SELECT id FROM users WHERE email = $1",
		request.Email,
	).Scan(&existingID)

	if err == nil {
		http.Error(
			w,
			"Email is already registered",
			http.StatusConflict,
		)
		return
	}

	if err != sql.ErrNoRows {
		http.Error(
			w,
			"Database error",
			http.StatusInternalServerError,
		)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(request.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to secure password",
			http.StatusInternalServerError,
		)
		return
	}

	var user models.User

	err = h.DB.QueryRow(`
		INSERT INTO users
		(name, email, password)
		VALUES ($1, $2, $3)
		RETURNING id, name, email, created_at
	`,
		request.Name,
		request.Email,
		string(hashedPassword),
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.CreatedAt,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to create user",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(
		map[string]interface{}{
			"message": "User registered successfully",
			"user":    user,
		},
	)
}
