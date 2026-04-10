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
export function getAnomalyColor(score: number) {
    if (score >= 10) return "#dc2626"
    if (score >= 6) return "#f97316"   
    if (score >= 3) return "#eab308"   
    return "#3b82f6"                  
}
export function getRatioColor(ratio: number) {
    if (ratio >= 3) return "#dc2626" // strong seller
    if (ratio >= 1.5) return "#f59e0b" // moderately seller-heavy
    if (ratio >= 0.75) return "#6366f1" // roughly balanced
    return "#2563eb" // buyer-heavy
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

export function getHeatColor(count: number, maxCount: number) {
    if (count === 0 || maxCount === 0) return "rgb(249 250 251)"

    const intensity = count / maxCount

    if (intensity >= 0.85) return "rgb(30 64 175)"
    if (intensity >= 0.65) return "rgb(59 130 246)"
    if (intensity >= 0.45) return "rgb(96 165 250)"
    if (intensity >= 0.25) return "rgb(147 197 253)"
    return "rgb(219 234 254)"
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