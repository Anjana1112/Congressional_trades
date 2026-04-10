"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Member } from "@/lib/types"
 import { formatMoney } from "@/lib/utils"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Member>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Member ID <ArrowUpDown className="h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => (
        <div className="font-mono text-sm text-muted-foreground">
            {row.original.id}
        </div>
        ),
    },
    {
        accessorKey: "full_name",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Member <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => (
        <div className="font-medium">{row.original.full_name}</div>
        ),
    },
    {
        accessorKey: "chamber",
        header: "Chamber",
         cell: ({ row }) => row.original.chamber === "house" ? "House" : "Senate",
    },
    {
        accessorKey: "party",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Party <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
         cell: ({ row }) => row.original.party || "—",
    },
    {
        accessorKey: "state",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            State <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => row.original.state || "—",
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
        accessorKey: "stocks_traded",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Stocks Traded <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => (row.original.stocks_traded),
    },
]