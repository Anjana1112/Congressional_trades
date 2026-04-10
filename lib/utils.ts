import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Trade } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function formatMoney(value: number | null | undefined) {
    if (value == null) return "—"
    return "$" + Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
export function formatDate(value: string | null | undefined) {
    if (value == null) return "—"
    const d = new Date(value)
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
}
export function getDelayColor(days: number) {
    if (days >= 365) return "#dc2626"   // deep red (extreme)
    if (days >= 180) return "#f97316"   // orange (very late)
    if (days >= 90) return "#eab308"    // yellow (late)
    return "#3b82f6"                    // blue (mildly late)
}

export function formatAxisValue(logValue: number) {
    const actualValue = 10 ** logValue

    if (actualValue >= 1_000_000_000) {
      return `${(actualValue / 1_000_000_000).toFixed(actualValue >= 10_000_000_000 ? 0 : 1)}B`
    }

    if (actualValue >= 1_000_000) {
      return `${(actualValue / 1_000_000).toFixed(actualValue >= 10_000_000 ? 0 : 1)}M`
    }

    if (actualValue >= 1_000) {
      return `${(actualValue / 1_000).toFixed(actualValue >= 10_000 ? 0 : 1)}K`
    }

    return Math.round(actualValue).toString()
}


export function isSameDirection(type_1: string, type_2: string) {
    const t1 = type_1.toLowerCase().trim()
    const t2 = type_2.toLowerCase().trim()

    const isBuy = (t: string) => t === "purchase"
    const isSell = (t: string) => t === "sale" || t === "sale_partial"

    return (isBuy(t1) && isBuy(t2)) || (isSell(t1) && isSell(t2))
}

export function getHeatColor(count: number, max: number) {
  if (count === 0) return "rgba(34, 197, 94, 0.08)" // very light green

  const intensity = count / max

  return `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`
}
export function getTextColor(count: number, maxCount: number) {
    if (maxCount === 0) return "#111827"
    return count / maxCount >= 0.65 ? "white" : "#111827"
}

export function formatTradeType(type: Trade["trade_type"]) {
    if (type === "purchase") return "BUY"
    if (type === "sale" || type === "sale_partial") return "SELL"
    return type
}

export function formatAmountRange(low: number | null, high: number | null) {
    if (low && high) return `$${low.toLocaleString()}–${high.toLocaleString()}`
    if (low) return `$${low.toLocaleString()}`
    if (high) return `$${high.toLocaleString()}`
    return "—"
}