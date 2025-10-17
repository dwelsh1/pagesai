import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-please-override-with-32-bytes');
export async function issueToken(sub: string) {
  return await new SignJWT({ sub }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(secret());
}
export async function currentUserId() {
  const token = (await cookies()).get('token')?.value;
  if(!token) return null;
  try { const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] }); return (payload.sub as string) ?? null; }
  catch { return null; }
}
