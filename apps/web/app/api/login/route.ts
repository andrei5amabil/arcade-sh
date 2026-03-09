import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userQuery.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json({ message: 'Login successful', user: userWithoutPassword });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}