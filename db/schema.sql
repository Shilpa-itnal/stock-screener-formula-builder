CREATE TABLE IF NOT EXISTS stocks (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  exchange_name TEXT,
  sector TEXT,
  industry TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_history (
  id BIGSERIAL PRIMARY KEY,
  stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  trade_date DATE NOT NULL,
  open NUMERIC(18,4),
  high NUMERIC(18,4),
  low NUMERIC(18,4),
  close NUMERIC(18,4),
  adjusted_close NUMERIC(18,4),
  volume BIGINT,
  UNIQUE(stock_id, trade_date)
);

CREATE TABLE IF NOT EXISTS fundamental_snapshots (
  id BIGSERIAL PRIMARY KEY,
  stock_id BIGINT NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  pe NUMERIC(18,4),
  pb NUMERIC(18,4),
  roe NUMERIC(18,4),
  roa NUMERIC(18,4),
  eps NUMERIC(18,4),
  market_cap NUMERIC(22,2),
  revenue_growth NUMERIC(18,4),
  debt_to_equity NUMERIC(18,4),
  raw_json JSONB,
  UNIQUE(stock_id, snapshot_date)
);

CREATE TABLE IF NOT EXISTS saved_formulas (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  formula_text TEXT NOT NULL,
  ast_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backtest_runs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  formula_id BIGINT REFERENCES saved_formulas(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rebalance_frequency TEXT NOT NULL,
  benchmark_symbol TEXT NOT NULL,
  total_return NUMERIC(18,4),
  cagr NUMERIC(18,4),
  max_drawdown NUMERIC(18,4),
  sharpe NUMERIC(18,4),
  win_rate NUMERIC(18,4),
  result_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backtest_holdings (
  id BIGSERIAL PRIMARY KEY,
  backtest_run_id BIGINT NOT NULL REFERENCES backtest_runs(id) ON DELETE CASCADE,
  rebalance_date DATE NOT NULL,
  stock_id BIGINT REFERENCES stocks(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  weight NUMERIC(12,6) NOT NULL,
  price NUMERIC(18,4)
);

CREATE INDEX IF NOT EXISTS idx_price_history_stock_date ON price_history(stock_id, trade_date);
CREATE INDEX IF NOT EXISTS idx_fundamentals_stock_date ON fundamental_snapshots(stock_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_saved_formulas_user ON saved_formulas(user_id);
CREATE INDEX IF NOT EXISTS idx_backtest_runs_user ON backtest_runs(user_id, created_at DESC);
