import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/server/prisma';
import { z } from 'zod';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if(!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

const Update = z.object({
  title: z.string().min(1).max(200).optional(),
  favorite: z.boolean().optional(),
  contentJson: z.any().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const p = Update.safeParse(body);
  if(!p.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const page = await prisma.page.update({ where: { id }, data: p.data });
  return NextResponse.json(page);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.page.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
