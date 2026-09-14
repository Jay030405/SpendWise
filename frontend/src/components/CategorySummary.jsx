function CategorySummary({ categoryTotals }) {
  return (
    <section className="category-section">

      <h2>Category Summary</h2>

      <div className="category-grid">

        <div className="category-card">
          <h3>Food</h3>
          <p>
            ₹{categoryTotals.Food.toFixed(2)}
          </p>
        </div>

        <div className="category-card">
          <h3>Travel</h3>
          <p>
            ₹{categoryTotals.Travel.toFixed(2)}
          </p>
        </div>

        <div className="category-card">
          <h3>Shopping</h3>
          <p>
            ₹{categoryTotals.Shopping.toFixed(2)}
          </p>
        </div>

        <div className="category-card">
          <h3>Entertainment</h3>
          <p>
            ₹{categoryTotals.Entertainment.toFixed(2)}
          </p>
        </div>

        <div className="category-card">
          <h3>Other</h3>
          <p>
            ₹{categoryTotals.Other.toFixed(2)}
          </p>
        </div>

      </div>

    </section>
  );
}

export default CategorySummary;