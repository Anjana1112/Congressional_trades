import pool from "@/lib/db"
import { NextResponse } from "next/server"

async function getCompanyName(ticker: string): Promise<string> {
    try {
        const res = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
        )
        const data = await res.json()
        return data.quotes?.[0]?.longname ?? data.quotes?.[0]?.shortname ?? ticker
    } catch {
        return ticker
    }
}

interface StockSummaryRow {
    ticker: string
    company_name?: string
    [key: string]: unknown
}
export async function GET() {
    try {
        const [rows] = await pool.execute(`
            SELECT * FROM v_stock_summary
            ORDER BY total_invested DESC
        `) as [StockSummaryRow[], unknown]

        // Fill in missing company names
        const enriched = await Promise.all(
        rows.map(async (row) => {
            if (!row.company_name && row.ticker) {
            row.company_name = await getCompanyName(row.ticker)
            }
            return row
        })
        )
        return NextResponse.json(enriched)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 })
    }
}