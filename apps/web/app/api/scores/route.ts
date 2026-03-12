import { NextResponse } from 'next/server';
import { Pool } from 'pg'; 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const { game_id, player_id, score } = await request.json();

    const result = await pool.query(
        'INSERT INTO scores (game_id, player_id, score) VALUES ($1, $2, $3) RETURNING *',
      [game_id, player_id, score]
    );

    return NextResponse.json({ success: true, score: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}