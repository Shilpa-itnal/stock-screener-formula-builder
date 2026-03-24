import type { BacktestResponse, StockRow } from './types';

export const sampleStocks: StockRow[] = [
  { symbol: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', pe: 28.4, roe: 152.4, roa: 29.5, pb: 43.2, eps: 6.42, marketCap: 3200000000000, revenueGrowth: 4.3, debtToEquity: 1.75 },
  { symbol: 'MSFT', companyName: 'Microsoft Corp.', sector: 'Technology', pe: 33.8, roe: 36.7, roa: 18.4, pb: 11.9, eps: 11.8, marketCap: 3000000000000, revenueGrowth: 12.5, debtToEquity: 0.32 },
  { symbol: 'GOOGL', companyName: 'Alphabet Inc.', sector: 'Communication Services', pe: 24.7, roe: 28.2, roa: 16.6, pb: 6.1, eps: 7.12, marketCap: 2100000000000, revenueGrowth: 10.2, debtToEquity: 0.11 },
  { symbol: 'META', companyName: 'Meta Platforms', sector: 'Communication Services', pe: 22.6, roe: 34.9, roa: 21.7, pb: 8.7, eps: 18.01, marketCap: 1300000000000, revenueGrowth: 18.1, debtToEquity: 0.27 },
  { symbol: 'JPM', companyName: 'JPMorgan Chase', sector: 'Financials', pe: 13.1, roe: 17.3, roa: 1.4, pb: 1.9, eps: 18.22, marketCap: 580000000000, revenueGrowth: 7.9, debtToEquity: 1.29 },
  { symbol: 'XOM', companyName: 'Exxon Mobil', sector: 'Energy', pe: 11.8, roe: 18.2, roa: 10.6, pb: 2.0, eps: 9.23, marketCap: 510000000000, revenueGrowth: 3.6, debtToEquity: 0.18 },
  { symbol: 'NVDA', companyName: 'NVIDIA Corp.', sector: 'Technology', pe: 47.1, roe: 64.1, roa: 42.8, pb: 39.4, eps: 12.1, marketCap: 2900000000000, revenueGrowth: 126.1, debtToEquity: 0.19 },
  { symbol: 'ADBE', companyName: 'Adobe Inc.', sector: 'Technology', pe: 26.9, roe: 44.5, roa: 18.2, pb: 12.4, eps: 14.32, marketCap: 240000000000, revenueGrowth: 11.2, debtToEquity: 0.29 },
  { symbol: 'KO', companyName: 'Coca-Cola Co.', sector: 'Consumer Staples', pe: 22.3, roe: 39.4, roa: 10.5, pb: 9.9, eps: 2.72, marketCap: 300000000000, revenueGrowth: 5.1, debtToEquity: 1.54 },
  { symbol: 'UNH', companyName: 'UnitedHealth Group', sector: 'Healthcare', pe: 18.8, roe: 25.7, roa: 8.3, pb: 4.6, eps: 25.75, marketCap: 470000000000, revenueGrowth: 8.6, debtToEquity: 0.67 },
];

export const demoBacktest: BacktestResponse = {
  metrics: {
    totalReturn: 74.2,
    cagr: 15.1,
    maxDrawdown: -18.6,
    winRate: 63.4,
    sharpe: 1.12,
  },
  equityCurve: [
    { date: '2021-01-01', portfolioValue: 10000, benchmarkValue: 10000, drawdown: 0 },
    { date: '2021-07-01', portfolioValue: 10980, benchmarkValue: 10530, drawdown: 0 },
    { date: '2022-01-01', portfolioValue: 11750, benchmarkValue: 11120, drawdown: -2.1 },
    { date: '2022-07-01', portfolioValue: 11190, benchmarkValue: 10280, drawdown: -7.5 },
    { date: '2023-01-01', portfolioValue: 12880, benchmarkValue: 11450, drawdown: -1.3 },
    { date: '2023-07-01', portfolioValue: 14220, benchmarkValue: 12210, drawdown: 0 },
    { date: '2024-01-01', portfolioValue: 15360, benchmarkValue: 13140, drawdown: -3.9 },
    { date: '2024-07-01', portfolioValue: 16310, benchmarkValue: 13980, drawdown: -2.2 },
    { date: '2025-01-01', portfolioValue: 17420, benchmarkValue: 14920, drawdown: 0 },
  ],
  holdings: [
    { rebalanceDate: '2024-01-01', symbol: 'JPM', weight: 0.25, price: 160.22 },
    { rebalanceDate: '2024-01-01', symbol: 'XOM', weight: 0.25, price: 104.41 },
    { rebalanceDate: '2024-01-01', symbol: 'UNH', weight: 0.25, price: 522.73 },
    { rebalanceDate: '2024-01-01', symbol: 'META', weight: 0.25, price: 355.12 },
    { rebalanceDate: '2024-07-01', symbol: 'JPM', weight: 0.25, price: 201.15 },
    { rebalanceDate: '2024-07-01', symbol: 'XOM', weight: 0.25, price: 113.82 },
    { rebalanceDate: '2024-07-01', symbol: 'UNH', weight: 0.25, price: 487.66 },
    { rebalanceDate: '2024-07-01', symbol: 'ADBE', weight: 0.25, price: 542.3 },
  ],
};
