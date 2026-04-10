"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useData } from "@/app/data-context"

const chartConfig = {
  sharpe_proxy: {
    label: "Sharpe Proxy",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SharpeProxyChart() {
    const { sharpeProxies } = useData()

    const data = useMemo(() => {
        return [...sharpeProxies]
        .filter((row) => Number.isFinite(Number(row.sharpe_proxy)))
        .sort((a, b) => Number(b.sharpe_proxy) - Number(a.sharpe_proxy))
        .slice(0, 10)
        .map((row) => ({
            ...row,
            sharpe_proxy: Number(row.sharpe_proxy),
            short_name: row.member, 
        }))
    }, [sharpeProxies])

    return (
        <Card>
        <CardHeader>
            <CardTitle>Top 10 Members by Sharpe Proxy</CardTitle>
            <CardDescription>
            Risk-adjusted sell-vs-buy proxy ranked by consistency
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-105 w-full">
            <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{ left: -55, right: 12, top: 8, bottom: 8 }}
            >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="sharpe_proxy" />
                <YAxis
                dataKey="short_name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={180}
                interval={0}
                />
                <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    formatter={(value) => [`${Number(value).toFixed(2)}`]}
                    />
                }
                />
                <Bar
                dataKey="sharpe_proxy"
                fill="var(--color-sharpe_proxy)"
                radius={6}
                />
            </BarChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}