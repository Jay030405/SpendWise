function Dashboard({
  totalExpenses,
  expenseCount,
  averageExpense,
}) {
  return (
    <section className="dashboard">

      <div className="summary-card">
        <p className="summary-title">Total Spent</p>

        <h2>
          ₹{totalExpenses.toFixed(2)}
        </h2>

        <span>Total amount spent</span>
      </div>

      <div className="summary-card">
        <p className="summary-title">
          Number of Expenses
        </p>

        <h2>{expenseCount}</h2>

        <span>Total transactions</span>
      </div>

      <div className="summary-card">
        <p className="summary-title">
          Average Expense
        </p>

        <h2>
          ₹{averageExpense.toFixed(2)}
        </h2>

        <span>Average per transaction</span>
      </div>

    </section>
  );
}

export default Dashboard;