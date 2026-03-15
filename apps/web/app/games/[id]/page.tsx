import Navbar from '@/components/Navbar';
import GameCanvas from '@/components/game/GameCanvas';
import { GAMES } from '@/lib/games';
import { notFound } from 'next/navigation';
import Leaderboard from '@/components/game/Leaderboard';

export default async function GamePage({ params }:{ params: Promise<{ id: string }> }) {
  const { id } = await params;

  const game = GAMES.find((g) => g.id === id);

  if (!game) notFound();

  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <Navbar />

        <div className="flex flex-col xl:flex-row gap-8">
          <div className="flex-1 bg-[#16161e] rounded-xl border border-[#414868] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#24283b] flex justify-between items-center bg-[#1f2335]">
              <h2 className="text-[#7aa2f7] font-bold text-sm tracking-widest uppercase">
                {game.title} // ENGINE_READY
              </h2>
              <span className="text-[10px] text-[#565f89]">RESOLUTION: 800x600</span>
            </div>
            
            <GameCanvas gameId={game.id} />
          </div>

          <div className="w-full xl:w-80">
            <div className="bg-[#1f2335] p-6 rounded-xl border border-[#414868] h-full shadow-lg">
              <h3 className="text-[#bb9af7] text-xs font-bold uppercase mb-6 tracking-widest border-b border-[#414868] pb-2">
                TOP_PILOTS_REGISTRY
              </h3>
              
              <Leaderboard gameId={id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}