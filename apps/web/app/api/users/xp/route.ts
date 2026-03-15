import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: Request){
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('user_id');

    if( !userId ) return NextResponse.json({error: "No user"}, {status: 401});

    try{
        const result = await pool.query(
            `
            SELECT SUM(score) as total_xp FROM scores WHERE player_id = $1
            `
        , [userId]);
        const total_xp = parseInt(result.rows[0].total_xp) || 0;
        const level = Math.floor(total_xp/100) + 1;
        return NextResponse.json({
            total_xp: total_xp,
            level: level,
            rank_title: getRankTitle(level)
        });
    }
    catch(err){
        return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
    }

}

function getRankTitle(level: number) {
  if (level < 5) return "LS_SPAMMER";
  if (level < 15) return "PS_DAEMON";
  if (level < 30) return "GREP_GOD";
  return "SUDO";
}