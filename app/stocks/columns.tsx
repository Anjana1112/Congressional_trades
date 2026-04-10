"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Stock } from "@/lib/types"
 import { formatMoney } from "@/lib/utils"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Stock>[] = [
    {
        accessorKey: "ticker",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Ticker <ArrowUpDown className="h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => (
        <div className="font-mono text-sm text-muted-foreground">
            {row.original.ticker}
        </div>
        ),
    },
    {
        accessorKey: "company_name",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Company <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => (
        <div className="font-medium">{row.original.company_name}</div>
        ),
    },
    {
        accessorKey: "state",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Sector <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => row.original.sector || "—",
    },
    {
        accessorKey: "trade_count",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Trades <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
    },
    {
        accessorKey: "total_invested",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Total Invested <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatMoney(row.original.total_invested),
    },
    {
        accessorKey: "total_buys",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Buys <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatMoney(row.original.total_buys),
    },
    {
        accessorKey: "total_sells",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Sells <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatMoney(row.original.total_sells),
    },
    {
        accessorKey: "member_count",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            # Members <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => row.original.member_count,
    },
]