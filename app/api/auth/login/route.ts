import { NextResponse } from 'next/server';
import { z } from 'zod';
import { compare } from 'bcryptjs';
import { issueToken } from '@/src/server/auth';
import { prisma } from '@/src/server/prisma';

const Login = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Login.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const jwt = await issueToken(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('token', jwt, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60*60*8 });
  return res;
}
