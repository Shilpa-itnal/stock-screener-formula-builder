import type { BacktestHolding } from '@/lib/types';

export default function HoldingsTable({ holdings }: { holdings: BacktestHolding[] }) {
  return (
    <div className="card">
      <h2>Holdings by Rebalance Date</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Rebalance Date</th>
              <th>Symbol</th>
              <th>Weight</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <tr key={`${holding.rebalanceDate}-${holding.symbol}-${index}`}>
                <td>{holding.rebalanceDate}</td>
                <td>{holding.symbol}</td>
                <td>{(holding.weight * 100).toFixed(2)}%</td>
                <td>${holding.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
