import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey =
  process.env.JWT_SECRET ||
  'your-super-secret-jwt-key-change-this-in-production';
const encodedKey = new TextEncoder().encode(secretKey);

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as JWTPayload;
  } catch {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(userId: string, username: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({
    userId,
    username,
    iat: Date.now(),
    exp: expiresAt.getTime(),
  });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const payload = await decrypt(session);
  if (!payload) return;

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: session,
    httpOnly: true,
    expires: expires,
  });
  return res;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
