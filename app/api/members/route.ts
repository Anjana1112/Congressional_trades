import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM v_member_summary
        ORDER BY id ASC
      `)
      return NextResponse.json(rows)
    } catch (error) {
      console.error("DB ERROR:", error)
      return NextResponse.json(
        { error: "Failed to fetch members" },
        { status: 500 }
      )
    }
}