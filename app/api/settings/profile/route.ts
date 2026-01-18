import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.response) return authResult.response;

    try {
        const userId = authResult.user.id;
        const user = await query('SELECT id, email, full_name, role, organization, phone FROM users WHERE id = $1', [userId]);

        if (user.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user[0]);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.response) return authResult.response;

    try {
        const userId = authResult.user.id;
        const { full_name, organization, phone } = await request.json();

        const updated = await query(`
      UPDATE users 
      SET full_name = $1, organization = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, email, full_name, organization, phone
    `, [full_name, organization, phone, userId]);

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updated[0]
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
