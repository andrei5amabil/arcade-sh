import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get('adminId');

  try {
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [adminId]);
    if (!adminCheck.rows[0]?.is_admin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const result = await pool.query('SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { adminId, targetUserId } = await req.json();

  try {
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [adminId]);
    if (!adminCheck.rows[0]?.is_admin) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

    await pool.query('DELETE FROM users WHERE id = $1', [targetUserId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}