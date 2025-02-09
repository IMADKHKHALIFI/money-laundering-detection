"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    header: "Sender Account",
  },
  {
    accessorKey: "Receiver_account",
    header: "Receiver Account",
  },
  {
    accessorKey: "Amount",
    header: "Amount",
  },
  {
    accessorKey: "Payment_currency",
    header: "Currency",
  },
  {
    accessorKey: "Payment_type",
    header: "Payment Type",
  },
  {
    accessorKey: "Time",
    header: "Time",
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

  const table = useReactTable({
    data: predictions,
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
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter transactions..."
          value={(table.getColumn("Sender_account")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Sender_account")?.setFilterValue(event.target.value)}
          className="max-w-sm bg-white/5 text-white border-white/20"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/10 text-white border-white/20">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1E293B] text-white border-white/20">
            {table.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-white/80"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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

