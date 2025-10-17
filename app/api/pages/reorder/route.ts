import { NextResponse } from 'next/server';
import { prisma } from '@/src/server/prisma';
import { z } from 'zod';

const Schema = z.object({ order: z.array(z.object({ id: z.string(), sortIndex: z.number() })) });

export async function POST(req: Request) {
  const body = await req.json();
  const p = Schema.safeParse(body);
  if(!p.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  for (const item of p.data.order) {
    await prisma.page.update({ where: { id: item.id }, data: { sortIndex: item.sortIndex } });
  }
  return NextResponse.json({ ok: true });
}
