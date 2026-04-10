import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const [rows] = await pool.execute(`
        SELECT
            vd.member,
            vd.chamber,
            vd.ticker,
            vd.party,
            vd.sector,
            vd.trade_type,
            vd.trade_date,
            vd.filed_date,
            DATEDIFF(vd.filed_date, vd.trade_date) AS days_to_disclose
        FROM v_trade_detail vd
        WHERE vd.trade_type IN ('sale', 'sale_partial') AND DATEDIFF(vd.filed_date, vd.trade_date) > 45
        ORDER BY days_to_disclose DESC;

        `)

        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json(
        { error: "Failed to fetch late disclosures by state" },
        { status: 500 }
        )
    }
}