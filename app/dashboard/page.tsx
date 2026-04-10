"use client"

import dynamic from "next/dynamic"
import { LateDisclosureScatterPlot } from "@/components/charts/late-disclosure-chart"
import { PreEventTradeChart } from "@/components/charts/pre-event-chart"
import { TopStocksBarChart } from "@/components/charts/top-stocks-chart"
import { TopTradesTable } from "@/components/charts/top-trade-table"
import { SharpeProxyChart } from "@/components/charts/sharpe-chart"
import { LatestTradesTable } from "@/components/charts/recent-trades"
import { SectorConcentrationRanking } from "@/components/charts/sector-concentration"
import { SellToBuyScatterPlot } from "@/components/charts/sell-to-buy-chart"
import { ClusterTradingHeatmap } from "@/components/charts/cluster-chart"
import { ZScoreSpikePlot } from "@/components/charts/z-chart"

const TopMembersBarChart = dynamic(
  () =>
    import("@/components/charts/top-members-chart").then(
      (m) => m.TopMembersBarChart
    ),
  { ssr: false }
)

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <main className="space-y-8 px-6 py-4">
        {/* Row 1 */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <TopTradesTable />
          </div>

          <div className="xl:col-span-7 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TopMembersBarChart />
              <TopStocksBarChart />
            </div>

            <LatestTradesTable />
          </div>
        </section>

        {/* Insider indicators */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Potential Insider Trading Indicators
            </h2>
            <p className="text-sm text-muted-foreground">
              Signals and anomaly-focused views based on trading behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
            <div className="space-y-6">
              <ClusterTradingHeatmap />
              <SharpeProxyChart />
            </div>

            <div className="space-y-6">
              <SectorConcentrationRanking />
              <LateDisclosureScatterPlot />
            </div>

            <div className="space-y-6">
              <SellToBuyScatterPlot />
              <ZScoreSpikePlot />
              <PreEventTradeChart />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}