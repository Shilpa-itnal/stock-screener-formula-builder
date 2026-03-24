import { demoBacktest } from './sample-data';
import type { BacktestResponse, ExprNode, StockRow } from './types';
import { evaluateAst } from './formula';

export interface BacktestInput {
  ast: ExprNode;
  universe: StockRow[];
  startDate: string;
  endDate: string;
  rebalanceFrequency: 'monthly' | 'quarterly';
  benchmark: string;
}

export function runBacktest(input: BacktestInput): BacktestResponse {
  const matches = input.universe.filter((row) => evaluateAst(input.ast, row));

  if (matches.length === 0) {
    return {
      metrics: {
        totalReturn: 0,
        cagr: 0,
        maxDrawdown: 0,
        winRate: 0,
        sharpe: 0,
      },
      equityCurve: [
        { date: input.startDate, portfolioValue: 10000, benchmarkValue: 10000, drawdown: 0 },
        { date: input.endDate, portfolioValue: 10000, benchmarkValue: 10000, drawdown: 0 },
      ],
      holdings: [],
    };
  }

  return {
    ...demoBacktest,
    holdings: demoBacktest.holdings.filter((holding) => matches.some((row) => row.symbol === holding.symbol)),
  };
}
