"use client"

import { useState } from "react"
import FileUpload from "./components/FileUpload"
import PredictionTable from "./components/PredictionTable"
import Charts from "./components/Charts"

function App() {
  const [predictions, setPredictions] = useState(null)
  const [summary, setSummary] = useState(null)

  const handleFileUpload = (data) => {
    setPredictions(data.predictions)
    setSummary(data.summary)
  }

  return (
    <div className="App">
      <h1>Money Laundering Detection System</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {predictions && (
        <>
          <h2>Prediction Results</h2>
          <PredictionTable predictions={predictions} />
          <Charts predictions={predictions} />
          <h2>Summary</h2>
          <p>Total Transactions: {summary.total_transactions}</p>
          <p>Flagged Transactions: {summary.flagged_transactions}</p>
          <p>Average Probability: {summary.average_probability}%</p>
        </>
      )}
    </div>
  )
}

export default App

