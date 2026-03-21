import { NextResponse } from 'next/server';
import { Pool } from 'pg'; 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  const { userId, prizeId } = await req.json();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userRes = await client.query('SELECT tickets FROM users WHERE id = $1', [userId]);
    const prizeRes = await client.query('SELECT cost FROM prizes WHERE id = $1', [prizeId]);

    const userTickets = userRes.rows[0].tickets;
    const prizeCost = prizeRes.rows[0].cost;

    if (userTickets < prizeCost) {
      throw new Error("INSUFFICIENT_TICKETS");
    }

    await client.query('UPDATE users SET tickets = tickets - $1 WHERE id = $2', [prizeCost, userId]);

    await client.query('INSERT INTO user_prizes (user_id, prize_id) VALUES ($1, $2)', [userId, prizeId]);

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (e) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: "DB Error" }, { status: 400 });
  } finally {
    client.release();
  }
}