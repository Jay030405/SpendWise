function ExpenseForm({
  amount,
  setAmount,
  category,
  setCategory,
  date,
  setDate,
  note,
  setNote,
  editingIndex,
  handleAddExpense,
  handleUpdateExpense,
  handleCancelEdit,
  resetForm,
  saving,
}) {
  const isEditing = editingIndex !== null;

  return (
    <section className="form-section">

      <h2>
        {isEditing
          ? "Edit Expense"
          : "Add Expense"}
      </h2>

      <div className="form-grid">

        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="Enter amount"
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            disabled={saving}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label>Note</label>

          <input
            type="text"
            maxLength="255"
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            placeholder="What was this expense for?"
            disabled={saving}
          />
        </div>

      </div>

      <div className="form-buttons">

        {isEditing ? (
          <>
            <button
              className="primary-button"
              onClick={handleUpdateExpense}
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Expense"}
            </button>

            <button
              className="secondary-button"
              onClick={handleCancelEdit}
              disabled={saving}
            >
              Cancel Edit
            </button>
          </>
        ) : (
          <button
            className="primary-button"
            onClick={handleAddExpense}
            disabled={saving}
          >
            {saving
              ? "Adding..."
              : "Add Expense"}
          </button>
        )}

        <button
          className="secondary-button"
          onClick={resetForm}
          disabled={saving}
        >
          Reset Form
        </button>

      </div>

    </section>
  );
}

export default ExpenseForm;