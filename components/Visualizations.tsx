"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts"

export function Visualizations({ predictions }: { predictions: any[] }) {
  // Calculate summary data
  const totalTransactions = predictions.length
  const totalAmount = predictions.reduce((sum, p) => sum + p.Amount, 0)
  const highRiskTransactions = predictions.filter(p => p.Is_laundering === "YES").length
  const averageRiskScore = predictions.reduce((sum, p) => sum + p.Laundering_probability, 0) / totalTransactions || 0

  // Format numbers
  const formatNumber = (num: number) => num.toLocaleString()
  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`

  // Convert time string to hour
  const getHour = (timeStr: string) => {
    // If timeStr is in HH:MM:SS format
    if (timeStr.includes(':')) {
      return parseInt(timeStr.split(':')[0])
    }
    // If timeStr is just a number, convert it to 24-hour format
    return Math.floor(parseInt(timeStr) / 3600) % 24
  }

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
  }

  // Group transactions by hour
  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    displayHour: formatHour(i),
    amount: 0
  }))

  // Aggregate transaction amounts by hour
  predictions.forEach(prediction => {
    const hour = getHour(prediction.Time)
    if (timeSeriesData[hour]) {
      timeSeriesData[hour].amount += prediction.Amount
    }
  })

  // Transaction amount distribution with better ranges and formatting
  const amountRanges = [
    { range: '0-1K', min: 0, max: 1000 },
    { range: '1K-5K', min: 1000, max: 5000 },
    { range: '5K-10K', min: 5000, max: 10000 },
    { range: '10K-50K', min: 10000, max: 50000 },
    { range: '50K-100K', min: 50000, max: 100000 },
    { range: '100K+', min: 100000, max: Infinity }
  ]

  const amountDistribution = amountRanges.map(range => ({
    range: range.range,
    count: predictions.filter(p => p.Amount >= range.min && p.Amount < range.max).length,
    totalAmount: predictions
      .filter(p => p.Amount >= range.min && p.Amount < range.max)
      .reduce((sum, p) => sum + p.Amount, 0)
  }))

  // Group transactions by hour with better formatting
  const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    displayHour: formatHour(i),
    amount: 0,
    count: 0,
    suspicious: 0
  }))

  // Aggregate transaction data by hour
  predictions.forEach(prediction => {
    const hour = getHour(prediction.Time)
    if (hourlyActivity[hour]) {
      hourlyActivity[hour].amount += prediction.Amount
      hourlyActivity[hour].count++
      if (prediction.Is_laundering === "YES") {
        hourlyActivity[hour].suspicious++
      }
    }
  })

  // Risk Score Distribution Data
  const riskDistributionData = [
    { range: '0-25%', count: predictions.filter(p => p.Laundering_probability <= 25).length },
    { range: '26-50%', count: predictions.filter(p => p.Laundering_probability > 25 && p.Laundering_probability <= 50).length },
    { range: '51-75%', count: predictions.filter(p => p.Laundering_probability > 50 && p.Laundering_probability <= 75).length },
    { range: '76-100%', count: predictions.filter(p => p.Laundering_probability > 75).length }
  ]

  // Currency Distribution Data
  const currencyData = Object.entries(
    predictions.reduce((acc, pred) => {
      acc[pred.Payment_currency] = (acc[pred.Payment_currency] || 0) + pred.Amount
      return acc
    }, {} as Record<string, number>)
  ).map(([currency, amount]) => ({
    name: currency,
    value: amount
  }))

  // Payment Type Analysis Data
  const paymentTypeData = Object.entries(
    predictions.reduce((acc, pred) => {
      if (!acc[pred.Payment_type]) {
        acc[pred.Payment_type] = { total: 0, suspicious: 0 }
      }
      acc[pred.Payment_type].total++
      if (pred.Is_laundering === "YES") {
        acc[pred.Payment_type].suspicious++
      }
      return acc
    }, {} as Record<string, { total: number, suspicious: number }>)
  ).map(([type, data]) => ({
    type,
    total: data.total,
    suspicious: data.suspicious,
    riskRate: (data.suspicious / data.total) * 100
  }))

  return (
    <div className="space-y-8">
      {/* Summary Statistics Card */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#0F172A] p-4">
            <CardContent>
              <h4 className="text-white">Total Transactions Monitored</h4>
              <p className="text-blue-200">{formatNumber(totalTransactions)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0F172A] p-4">
            <CardContent>
              <h4 className="text-white">High-Risk Transactions</h4>
              <p className="text-blue-200">{formatNumber(highRiskTransactions)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0F172A] p-4">
            <CardContent>
              <h4 className="text-white">Average Risk Score</h4>
              <p className="text-blue-200">{averageRiskScore.toFixed(2)}%</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0F172A] p-4">
            <CardContent>
              <h4 className="text-white">Total Transaction Volume</h4>
              <p className="text-blue-200">{formatCurrency(totalAmount)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Volume Over Time */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Transaction Volume Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="displayHour" 
                stroke="rgba(255,255,255,0.5)"
                interval={2} // Show every 3rd label to prevent overcrowding
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value)}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: number) => new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(value)}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Amount Distribution */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Transaction Amount Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={amountDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="range" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 0
                }).format(value)}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: number, name: string) => [
                  name === 'count' 
                    ? `${value.toLocaleString()} transactions`
                    : new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                      }).format(value),
                  name === 'count' ? 'Count' : 'Total Amount'
                ]}
              />
              <Bar 
                dataKey="count" 
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              >
                {amountDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.count > 0 ? '#82ca9d' : '#374151'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Transaction Activity */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Hourly Transaction Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyActivity}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E91E63" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E91E63" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="displayHour"
                stroke="rgba(255,255,255,0.5)"
                interval={2}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value)}
                label={{ 
                  value: 'Transaction Amount', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'rgba(255,255,255,0.5)' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: 'none', 
                  borderRadius: '8px',
                  padding: '12px'
                }}
                labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: number, name: string) => {
                  switch (name) {
                    case 'amount':
                      return [
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(value),
                        'Total Amount'
                      ]
                    case 'count':
                      return [`${value} transactions`, 'Count']
                    case 'suspicious':
                      return [`${value} suspicious`, 'Suspicious']
                    default:
                      return [value, name]
                  }
                }}
                labelFormatter={(label) => `Hour: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#E91E63" 
                fill="url(#colorActivity)"
                name="amount"
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#4CAF50" 
                fill="url(#colorActivity)"
                opacity={0.3}
                name="count"
              />
              <Area 
                type="monotone" 
                dataKey="suspicious" 
                stroke="#FF9800" 
                fill="none"
                strokeDasharray="5 5"
                name="suspicious"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#E91E63] mr-2" />
            <span className="text-white/80">Total Amount</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2" />
            <span className="text-white/80">Transaction Count</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FF9800] mr-2" />
            <span className="text-white/80">Suspicious Transactions</span>
          </div>
        </div>
      </div>

      {/* Risk Score Distribution */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Risk Score Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 0
                }).format(value)}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
              />
              <Bar 
                dataKey="count" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={index > 2 ? '#ef4444' : index > 1 ? '#f97316' : '#22c55e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Currency Distribution */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Transaction Currency Distribution</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={currencyData.sort((a, b) => b.value - a.value)} // Sort by value descending
              layout="vertical" // Make it a horizontal bar chart
              margin={{ left: 60 }} // Add margin for currency labels
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number"
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value)}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="rgba(255,255,255,0.5)"
                width={60}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  border: 'none', 
                  borderRadius: '8px',
                  padding: '12px'
                }}
                labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(value),
                  'Total Amount'
                ]}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
              >
                {currencyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={[
                      '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
                      '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9'
                    ][index % 8]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Add a legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
          {currencyData.map((currency, index) => (
            <div key={currency.name} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ 
                  backgroundColor: [
                    '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
                    '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9'
                  ][index % 8] 
                }}
              />
              <span className="text-white/80">
                {currency.name} ({((currency.value / currencyData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Type Analysis */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#0A0F1E] rounded-lg p-4 shadow-lg">
        <h3 className="text-lg mb-4 text-white">Payment Type Risk Analysis</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="type" stroke="rgba(255,255,255,0.5)" />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
              />
              <Bar dataKey="riskRate" fill="#ef4444" name="Risk Rate (%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="#3b82f6" name="Total Transactions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

