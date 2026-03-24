import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateFormula, evaluateAst } from '@/lib/formula';
import { sampleStocks } from '@/lib/sample-data';

const schema = z.object({
  formula: z.string().min(1),
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

  const matches = sampleStocks.filter((row) => evaluateAst(validation.ast, row));
  return NextResponse.json({ matches, count: matches.length, formula: validation.normalizedFormula });
}
