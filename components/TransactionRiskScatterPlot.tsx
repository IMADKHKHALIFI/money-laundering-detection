import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { amount: 1000, probability: 20 },
  { amount: 5000, probability: 80 },
  // Add more data points
]

export default function TransactionRiskScatterPlot() {
  return (
    <ScatterChart width={600} height={300}>
      <CartesianGrid />
      <XAxis type="number" dataKey="amount" name="Transaction Amount" />
      <YAxis type="number" dataKey="probability" name="Laundering Probability" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Transactions" data={data} fill="#8884d8" />
    </ScatterChart>
  )
} 