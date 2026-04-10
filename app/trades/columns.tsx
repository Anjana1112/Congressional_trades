"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Trade } from "@/lib/types"
 import { formatDate, formatMoney } from "@/lib/utils"
import { ArrowUpDown } from "lucide-react"
import { access } from "fs"

export const columns: ColumnDef<Trade>[] = [
    {
        accessorKey: "trade_id",
        header: "Trade ID",
        cell: ({ row }) => (
        <div className="font-medium">{row.original.trade_id}</div>
        ),
    },
    {
        accessorKey: "member",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Member <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => (
        <div className="font-medium">{row.original.member}</div>
        ),
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
        cell: ({ row }) => row.original.state,
    },
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
        cell: ({ row }) => (row.original.company_name),
    },
    {
        accessorKey: "sector",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Sector <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => row.original.sector || "—",
    },
    {
        accessorKey: "trade_type",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Trade Type <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => row.original.trade_type || "—",
    },
    {
        accessorKey: "amount_low",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Min. Amt. <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatMoney(row.original.amount_low),
    },
    {
        accessorKey: "amount_high",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Max. Amt. <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatMoney(row.original.amount_high),
    },
    {
        accessorKey: "amount_mid",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Est. Amt. <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatMoney(row.original.amount_mid),
    },
    {
        accessorKey: "trade_date",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Trade Date <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatDate(row.original.trade_date),
    },
    {
        accessorKey: "filed_date",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Filed Date <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => formatDate(row.original.filed_date),
    },
    {
        accessorKey: "year",
        header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1">
            Year <ArrowUpDown className="h-4 w-4" />
        </button>
        ),
        cell: ({ row }) => row.original.year,
    },
]