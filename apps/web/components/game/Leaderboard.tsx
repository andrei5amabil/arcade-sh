"use client";
import { useEffect, useState } from 'react';

interface Score {
  username: string;
  score: number;
  avatar_url: string;
}

export default function Leaderboard({ gameId }: { gameId: string }) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(`/api/scores?game_id=${gameId}`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("LEADERBOARD_FETCH_FAILED", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, [gameId]);

  if (loading) return <div className="text-[#565f89] text-xs animate-pulse">SYNCING_DATABASE...</div>;

  return (
    <div className="space-y-4">
      {scores.length === 0 ? (
        <p className="text-[#565f89] text-[10px] italic">NO_DATA_FOUND</p>
      ) : (
        scores.map((s, i) => (
          <div key={i} className="flex items-center justify-between bg-[#16161e] p-3 rounded border border-[#24283b] hover:border-[#7aa2f7] transition-colors">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold ${i === 0 ? 'text-[#e0af68]' : 'text-[#565f89]'}`}>
                0{i + 1}
              </span>
              <img src={s.avatar_url || '/sprites/default-avatar.png'} alt="" className="w-6 h-6 rounded-full border border-[#414868]" />
              <span className="text-xs font-medium text-[#c0caf5] uppercase tracking-tighter">
                {s.username}
              </span>
            </div>
            <span className="text-xs font-mono text-[#bb9af7] font-bold">
              {s.score.toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}