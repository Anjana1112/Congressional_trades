"use client"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useData } from "@/app/data-context"

const stocksConfig = {
    total_invested: { label: "Total Invested", color: "var(--chart-1)" },
} satisfies ChartConfig

export function TopStocksBarChart() {
    const { stocks } = useData()
    const data = stocks
        .sort((a, b) => Number(b.total_invested) - Number(a.total_invested))
        .slice(0, 10)
        .map(r => ({ ...r, total_invested: Number(r.total_invested) }))

    return (
        <Card>
        <CardHeader>
            <CardTitle>Top 10 Stocks by Investment</CardTitle>
            <CardDescription>Total estimated $ invested in each stock</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={stocksConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" dataKey="total_invested" hide />
                <YAxis dataKey="ticker" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={v => [`$${Math.floor(Number(v)).toLocaleString()}`]} hideLabel />} />
                <Bar dataKey="total_invested" fill="var(--color-total_invested)" radius={5} />
            </BarChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}