function ExpenseTable({
  expenses,
  filteredExpenses,
  handleEditExpense,
  handleDeleteExpense,
  deleting,
}) {
  return (
    <section className="table-section">

      <div className="table-header">
        <h2>Expense History</h2>

        <span>
          {filteredExpenses.length} expenses
        </span>
      </div>

      {expenses.length === 0 ? (
        <p className="empty-message">
          No expenses added yet.
        </p>
      ) : filteredExpenses.length === 0 ? (
        <p className="empty-message">
          No expenses match your search or
          filter.
        </p>
      ) : (
        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map(
                (expense, index) => (
                  <tr key={expense.id}>

                    <td>{index + 1}</td>

                    <td className="amount">
                      ₹
                      {Number(
                        expense.amount
                      ).toFixed(2)}
                    </td>

                    <td>
                      <span className="category-badge">
                        {expense.category}
                      </span>
                    </td>

                    <td>{expense.date}</td>

                    <td>
                      {expense.note || "-"}
                    </td>

                    <td className="actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEditExpense(
                            expense.id
                          )
                        }
                        disabled={deleting}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteExpense(
                            expense.id
                          )
                        }
                        disabled={deleting}
                      >
                        {deleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </td>

                  </tr>
                )
              )}
            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}

export default ExpenseTable;