# SpendWise 💰

SpendWise is a full-stack personal expense tracker that allows users to securely manage, track, and analyze their daily expenses.

The application provides user authentication, expense management, category-wise summaries, monthly summaries, charts, and a PostgreSQL database for persistent storage.

---

## 🚀 Live Demo

**Live Application:**  
https://spendwise-frontend-jtv8.onrender.com

**Backend API:**  
https://spendwise-ywox.onrender.com

**Health Check:**  
https://spendwise-ywox.onrender.com/api/health

## 🚀 Features

- 🔐 User Registration
- 🔑 User Login with JWT Authentication
- 👤 User Profile
- 💰 Add Expenses
- ✏️ Edit Expenses
- 🗑️ Delete Expenses
- 📋 Expense History
- 🔎 Expense Search and Filtering
- 📊 Category-wise Expense Summary
- 📅 Monthly Expense Summary
- 📈 Expense Charts
- 🗄️ PostgreSQL Database
- 🐳 Dockerized Frontend, Backend and Database
- 🔒 User-specific expense data
- 💾 Persistent database storage

---

## 🛠️ Technologies Used

### Frontend

- React
- JavaScript
- HTML
- CSS
- Recharts
- Vite
- Nginx

### Backend

- Go (Golang)
- REST API
- JWT Authentication
- bcrypt
- net/http

### Database

- PostgreSQL

### DevOps / Tools

- Docker
- Docker Compose
- Git
- GitHub
- Visual Studio Code

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │       Browser       │
                 │                     │
                 │   React Frontend    │
                 └──────────┬──────────┘
                            │
                         HTTP/API
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Go Backend     │
                 │                     │
                 │     REST API        │
                 │  JWT Authentication │
                 └──────────┬──────────┘
                            │
                         SQL Queries
                            │
                            ▼
                 ┌─────────────────────┐
                 │     PostgreSQL      │
                 │                     │
                 │ Users + Expenses    │
                 └─────────────────────┘