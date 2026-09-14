import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function CategoryChart({ categoryTotals }) {
  const chartData = Object.entries(
    categoryTotals
  ).map(([category, amount]) => ({
    category,
    amount,
  }));

  const barColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
  ];

  return (
    <section className="category-section">

      <h2>Spending by Category</h2>

      <div
        style={{
          width: "100%",
          height: "350px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="category"
            />

            <YAxis
              tickFormatter={(value) =>
                `₹${value}`
              }
            />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toFixed(2)}`
              }
            />

            <Bar
              dataKey="amount"
              name="Spent"
              radius={[6, 6, 0, 0]}
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      barColors[
                        index %
                          barColors.length
                      ]
                    }
                  />
                )
              )}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}

export default CategoryChart;