import { NextResponse } from 'next/server';
import { z } from 'zod';
import { validateFormula } from '@/lib/formula';

const schema = z.object({
  formula: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = validateFormula(parsed.data.formula);
  return NextResponse.json(result);
}
