import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

const TOKEN_TTL = '30d';

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.jwtSecret);
}

export async function signUserToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey());
}

export async function verifyUserToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const userId = payload.userId;

    return typeof userId === 'string' ? userId : null;
  } catch {
    return null;
  }
}
