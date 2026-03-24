import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateFormula } from '@/lib/formula';
import { sampleStocks } from '@/lib/sample-data';
import { runBacktest } from '@/lib/backtest';

const schema = z.object({
  formula: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  rebalanceFrequency: z.enum(['monthly', 'quarterly']),
  benchmark: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const validation = validateFormula(parsed.data.formula);
  if (!validation.ok) {
    return NextResponse.json(validation, { status: 400 });
  }

  const result = runBacktest({
    ast: validation.ast,
    universe: sampleStocks,
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate,
    rebalanceFrequency: parsed.data.rebalanceFrequency,
    benchmark: parsed.data.benchmark,
  });

  return NextResponse.json(result);
}
