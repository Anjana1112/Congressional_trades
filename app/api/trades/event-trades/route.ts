import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const eventDate = searchParams.get("event_date") ?? "2020-03-13"
    const windowDays = parseInt(searchParams.get("window_days") ?? "30")

    try {
        const [rows] = await pool.execute(
        `SELECT
            vd.member,
            vd.chamber,
            vd.state,
            vd.ticker,
            vd.company_name,
            vd.sector,
            vd.trade_type,
            vd.trade_date,
            vd.filed_date,
            DATEDIFF(?, vd.trade_date) AS days_before_event,
            vd.amount_mid AS estimated_value
        FROM v_trade_detail vd
        WHERE vd.trade_date BETWEEN DATE_SUB(?, INTERVAL ? DAY) AND ?
        ORDER BY vd.trade_date DESC, estimated_value ASC`,
        [eventDate, eventDate, windowDays, eventDate]
        )
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch trades before event" }, { status: 500 })
    }
}