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
    party_1: string | null
    member_2: string
    party_2: string | null
    clusterCount: number
    distinctTickers: number
    avgDaysApart: number
    minDaysApart: number
    sameDirectionCount: number
    oppositeDirectionCount: number
    sharedTickers: string[]
}

type MemberLabel = {
    name: string
    party: string | null
}

export function ClusterTradingHeatmap() {
    const formatParty = (party?: string | null) => {
        if (!party) return "—"
        if (party.toLowerCase() === "democrat") return "DNC"
        if (party.toLowerCase() === "republican") return "GOP"
        return party
    }

    const { cluster } = useData()
    const [hoveredPair, setHoveredPair] = useState<PairSummary | null>(null)

    const { members, matrix, maxCount } = useMemo(() => {
        const rows = (cluster ?? []) as Cluster[]
        const pairMap = new Map<string, PairSummary>()
        const memberTotals = new Map<string, number>()
        const memberPartyMap = new Map<string, string | null>()

        for (const row of rows) {
        const m1 = row.member_1.trim()
        const m2 = row.member_2.trim()
        const [member_1, member_2] = m1 < m2 ? [m1, m2] : [m2, m1]
        const [party_1, party_2] =
            m1 < m2
            ? [row.party_1 ?? null, row.party_2 ?? null]
            : [row.party_2 ?? null, row.party_1 ?? null]

        const key = `${member_1}|||${member_2}`

        memberPartyMap.set(member_1, party_1)
        memberPartyMap.set(member_2, party_2)

        if (!pairMap.has(key)) {
            pairMap.set(key, {
            member_1,
            party_1,
            member_2,
            party_2,
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
        .slice(0, 8)
        .map(([member]) => ({
            name: member,
            party: memberPartyMap.get(member) ?? null,
        }))

        const topMemberNames = topMembers.map((m) => m.name)

        const filteredPairs = summaries.filter(
        (pair) =>
            topMemberNames.includes(pair.member_1) && topMemberNames.includes(pair.member_2)
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
        <Card className="h-fit rounded-xl border bg-background shadow-sm">
        <CardHeader className="space-y-1 px-4 py-3">
            <CardTitle className="text-base">Cluster Trading Heatmap</CardTitle>
            <CardDescription className="text-xs">
            Repeated same-stock trades within 7 days
            </CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0">
            {!cluster || cluster.length === 0 ? (
            <p className="text-xs text-muted-foreground">Loading...</p>
            ) : members.length === 0 ? (
            <p className="text-xs text-muted-foreground">No results found.</p>
            ) : (
            <div className="space-y-3">
                <div className="overflow-x-auto">
                <div
                    className="grid gap-1"
                    style={{
                    gridTemplateColumns: `110px repeat(${members.length}, 36px)`,
                    minWidth: `${110 + members.length * 36}px`,
                    }}
                >
                    <div className="h-14" />

                    {members.map((member) => (
                    <div
                        key={`col-${member.name}`}
                        className="flex h-14 items-end justify-center overflow-visible"
                    >
                        <div
                        className="origin-bottom-left -rotate-45 whitespace-nowrap"
                        title={member.name}
                        >
                        <div className="max-w-20 truncate text-[10px] font-medium text-muted-foreground">
                            {member.name}
                        </div>
                        <div className="text-[9px] text-muted-foreground/70">
                            {formatParty(member.party) ?? "-"}
                        </div>
                        </div>
                    </div>
                    ))}

                    {members.map((rowMember) => (
                    <FragmentRow
                        key={rowMember.name}
                        rowMember={rowMember}
                        members={members}
                        matrix={matrix}
                        maxCount={maxCount}
                        setHoveredPair={setHoveredPair}
                    />
                    ))}
                </div>
                </div>

                <div className="rounded-md border p-3">
                {hoveredPair ? (
                    <div className="space-y-2">
                    <div className="text-xs font-medium">
                        {hoveredPair.member_1} ({hoveredPair.party_1 ?? "-"}) &{" "}
                        {hoveredPair.member_2} ({hoveredPair.party_2 ?? "-"})
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span>{hoveredPair.clusterCount} overlaps</span>
                        <span>{hoveredPair.distinctTickers} tickers</span>
                        <span>Avg {hoveredPair.avgDaysApart.toFixed(1)}d</span>
                        <span>Min {hoveredPair.minDaysApart}d</span>
                        <span className="text-green-600">
                            ↑ {hoveredPair.sameDirectionCount}
                        </span>
                        <span className="text-red-600">
                            ↓ {hoveredPair.oppositeDirectionCount}
                        </span>
                    </div>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground">
                    Hover a cell to inspect a pair.
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
    rowMember: MemberLabel
    members: MemberLabel[]
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
        <div className="flex flex-col justify-center pr-1">
            <span
            className="truncate text-[10px] font-medium text-muted-foreground"
            title={rowMember.name}
            >
            {rowMember.name}
            </span>
            <span className="truncate text-[9px] text-muted-foreground/70">
            {rowMember.party ?? "-"}
            </span>
        </div>

        {members.map((colMember) => {
            if (rowMember.name === colMember.name) {
            return (
                <div
                key={`${rowMember.name}-${colMember.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-sm border bg-muted/40 text-[10px] text-muted-foreground"
                >
                —
                </div>
            )
            }

            const key =
            rowMember.name < colMember.name
                ? `${rowMember.name}|||${colMember.name}`
                : `${colMember.name}|||${rowMember.name}`

            const pair = matrix.get(key)
            const count = pair?.clusterCount ?? 0

            return (
            <button
                key={`${rowMember.name}-${colMember.name}`}
                type="button"
                onMouseEnter={() => setHoveredPair(pair ?? null)}
                onMouseLeave={() => setHoveredPair(null)}
                className="flex h-9 w-9 items-center justify-center rounded-sm border text-[10px] font-medium"
                style={{
                backgroundColor: getHeatColor(count, maxCount),
                color: getTextColor(count, maxCount),
                }}
                title={
                pair
                    ? `${pair.member_1} (${pair.party_1 ?? "-"}) & ${pair.member_2} (${pair.party_2 ?? "-"}): ${pair.clusterCount} overlaps`
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