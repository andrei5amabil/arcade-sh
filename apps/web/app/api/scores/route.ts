import { NextResponse } from 'next/server';
import { Pool } from 'pg'; 

function getRankTitle(level: number) {
  if (level < 5) return "LS_SPAMMER";
  if (level < 15) return "PS_DAEMON";
  if (level < 30) return "GREP_GOD";
  return "SUDO";
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('game_id');

  if (!gameId) {
    return NextResponse.json({ error: "Missing game_id" }, { status: 400 });
  }

  try {
    const result = await pool.query(`
      SELECT 
        s.score, 
        s.created_at, 
        u.username, 
        u.avatar_url 
      FROM scores s
      JOIN users u ON s.player_id = u.id
      WHERE s.game_id = $1
      ORDER BY s.score DESC
      LIMIT 5
    `, [gameId]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('FETCH_ERROR:', error);
    return NextResponse.json({ error: "Database failure" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const { game_id, player_id, score } = await request.json();

    await client.query('BEGIN');

    await client.query(
      'INSERT INTO scores (game_id, player_id, score) VALUES ($1, $2, $3)',
      [game_id, player_id, score]
    );

    const xpResult = await client.query(
      'SELECT SUM(score) as total FROM scores WHERE player_id = $1',
      [player_id]
    );
    const newTotalXp = parseInt(xpResult.rows[0].total) || 0;
    const newLevel = Math.floor(newTotalXp/100) + 1;
    const newTitle = getRankTitle(newLevel);

    await client.query(`
      UPDATE users 
      SET xp = $1, level = $2, rank_title = $3 
      WHERE id = $4
    `, [newTotalXp, newLevel, newTitle, player_id]);

    await client.query('COMMIT');

    return NextResponse.json({ 
      success: true, 
      xp: newTotalXp, 
      level: newLevel, 
      title: newTitle 
    });

  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('TRANSACTION_FAILURE:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    client.release();
  }
}