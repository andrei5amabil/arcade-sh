import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { userId, avatarUrl } = await req.json();

  try {
    await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [avatarUrl, userId]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "FAILED_TO_UPDATE_AVATAR" }, { status: 500 });
  }
}