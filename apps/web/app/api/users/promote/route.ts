import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { requesterId, targetUserId } = await req.json();
  const requesterCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [requesterId]);
  
  if (!requesterCheck.rows[0]?.is_admin) {
    return NextResponse.json({ error: "UNAUTHORIZED_ACCESS" }, { status: 403 });
  }
  await pool.query('UPDATE users SET is_admin = TRUE WHERE id = $1', [targetUserId]);
  return NextResponse.json({ success: true });
}