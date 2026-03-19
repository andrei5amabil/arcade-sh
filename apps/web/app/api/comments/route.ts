import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  try {
    const query = `
      SELECT 
        comments.*, 
        users.username, 
        users.avatar_url 
      FROM comments 
      JOIN users ON comments.user_id = users.id 
      WHERE post_id = $1 
      ORDER BY created_at ASC;
    `;
    const result = await pool.query(query, [postId]);
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "COMMENTS_OFFLINE" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { postId, userId, content } = await req.json();

    if (!content || content.length > 200) {
      return NextResponse.json({ error: "CONTENT_TOO_LONG" }, { status: 400 });
    }

    const query = `
      INSERT INTO comments (post_id, user_id, content) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const result = await pool.query(query, [postId, userId, content]);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 500 });
  }
}