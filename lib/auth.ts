import { query } from './db';
import * as bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
);

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'scientist' | 'manager' | 'viewer' | 'user';
  organization: string;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  organizationName: string
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const results = await query(
    `INSERT INTO users (email, password_hash, full_name, role, organization) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, email, full_name, role, organization`,
    [email, hashedPassword, fullName, 'user', organizationName]
  );

  return results[0] as User;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const results = await query(
    `SELECT id, email, full_name, role, organization, password_hash FROM users WHERE email = $1`,
    [email]
  );

  if (results.length === 0) return null;

  const user = results[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) return null;

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    organization: user.organization,
  };
}

export async function createToken(user: User): Promise<string> {
  return new SignJWT(user as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const verified = await jwtVerify(token, SECRET);
    return verified.payload as unknown as User;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}
