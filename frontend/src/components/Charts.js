import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const Charts = ({ predictions }) => {
  const currencyData = predictions.reduce((acc, prediction) => {
    const currency = prediction.Payment_currency
    if (!acc[currency]) {
      acc[currency] = { currency, count: 0, totalAmount: 0 }
    }
    acc[currency].count += 1
    acc[currency].totalAmount += prediction.Amount
    return acc
  }, {})

  const chartData = Object.values(currencyData)

  return (
    <div>
      <h2>Transaction Distribution by Currency</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="currency" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Transaction Count" />
        <Bar yAxisId="right" dataKey="totalAmount" fill="#82ca9d" name="Total Amount" />
      </BarChart>
    </div>
  )
}

export default Charts

