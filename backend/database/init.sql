-- ============================================
-- SpendWise Database Initialization
-- ============================================


-- ============================================
-- Users Table
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- Expenses Table
-- ============================================

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,

    amount DECIMAL(10, 2) NOT NULL
        CHECK (amount > 0),

    category VARCHAR(50) NOT NULL,

    expense_date DATE NOT NULL,

    note VARCHAR(255),

    user_id INTEGER NOT NULL,

    CONSTRAINT fk_expenses_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================
-- Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_expenses_user_id
ON expenses(user_id);


CREATE INDEX IF NOT EXISTS idx_expenses_date
ON expenses(expense_date);


CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);