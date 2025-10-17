import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ message: 'Session cleared' });
  
  // Clear all possible cookie variations
  res.cookies.set('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  
  res.cookies.set('token', '', {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  
  return res;
}
