// "use client"

// import { useMemo, useState } from "react"
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   ReferenceLine,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { useData } from "@/app/data-context"

// type SectorBarPoint = {
//   member: string
//   avg_return_pct: number
//   round_trips: number
// }

// function formatPct(value: number) {
//   return `${value.toFixed(1)}%`
// }

// function shortenName(name: string) {
//   const parts = name.trim().split(/\s+/)
//   return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : name
// }

// export function AlphaSectorChart() {
//   const { alphaProxies } = useData()
//   const [selectedSector, setSelectedSector] = useState("")

//   const sectorMap = useMemo(() => {
//     const memberSectorAgg = new Map<
//       string,
//       { weightedReturn: number; totalTrips: number }
//     >()

//     for (const row of alphaProxies) {
//       const sector = row.sector ?? "Unknown"
//       const member = row.member
//       const avgReturn = Number(row.avg_return_pct)
//       const trips = Number(row.round_trips)

//       if (!Number.isFinite(avgReturn) || !Number.isFinite(trips) || trips < 2) {
//         continue
//       }

//       if (avgReturn > 500 || avgReturn < -100) {
//         continue
//       }

//       const key = `${sector}__${member}`
//       const existing = memberSectorAgg.get(key) ?? {
//         weightedReturn: 0,
//         totalTrips: 0,
//       }

//       existing.weightedReturn += avgReturn * trips
//       existing.totalTrips += trips

//       memberSectorAgg.set(key, existing)
//     }

//     const map = new Map<string, SectorBarPoint[]>()

//     for (const [key, agg] of memberSectorAgg.entries()) {
//       const splitIndex = key.indexOf("__")
//       const sector = key.slice(0, splitIndex)
//       const member = key.slice(splitIndex + 2)

//       const point: SectorBarPoint = {
//         member,
//         avg_return_pct: agg.weightedReturn / agg.totalTrips,
//         round_trips: agg.totalTrips,
//       }

//       if (Math.abs(point.avg_return_pct) < 0.1) {
//         continue
//       }

//       const current = map.get(sector) ?? []
//       current.push(point)
//       map.set(sector, current)
//     }

//     for (const [sector, points] of map.entries()) {
//       map.set(
//         sector,
//         [...points]
//           .sort((a, b) => a.avg_return_pct - b.avg_return_pct)
//           .slice(0, 10)
//       )
//     }

//     return map
//   }, [alphaProxies])

//   const sectors = useMemo(() => {
//     return [...sectorMap.keys()].sort()
//   }, [sectorMap])

//   const activeSector = selectedSector || sectors[0] || ""

//   const chartData = useMemo(() => {
//     return [...(sectorMap.get(activeSector) ?? [])].sort(
//       (a, b) => a.avg_return_pct - b.avg_return_pct
//     )
//   }, [sectorMap, activeSector])

//   const xDomain = useMemo<[number, number]>(() => {
//     if (!chartData.length) return [-100, 150]

//     const values = chartData.map((d) => d.avg_return_pct)
//     const minValue = Math.min(...values, -10)
//     const maxValue = Math.max(...values, 10)

//     return [
//       Math.max(-100, Math.floor(minValue / 10) * 10),
//       Math.min(150, Math.ceil(maxValue / 10) * 10),
//     ]
//   }, [chartData])

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Alpha by Sector</CardTitle>
//         <CardDescription>
//           Weighted average return % by member within a selected sector
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <div className="mb-4 flex items-center gap-3">
//           <label htmlFor="sector-select" className="text-sm font-medium">
//             Sector
//           </label>
//           <select
//             id="sector-select"
//             value={activeSector}
//             onChange={(e) => setSelectedSector(e.target.value)}
//             className="rounded-md border bg-background px-3 py-2 text-sm"
//           >
//             {sectors.map((sector) => (
//               <option key={sector} value={sector}>
//                 {sector}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="h-[420px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={chartData}
//               layout="vertical"
//               margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
//             >
//               <CartesianGrid horizontal={false} />
//               <ReferenceLine
//                 x={0}
//                 stroke="var(--muted-foreground)"
//                 strokeDasharray="4 4"
//               />
//               <XAxis
//                 type="number"
//                 domain={xDomain}
//                 tickFormatter={(value: number) => `${value}%`}
//               />
//               <YAxis
//                 type="category"
//                 dataKey="member"
//                 width={140}
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={10}
//                 tickFormatter={shortenName}
//               />
//               <Tooltip
//                 cursor={{ fill: "transparent" }}
//                 content={({ active, payload }) => {
//                   if (!active || !payload?.length) return null
//                   const point = payload[0]?.payload as SectorBarPoint

//                   return (
//                     <div className="rounded-lg border bg-background p-3 text-sm shadow">
//                       <div className="font-medium">{point.member}</div>
//                       <div className="mt-1">
//                         Avg Return: {formatPct(point.avg_return_pct)}
//                       </div>
//                       <div className="text-muted-foreground">
//                         Round Trips: {point.round_trips}
//                       </div>
//                     </div>
//                   )
//                 }}
//               />
//               <Bar dataKey="avg_return_pct" radius={6}>
//                 {chartData.map((entry) => (
//                   <Cell
//                     key={`${activeSector}-${entry.member}`}
//                     fill={entry.avg_return_pct >= 0 ? "#10b981" : "#ef4444"}
//                   />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }