"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/app/data-context"
import { SectorConcentration } from "@/lib/types"
import { formatMoney } from "@/lib/utils"

export function SectorConcentrationRanking() {
    const { sectorConcentration } = useData()

    const data = [...sectorConcentration]
        .filter(
        (row: SectorConcentration) =>
            row.pct_of_portfolio > 50 &&
            row.sector_trades >= 3 &&
            row.sector_value >= 50000
        )
        .sort(
        (a: SectorConcentration, b: SectorConcentration) =>
            b.pct_of_portfolio - a.pct_of_portfolio
        )
        .slice(0, 10)

    return (
        <Card>
        <CardHeader>
            <CardTitle>Sector Concentration</CardTitle>
            <CardDescription>
            Members whose trading activity is heavily concentrated in one sector
            </CardDescription>
        </CardHeader>

        <CardContent>
            {sectorConcentration.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Loading...</p>
            ) : data.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No results found.</p>
            ) : (
            <div className="space-y-5">
                {data.map((row, i) => (
                <div key={`${row.member}-${row.sector}-${i}`} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="truncate font-medium">{row.member}</div>

                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{(row.state)}</span>
                        <span className="text-gray-400">|</span>
                        <span>{row.sector}</span>
                        <span className="text-gray-400">|</span>
                        <span>{row.party || "-"}</span>
                        </div>
                    </div>

                    <div className="shrink-0 text-right">
                        <div className="font-medium">{row.pct_of_portfolio}%</div>
                        <div className="text-xs text-muted-foreground">
                        {row.sector_trades} trades · {formatMoney(row.sector_value)}
                        </div>
                    </div>
                    </div>

                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(row.pct_of_portfolio, 100)}%` }}
                    />
                    </div>
                </div>
                ))}
            </div>
            )}
        </CardContent>
        </Card>
    )
}