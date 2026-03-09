import Navbar from '@/components/Navbar';
import GameGrid from '@/components/GameGrid';
import LeaderboardTable from '@/components/LeaderboardTable';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        
        <Navbar />

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <GameGrid />
          </div>

          <div className="w-full lg:w-80">
            <h2 className="text-[#565f89] text-xs font-bold uppercase tracking-[0.2em] mb-6">Global_Ranking</h2>
            <LeaderboardTable />
          </div>
        </div>

      </div>
    </main>
  );
}