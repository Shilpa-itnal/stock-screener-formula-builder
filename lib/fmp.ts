const BASE_URL = process.env.FMP_BASE_URL || 'https://financialmodelingprep.com/stable';
const API_KEY = process.env.FMP_API_KEY;

async function fmpFetch<T>(path: string): Promise<T> {
  if (!API_KEY) {
    throw new Error('Missing FMP_API_KEY');
  }

  const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}apikey=${API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } });

  if (!res.ok) {
    throw new Error(`FMP request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getHistoricalPrices(symbol: string) {
  return fmpFetch(`/historical-price-eod/full?symbol=${symbol}`);
}

export async function getRatiosTTM(symbol: string) {
  return fmpFetch(`/ratios-ttm?symbol=${symbol}`);
}
