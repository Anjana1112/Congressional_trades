# Congress Stock Trades

A Next.js dashboard for exploring stock trades disclosed by members of the U.S. Congress. It reads trade filings from a MySQL database and shows them as interactive tables and charts: top traders and stocks, late disclosures, sell-to-buy ratios, sector concentration, clustered trading, and return proxies.

**Live demo:** <https://congressional-trades-h55e.vercel.app/>

> **Disclaimer:** All analytics and risk scores are heuristics meant for transparency and research. They do **not** establish insider trading or wrongdoing.

---

## Features 

| Page | Route | What it shows |
| --- | --- | --- |
| Dashboard | `/` and `/dashboard` | Overview charts (see below) |
| Trade Filings | `/trades` | Searchable, sortable table of every trade, with a per-trade risk badge and detail modal |
| Stocks | `/stocks` | Per-ticker summary: trade count, total invested, buys/sells, number of members |
| Congress Members | `/members` | Per-member summary: chamber, party, state, trade volume, stocks traded |

**Dashboard charts** (`components/charts/`):

- Top trades and latest trades tables
- Top members and top stocks bar charts
- Late disclosure scatter plot (days between trade and filing)
- Sell-to-buy ratio scatter plot
- Sector concentration ranking
- Sector preferences by party
- Cluster trading heatmap (several members trading the same ticker within a short window)
- Z-score spike plot (unusually large trades compared with a member's own history)
- Sharpe and alpha proxy charts (based on round trips)
- Pre-event trades chart (trades shortly before a market event)

---

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- **Styling/UI:** Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) (Radix UI), lucide-react icons
- **Tables:** TanStack Table
- **Charts:** Recharts
- **Database:** MySQL via `mysql2` (connection pool)
- **External data:** Yahoo Finance search API, used to fill in missing company names

---

## Project structure

```
app/
  layout.tsx            # Root layout, navbar, DataProvider
  data-context.tsx      # Client-side context that fetches all API data once
  page.tsx              # Home -> renders the dashboard
  dashboard/            # Dashboard page
  trades/               # Trades table page + column definitions
  stocks/               # Stocks table page + column definitions
  members/              # Members table page + column definitions
  api/                  # Route handlers (see API reference)
components/
  navbar.tsx
  dataTable.tsx         # Generic TanStack data table
  charts/               # Dashboard chart components
  ai/                   # Risk badge + risk detail modal
  ui/                   # shadcn/ui primitives
lib/
  db.ts                 # MySQL connection pool (server-only)
  types.ts              # Shared TypeScript types
  utils.ts              # cn() helper
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A MySQL database loaded with the `congress_trades` schema (see [Database](#database))

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLUSER=your_user
MYSQLPASSWORD=your_password
MYSQLDATABASE=congress_trades
```

`MYSQLPORT` defaults to `3306` and `MYSQLDATABASE` defaults to `congress_trades`.

### 3. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

---

## Database

The app expects these tables and views in MySQL:

**Tables**
- `members` – congress members (`id`, `name`, `party_id`, chamber, state, …)
- `parties` – party lookup
- `stocks` – tickers, company names, sectors
- `trades` – individual trade disclosures (`member_id`, `stock_id`, `trade_type`, `amount_low/high/mid`, `trade_date`, `filed_date`, …)
- `committees` and `member_committees` – committee assignments, used for risk scoring

**Views**
- `v_trade_detail` – trades joined with member, party and stock info
- `v_member_summary` – per-member aggregates
- `v_stock_summary` – per-stock aggregates

---

## API reference

Every endpoint is a `GET` that returns JSON.

| Endpoint | Description | Query params |
| --- | --- | --- |
| `/api/trades` | All trades, newest first | – |
| `/api/stocks` | Stock summaries, ordered by total invested | – |
| `/api/members` | Member summaries | – |
| `/api/trades/late-disclosures` | Trades with long trade-to-filing delays | – |
| `/api/trades/sell-buy-ratio` | Sell-to-buy ratio per member | – |
| `/api/trades/sector-concentration` | How concentrated each member's trades are by sector | – |
| `/api/trades/sharpe` | Sharpe-style return proxy per member | – |
| `/api/trades/alpha` | Alpha proxy from round-trip trades | `min_round_trips` (default `2`) |
| `/api/trades/cluster` | Members trading the same ticker within a window | `window_days` (default `7`) |
| `/api/trades/short-window` | Buy/sell round trips within a short window | `window_days` (default `7`) |
| `/api/trades/z-score` | Trades that are unusually large for that member | `min_z` (default `2`) |
| `/api/trades/event-trades` | Trades around a given event date | `event_date` (default `2020-03-13`), `window_days` (default `30`) |
| `/api/party/sector-preferences` | Sector trading preferences by party | – |
| `/api/trades/[trade_id]/ai-risk` | Heuristic risk analysis for one trade | – |


---

## Deployment

The app is deployed on Vercel at <https://congressional-trades-h55e.vercel.app/>.
