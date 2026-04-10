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
import { getDelayColor } from "@/lib/utils"

type ScatterPoint = {
    x: number
    y: number
    z: number
    member: string
    party: string | null
    ticker: string
    trade_type: string
    trade_date: string
    filed_date: string
    days_to_disclose: number
}

function formatDateLabel(timestamp: number) {
    return new Date(timestamp).toLocaleDateString("en-US", {
        year: "2-digit",
        month: "short",
    })
}

export function LateDisclosureScatterPlot() {
    const { lateDisclosures } = useData()

    const chartData = useMemo<ScatterPoint[]>(() => {
        return lateDisclosures
        .map((d) => {
            const x = new Date(d.trade_date).getTime()
            const y = Number(d.days_to_disclose)

            return {
            x,
            y,
            z: Math.max(6, Math.min(18, y / 120)),
            member: d.member,
            party: d.party,
            ticker: d.ticker,
            trade_type: d.trade_type,
            trade_date: d.trade_date,
            filed_date: d.filed_date,
            days_to_disclose: y,
            }
        })
        .filter(
            (d) =>
            Number.isFinite(d.x) &&
            Number.isFinite(d.y) &&
            d.y > 45
        )
        .sort((a, b) => a.x - b.x)
    }, [lateDisclosures])

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Late Disclosure Scatter</CardTitle>
            <CardDescription>
            Each point is a late-reported trade. Higher points indicate longer disclosure delays.
            </CardDescription>
        </CardHeader>

        <CardContent className="h-90">
            {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No results found.</p>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 12, right: 18, bottom: 12, left: 6 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                <XAxis
                    type="number"
                    dataKey="x"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatDateLabel}
                    tick={{ fontSize: 12 }}
                    name="Trade date"
                />

                <YAxis
                    type="number"
                    dataKey="y"
                    tick={{ fontSize: 12 }}
                    name="Days to disclose"
                />

                <ZAxis type="number" dataKey="z" range={[60, 220]} />

                <ReferenceLine
                    y={45}
                    stroke="var(--destructive)"
                    strokeDasharray="4 4"
                    label={{ value: "45-day rule", position: "right", fontSize: 12 }}
                />

                <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => {
                    if (name === "Days to disclose") return [`${value} days`, name]
                    return [value, name]
                    }}
                    labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as ScatterPoint | undefined
                    if (!p) return ""
                    return `${p.member} • ${p.ticker}`
                    }}
                    content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const p = payload[0].payload as ScatterPoint

                    return (
                        <div className="rounded-lg border bg-background p-3 text-sm shadow-sm">
                        <div className="font-medium">
                            {p.member}: {p.ticker}
                        </div>
                        <div className="">
                            Party: {p.party || "—"}
                        </div>
                        <div className="text-green-600">
                            {p.trade_type}
                        </div>
                        <div className="mt-2">Trade date: {p.trade_date}</div>
                        <div>Filed date: {p.filed_date}</div>
                        <div className="font-medium">
                            Delay: {p.days_to_disclose} days
                        </div>
                        </div>
                    )
                    }}
                />

                <Scatter name="Late disclosures" data={chartData}>
                        {chartData.map((entry, index) => (
                            <Cell
                            key={`cell-${index}`}
                            fill={getDelayColor(entry.days_to_disclose)}
                            fillOpacity={0.85}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
            )}
        </CardContent>
        </Card>
    )
    }