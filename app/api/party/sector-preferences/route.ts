import pool from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const [rows] = await pool.execute(
        `SELECT 
            p.name AS party,
            c.name AS committee,
            s.sector,
            COUNT(t.id) AS trade_count,
            SUM(t.amount_mid) AS total_invested,
            COUNT(DISTINCT t.member_id) AS members_trading_sector
        FROM trades t
        JOIN members m ON t.member_id = m.id
        JOIN parties p ON m.party_id = p.id
        JOIN stocks s ON t.stock_id = s.id
        LEFT JOIN member_committees mc ON m.id = mc.member_id
        LEFT JOIN committees c ON mc.committee_id = c.id
        WHERE s.sector IS NOT NULL
        GROUP BY p.id, p.name, c.id, c.name, s.sector
        ORDER BY party, total_invested DESC`
        )

        return NextResponse.json(rows)
    } catch (error) {
        console.error("DB ERROR:", error)
        return NextResponse.json(
        { error: "Failed to fetch sector preferences" },
        { status: 500 }
        )
    }
}