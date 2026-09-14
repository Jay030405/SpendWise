package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"spendwise-backend/middleware"
	"spendwise-backend/models"
)

func (h *AuthHandler) Login(
	w http.ResponseWriter,
	r *http.Request,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	var request models.LoginRequest

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

	request.Email = strings.ToLower(
		strings.TrimSpace(
			request.Email,
		),
	)

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

	var user models.User

	err = h.DB.QueryRow(`
		SELECT id, name, email, password, created_at
		FROM users
		WHERE email = $1
	`,
		request.Email,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		http.Error(
			w,
			"Invalid email or password",
			http.StatusUnauthorized,
		)
		return
	}

	if err != nil {
		http.Error(
			w,
			"Database error",
			http.StatusInternalServerError,
		)
		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(request.Password),
	)

	if err != nil {
		http.Error(
			w,
			"Invalid email or password",
			http.StatusUnauthorized,
		)
		return
	}

	token, err := middleware.GenerateToken(
		user.ID,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to generate authentication token",
			http.StatusInternalServerError,
		)
		return
	}

	user.Password = ""

	response := map[string]interface{}{
		"message": "Login successful",
		"token":   token,
		"user":    user,
	}

	json.NewEncoder(w).Encode(response)
}
