"use client"

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    ReferenceLine,
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
import { formatMoney, formatAxisValue } from "@/lib/utils"

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

export function SellToBuyScatterPlot() {
    const { sellBuyRatios } = useData()

    const data = sellBuyRatios
        .filter((row) => row.total_buys > 0 && row.total_sells > 0)
        .map((row) => {
            const totalBuys = Number(row.total_buys)
            const totalSells = Number(row.total_sells)
            const tradeCount = Number(row.trade_count)
            const ratio = totalSells / totalBuys

            return {
                x: Math.log10(totalBuys),
                y: Math.log10(totalSells),
                z: tradeCount,
                name: row.full_name,
                party: row.party,
                state: row.state,
                ratio: Number(ratio.toFixed(2)),
                totalBuys,
                totalSells,
                color: getPartyColor(row.party),
            }
        })
        .sort((a, b) => b.ratio - a.ratio)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sell vs Buy Behavior</CardTitle>
                <CardDescription>
                    Members above the diagonal are selling more than they buy
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="h-130">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Total Buys (log10)"
                                tick={{ fontSize: 12 }}
                                domain={["dataMin - 0.2", "dataMax + 0.2"]}
                                tickFormatter={formatAxisValue}
                            />

                            <YAxis
                                type="number"
                                dataKey="y"
                                name="Total Sells (log10)"
                                tick={{ fontSize: 12 }}
                                domain={["dataMin - 0.2", "dataMax + 0.2"]}
                                tickFormatter={formatAxisValue}
                            />

                            <ZAxis
                                type="number"
                                dataKey="z"
                                range={[50, 400]}
                                name="Trades"
                            />

                            <ReferenceLine
                                segment={[
                                    { x: Math.min(...data.map((d) => d.x)), y: Math.min(...data.map((d) => d.x)) },
                                    { x: Math.max(...data.map((d) => d.x)), y: Math.max(...data.map((d) => d.x)) },
                                ]}
                                stroke="#374151"
                                strokeDasharray="6 6"
                            />

                            <Tooltip
                                cursor={{ strokeDasharray: "3 3" }}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    const d = payload[0].payload

                                    return (
                                        <div className="rounded-md border bg-background p-3 shadow-sm text-sm">
                                            <div className="font-medium">{d.name}</div>
                                            <div className="text-muted-foreground">{d.state} | {d.party || "Unknown Party"}</div>
                                            <div>Buys: {formatMoney(d.totalBuys)}</div>
                                            <div>Sells: {formatMoney(d.totalSells)}</div>
                                            <div>Trades: {d.z}</div>
                                            <div className="mt-2 font-medium">
                                                Sell-to-buy ratio: {d.ratio}x
                                            </div>
                                        </div>
                                    )
                                }}
                            />

                            <Scatter data={data}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
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
            </CardContent>
        </Card>
    )
}