import { validateFormula, evaluateAst } from '../lib/formula';
import type { StockRow } from '../lib/types';

interface ValidateMessage {
  type: 'VALIDATE';
  formula: string;
}

interface EvaluateMessage {
  type: 'EVALUATE';
  formula: string;
  rows: StockRow[];
}

type WorkerMessage = ValidateMessage | EvaluateMessage;

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const payload = event.data;

  if (payload.type === 'VALIDATE') {
    const result = validateFormula(payload.formula);
    self.postMessage({ type: 'VALIDATION_RESULT', result });
    return;
  }

  const parsed = validateFormula(payload.formula);
  if (!parsed.ok) {
    self.postMessage({ type: 'EVALUATION_RESULT', result: parsed });
    return;
  }

  const matches = payload.rows.filter((row) => evaluateAst(parsed.ast, row));
  self.postMessage({
    type: 'EVALUATION_RESULT',
    result: { ok: true, ast: parsed.ast, normalizedFormula: parsed.normalizedFormula, matches },
  });
};

export {};
