package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"spendwise-backend/middleware"
)

func (h *AuthHandler) GetProfile(
	w http.ResponseWriter,
	r *http.Request,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	userID, ok := middleware.GetUserID(
		r.Context(),
	)

	if !ok {
		http.Error(
			w,
			"User authentication required",
			http.StatusUnauthorized,
		)
		return
	}

	var (
		id    int
		name  string
		email string
	)

	err := h.DB.QueryRow(`
		SELECT id, name, email
		FROM users
		WHERE id = $1
	`,
		userID,
	).Scan(
		&id,
		&name,
		&email,
	)

	if err == sql.ErrNoRows {
		http.Error(
			w,
			"User not found",
			http.StatusNotFound,
		)
		return
	}

	if err != nil {
		http.Error(
			w,
			"Failed to fetch user profile",
			http.StatusInternalServerError,
		)
		return
	}

	response := map[string]interface{}{
		"id":    id,
		"name":  name,
		"email": email,
	}

	json.NewEncoder(w).Encode(response)
}
