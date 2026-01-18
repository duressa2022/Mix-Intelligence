import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, User } from './auth';

export async function requireAuth(request: NextRequest): Promise<{ user: User; response: null } | { user: null; response: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const user = await verifyToken(token);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Invalid token' }, { status: 401 }),
    };
  }

  return { user, response: null };
}

export async function requireRole(request: NextRequest, allowedRoles: string[]): Promise<{ user: User; response: null } | { user: null; response: NextResponse }> {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult;

  if (!authResult.user || !allowedRoles.includes(authResult.user.role)) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { user: authResult.user, response: null };
}
