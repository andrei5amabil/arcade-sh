import { NextResponse } from 'next/server';
import { Pool } from 'pg'; 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
    try{
        const result = await pool.query('SELECT * FROM prizes');
        return NextResponse.json(result.rows);
    }catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}