import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') ?? '';
  if(!q) return NextResponse.json([]);
  const pages = await prisma.page.findMany({
    where: { title: { contains: q, mode: 'insensitive' } },
    orderBy: { sortIndex: 'asc' },
    take: 20
  });
  return NextResponse.json(pages);
}
