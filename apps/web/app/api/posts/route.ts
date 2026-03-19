import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    const query = `
      SELECT 
        posts.id, 
        posts.content, 
        posts.created_at, 
        users.username, 
        users.avatar_url,
        users.rank_title
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC;
    `;
    
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("FEED_SYNC_ERROR:", err);
    return NextResponse.json({ error: "DATABASE_OFFLINE" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, content } = await req.json();

    if (!content || content.length > 100) {
      return NextResponse.json({ error: "INVALID_TRANSMISSION_LENGTH" }, { status: 400 });
    }

    const query = `
      INSERT INTO posts (user_id, content) 
      VALUES ($1, $2) 
      RETURNING *;
    `;
    
    const result = await pool.query(query, [userId, content]);
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "TRANSMISSION_FAILED" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { postId, userId } = await req.json();

    const postCheck = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    const userCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);

    if (postCheck.rows.length === 0) {
      return NextResponse.json({ error: "POST_NOT_FOUND" }, { status: 404 });
    }

    const postOwnerId = postCheck.rows[0].user_id;
    const isRequesterAdmin = userCheck.rows[0]?.is_admin || false;

    if (postOwnerId !== userId && !isRequesterAdmin) {
      return NextResponse.json({ error: "UNAUTHORIZED_ACTION" }, { status: 403 });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    return NextResponse.json({ success: true });
    
  } catch (err) {
    return NextResponse.json({ error: "DELETION_FAILED" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { postId, userId, newContent } = await req.json();

    const postCheck = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    
    if (postCheck.rows.length === 0) {
      return NextResponse.json({ error: "POST_NOT_FOUND" }, { status: 404 });
    }

    if (postCheck.rows[0].user_id !== userId) {
      return NextResponse.json({ error: "UNAUTHORIZED_EDIT" }, { status: 403 });
    }

    const result = await pool.query(
      'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
      [newContent, postId]
    );

    return NextResponse.json(result.rows[0]);
    
  } catch (err) {
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}