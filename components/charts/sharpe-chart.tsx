"use client"

import { useMemo } from "react"
import {
    CartesianGrid,
    Cell,
    ReferenceLine,
    Scatter,
    ScatterChart,
    XAxis,
    YAxis,
    ZAxis,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from "@/components/ui/chart"
import { useData } from "@/app/data-context"

const PARTY_COLORS: Record<string, string> = {
    democrat: "#1d4ed8",
    republican: "#dc2626",
    other: "#eab308",
}

const chartConfig = {
    democrat: {
        label: "Democrat",
        color: PARTY_COLORS.democrat,
    },
    republican: {
        label: "Republican",
        color: PARTY_COLORS.republican,
    },
    other: {
        label: "Other / Unknown",
        color: PARTY_COLORS.other,
    },
} satisfies ChartConfig

type PartyKey = "democrat" | "republican" | "other"

type SharpeProxyRow = {
    member: string
    party: string | null
    state: string | null
    avg_trade_size: number | string | null
    trade_volatility: number | string | null
    total_buys: number | string | null
    total_sells: number | string | null
    net_profit_proxy: number | string | null
    sharpe_proxy: number | string | null
}

type ScatterRow = {
    member: string
    party: PartyKey
    state: string | null
    avg_trade_size: number
    trade_volatility: number
    total_buys: number
    total_sells: number
    net_profit_proxy: number
    sharpe_proxy: number
    trade_count_proxy: number
    fill: string
}

function formatCompactMoney(value: number) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
  }).format(value)
}

function formatMoney(value: number) {
    const abs = Math.abs(value)

    if (abs >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`
    }

    if (abs >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`
    }

    return `$${value.toLocaleString("en-US")}`
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })
}

function normalizeParty(party: string | null | undefined): PartyKey {
    const value = party?.toLowerCase().trim()

    if (value === "democrat") return "democrat"
    if (value === "republican") return "republican"

    return "other"
}

export function SharpeProxyChart() {
    const { sharpeProxies } = useData()

    const data = useMemo<ScatterRow[]>(() => {
        return (sharpeProxies as SharpeProxyRow[])
        .map((row) => {
            const party = normalizeParty(row.party)
            const avgTradeSize = Number(row.avg_trade_size)
            const tradeVolatility = Number(row.trade_volatility)
            const totalBuys = Number(row.total_buys)
            const totalSells = Number(row.total_sells)
            const netProfitProxy = Number(row.net_profit_proxy)
            const sharpeProxy = Number(row.sharpe_proxy)

            return {
            member: row.member,
            party,
            state: row.state,
            avg_trade_size: avgTradeSize,
            trade_volatility: tradeVolatility,
            total_buys: totalBuys,
            total_sells: totalSells,
            net_profit_proxy: netProfitProxy,
            sharpe_proxy: sharpeProxy,
            trade_count_proxy: Math.max(totalBuys + totalSells, 1),
            fill: PARTY_COLORS[party],
            }
        })
        .filter(
            (row) =>
            Number.isFinite(row.net_profit_proxy) &&
            Number.isFinite(row.sharpe_proxy) &&
            Number.isFinite(row.trade_count_proxy)
        )
        .sort((a, b) => b.sharpe_proxy - a.sharpe_proxy)
    }, [sharpeProxies])

    return (
        <Card>
        <CardHeader>
            <CardTitle>Sharpe Proxy vs Net Profit Proxy</CardTitle>
            <CardDescription>
            Higher points indicate stronger risk-adjusted trading behavior.
            Farther-right points show larger positive net profit proxy. Bubble
            size reflects total trading activity.
            </CardDescription>
        </CardHeader>

        <CardContent>
            <ChartContainer config={chartConfig} className="h-105 w-full">
            <ScatterChart
                accessibilityLayer
                margin={{ left: 12, right: 18, top: 10, bottom: 10 }}
            >
                <CartesianGrid />

                <XAxis
                type="number"
                dataKey="net_profit_proxy"
                name="Net Profit Proxy"
                tickFormatter={(value) => formatCompactMoney(Number(value))}
                />

                <YAxis
                type="number"
                dataKey="sharpe_proxy"
                name="Sharpe Proxy"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                />

                <ZAxis
                type="number"
                dataKey="trade_count_proxy"
                name="Trading Activity"
                range={[70, 450]}
                />

                <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />

            

                <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                    if (!active || !payload?.length) return null

                    const row = payload[0].payload as ScatterRow

                    return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
                        <div className="font-medium">{row.member}</div>

                        <div className="text-muted-foreground capitalize">
                        {row.party === "other" ? "Other / Unknown" : row.party}
                        {" • "}
                        {row.state ? (
                            row.state
                        ) : (
                            <span className="italic opacity-70">Unknown</span>
                        )}
                        </div>

                        <div className="mt-2 space-y-1">
                        <div>Sharpe Proxy: {formatNumber(row.sharpe_proxy)}</div>
                        <div>
                            Net Profit Proxy: {formatMoney(row.net_profit_proxy)}
                        </div>
                        <div>
                            Avg Trade Size: {formatMoney(row.avg_trade_size)}
                        </div>
                        <div>
                            Trade Volatility: {formatNumber(row.trade_volatility)}
                        </div>
                        <div>Total Buys: {formatMoney(row.total_buys)}</div>
                        <div>Total Sells: {formatMoney(row.total_sells)}</div>
                        </div>
                    </div>
                    )
                }}
                />

                <Scatter data={data}>
                {data.map((row, index) => (
                    <Cell key={`${row.member}-${index}`} fill={row.fill} />
                ))}
                </Scatter>
            </ScatterChart>
            </ChartContainer>
            <div className="flex gap-4 justify-end mt-3 text-sm">
              {(Object.entries(chartConfig) as [PartyKey, { label: string; color: string }][]).map(([key, { label, color }]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
        </CardContent>
        </Card>
    )
}