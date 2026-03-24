import { NextResponse } from 'next/server';
import { z } from 'zod';

const inMemoryStore: { id: number; name: string; formulaText: string }[] = [
  { id: 1, name: 'Value + Quality', formulaText: 'PE < 20 AND ROE > 15' },
];

const schema = z.object({
  name: z.string().min(1),
  formulaText: z.string().min(1),
});

export async function GET() {
  return NextResponse.json(inMemoryStore);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const newItem = {
    id: inMemoryStore.length + 1,
    name: parsed.data.name,
    formulaText: parsed.data.formulaText,
  };

  inMemoryStore.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}
