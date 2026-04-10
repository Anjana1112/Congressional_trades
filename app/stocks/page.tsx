"use client"

import { DataTable } from "@/components/dataTable"
import { columns } from "./columns"
import { useData } from "@/app/data-context"

export default function StockPage() {
    const { stocks } = useData()

    return (
        <div className="mx-auto w-[98%] min-h-62.5 pt-4 gap-4">
        <h1 className="text-2xl font-bold ml-30">Stocks</h1>
        {stocks.length === 0 ? (
            <div className="p-6">Loading stocks...</div>
        ) : (
            <div className="bg-background min-h-67.5 shadow-sm">
            <DataTable columns={columns} data={stocks} />
            </div>
        )}
        </div>
    )
}