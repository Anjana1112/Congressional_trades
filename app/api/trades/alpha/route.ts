import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const minRoundTrips = parseInt(searchParams.get("min_round_trips") ?? "2")

    try {
        const [rows] = await pool.execute(
        `SELECT
            b.member,
            b.chamber,
            b.ticker,
            b.sector,
            COUNT(*) AS round_trips,
            AVG(b.amount_mid) AS avg_buy_value,
            AVG(s.amount_mid) AS avg_sell_value,
            ROUND(AVG(s.amount_mid - b.amount_mid), 0) AS avg_gain_per_trip,
            ROUND(AVG((s.amount_mid - b.amount_mid) / NULLIF(b.amount_mid, 0)) * 100, 2) AS avg_return_pct
        FROM v_trade_detail b
        JOIN v_trade_detail s
            ON  b.member = s.member
            AND b.ticker = s.ticker
            AND b.trade_type = 'purchase'
            AND s.trade_type IN ('sale', 'sale_partial')
            AND s.trade_date > b.trade_date
        GROUP BY b.member, b.chamber, b.ticker, b.sector
        HAVING round_trips >= ?
        ORDER BY avg_return_pct DESC`,
        [minRoundTrips]
        )
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch alpha proxy" }, { status: 500 })
    }
}