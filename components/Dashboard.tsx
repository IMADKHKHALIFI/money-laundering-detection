"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts'

const transactionData = [
  { date: '2023-01-01', volume: 1000000 },
  { date: '2023-01-02', volume: 2000000 },
  // Add more data points
]

const paymentData = [
  { type: 'SWIFT', count: 2400 },
  { type: 'WIRE', count: 1800 },
  // Add more data points
]

export default function Dashboard({ predictions, summary }) {
  return (
    <div className="dashboard-container p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="text-lg text-gray-300 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-white">{summary?.total_transactions || 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg text-gray-300 mb-2">Flagged Transactions</h3>
          <p className="text-3xl font-bold text-red-400">{summary?.flagged_transactions || 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg text-gray-300 mb-2">Average Risk</h3>
          <p className="text-3xl font-bold text-yellow-400">{summary?.average_probability || 0}%</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg text-gray-300 mb-2">Total Amount</h3>
          <p className="text-3xl font-bold text-green-400">
            ${predictions?.reduce((sum, p) => sum + p.Amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="Payment_type" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="Laundering_probability" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="Time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="Amount" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 