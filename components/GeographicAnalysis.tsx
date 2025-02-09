"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface Transaction {
  Sender_account: string
  Receiver_account: string
  Amount: number
  Payment_currency: string
  Payment_type: string
  Time: string
  Is_laundering: string
  Laundering_probability: number
  region?: string // Add region information to your transactions
}

interface GeographicAnalysisProps {
  transactions: Transaction[]
}

interface RegionStats {
  totalTransactions: number
  suspiciousTransactions: number
  totalAmount: number
  riskScore: number
}

export function GeographicAnalysis({ transactions }: GeographicAnalysisProps) {
  // Calculate regional statistics
  const regionData = transactions.reduce((acc: Record<string, RegionStats>, tx) => {
    const region = tx.region || 'Unknown'
    
    if (!acc[region]) {
      acc[region] = {
        totalTransactions: 0,
        suspiciousTransactions: 0,
        totalAmount: 0,
        riskScore: 0
      }
    }
    
    acc[region].totalTransactions++
    acc[region].totalAmount += tx.Amount
    if (tx.Is_laundering === "YES") {
      acc[region].suspiciousTransactions++
    }
    acc[region].riskScore += tx.Laundering_probability

    return acc
  }, {})

  // Calculate average risk scores and sort regions by risk
  const regionStats = Object.entries(regionData).map(([region, stats]) => ({
    region,
    ...stats,
    averageRiskScore: stats.riskScore / stats.totalTransactions,
    suspiciousPercentage: (stats.suspiciousTransactions / stats.totalTransactions) * 100
  })).sort((a, b) => b.averageRiskScore - a.averageRiskScore)

  // Calculate YES/NO statistics
  const launderingStats = transactions.reduce(
    (acc, tx) => {
      if (tx.Is_laundering === "YES") {
        acc.yes++
        acc.yesAmount += tx.Amount
      } else {
        acc.no++
        acc.noAmount += tx.Amount
      }
      return acc
    },
    { yes: 0, no: 0, yesAmount: 0, noAmount: 0 }
  )

  const totalTransactions = transactions.length
  const yesPercentage = (launderingStats.yes / totalTransactions) * 100
  const noPercentage = (launderingStats.no / totalTransactions) * 100

  return (
    <div className="bg-[#1E293B] rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-white">Geographic Risk Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Suspicious Transactions Card */}
        <Card className="bg-[#0F172A] border-0 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-400">Suspicious Transactions</p>
              <div className="mt-4 flex items-baseline">
                <p className="text-2xl font-semibold text-white">
                  {launderingStats.yes.toLocaleString()}
                </p>
                <p className="ml-2 text-sm text-white/60">
                  ({yesPercentage.toFixed(1)}%)
                </p>
              </div>
              <p className="mt-1 text-sm text-white/60">
                Total Amount: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(launderingStats.yesAmount)}
              </p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <Progress 
            value={yesPercentage} 
            className="h-2 mt-4" 
            indicatorClassName="bg-red-500"
          />
        </Card>

        {/* Clean Transactions Card */}
        <Card className="bg-[#0F172A] border-0 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-400">Clean Transactions</p>
              <div className="mt-4 flex items-baseline">
                <p className="text-2xl font-semibold text-white">
                  {launderingStats.no.toLocaleString()}
                </p>
                <p className="ml-2 text-sm text-white/60">
                  ({noPercentage.toFixed(1)}%)
                </p>
              </div>
              <p className="mt-1 text-sm text-white/60">
                Total Amount: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(launderingStats.noAmount)}
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <Progress 
            value={noPercentage} 
            className="h-2 mt-4" 
            indicatorClassName="bg-green-500"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* High Risk Regions */}
        <Card className="bg-[#0F172A] border-0 p-4">
          <h3 className="text-sm font-medium text-white/80 mb-4">High Risk Regions</h3>
          <div className="space-y-4">
            {regionStats.slice(0, 5).map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{region.region}</span>
                  <span className="text-white/80">{region.averageRiskScore.toFixed(1)}% Risk</span>
                </div>
                <Progress value={region.averageRiskScore} className="h-2" 
                  indicatorClassName={region.averageRiskScore > 75 ? "bg-red-500" : 
                    region.averageRiskScore > 50 ? "bg-yellow-500" : "bg-green-500"} 
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Suspicious Transaction Distribution */}
        <Card className="bg-[#0F172A] border-0 p-4">
          <h3 className="text-sm font-medium text-white/80 mb-4">Suspicious Transaction Distribution</h3>
          <div className="space-y-4">
            {regionStats.slice(0, 5).map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{region.region}</span>
                  <span className="text-white/80">
                    {region.suspiciousTransactions} / {region.totalTransactions}
                  </span>
                </div>
                <Progress value={region.suspiciousPercentage} className="h-2"
                  indicatorClassName={region.suspiciousPercentage > 75 ? "bg-red-500" : 
                    region.suspiciousPercentage > 50 ? "bg-yellow-500" : "bg-green-500"} 
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Transaction Volume by Region */}
        <Card className="bg-[#0F172A] border-0 p-4 md:col-span-2">
          <h3 className="text-sm font-medium text-white/80 mb-4">Transaction Volume by Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {regionStats.slice(0, 6).map((region) => (
              <div key={region.region} className="p-4 bg-[#1E293B] rounded-lg">
                <div className="text-sm text-white mb-2">{region.region}</div>
                <div className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(region.totalAmount)}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  {region.totalTransactions} transactions
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
} 