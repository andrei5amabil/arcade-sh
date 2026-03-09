import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY xp DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    const salts = 10;
    const hashPass = await bcrypt.hash(password, salts);

    const query = `
      INSERT INTO users (username, email, password_hash, level, xp) 
      VALUES ($1, $2, $3, 1, 0) 
      RETURNING *`;
    
    const values = [username, email, hashPass];
    const result = await pool.query(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'User already exists or DB error' }, { status: 400 });
  }
}