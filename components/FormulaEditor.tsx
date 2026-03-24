'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ValidationResult } from '@/lib/types';

const examples = [
  'PE < 20 AND ROE > 15',
  'MarketCap > 1000000000 AND DebtToEquity < 0.5',
  '(PE < 25 AND RevenueGrowth > 10) OR ROE > 20',
];

export default function FormulaEditor({
  formula,
  onChange,
  onValidation,
}: {
  formula: string;
  onChange: (value: string) => void;
  onValidation: (result: ValidationResult | null) => void;
}) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    const currentWorker = new Worker(new URL('../workers/formulaWorker.ts', import.meta.url));
    currentWorker.onmessage = (event) => {
      if (event.data.type === 'VALIDATION_RESULT') {
        setResult(event.data.result as ValidationResult);
        onValidation(event.data.result as ValidationResult);
      }
    };
    setWorker(currentWorker);
    return () => currentWorker.terminate();
  }, [onValidation]);

  useEffect(() => {
    if (!worker || !formula.trim()) {
      setResult(null);
      onValidation(null);
      return;
    }

    const timeout = window.setTimeout(() => {
      worker.postMessage({ type: 'VALIDATE', formula });
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [formula, worker, onValidation]);

  const helper = useMemo(() => 'Supported fields: PE, PB, ROE, ROA, EPS, MarketCap, RevenueGrowth, DebtToEquity', []);

  return (
    <div className="card">
      <h2>Formula Builder</h2>
      <textarea
        className="textarea"
        placeholder="PE < 20 AND ROE > 15"
        value={formula}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="row" style={{ marginTop: 12 }}>
        {examples.map((item) => (
          <button key={item} className="btn secondary" onClick={() => onChange(item)}>
            Use example
          </button>
        ))}
      </div>
      <p className="small">{helper}</p>
      {result?.ok ? (
        <p className="success">Valid formula: {result.normalizedFormula}</p>
      ) : result ? (
        <p className="error">{result.error}</p>
      ) : (
        <p className="small">Start typing to validate the formula in a Web Worker.</p>
      )}
    </div>
  );
}
