import { NextResponse } from 'next/server';
import { prisma } from '@/src/server/prisma';
import { z } from 'zod';

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { sortIndex: 'asc' } });
  return NextResponse.json(pages);
}

const Create = z.object({ title: z.string().min(1).max(200), parentPageId: z.string().optional().nullable() });

export async function POST(req: Request) {
  const body = await req.json();
  const p = Create.safeParse(body);
  if(!p.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const currentMax = await prisma.page.aggregate({ _max: { sortIndex: true } });
  const next = (currentMax._max.sortIndex ?? -1) + 1;
  const page = await prisma.page.create({ data: { title: p.data.title, parentPageId: p.data.parentPageId ?? null, sortIndex: next } });
  return NextResponse.json(page, { status: 201 });
}
