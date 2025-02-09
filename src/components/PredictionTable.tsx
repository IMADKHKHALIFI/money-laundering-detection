"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

interface Prediction {
  Sender_account: string
  Receiver_account: string
  Amount: number
  Payment_currency: string
  Payment_type: string
  Time: string
  Is_laundering: string
  Laundering_probability: number
}

const columns: ColumnDef<Prediction>[] = [
  {
    accessorKey: "Sender_account",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:text-white/80"
      >
        Sender Account
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Receiver_account",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:text-white/80"
      >
        Receiver Account
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:text-white/80"
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Payment_currency",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:text-white/80"
      >
        Currency
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Payment_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:text-white/80"
      >
        Payment Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-white hover:text-white/80"
      >
        Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "Is_laundering",
    header: "Is Laundering",
    cell: ({ row }) => {
      const value = row.getValue("Is_laundering")
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "YES" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      )
    },
  },
  {
    accessorKey: "Laundering_probability",
    header: "Probability (%)",
    cell: ({ row }) => {
      const value = row.getValue("Laundering_probability")
      return (
        <span
          className={`font-medium ${value > 75 ? "text-red-600" : value > 25 ? "text-yellow-600" : "text-green-600"}`}
        >
          {value}%
        </span>
      )
    },
  },
]

export function PredictionTable({ predictions }: { predictions: Prediction[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [filter, setFilter] = useState("all")
  const [amountFilter, setAmountFilter] = useState<"none" | "asc" | "desc">("none")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all")
  const [riskLevel, setRiskLevel] = useState<string>("all")
  const [transactionType, setTransactionType] = useState<string>("all")

  let filteredPredictions = predictions.filter(pred => {
    if (filter === "YES" && pred.Is_laundering !== "YES") return false
    if (filter === "NO" && pred.Is_laundering !== "NO") return false

    if (selectedCurrency !== "all" && pred.Payment_currency !== selectedCurrency) return false

    if (transactionType !== "all" && pred.Payment_type !== transactionType) return false

    const probability = pred.Laundering_probability
    if (riskLevel === "high" && probability < 75) return false
    if (riskLevel === "medium" && (probability < 25 || probability > 75)) return false
    if (riskLevel === "low" && probability > 25) return false

    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(pred.Time)
      if (transactionDate < dateRange.from || transactionDate > dateRange.to) return false
    }

    return true
  })

  if (amountFilter !== "none") {
    filteredPredictions = [...filteredPredictions].sort((a, b) => {
      if (amountFilter === "asc") {
        return a.Amount - b.Amount
      } else {
        return b.Amount - a.Amount
      }
    })
  }

  const table = useReactTable({
    data: filteredPredictions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-lg">
        {/* Search and Filter Section */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter transactions..."
            value={(table.getColumn("Sender_account")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("Sender_account")?.setFilterValue(event.target.value)}
            className="max-w-sm bg-white/5 text-white border-white/20"
          />
          
          {/* Transaction Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 text-white border-white/20 rounded-md px-3 py-2 min-w-[200px]"
          >
            <option value="all">All Transactions</option>
            <option value="YES">Suspicious Only</option>
            <option value="NO">Clean Only</option>
          </select>

          {/* Currency Filter */}
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-white/5 text-white border-white/20 rounded-md px-3 py-2"
          >
            <option value="all">All Currencies</option>
            {Array.from(new Set(predictions.map(p => p.Payment_currency))).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>

          {/* Payment Type Filter */}
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="bg-white/5 text-white border-white/20 rounded-md px-3 py-2"
          >
            <option value="all">All Payment Types</option>
            {Array.from(new Set(predictions.map(p => p.Payment_type))).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="bg-white/5 text-white border-white/20 rounded-md px-3 py-2"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk (>75%)</option>
            <option value="medium">Medium Risk (25-75%)</option>
            <option value="low">Low Risk (<25%)</option>
          </select>
        </div>

        {/* Table Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setFilter("all")
              setSelectedCurrency("all")
              setRiskLevel("all")
              setTransactionType("all")
            }}
            className="bg-white/10 text-white border-white/20"
          >
            Clear Filters
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/10 text-white border-white/20">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1E293B] text-white border-white/20">
              {table.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-white/80"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/10">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white/70">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white/80">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-white/60">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => table.previousPage()} 
          disabled={!table.getCanPreviousPage()}
          className="bg-white/10 text-white border-white/20"
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => table.nextPage()} 
          disabled={!table.getCanNextPage()}
          className="bg-white/10 text-white border-white/20"
        >
          Next
        </Button>
      </div>
    </div>
  )
} 