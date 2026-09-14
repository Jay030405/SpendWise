package main

import (
	"encoding/json"
	"log"
	"net/http"

	"spendwise-backend/config"
	"spendwise-backend/handlers"
	"spendwise-backend/middleware"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		origin := r.Header.Get("Origin")

		// Allow both Vite development server and Docker/Nginx frontend.
		if origin == "http://localhost:5173" ||
			origin == "http://localhost:3000" {

			w.Header().Set(
				"Access-Control-Allow-Origin",
				origin,
			)
		}

		w.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS",
		)

		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func healthHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	response := map[string]string{
		"status":  "success",
		"message": "SpendWise backend is running",
	}

	json.NewEncoder(w).Encode(response)
}

func main() {

	db := config.ConnectDatabase()

	defer db.Close()

	expenseHandler :=
		handlers.NewExpenseHandler(db)

	authHandler :=
		handlers.NewAuthHandler(db)

	mux := http.NewServeMux()

	// ============================================
	// Health Check
	// ============================================

	mux.HandleFunc(
		"/api/health",
		healthHandler,
	)

	// ============================================
	// Register
	// ============================================

	mux.HandleFunc(
		"/api/register",
		func(
			w http.ResponseWriter,
			r *http.Request,
		) {

			if r.Method != http.MethodPost {
				http.Error(
					w,
					"Method not allowed",
					http.StatusMethodNotAllowed,
				)

				return
			}

			authHandler.Register(
				w,
				r,
			)
		},
	)

	// ============================================
	// Login
	// ============================================

	mux.HandleFunc(
		"/api/login",
		func(
			w http.ResponseWriter,
			r *http.Request,
		) {

			if r.Method != http.MethodPost {
				http.Error(
					w,
					"Method not allowed",
					http.StatusMethodNotAllowed,
				)

				return
			}

			authHandler.Login(
				w,
				r,
			)
		},
	)

	// ============================================
	// Current User Profile
	// ============================================

	profileHandler := func(
		w http.ResponseWriter,
		r *http.Request,
	) {

		if r.Method != http.MethodGet {
			http.Error(
				w,
				"Method not allowed",
				http.StatusMethodNotAllowed,
			)

			return
		}

		authHandler.GetProfile(
			w,
			r,
		)
	}

	mux.Handle(
		"/api/me",
		middleware.AuthMiddleware(
			http.HandlerFunc(profileHandler),
		),
	)

	// ============================================
	// Expense Routes
	// ============================================

	expenseRoutes := http.NewServeMux()

	// GET /api/expenses
	// POST /api/expenses

	expenseRoutes.HandleFunc(
		"/api/expenses",
		func(
			w http.ResponseWriter,
			r *http.Request,
		) {

			switch r.Method {

			case http.MethodGet:

				expenseHandler.GetExpenses(
					w,
					r,
				)

			case http.MethodPost:

				expenseHandler.CreateExpense(
					w,
					r,
				)

			default:

				http.Error(
					w,
					"Method not allowed",
					http.StatusMethodNotAllowed,
				)
			}
		},
	)

	// PUT /api/expenses/{id}
	// DELETE /api/expenses/{id}

	expenseRoutes.HandleFunc(
		"/api/expenses/",
		func(
			w http.ResponseWriter,
			r *http.Request,
		) {

			switch r.Method {

			case http.MethodPut:

				expenseHandler.UpdateExpense(
					w,
					r,
				)

			case http.MethodDelete:

				expenseHandler.DeleteExpense(
					w,
					r,
				)

			default:

				http.Error(
					w,
					"Method not allowed",
					http.StatusMethodNotAllowed,
				)
			}
		},
	)

	// ============================================
	// Protect Expense APIs
	// ============================================

	mux.Handle(
		"/api/expenses",
		middleware.AuthMiddleware(
			expenseRoutes,
		),
	)

	mux.Handle(
		"/api/expenses/",
		middleware.AuthMiddleware(
			expenseRoutes,
		),
	)

	// ============================================
	// Enable CORS
	// ============================================

	handler := enableCORS(mux)

	log.Println(
		"SpendWise backend is running on http://localhost:8080",
	)

	err := http.ListenAndServe(
		":8080",
		handler,
	)

	if err != nil {
		log.Fatal(err)
	}
}
