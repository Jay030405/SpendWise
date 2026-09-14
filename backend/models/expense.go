package models

type Expense struct {
	ID          int     `json:"id"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	ExpenseDate string  `json:"date"`
	Note        string  `json:"note"`
}

type CreateExpenseRequest struct {
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	ExpenseDate string  `json:"date"`
	Note        string  `json:"note"`
}
