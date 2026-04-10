"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatAmountRange, formatTradeType } from "@/lib/utils"
import { useData } from "@/app/data-context"
import { Trade } from "@/lib/types"

export function TopTradesTable() {
    const { trades } = useData()
    const data = [...trades]
      .sort((a: Trade, b: Trade) => Number(b.amount_mid) - Number(a.amount_mid))
      .slice(0, 15)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Largest Disclosed Trades</CardTitle>
          <CardDescription>
            Highest individual trades reported by congress members (estimated)
          </CardDescription>
        </CardHeader>

        <CardContent>
          {trades.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4">Loading...</p>
          ) : (
            <div className="overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Amount Range</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>

                      <TableCell
                        className={`font-medium ${
                          row.trade_type === "purchase"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {formatTradeType(row.trade_type)}
                      </TableCell>

                      <TableCell className="font-medium">
                        {row.member}
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                {row.state} | {row.party}
                        </div>
                      </TableCell>

                      <TableCell className="font-mono">
                        {row.ticker}
                      </TableCell>

                      <TableCell>{row.sector ?? "—"}</TableCell>

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