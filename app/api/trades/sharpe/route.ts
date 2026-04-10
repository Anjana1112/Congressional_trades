import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const [rows] = await pool.execute(`
        WITH member_trade_stats AS (
            SELECT
            vd.member,
            vd.party,
            vd.chamber,
            vd.state,
            AVG(vd.amount_mid) AS avg_trade_size,
            STDDEV(vd.amount_mid) AS stddev_trade_size,
            SUM(IF(vd.trade_type IN ('sale','sale_partial'), vd.amount_mid, 0)) AS total_sells,
            SUM(IF(vd.trade_type = 'purchase', vd.amount_mid, 0)) AS total_buys
            FROM v_trade_detail vd
            GROUP BY vd.member, vd.chamber, vd.party, vd.state
        )
        SELECT
            member,
            chamber,
            party,
            state,
            ROUND(avg_trade_size, 0) AS avg_trade_size,
            ROUND(stddev_trade_size, 0) AS trade_volatility,
            total_buys,
            total_sells,
            (total_sells - total_buys) AS net_profit_proxy,
            ROUND((total_sells - total_buys) / NULLIF(stddev_trade_size, 0), 2) AS sharpe_proxy
        FROM member_trade_stats
        WHERE stddev_trade_size > 0
        ORDER BY sharpe_proxy DESC
        `)
        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json({ error: "Failed to fetch Sharpe" }, { status: 500 })
    }
}