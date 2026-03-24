export const SUPPORTED_FIELDS: Record<string, keyof import('./types').StockRow> = {
  PE: 'pe',
  ROE: 'roe',
  ROA: 'roa',
  PB: 'pb',
  EPS: 'eps',
  MARKETCAP: 'marketCap',
  REVENUEGROWTH: 'revenueGrowth',
  DEBTTOEQUITY: 'debtToEquity',
};
