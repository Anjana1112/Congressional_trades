"use client"

import { useMemo, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useData } from "@/app/data-context"
import { Cluster } from "@/lib/types"
import { getHeatColor, getTextColor, isSameDirection } from "@/lib/utils"

type PairSummary = {
    member_1: string
    member_2: string
    clusterCount: number
    distinctTickers: number
    avgDaysApart: number
    minDaysApart: number
    sameDirectionCount: number
    oppositeDirectionCount: number
    sharedTickers: string[]
}

export function ClusterTradingHeatmap() {
        const { cluster } = useData()
        const [hoveredPair, setHoveredPair] = useState<PairSummary | null>(null)

        const { members, matrix, maxCount } = useMemo(() => {
            const rows = (cluster ?? []) as Cluster[]
            const pairMap = new Map<string, PairSummary>()
            const memberTotals = new Map<string, number>()

            for (const row of rows) {
                const m1 = row.member_1.trim()
                const m2 = row.member_2.trim()
                const [member_1, member_2] = m1 < m2 ? [m1, m2] : [m2, m1]
                const key = `${member_1}|||${member_2}`

                if (!pairMap.has(key)) {
                    pairMap.set(key, {
                        member_1,
                        member_2,
                        clusterCount: 0,
                        distinctTickers: 0,
                        avgDaysApart: 0,
                        minDaysApart: row.days_apart,
                        sameDirectionCount: 0,
                        oppositeDirectionCount: 0,
                        sharedTickers: [],
                    })
                }

                const current = pairMap.get(key)!
                current.clusterCount += 1
                current.minDaysApart = Math.min(current.minDaysApart, row.days_apart)
                current.avgDaysApart += row.days_apart

                if (isSameDirection(row.type_1, row.type_2)) {
                    current.sameDirectionCount += 1
                } else {
                    current.oppositeDirectionCount += 1
                }

                if (!current.sharedTickers.includes(row.ticker)) {
                    current.sharedTickers.push(row.ticker)
                }

                memberTotals.set(member_1, (memberTotals.get(member_1) ?? 0) + 1)
                memberTotals.set(member_2, (memberTotals.get(member_2) ?? 0) + 1)
            }

            const summaries = [...pairMap.values()].map((pair) => ({
                ...pair,
                distinctTickers: pair.sharedTickers.length,
                avgDaysApart: pair.clusterCount > 0 ? pair.avgDaysApart / pair.clusterCount : 0,
            }))

            const topMembers = [...memberTotals.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([member]) => member)

            const filteredPairs = summaries.filter(
                (pair) =>
                    topMembers.includes(pair.member_1) && topMembers.includes(pair.member_2)
            )

            const matrixMap = new Map<string, PairSummary>()
            for (const pair of filteredPairs) {
                matrixMap.set(`${pair.member_1}|||${pair.member_2}`, pair)
            }

            const max =
                filteredPairs.length > 0
                    ? Math.max(...filteredPairs.map((pair) => pair.clusterCount))
                    : 0

            return {
                members: topMembers,
                matrix: matrixMap,
                maxCount: max,
            }
        }, [cluster])

        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>Cluster Trading Heatmap</CardTitle>
                    <CardDescription>
                        Member pairs repeatedly trading the same stock within 7 days
                    </CardDescription>
                </CardHeader>

                <CardContent className="h-[calc(100%-88px)]">
                    {!cluster || cluster.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">Loading...</p>
                    ) : members.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">No results found.</p>
                    ) : (
                        <div className="h-full min-w-0">
                            <div className="overflow-x-auto">
                                <div
                                    className="grid gap-y-1 gap-x-1"
                                    style={{
                                        gridTemplateColumns: `160px repeat(${members.length}, minmax(56px, 1fr))`,
                                        minWidth: `${160 + members.length * 56}px`,
                                    }}
                                >
                                    <div className="h-20" />

                                    {members.map((member) => (
                                        <div
                                            key={`col-${member}`}
                                            className="flex h-20 items-end justify-center overflow-visible"
                                        >
                                            <span
                                                className="origin-bottom-left -rotate-45 whitespace-nowrap text-xs font-medium text-muted-foreground"
                                                title={member}
                                            >
                                                {member}
                                            </span>
                                        </div>
                                    ))}

                                    {members.map((rowMember) => (
                                        <FragmentRow
                                            key={rowMember}
                                            rowMember={rowMember}
                                            members={members}
                                            matrix={matrix}
                                            maxCount={maxCount}
                                            setHoveredPair={setHoveredPair}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 rounded-md border p-4">
                                {hoveredPair ? (
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0">
                                                <div className="truncate font-medium">{hoveredPair.member_1}</div>
                                                <div className="truncate text-sm text-muted-foreground">
                                                    {hoveredPair.member_2}
                                                </div>
                                            </div>

                                            <div className="text-right text-sm">
                                                <div className="font-medium">
                                                    {hoveredPair.clusterCount} overlaps
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {hoveredPair.distinctTickers} tickers
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span>Avg gap: {hoveredPair.avgDaysApart.toFixed(1)}d</span>
                                            <span>Min gap: {hoveredPair.minDaysApart}d</span>
                                            <span>Same direction: {hoveredPair.sameDirectionCount}</span>
                                            <span>Opposite: {hoveredPair.oppositeDirectionCount}</span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {hoveredPair.sharedTickers.slice(0, 8).map((ticker) => (
                                                <span
                                                    key={ticker}
                                                    className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                                >
                                                    {ticker}
                                                </span>
                                            ))}
                                            {hoveredPair.sharedTickers.length > 8 && (
                                                <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                    +{hoveredPair.sharedTickers.length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Hover a cell to inspect a member pair.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        )
    }

    type FragmentRowProps = {
        rowMember: string
        members: string[]
        matrix: Map<string, PairSummary>
        maxCount: number
        setHoveredPair: React.Dispatch<React.SetStateAction<PairSummary | null>>
    }

    function FragmentRow({
        rowMember,
        members,
        matrix,
        maxCount,
        setHoveredPair,
    }: FragmentRowProps) {
        return (
            <>
                <div
                    className="flex items-center pr-1 text-xs font-medium text-muted-foreground"
                    title={rowMember}
                >
                    <span className="truncate">{rowMember}</span>
                </div>

                {members.map((colMember) => {
                    if (rowMember === colMember) {
                        return (
                            <div
                                key={`${rowMember}-${colMember}`}
                                className="flex aspect-square items-center justify-center rounded-md border bg-muted/40 text-[10px] text-muted-foreground"
                            >
                                —
                            </div>
                        )
                    }

                    const key =
                        rowMember < colMember
                            ? `${rowMember}|||${colMember}`
                            : `${colMember}|||${rowMember}`

                    const pair = matrix.get(key)
                    const count = pair?.clusterCount ?? 0

                    return (
                        <button
                            key={`${rowMember}-${colMember}`}
                            type="button"
                            onMouseEnter={() => setHoveredPair(pair ?? null)}
                            onMouseLeave={() => setHoveredPair(null)}
                            className="flex aspect-square items-center justify-center rounded-md border text-xs font-medium transition-transform hover:scale-[1.03]"
                            style={{
                                backgroundColor: getHeatColor(count, maxCount),
                                color: getTextColor(count, maxCount),
                            }}
                            title={
                                pair
                                    ? `${pair.member_1} & ${pair.member_2}: ${pair.clusterCount} overlaps`
                                    : "No overlap"
                            }
                        >
                            {count > 0 ? count : ""}
                        </button>
                    )
                })}
            </>
        )
}