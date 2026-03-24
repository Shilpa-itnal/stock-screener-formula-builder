export type TokenType =
  | 'NUMBER'
  | 'IDENTIFIER'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'AND'
  | 'OR'
  | 'NOT';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export type ComparisonOperator = '<' | '>' | '<=' | '>=' | '=' | '!=';

export type ExprNode =
  | {
      type: 'COMPARISON';
      field: string;
      operator: ComparisonOperator;
      value: number;
    }
  | {
      type: 'LOGICAL';
      operator: 'AND' | 'OR';
      left: ExprNode;
      right: ExprNode;
    }
  | {
      type: 'NOT';
      operand: ExprNode;
    };

export interface ValidationSuccess {
  ok: true;
  ast: ExprNode;
  normalizedFormula: string;
}

export interface ValidationError {
  ok: false;
  error: string;
  position?: number;
}

export type ValidationResult = ValidationSuccess | ValidationError;

export interface StockRow {
  symbol: string;
  companyName: string;
  sector: string;
  pe: number;
  roe: number;
  roa: number;
  pb: number;
  eps: number;
  marketCap: number;
  revenueGrowth: number;
  debtToEquity: number;
}

export interface EquityPoint {
  date: string;
  portfolioValue: number;
  benchmarkValue: number;
  drawdown: number;
}

export interface BacktestMetrics {
  totalReturn: number;
  cagr: number;
  maxDrawdown: number;
  winRate: number;
  sharpe: number;
}

export interface BacktestHolding {
  rebalanceDate: string;
  symbol: string;
  weight: number;
  price: number;
}

export interface BacktestResponse {
  metrics: BacktestMetrics;
  equityCurve: EquityPoint[];
  holdings: BacktestHolding[];
}
