"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { formatMoney } from "@/lib/utils"
import { useData } from "@/app/data-context"

type SectorPreference = {
    party: string | null
    sector: string | null
    total_invested: number | string | null
}

type Row = {
    party: string
} & Record<string, number | string>

type Flat = {
    party: string
    sector: string
    value: number
}

const COLORS = [
    "#3f3875",
    "#16a34a",
    "#ea580c",
    "#8967c3",
    "#db2777",
    "#0f766e",
    "#85bcda",
    "#64748b",
]

export function SectorParty() {
    const { sectorPreferences } = useData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const raw: SectorPreference[] = Array.isArray(sectorPreferences)
        ? sectorPreferences
        : []

    const flat = useMemo<Flat[]>(() => {
        return raw
        .map((r) => ({
            party: r.party ?? "",
            sector: r.sector ?? "",
            value: Number(r.total_invested ?? 0),
        }))
        .filter((r) => r.party && r.sector && r.value > 0)
    }, [raw])

    const orderedSectors = useMemo(() => {
        const totals = new Map<string, number>()

        for (const r of flat) {
        totals.set(r.sector, (totals.get(r.sector) ?? 0) + r.value)
        }

        return Array.from(totals.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([s]) => s)
    }, [flat])

    const visible = useMemo(() => orderedSectors.slice(0, 6), [orderedSectors])

    const data = useMemo<Row[]>(() => {
        const map = new Map<string, Row>()

        for (const r of flat) {
        const key = visible.includes(r.sector) ? r.sector : "Other"

        if (!map.has(r.party)) {
            map.set(r.party, { party: r.party })
        }

        const entry = map.get(r.party)!
        const current =
            typeof entry[key] === "number" ? (entry[key] as number) : 0

        entry[key] = current + r.value
        }

        return Array.from(map.values())
    }, [flat, visible])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stackKeys = orderedSectors.length > 6 ? [...visible, "Other"] : visible

    const config: ChartConfig = useMemo(() => {
        const c: ChartConfig = {}

        stackKeys.forEach((key, i) => {
        c[key] = {
            label: key,
            color: COLORS[i % COLORS.length],
        }
        })

        return c
    }, [stackKeys])

    return (
        <Card>
        <CardHeader>
            <CardTitle>Sector Distribution by Party</CardTitle>
            <CardDescription>
            Total invested across sectors
            </CardDescription>
        </CardHeader>

        <CardContent>
            <ChartContainer config={config} className="h-80 w-full">
            <BarChart data={data} accessibilityLayer>
                <CartesianGrid vertical={false} />

                <XAxis
                dataKey="party"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                />

                <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    indicator="dot"
                    formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-4">
                        <span>{String(name)}</span>
                        <span className="font-medium">
                            {formatMoney(Number(value ?? 0))}
                        </span>
                        </div>
                    )}
                    />
                }
                />

                <ChartLegend content={<ChartLegendContent />} />

                {stackKeys.map((key, i) => (
                <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={COLORS[i % COLORS.length]}
                    radius={
                    i === 0
                        ? [0, 0, 4, 4]
                        : i === stackKeys.length - 1
                        ? [4, 4, 0, 0]
                        : [0, 0, 0, 0]
                    }
                />
                ))}
            </BarChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}