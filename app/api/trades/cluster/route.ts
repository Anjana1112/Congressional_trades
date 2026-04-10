import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const windowDays = parseInt(searchParams.get("window_days") ?? "7")

    try {
        const [rows] = await pool.execute(
        `SELECT
            a.ticker,
            a.company_name,
            a.sector,
            a.member AS member_1,
            a.party AS party_1,
            b.member AS member_2,
            b.party AS party_2,
            a.trade_type AS type_1,
            b.trade_type AS type_2,
            a.trade_date AS date_1,
            b.trade_date AS date_2,
            ABS(DATEDIFF(a.trade_date, b.trade_date)) AS days_apart
        FROM v_trade_detail a
        JOIN v_trade_detail b
            ON  a.ticker = b.ticker
            AND a.member != b.member
            AND ABS(DATEDIFF(a.trade_date, b.trade_date)) <= ?
            AND a.member < b.member
        ORDER BY days_apart, a.ticker`,
        [windowDays]
        )
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch cluster trades" }, { status: 500 })
    }
}