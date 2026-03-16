import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await pool.query(`
      SELECT 
        game_id, 
        all_time_best, 
        total_cumulative_score, 
        times_played 
      FROM leaderboards 
      WHERE player_id = $1
      ORDER BY total_cumulative_score DESC
    `, [userId]);

    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  }
}