import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
      const [rows] = await pool.execute(`
        SELECT
          vd.member,
          vd.state,
          vd.party,
          vd.sector,
          COUNT(vd.trade_id) AS sector_trades,
          SUM(vd.amount_mid) AS sector_value,
          ROUND(
            SUM(vd.amount_mid) / SUM(SUM(vd.amount_mid)) OVER (PARTITION BY vd.member) * 100,
            1
          ) AS pct_of_portfolio
        FROM v_trade_detail vd
        WHERE vd.sector IS NOT NULL
        GROUP BY vd.member, vd.state, vd.party, vd.sector
        ORDER BY sector_value DESC
      `)
      return NextResponse.json(rows)
    } catch (error) {
      console.error("DB ERROR:", error)
      return NextResponse.json({ error: "Failed to fetch sector concentration" }, { status: 500 })
    }
}