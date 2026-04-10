import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const minZ = parseFloat(searchParams.get("min_z") ?? "2")

    try {
        const [rows] = await pool.execute(
        `WITH member_stats AS (
            SELECT
            vd.member,
            AVG(vd.amount_mid) AS avg_trade,
            STDDEV(vd.amount_mid) AS stddev_trade
            FROM v_trade_detail vd
            GROUP BY vd.member
        )
        SELECT
            vd.member,
            vd.chamber,
            vd.party,
            vd.ticker,
            vd.company_name,
            vd.sector,
            vd.trade_type,
            vd.trade_date,
            vd.amount_mid,
            ms.avg_trade,
            ROUND((vd.amount_mid - ms.avg_trade) / NULLIF(ms.stddev_trade, 0), 2) AS z_score
        FROM v_trade_detail vd
        JOIN member_stats ms ON vd.member = ms.member
        WHERE (vd.amount_mid - ms.avg_trade) / NULLIF(ms.stddev_trade, 0) > ?
        ORDER BY z_score DESC`,
        [minZ]
        )
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch z-score spikes" }, { status: 500 })
    }
}