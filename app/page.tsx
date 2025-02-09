"use client"

import { useState } from "react"
import { FileUpload } from "@/components/FileUpload"
import { PredictionTable } from "@/components/PredictionTable"
import { Visualizations } from "@/components/Visualizations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, RefreshCw, Trash2, AlertTriangle, DollarSign, BarChart, TrendingUp, Shield, Activity } from "lucide-react"
import Clock from "@/components/Clock"
import { GeographicAnalysis } from "@/components/GeographicAnalysis"

export default function Home() {
  const [predictions, setPredictions] = useState<Array<{
    Sender_account: string;
    Receiver_account: string;
    Amount: number;
    Payment_currency: string;
    Payment_type: string;
    Time: string;
    Is_laundering: string;
    Laundering_probability: number;
  }> | null>(null)
  const [summary, setSummary] = useState(null)

  const handleFileUpload = (data: { predictions: any; summary: any }) => {
    setPredictions(data.predictions)
    setSummary(data.summary)
  }

  const handleClearData = () => {
    setPredictions(null)
    setSummary(null)
  }

  const handleRefresh = () => {
    // Implement refresh logic here
  }

  const handleDownload = () => {
    if (predictions) {
      const csv = [
        [
          "Sender_account",
          "Receiver_account",
          "Amount",
          "Payment_currency",
          "Payment_type",
          "Time",
          "Is_laundering",
          "Laundering_probability",
        ],
        ...(predictions || []).map((p) => [
          p.Sender_account,
          p.Receiver_account,
          p.Amount,
          p.Payment_currency,
          p.Payment_type,
          p.Time,
          p.Is_laundering,
          p.Laundering_probability,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", "predictions.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0A0F1E]">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                Guardian<span className="text-blue-400">Flow</span>
                <DollarSign className="w-6 h-6 ml-2 text-green-400" />
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                  Beta
                </span>
                <Activity className="w-4 h-4 text-blue-300" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/about"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>About</span>
            </a>
            <Clock />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="mb-8 bg-[#1E293B] border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="mr-2 h-6 w-6" />
              Upload Transaction Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFileUpload={handleFileUpload} />
          </CardContent>
        </Card>

        {predictions && (
          <div className="space-y-8">
            <div className="flex justify-between items-center text-white">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart className="mr-2 h-6 w-6" />
                Analysis Results
              </h2>
              <div className="space-x-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={handleClearData}
                  variant="outline"
                  className="bg-red-500/10 hover:bg-red-500/20 text-white border-red-500/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="bg-green-500/10 hover:bg-green-500/20 text-white border-green-500/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <Card className="bg-[#1E293B] border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="mr-2 h-6 w-6" />
                  Prediction Table
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PredictionTable predictions={predictions} />
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart className="mr-2 h-6 w-6" />
                  Visualizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Visualizations predictions={predictions} />
              </CardContent>
            </Card>

            <GeographicAnalysis transactions={predictions} />
          </div>
        )}
      </main>
    </div>
  )
}

