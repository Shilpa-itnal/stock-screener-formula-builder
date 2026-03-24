'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import type { EquityPoint } from '@/lib/types';

export default function PerformanceCharts({ points }: { points: EquityPoint[] }) {
  return (
    <div className="grid grid-2">
      <div className="card" style={{ height: 360 }}>
        <h2>Equity Curve</h2>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="portfolioValue" name="Portfolio" strokeWidth={2} />
            <Line type="monotone" dataKey="benchmarkValue" name="Benchmark" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card" style={{ height: 360 }}>
        <h2>Drawdown</h2>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="drawdown" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
