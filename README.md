# Stock Screener with Custom Formula Builder

A full-stack starter project where users write Excel-like formulas such as:

```txt
PE < 20 AND ROE > 15
```

The app validates the formula in a Web Worker, screens a stock universe, and runs a starter backtest with charts and metrics.

## Features

- Dashboard with formula input, saved formulas, and quick stats
- Screener view with validation errors and stock matches table
- Backtest controls for date range, rebalance frequency, and benchmark
- Results page with equity curve, drawdown chart, metric cards, and holdings table
- PostgreSQL schema for stocks, price history, fundamentals, formulas, and backtests

## Tech Stack

- Next.js App Router
- TypeScript
- Web Workers
- Recharts
- PostgreSQL
- Financial Modeling Prep API integration helpers

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`

## Environment Variables

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/stockscreener
FMP_API_KEY=your_fmp_api_key
FMP_BASE_URL=https://financialmodelingprep.com/stable
```

## Notes

- This starter uses demo stock data and a demo backtest result so the UI works immediately.
- Replace `sample-data.ts` with point-in-time fundamentals and historical adjusted prices from your own ETL pipeline.
- Persist formulas and backtests with PostgreSQL by wiring the route handlers to `lib/db.ts`.

## Production Extensions

- Add authentication
- Add ranking formulas like `TOP 20 BY ROE`
- Add benchmark comparison stats
- Add transaction costs and slippage in the backtest engine
- Add scheduled FMP sync jobs
