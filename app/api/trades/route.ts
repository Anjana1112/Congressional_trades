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

interface TradeRow {
    ticker: string
    company_name?: string
    [key: string]: unknown
}

export async function GET() {
    try {
        const [rows] = await pool.execute(`
        select * from v_trade_detail
        order by trade_date desc
        `) as [TradeRow[], unknown]

        //for tickers missing company names
        const missingTickers = [...new Set(
        rows
            .filter(r => !r.company_name && r.ticker)
            .map(r => r.ticker)
        )]

        const companyMap: Record<string, string> = {}
        await Promise.all(
        missingTickers.map(async ticker => {
            companyMap[ticker] = await getCompanyName(ticker)
        })
        )
        const enriched = rows.map(row => ({
        ...row,
        company_name: row.company_name ?? companyMap[row.ticker] ?? row.ticker
        }))

        return NextResponse.json(enriched)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 })
    }
}