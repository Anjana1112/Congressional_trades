"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useData } from "@/app/data-context"
import { formatMoney } from "@/lib/utils"

const EVENT_DATE = "2020-03-13"
const WINDOW_DAYS = 30

const config = {
  trade_count: { label: "Daily Trades", color: "var(--chart-1)" },
  total_value: { label: "Value Invested", color: "var(--chart-1)" },
} satisfies ChartConfig

export function PreEventTradeChart() {
  const { trades } = useData()

  const data = useMemo(() => {
    const eventDate = new Date(`${EVENT_DATE}T00:00:00`)
    const startDate = new Date(eventDate)
    startDate.setDate(startDate.getDate() - WINDOW_DAYS)

    const grouped = new Map<string, { trade_count: number; total_value: number }>()

    for (const trade of trades) {
      const dateStr = trade.trade_date?.slice(0, 10)
      if (!dateStr) continue

      const tradeDate = new Date(`${dateStr}T00:00:00`)
      if (tradeDate < startDate || tradeDate >= eventDate) continue

      const estimatedValue = Number(trade.amount_mid ?? 0)
      const current = grouped.get(dateStr) ?? { trade_count: 0, total_value: 0 }

      grouped.set(dateStr, {
        trade_count: current.trade_count + 1,
        total_value: current.total_value + estimatedValue,
      })
    }

    return [...grouped.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, values]) => ({
        date,
        trade_count: values.trade_count,
        total_value: values.total_value,
      }))
  }, [trades])

  return (
    <Card>
      <CardHeader>
        <CardTitle>30 Days Before COVID</CardTitle>
        <CardDescription>
          Daily trade volume in the {WINDOW_DAYS} days before {EVENT_DATE}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={config} className="h-87.5 w-full">
          <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={30}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    if (name === "trade_count") {
                      return [
                        <div key="tooltip-values" className="flex flex-col gap-1">
                          <div>Trades: {value}</div>
                          <div>
                            Value Invested: {formatMoney(
                              Number(item.payload?.total_value ?? 0)
                            )}
                          </div>
                        </div>,
                      ]
                    }

                    return [value, name]
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="trade_count"
              stroke="var(--color-trade_count)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}