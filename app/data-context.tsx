"use client"

import { AlphaProxy, LateDisclosure, Member, SectorConcentration, SellBuyRatio, SharpeProxy, Stock, Trade, Cluster, ZScore, PreEventTrade, SectorPreference } from "@/lib/types"
import { createContext, useContext, useEffect, useState } from "react"

interface DataContextType {
    members: Member[]
    stocks: Stock[]
    trades: Trade[]
    lateDisclosures: LateDisclosure[]
    sellBuyRatios: SellBuyRatio[]
    sectorConcentration: SectorConcentration[]
    sharpeProxies: SharpeProxy[]
    preEventTrades: PreEventTrade[]
    zScores: ZScore[]   
    alphaProxies: AlphaProxy[]
    cluster: Cluster[]
    sectorPreferences: SectorPreference[]
}

const DataContext = createContext<DataContextType>({
    members: [],
    stocks: [],
    trades: [],
    lateDisclosures: [],
    sellBuyRatios: [],
    sectorConcentration: [],
    sharpeProxies: [],
    zScores: [],
    alphaProxies: [],
    cluster: [],
    preEventTrades: [],
    sectorPreferences: [],
})
export function DataProvider({ children }: { children: React.ReactNode }) {
    const [members, setMembers] = useState<Member[]>([])
    const [stocks, setStocks] = useState<Stock[]>([])
    const [trades, setTrades] = useState<Trade[]>([])
    const [lateDisclosures, setLateDisclosures] = useState<LateDisclosure[]>([])
    const [sellBuyRatios, setSellBuyRatios] = useState<SellBuyRatio[]>([])
    const [sectorConcentration, setSectorConcentration] = useState<SectorConcentration[]>([])
    const [sharpeProxies, setSharpeProxies] = useState<SharpeProxy[]>([])
    const [alphaProxies, setAlphaProxies] = useState<AlphaProxy[]>([])
    const [cluster, setCluster] = useState<Cluster[]>([])
    const [zScores, setZScores] = useState<ZScore[]>([])
    const [preEventTrades, setPreEventTrades] = useState<PreEventTrade[]>([])
    const [sectorPreferences, setSectorPreferences] = useState<SectorPreference[]>([])

    useEffect(() => {
        fetch("/api/members").then(r => r.json()).then(d => setMembers(Array.isArray(d) ? d : []))
        fetch("/api/stocks").then(r => r.json()).then(d => setStocks(Array.isArray(d) ? d : []))
        fetch("/api/trades").then(r => r.json()).then(d => setTrades(Array.isArray(d) ? d : []))
        fetch("/api/trades/late-disclosures").then(r => r.json()).then(d => setLateDisclosures(Array.isArray(d) ? d : []))
        fetch("/api/trades/sell-buy-ratio").then(r => r.json()).then(d => setSellBuyRatios(Array.isArray(d) ? d : []))
        fetch("/api/trades/sector-concentration").then(r => r.json()).then(d => setSectorConcentration(Array.isArray(d) ? d : []))
        fetch("/api/trades/sharpe").then(r => r.json()).then(d => setSharpeProxies(Array.isArray(d) ? d : []))
        fetch("/api/trades/alpha").then(r => r.json()).then(d => setAlphaProxies(Array.isArray(d) ? d : []))
        fetch("/api/trades/cluster").then(r => r.json()).then(d => setCluster(Array.isArray(d) ? d : []))
        fetch("/api/trades/z-score").then(r => r.json()).then(d => setZScores(Array.isArray(d) ? d : []))
        fetch("/api/trades/pre-event").then(r => r.json()).then(d => setPreEventTrades(Array.isArray(d) ? d : []))
        fetch("/api/party/sector-preferences").then(r => r.json()).then(d => setSectorPreferences(Array.isArray(d) ? d : []))
    }, [])

    return (
        <DataContext.Provider value={{
            members, stocks, trades, lateDisclosures, sellBuyRatios, sectorConcentration, 
            sharpeProxies, alphaProxies, cluster, zScores, preEventTrades, 
            sectorPreferences
        }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)