import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const data = [
  { date: '2023-01-01', count: 5 },
  { date: '2023-01-02', count: 8 },
  // Add more data points
]

export default function SuspiciousTransactionsChart() {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="count" stroke="#8884d8" />
    </LineChart>
  )
} 