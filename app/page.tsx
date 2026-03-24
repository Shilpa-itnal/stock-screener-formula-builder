'use client';

import { useMemo, useState } from 'react';
import FormulaEditor from '@/components/FormulaEditor';
import ScreeningTable from '@/components/ScreeningTable';
import BacktestControls, { type BacktestFormState } from '@/components/BacktestControls';
import MetricCard from '@/components/MetricCard';
import PerformanceCharts from '@/components/PerformanceCharts';
import HoldingsTable from '@/components/HoldingsTable';
import { sampleStocks, demoBacktest } from '@/lib/sample-data';
import { evaluateAst } from '@/lib/formula';
import type { BacktestResponse, ValidationResult } from '@/lib/types';

const initialBacktestForm: BacktestFormState = {
  startDate: '2021-01-01',
  endDate: '2025-01-01',
  rebalanceFrequency: 'quarterly',
  benchmark: 'SPY',
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'screener' | 'backtest' | 'results'>('dashboard');
  const [formula, setFormula] = useState('PE < 20 AND ROE > 15');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [savedFormulas, setSavedFormulas] = useState<string[]>(['PE < 20 AND ROE > 15', 'MarketCap > 1000000000 AND DebtToEquity < 0.5']);
  const [backtestForm, setBacktestForm] = useState<BacktestFormState>(initialBacktestForm);
  const [backtestResult, setBacktestResult] = useState<BacktestResponse>(demoBacktest);

  const screenedRows = useMemo(() => {
    if (!validation?.ok) return [];
    return sampleStocks.filter((row) => evaluateAst(validation.ast, row));
  }, [validation]);

  const handleSaveFormula = async () => {
    if (!formula.trim()) return;
    setSavedFormulas((current) => Array.from(new Set([formula, ...current])));
  };

  const handleRunBacktest = async () => {
    if (!validation?.ok) return;

    const response = await fetch('/api/backtest/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formula,
        startDate: backtestForm.startDate,
        endDate: backtestForm.endDate,
        rebalanceFrequency: backtestForm.rebalanceFrequency,
        benchmark: backtestForm.benchmark,
      }),
    });

    const data = (await response.json()) as BacktestResponse;
    setBacktestResult(data);
    setActiveTab('results');
  };

  return (
    <main className="container">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div className="badge">Stock Screener with Custom Formula Builder</div>
          <h1 style={{ marginBottom: 8 }}>Screen, validate, and backtest custom stock formulas</h1>
          <div className="small">Stack: Next.js, Web Workers, PostgreSQL, Recharts, Financial Modeling Prep API</div>
        </div>
        <button className="btn" onClick={handleSaveFormula}>Save Formula</button>
      </div>

      <div className="tabs">
        {['dashboard', 'screener', 'backtest', 'results'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' ? (
        <div className="grid" style={{ gap: 20 }}>
          <div className="grid grid-2">
            <FormulaEditor formula={formula} onChange={setFormula} onValidation={setValidation} />
            <div className="card">
              <h2>Saved Formulas</h2>
              <div className="grid" style={{ gap: 12 }}>
                {savedFormulas.map((saved) => (
                  <button key={saved} className="btn secondary" onClick={() => setFormula(saved)}>
                    {saved}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-3">
            <MetricCard label="Universe Size" value={String(sampleStocks.length)} hint="Demo universe in this starter project" />
            <MetricCard label="Current Matches" value={String(screenedRows.length)} hint="Based on validated formula" />
            <MetricCard label="Saved Formulas" value={String(savedFormulas.length)} hint="You can wire this to PostgreSQL" />
          </div>
        </div>
      ) : null}

      {activeTab === 'screener' ? (
        <div className="grid" style={{ gap: 20 }}>
          <FormulaEditor formula={formula} onChange={setFormula} onValidation={setValidation} />
          <ScreeningTable rows={screenedRows} />
        </div>
      ) : null}

      {activeTab === 'backtest' ? (
        <div className="grid" style={{ gap: 20 }}>
          <FormulaEditor formula={formula} onChange={setFormula} onValidation={setValidation} />
          <BacktestControls state={backtestForm} onChange={setBacktestForm} onRun={handleRunBacktest} />
        </div>
      ) : null}

      {activeTab === 'results' ? (
        <div className="grid" style={{ gap: 20 }}>
          <div className="grid grid-3">
            <MetricCard label="Total Return" value={`${backtestResult.metrics.totalReturn.toFixed(1)}%`} />
            <MetricCard label="CAGR" value={`${backtestResult.metrics.cagr.toFixed(1)}%`} />
            <MetricCard label="Max Drawdown" value={`${backtestResult.metrics.maxDrawdown.toFixed(1)}%`} />
            <MetricCard label="Win Rate" value={`${backtestResult.metrics.winRate.toFixed(1)}%`} />
            <MetricCard label="Sharpe" value={backtestResult.metrics.sharpe.toFixed(2)} />
          </div>
          <PerformanceCharts points={backtestResult.equityCurve} />
          <HoldingsTable holdings={backtestResult.holdings} />
        </div>
      ) : null}
    </main>
  );
}
