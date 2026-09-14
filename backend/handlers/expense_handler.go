package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"spendwise-backend/middleware"
	"spendwise-backend/models"
)

type ExpenseHandler struct {
	DB *sql.DB
}

func NewExpenseHandler(db *sql.DB) *ExpenseHandler {
	return &ExpenseHandler{
		DB: db,
	}
}

func (h *ExpenseHandler) GetExpenses(
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

	rows, err := h.DB.Query(`
		SELECT id, amount, category, expense_date, note
		FROM expenses
		WHERE user_id = $1
		ORDER BY expense_date DESC, id DESC
	`,
		userID,
	)

	if err != nil {
		http.Error(
			w,
			"Failed to fetch expenses",
			http.StatusInternalServerError,
		)
		return
	}

	defer rows.Close()

	expenses := []models.Expense{}

	for rows.Next() {

		var expense models.Expense
		var note sql.NullString

		err := rows.Scan(
			&expense.ID,
			&expense.Amount,
			&expense.Category,
			&expense.ExpenseDate,
			&note,
		)

		if err != nil {
			http.Error(
				w,
				"Failed to read expense",
				http.StatusInternalServerError,
			)
			return
		}

		if note.Valid {
			expense.Note = note.String
		}

		expenses = append(
			expenses,
			expense,
		)
	}

	if err := rows.Err(); err != nil {
		http.Error(
			w,
			"Failed to read database rows",
			http.StatusInternalServerError,
		)
		return
	}

	json.NewEncoder(w).Encode(expenses)
}

func (h *ExpenseHandler) CreateExpense(
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

	var request models.CreateExpenseRequest

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

	if request.Amount <= 0 {
		http.Error(
			w,
			"Amount must be greater than 0",
			http.StatusBadRequest,
		)
		return
	}

	if request.Category == "" {
		http.Error(
			w,
			"Category is required",
			http.StatusBadRequest,
		)
		return
	}

	if request.ExpenseDate == "" {
		http.Error(
			w,
			"Date is required",
			http.StatusBadRequest,
		)
		return
	}

	var expense models.Expense
	var note sql.NullString

	err = h.DB.QueryRow(`
		INSERT INTO expenses
		(amount, category, expense_date, note, user_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, amount, category, expense_date, note
	`,
		request.Amount,
		request.Category,
		request.ExpenseDate,
		request.Note,
		userID,
	).Scan(
		&expense.ID,
		&expense.Amount,
		&expense.Category,
		&expense.ExpenseDate,
		&note,
	)

	if err != nil {
		log.Println(
			"Database insert error:",
			err,
		)

		http.Error(
			w,
			"Failed to create expense",
			http.StatusInternalServerError,
		)
		return
	}

	if note.Valid {
		expense.Note = note.String
	}

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(expense)
}

func (h *ExpenseHandler) UpdateExpense(
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

	idText := strings.TrimPrefix(
		r.URL.Path,
		"/api/expenses/",
	)

	id, err := strconv.Atoi(idText)

	if err != nil {
		http.Error(
			w,
			"Invalid expense ID",
			http.StatusBadRequest,
		)
		return
	}

	var request models.CreateExpenseRequest

	err = json.NewDecoder(
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

	if request.Amount <= 0 {
		http.Error(
			w,
			"Amount must be greater than 0",
			http.StatusBadRequest,
		)
		return
	}

	if request.Category == "" {
		http.Error(
			w,
			"Category is required",
			http.StatusBadRequest,
		)
		return
	}

	if request.ExpenseDate == "" {
		http.Error(
			w,
			"Date is required",
			http.StatusBadRequest,
		)
		return
	}

	var expense models.Expense
	var note sql.NullString

	err = h.DB.QueryRow(`
		UPDATE expenses
		SET amount = $1,
			category = $2,
			expense_date = $3,
			note = $4
		WHERE id = $5
		AND user_id = $6
		RETURNING id, amount, category, expense_date, note
	`,
		request.Amount,
		request.Category,
		request.ExpenseDate,
		request.Note,
		id,
		userID,
	).Scan(
		&expense.ID,
		&expense.Amount,
		&expense.Category,
		&expense.ExpenseDate,
		&note,
	)

	if err == sql.ErrNoRows {
		http.Error(
			w,
			"Expense not found",
			http.StatusNotFound,
		)
		return
	}

	if err != nil {
		log.Println(
			"Database update error:",
			err,
		)

		http.Error(
			w,
			"Failed to update expense",
			http.StatusInternalServerError,
		)
		return
	}

	if note.Valid {
		expense.Note = note.String
	}

	json.NewEncoder(w).Encode(expense)
}

func (h *ExpenseHandler) DeleteExpense(
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

	idText := strings.TrimPrefix(
		r.URL.Path,
		"/api/expenses/",
	)

	id, err := strconv.Atoi(idText)

	if err != nil {
		http.Error(
			w,
			"Invalid expense ID",
			http.StatusBadRequest,
		)
		return
	}

	result, err := h.DB.Exec(
		"DELETE FROM expenses WHERE id = $1 AND user_id = $2",
		id,
		userID,
	)

	if err != nil {
		log.Println(
			"Database delete error:",
			err,
		)

		http.Error(
			w,
			"Failed to delete expense",
			http.StatusInternalServerError,
		)
		return
	}

	rowsAffected, err := result.RowsAffected()

	if err != nil {
		http.Error(
			w,
			"Failed to verify deletion",
			http.StatusInternalServerError,
		)
		return
	}

	if rowsAffected == 0 {
		http.Error(
			w,
			"Expense not found",
			http.StatusNotFound,
		)
		return
	}

	response := map[string]string{
		"status":  "success",
		"message": "Expense deleted successfully",
	}

	json.NewEncoder(w).Encode(response)
}
