import type { StockRow } from '@/lib/types';

export default function ScreeningTable({ rows }: { rows: StockRow[] }) {
  return (
    <div className="card">
      <h2>Screened Stocks</h2>
      <div className="small" style={{ marginBottom: 10 }}>
        {rows.length} matches
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Sector</th>
              <th>PE</th>
              <th>ROE</th>
              <th>PB</th>
              <th>Revenue Growth</th>
              <th>Debt/Equity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.symbol}>
                <td>{row.symbol}</td>
                <td>{row.companyName}</td>
                <td>{row.sector}</td>
                <td>{row.pe}</td>
                <td>{row.roe}</td>
                <td>{row.pb}</td>
                <td>{row.revenueGrowth}%</td>
                <td>{row.debtToEquity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
