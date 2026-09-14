import { useEffect, useState } from "react";

import Dashboard from "./components/Dashboard.jsx";
import CategorySummary from "./components/CategorySummary.jsx";
import CategoryChart from "./components/CategoryChart.jsx";
import CategoryPieChart from "./components/CategoryPieChart.jsx";
import MonthlySummary from "./components/MonthlySummary.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseTable from "./components/ExpenseTable.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";

import {
  login,
  register,
  getCurrentUser,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "./services/api.js";

function App() {
  // =========================
  // Authentication
  // =========================

  const [token, setToken] = useState(
    localStorage.getItem("spendwise_token")
  );

  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("spendwise_user") || "null"
    )
  );

  const [authPage, setAuthPage] = useState("login");

  const [authLoading, setAuthLoading] = useState(false);

  const [authError, setAuthError] = useState("");

  const [authSuccess, setAuthSuccess] = useState("");

  const [loginEmail, setLoginEmail] = useState("");

  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");

  const [registerPassword, setRegisterPassword] = useState("");

  // =========================
  // Profile
  // =========================

  const [showProfile, setShowProfile] = useState(false);

  // =========================
  // Expense Form
  // =========================

  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState("Food");

  const [date, setDate] = useState("");

  const [note, setNote] = useState("");

  // =========================
  // Expenses
  // =========================

  const [expenses, setExpenses] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // =========================
  // Search / Filter / Sort
  // =========================

  const [searchText, setSearchText] = useState("");

  const [filterCategory, setFilterCategory] = useState("All");

  const [filterDate, setFilterDate] = useState("");

  const [sortOrder, setSortOrder] = useState("none");

  // =========================
  // Loading / Messages
  // =========================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // Dashboard Calculations
  // =========================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const expenseCount = expenses.length;

  const averageExpense =
    expenseCount === 0
      ? 0
      : totalExpenses / expenseCount;

  // =========================
  // Category Totals
  // =========================

  const categoryTotals = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
    Entertainment: 0,
    Other: 0,
  };

  expenses.forEach((expense) => {
    if (
      categoryTotals[expense.category] !==
      undefined
    ) {
      categoryTotals[expense.category] +=
        Number(expense.amount);
    }
  });

  // =========================
  // Monthly Totals
  // =========================

  const monthlyTotals = {};

  expenses.forEach((expense) => {
    if (!expense.date) {
      return;
    }

    const month = expense.date.slice(0, 7);

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += Number(
      expense.amount
    );
  });

  const sortedMonthlyTotals =
    Object.fromEntries(
      Object.entries(monthlyTotals).sort(
        ([monthA], [monthB]) =>
          monthB.localeCompare(monthA)
      )
    );

  // =========================
  // Load User + Expenses
  // =========================

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchExpenses();
    }
  }, [token]);

  // =========================
  // Fetch Current User
  // =========================

  async function fetchUserProfile() {
    if (!token) {
      return;
    }

    try {
      const data = await getCurrentUser(token);

      setUser(data);

      localStorage.setItem(
        "spendwise_user",
        JSON.stringify(data)
      );
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        handleLogout();
      }
    }
  }

  // =========================
  // Login
  // =========================

  async function handleLogin() {
    setAuthError("");
    setAuthSuccess("");

    if (!loginEmail || !loginPassword) {
      setAuthError(
        "Please enter email and password."
      );

      return;
    }

    try {
      setAuthLoading(true);

      const data = await login(
        loginEmail,
        loginPassword
      );

      localStorage.setItem(
        "spendwise_token",
        data.token
      );

      localStorage.setItem(
        "spendwise_user",
        JSON.stringify(data.user)
      );

      setToken(data.token);

      setUser(data.user);

      setLoginEmail("");

      setLoginPassword("");

      setAuthError("");
    } catch (error) {
      console.error(error);

      setAuthError(
        error.message ||
          "Unable to login."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  // =========================
  // Register
  // =========================

  async function handleRegister() {
    setAuthError("");
    setAuthSuccess("");

    if (
      !registerName ||
      !registerEmail ||
      !registerPassword
    ) {
      setAuthError(
        "Please fill in all fields."
      );

      return;
    }

    if (registerPassword.length < 6) {
      setAuthError(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setAuthLoading(true);

      await register(
        registerName,
        registerEmail,
        registerPassword
      );

      setRegisterName("");

      setRegisterEmail("");

      setRegisterPassword("");

      setAuthSuccess(
        "Account created successfully! You can now login."
      );
    } catch (error) {
      console.error(error);

      setAuthError(
        error.message ||
          "Unable to create account."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  // =========================
  // Logout
  // =========================

  function handleLogout() {
    localStorage.removeItem(
      "spendwise_token"
    );

    localStorage.removeItem(
      "spendwise_user"
    );

    setToken(null);

    setUser(null);

    setExpenses([]);

    setShowProfile(false);

    resetForm();

    setError("");

    setSuccess("");
  }

  // =========================
  // Profile Navigation
  // =========================

  function handleOpenProfile() {
    setShowProfile(true);

    setError("");

    setSuccess("");
  }

  function handleCloseProfile() {
    setShowProfile(false);

    setError("");

    setSuccess("");
  }

  // =========================
  // Fetch Expenses
  // =========================

  async function fetchExpenses() {
    if (!token) {
      return;
    }

    try {
      setLoading(true);

      setError("");

      const data = await getExpenses(token);

      setExpenses(data);
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        handleLogout();

        return;
      }

      setError(
        "Unable to connect to the SpendWise backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Validate Expense
  // =========================

  function validateExpense() {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) {
      setError(
        "Amount must be greater than 0."
      );

      return false;
    }

    if (!date) {
      setError(
        "Please select a date."
      );

      return false;
    }

    if (!category) {
      setError(
        "Please select a category."
      );

      return false;
    }

    if (note.length > 255) {
      setError(
        "Note cannot be longer than 255 characters."
      );

      return false;
    }

    return true;
  }

  // =========================
  // Add Expense
  // =========================

  async function handleAddExpense() {
    setError("");

    setSuccess("");

    if (!validateExpense()) {
      return;
    }

    try {
      setSaving(true);

      await createExpense(
        {
          amount: Number(amount),
          category: category,
          date: date,
          note: note,
        },
        token
      );

      await fetchExpenses();

      resetForm();

      setSuccess(
        "Expense added successfully!"
      );
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        handleLogout();

        return;
      }

      setError(
        "Unable to save the expense."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // Update Expense
  // =========================

  async function handleUpdateExpense() {
    setError("");

    setSuccess("");

    if (!validateExpense()) {
      return;
    }

    try {
      setSaving(true);

      await updateExpense(
        editingId,
        {
          amount: Number(amount),
          category: category,
          date: date,
          note: note,
        },
        token
      );

      await fetchExpenses();

      resetForm();

      setSuccess(
        "Expense updated successfully!"
      );
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        handleLogout();

        return;
      }

      setError(
        "Unable to update the expense."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // Delete Expense
  // =========================

  async function handleDeleteExpense(
    idToDelete
  ) {
    const shouldDelete =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!shouldDelete) {
      return;
    }

    setError("");

    setSuccess("");

    try {
      setDeleting(true);

      await deleteExpense(
        idToDelete,
        token
      );

      await fetchExpenses();

      if (editingId === idToDelete) {
        resetForm();
      }

      setSuccess(
        "Expense deleted successfully!"
      );
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        handleLogout();

        return;
      }

      setError(
        "Unable to delete the expense."
      );
    } finally {
      setDeleting(false);
    }
  }

  // =========================
  // Edit Expense
  // =========================

  function handleEditExpense(idToEdit) {
    const expenseToEdit =
      expenses.find(
        (expense) =>
          expense.id === idToEdit
      );

    if (!expenseToEdit) {
      return;
    }

    setAmount(expenseToEdit.amount);

    setCategory(
      expenseToEdit.category
    );

    setDate(expenseToEdit.date);

    setNote(
      expenseToEdit.note || ""
    );

    setEditingId(idToEdit);

    setError("");

    setSuccess("");
  }

  // =========================
  // Cancel Edit
  // =========================

  function handleCancelEdit() {
    resetForm();
  }

  // =========================
  // Reset Form
  // =========================

  function resetForm() {
    setAmount("");

    setCategory("Food");

    setDate("");

    setNote("");

    setEditingId(null);
  }

  // =========================
  // Clear Filters
  // =========================

  function handleClearFilters() {
    setSearchText("");

    setFilterCategory("All");

    setFilterDate("");

    setSortOrder("none");
  }

  // =========================
  // Authentication Navigation
  // =========================

  function switchToRegister() {
    setAuthPage("register");

    setAuthError("");

    setAuthSuccess("");
  }

  function switchToLogin() {
    setAuthPage("login");

    setAuthError("");

    setAuthSuccess("");
  }

  // =========================
  // Filtered Expenses
  // =========================

  const filteredExpenses = [...expenses]
    .filter((expense) => {
      const matchesSearch = (
        expense.note || ""
      )
        .toLowerCase()
        .includes(
          searchText.toLowerCase()
        );

      const matchesCategory =
        filterCategory === "All" ||
        expense.category ===
          filterCategory;

      const matchesDate =
        filterDate === "" ||
        expense.date === filterDate;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      );
    })
    .sort((a, b) => {
      if (sortOrder === "low") {
        return (
          Number(a.amount) -
          Number(b.amount)
        );
      }

      if (sortOrder === "high") {
        return (
          Number(b.amount) -
          Number(a.amount)
        );
      }

      return 0;
    });

  // =========================
  // Authentication Pages
  // =========================

  if (!token) {
    if (authPage === "register") {
      return (
        <Register
          name={registerName}
          setName={setRegisterName}
          email={registerEmail}
          setEmail={setRegisterEmail}
          password={registerPassword}
          setPassword={
            setRegisterPassword
          }
          handleRegister={
            handleRegister
          }
          switchToLogin={
            switchToLogin
          }
          authLoading={
            authLoading
          }
          authError={authError}
          authSuccess={
            authSuccess
          }
        />
      );
    }

    return (
      <Login
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={
          setLoginPassword
        }
        handleLogin={
          handleLogin
        }
        switchToRegister={
          switchToRegister
        }
        authLoading={
          authLoading
        }
        authError={authError}
      />
    );
  }

  // =========================
  // Main SpendWise Application
  // =========================

  return (
    <div className="app">

      {/* =========================
          Header
      ========================== */}

      <header className="header">

        <div>
          <h1>SpendWise</h1>

          <p>
            Personal Expense Tracker
          </p>
        </div>

        <div className="user-area">

          <span>
            Welcome, {user?.name || "User"}
          </span>

          <button
            className="profile-button"
            onClick={
              handleOpenProfile
            }
          >
            My Account
          </button>

          <button
            className="logout-button"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>

      </header>

      {/* =========================
          Main Container
      ========================== */}

      <main className="container">

        {loading && (
          <p className="loading-message">
            Loading expenses...
          </p>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =========================
            Profile Page
        ========================== */}

        {showProfile ? (

          <Profile
            user={user}
            onClose={
              handleCloseProfile
            }
            onLogout={
              handleLogout
            }
          />

        ) : (

          <>
            {/* =========================
                Dashboard
            ========================== */}

            <Dashboard
              totalExpenses={
                totalExpenses
              }
              expenseCount={
                expenseCount
              }
              averageExpense={
                averageExpense
              }
            />

            {/* =========================
                Category Summary
            ========================== */}

            <CategorySummary
              categoryTotals={
                categoryTotals
              }
            />

            {/* =========================
                Charts
            ========================== */}

            <section className="charts-section">

              <CategoryChart
                categoryTotals={
                  categoryTotals
                }
              />

              <CategoryPieChart
                categoryTotals={
                  categoryTotals
                }
              />

            </section>

            {/* =========================
                Monthly Summary
            ========================== */}

            <MonthlySummary
              monthlyTotals={
                sortedMonthlyTotals
              }
            />

            {/* =========================
                Expense Form
            ========================== */}

            <ExpenseForm
              amount={amount}
              setAmount={setAmount}
              category={category}
              setCategory={
                setCategory
              }
              date={date}
              setDate={setDate}
              note={note}
              setNote={setNote}
              editingIndex={
                editingId
              }
              handleAddExpense={
                handleAddExpense
              }
              handleUpdateExpense={
                handleUpdateExpense
              }
              handleCancelEdit={
                handleCancelEdit
              }
              resetForm={
                resetForm
              }
              saving={saving}
            />

            {/* =========================
                Search and Filter
            ========================== */}

            <section className="filter-section">

              <h2>
                Search and Filter
              </h2>

              <div className="filter-grid">

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                  placeholder="Search by note..."
                />

                <select
                  value={
                    filterCategory
                  }
                  onChange={(e) =>
                    setFilterCategory(
                      e.target.value
                    )
                  }
                >
                  <option>
                    All
                  </option>

                  <option>
                    Food
                  </option>

                  <option>
                    Travel
                  </option>

                  <option>
                    Shopping
                  </option>

                  <option>
                    Entertainment
                  </option>

                  <option>
                    Other
                  </option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) =>
                    setFilterDate(
                      e.target.value
                    )
                  }
                />

                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(
                      e.target.value
                    )
                  }
                >
                  <option value="none">
                    Sort by Amount
                  </option>

                  <option value="low">
                    Lowest Amount
                  </option>

                  <option value="high">
                    Highest Amount
                  </option>
                </select>

                <button
                  className="secondary-button"
                  onClick={
                    handleClearFilters
                  }
                >
                  Clear Filters
                </button>

              </div>

            </section>

            {/* =========================
                Expense Table
            ========================== */}

            <ExpenseTable
              expenses={expenses}
              filteredExpenses={
                filteredExpenses
              }
              handleEditExpense={
                handleEditExpense
              }
              handleDeleteExpense={
                handleDeleteExpense
              }
              deleting={deleting}
            />

          </>

        )}

      </main>

    </div>
  );
}

export default App;