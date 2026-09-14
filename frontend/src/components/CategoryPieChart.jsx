import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CategoryPieChart({ categoryTotals }) {
  const chartData = Object.entries(
    categoryTotals
  )
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category,
      amount,
    }));

  const pieColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
  ];

  return (
    <section className="category-section">

      <h2>Expense Distribution</h2>

      {chartData.length === 0 ? (
        <p className="empty-message">
          No expense data available.
        </p>
      ) : (
        <div
          style={{
            width: "100%",
            height: "400px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label={({ category, percent }) =>
                  `${category} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        pieColors[
                          index %
                            pieColors.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toFixed(2)}`
                }
              />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

    </section>
  );
}

export default CategoryPieChart;