"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useData } from "@/app/data-context"
import { Trade } from "@/lib/types"
import { formatDate, formatAmountRange, formatTradeType } from "@/lib/utils"
import Link from "next/link"

export function LatestTradesTable() {
    const { trades } = useData()

    const formatParty = (party?: string | null) => {
        if (!party) return "—"
        if (party.toLowerCase() === "democrat") return "DNC"
        if (party.toLowerCase() === "republican") return "GOP"
        return party
    }

    const data = [...trades]
        .sort(
            (a: Trade, b: Trade) =>
                new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime()
        )
        .slice(0, 5)

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Latest Trades</CardTitle>
                    <CardDescription>
                        Most recently disclosed congressional trades
                    </CardDescription>
                </div>

                <Link
                    href="/trades"
                    className="text-sm text-gray-400 hover:text-gray-600 transition"
                >
                    View all
                </Link>
            </CardHeader>

            <CardContent>
                {trades.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">Loading...</p>
                ) : (
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Ticker</TableHead>
                                    <TableHead className="text-center">Sector</TableHead>
                                    <TableHead className="text-center">Amount Range</TableHead>
                                    <TableHead className="text-right">Trade Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.trade_id}>
                                        <TableCell
                                            className={`font-medium ${
                                                row.trade_type === "purchase"
                                                    ? "text-emerald-600"
                                                    : "text-amber-600"
                                            }`}
                                        >
                                            {formatTradeType(row.trade_type)}
                                        </TableCell>

                                        <TableCell className="max-w-55">
                                            <div className="flex flex-col gap-1">
                                                <span className="truncate font-medium text-gray-900">
                                                    {row.member}
                                                </span>

                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    {row.state ?? "—"} | {formatParty(row.party)}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-mono">{row.company_name}</TableCell>
                                        <TableCell className="font-mono">{row.ticker}</TableCell>
                                        <TableCell className="font-mono text-center">
                                            {row.sector ?? "—"}
                                        </TableCell>

                                        <TableCell className="text-right whitespace-nowrap">
                                            {formatAmountRange(row.amount_low, row.amount_high)}
                                        </TableCell>

                                        <TableCell className="text-right whitespace-nowrap">
                                            {formatDate(row.trade_date)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}