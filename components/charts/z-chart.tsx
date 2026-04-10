"use client"

import { useMemo } from "react"
import {
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
    Cell,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useData } from "@/app/data-context"
import { formatMoney, formatDate } from "@/lib/utils"

const PARTY_COLORS: Record<string, string> = {
    democrat: "#1d4ed8",
    republican: "#dc2626",
    other: "#eab308",
}

function getPartyColor(party: string | null | undefined) {
    const val = party?.toLowerCase().trim()
    if (val === "democrat") return PARTY_COLORS.democrat
    if (val === "republican") return PARTY_COLORS.republican
    return PARTY_COLORS.other
}

type ZScorePoint = {
    x: number
    y: number
    z: number
    member: string
    party: string | null
    ticker: string
    trade_type: string
    trade_date: string
    amount_mid: number
    avg_trade: number
    z_score: number
}

function parseDateToUTC(dateStr: string) {
    return new Date(dateStr).getTime()
}

function formatAxisDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
    })
}

export function ZScoreSpikePlot() {
    const { zScores } = useData()

    const chartData = useMemo<ZScorePoint[]>(() => {
        return zScores
        .map((d) => {
            const x = parseDateToUTC(d.trade_date)
            const y = Number(d.z_score)
            const amount = Number(d.amount_mid)
            const avg = Number(d.avg_trade)

            return {
                x,
                y,
                z: Math.max(80, Math.min(220, y * 10)),
                member: d.member,
                party: d.party,
                ticker: d.ticker,
                trade_type: d.trade_type,
                trade_date: d.trade_date,
                amount_mid: amount,
                avg_trade: avg,
                z_score: y,
            }
        })
        .filter(
            (d) =>
            Number.isFinite(d.x) &&
            Number.isFinite(d.y) &&
            Number.isFinite(d.amount_mid) &&
            Number.isFinite(d.avg_trade) &&
            d.y >= 3
        )
        .sort((a, b) => a.x - b.x)
    }, [zScores])

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Unusually Large Trades</CardTitle>
            <CardDescription>
            Trades with z-scores above each member&apos;s historical trade-size baseline
            </CardDescription>
        </CardHeader>

        <CardContent>
            {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No anomalies found.</p>
            ) : (
            <>
                <div className="h-95">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 12, right: 18, bottom: 18, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                    <XAxis
                        type="number"
                        dataKey="x"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={formatAxisDate}
                        tick={{ fontSize: 12 }}
                        name="Trade date"
                    />

                    <YAxis
                        type="number"
                        dataKey="y"
                        tick={{ fontSize: 12 }}
                        name="Z-score"
                    />

                    <ZAxis type="number" dataKey="z" range={[70, 200]} />

                    <ReferenceLine
                        y={3}
                        stroke="#6b7280"
                        strokeDasharray="4 4"
                        label={{ position: "right", fontSize: 12 }}
                    />

                    <ReferenceLine
                        y={6}
                        stroke="#6b7280"
                        strokeDasharray="4 4"
                        label={{ position: "right", fontSize: 12 }}
                    />

                    <ReferenceLine
                        y={10}
                        stroke="#6b7280"
                        strokeDasharray="4 4"
                        label={{ position: "right", fontSize: 12 }}
                    />

                    <Tooltip
                        content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const p = payload[0].payload as ZScorePoint

                        return (
                            <div className="rounded-lg border bg-background p-3 text-sm shadow-sm">
                            <div className="font-medium">{p.member}</div>
                            <div className="text-muted-foreground">{p.party || "Unknown Party"}</div>
                            <div className="text-muted-foreground">{p.trade_type}: {p.ticker}</div>
                            <div className="mt-2">Trade date: {formatDate(p.trade_date)}</div>
                            <div>Trade size: {formatMoney(p.amount_mid)}</div>
                            <div>Avg trade: {formatMoney(p.avg_trade)}</div>
                            <div className="font-medium">Z-score: {p.z_score.toFixed(2)}</div>
                            </div>
                        )
                        }}
                    />

                    <Scatter data={chartData}>
                        {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getPartyColor(entry.party)}
                            fillOpacity={0.85}
                        />
                        ))}
                    </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                {[
                    { color: PARTY_COLORS.democrat, label: "Democrat" },
                    { color: PARTY_COLORS.republican, label: "Republican" },
                    { color: PARTY_COLORS.other, label: "Other / Unknown" },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                    <span className="text-muted-foreground">{label}</span>
                    </div>
                ))}
                </div>
            </>
            )}
        </CardContent>
        </Card>
    )
}