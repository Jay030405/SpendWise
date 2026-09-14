function formatMonth(month) {
  const [year, monthNumber] = month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1
  );

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function MonthlySummary({ monthlyTotals }) {
  const months = Object.keys(monthlyTotals);

  return (
    <section className="category-section">

      <h2>Monthly Summary</h2>

      {months.length === 0 ? (
        <p className="empty-message">
          No monthly expense data available.
        </p>
      ) : (
        <div className="category-grid">

          {months.map((month) => (
            <div
              className="category-card"
              key={month}
            >
              <h3>{formatMonth(month)}</h3>

              <p>
                ₹
                {monthlyTotals[month].toFixed(
                  2
                )}
              </p>
            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default MonthlySummary;