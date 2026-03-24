'use client';

export interface BacktestFormState {
  startDate: string;
  endDate: string;
  rebalanceFrequency: 'monthly' | 'quarterly';
  benchmark: string;
}

export default function BacktestControls({
  state,
  onChange,
  onRun,
}: {
  state: BacktestFormState;
  onChange: (next: BacktestFormState) => void;
  onRun: () => void;
}) {
  return (
    <div className="card">
      <h2>Backtest</h2>
      <div className="grid grid-2">
        <label>
          <div className="small">Start Date</div>
          <input
            className="input"
            type="date"
            value={state.startDate}
            onChange={(e) => onChange({ ...state, startDate: e.target.value })}
          />
        </label>
        <label>
          <div className="small">End Date</div>
          <input
            className="input"
            type="date"
            value={state.endDate}
            onChange={(e) => onChange({ ...state, endDate: e.target.value })}
          />
        </label>
        <label>
          <div className="small">Rebalance Frequency</div>
          <select
            className="select"
            value={state.rebalanceFrequency}
            onChange={(e) => onChange({ ...state, rebalanceFrequency: e.target.value as BacktestFormState['rebalanceFrequency'] })}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </label>
        <label>
          <div className="small">Benchmark</div>
          <select
            className="select"
            value={state.benchmark}
            onChange={(e) => onChange({ ...state, benchmark: e.target.value })}
          >
            <option value="SPY">SPY</option>
            <option value="QQQ">QQQ</option>
            <option value="IWM">IWM</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn" onClick={onRun}>Run Backtest</button>
      </div>
    </div>
  );
}
