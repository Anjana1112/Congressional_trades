import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const [rows] = await pool.execute(`
        SELECT
            vs.full_name,
            vs.chamber,
            vs.state,
            vs.trade_count,
            vs.total_buys,
            vs.total_sells,
            ROUND(vs.total_sells / NULLIF(vs.total_buys, 0), 2) AS sell_to_buy_ratio
        FROM v_member_summary vs
        WHERE vs.total_buys > 0 AND vs.total_sells > 0
        ORDER BY sell_to_buy_ratio DESC
        `)
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch sell-to-buy ratios" }, { status: 500 })
    }
}