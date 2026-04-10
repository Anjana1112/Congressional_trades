export type Member = {
    id: number
    full_name: string
    chamber: "house" | "senate"
    state: string | null
    trade_count: number
    total_invested: number | null
    total_buys: number | null
    total_sells: number | null
    stocks_traded: number
    party: string | null
}
export type Stock = {
    ticker: string
    company_name: string | null
    sector: string | null
    trade_count: number
    total_invested: number | null
    total_buys: number | null
    total_sells: number | null
    member_count: number
}
export type Trade = {
        trade_id: number
        member: string
        chamber: "house" | "senate"
        party: string | null
        state: string | null
        ticker: string
        company_name: string | null
        sector: string | null
        trade_type: "purchase" | "sale" | "sale_partial"
        amount_low: number | null
        amount_high: number | null
        amount_mid: number | null
        trade_date: string
        filed_date: string
        year: number
}
export interface LateDisclosure {
    member: string
    party: string | null
    chamber: string
    ticker: string
    sector: string | null
    trade_type: string
    trade_date: string
    filed_date: string
    days_to_disclose: number
}
 
export interface SellBuyRatio {
    full_name: string
    party: string | null
    chamber: string
    state: string
    trade_count: number
    total_buys: number
    total_sells: number
    sell_to_buy_ratio: number
}
 
export interface SectorConcentration {
    member: string
    state: string
    party: string | null
    sector: string
    sector_trades: number
    sector_value: number
    pct_of_portfolio: number
}
 
export interface SharpeProxy {
    member: string
    chamber: string
    state: string
    party: string | null
    avg_trade_size: number
    trade_volatility: number
    total_buys: number
    total_sells: number
    net_profit_proxy: number
    sharpe_proxy: number
}
 
export interface AlphaProxy {
    member: string
    chamber: string
    ticker: string
    sector: string | null
    round_trips: number
    avg_buy_value: number
    avg_sell_value: number
    avg_gain_per_trip: number
    avg_return_pct: number
}

export interface ZScore{
    member: string
    chamber: string
    party: string | null
    ticker: string
    trade_type: string
    trade_date: string
    amount_mid: number
    avg_trade: number
    z_score: number
}
 
export interface Cluster {
    member_1: string
    party_1: string | null
    member_2: string
    party_2: string | null
    type_1: string
    type_2: string
    ticker: string
    sector: string | null
    date_1: string
    date_2: string
    days_apart: number
}

export interface PreEventTrade {
    member: string
    chamber: string
    state: string
    ticker: string
    company_name: string | null
    sector: string | null
    trade_type: string
    trade_date: string
    filed_date: string
    days_before_event: number
    estimated_value: number
}
export interface SectorPreference {
    party: string
    committee: string | null
    sector: string
    trade_count: number
    total_invested: number | null
    members_trading_sector: number
}