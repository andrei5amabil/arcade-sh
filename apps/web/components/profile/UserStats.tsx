"use client";
import { useEffect, useState } from 'react';

interface GameStat {
  game_id: string;
  all_time_best: number;
  total_cumulative_score: string; // BIGINT comes as string from Postgres
  times_played: number;
}

export default function UserStats({ userId }: { userId: number }) {
  const [stats, setStats] = useState<GameStat[]>([]);

  useEffect(() => {
    fetch(`/api/users/stats?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, [userId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div key={stat.game_id} className="bg-[#16161e] border border-[#414868] p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[#7aa2f7] font-bold uppercase text-xs tracking-widest">
              {stat.game_id.replace('-', '_')}
            </h4>
            <span className="text-[10px] text-[#565f89] font-mono">
              SESSIONS: {stat.times_played}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#565f89]">PERSONAL_BEST</span>
              <span className="text-[#9ece6a] font-mono font-bold">
                {stat.all_time_best.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#565f89]">TOTAL_CONTRIBUTION</span>
              <span className="text-[#bb9af7] font-mono font-bold">
                {parseInt(stat.total_cumulative_score).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}