import { GAMES } from '@/lib/games';
import Link from 'next/link';

export default function GameGrid() {
  return (
    <section className="mb-12">
      <h2 className="text-[#565f89] text-[10px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7aa2f7] shadow-[0_0_8px_#7aa2f7]"></span>
        Available_Modules
      </h2>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {GAMES.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="group flex">
            <div className="flex flex-col w-full border border-[#414868] bg-[#1f2335] rounded-xl p-5 transition-all duration-300 group-hover:border-[#7aa2f7] group-hover:shadow-[0_0_20px_rgba(122,162,247,0.1)] group-hover:translate-y-[-2px]">
              
              
              <div className="aspect-video w-full bg-[#1a1b26] rounded-lg mb-4 flex items-center justify-center border border-[#24283b] overflow-hidden transition-colors group-hover:border-[#414868]">
                <span 
                  style={{ color: game.color }} 
                  className="text-5xl font-black opacity-10 group-hover:opacity-40 transition-all duration-500 scale-90 group-hover:scale-110"
                >
                  {game.title[0]}
                </span>
              </div>

              
              <div className="flex flex-col flex-grow">
                <h3 className="text-[#c0caf5] font-bold text-lg group-hover:text-[#7aa2f7] transition-colors">
                  {game.title}
                </h3>
                
                
                <p className="text-[#565f89] text-xs mt-2 line-clamp-2 min-h-[32px] leading-relaxed">
                  {game.description}
                </p>

                
                <div className="mt-4 pt-4 border-t border-[#24283b] flex justify-between items-center">
                  <span className="text-[10px] text-[#414868] font-mono uppercase">Status: Ready</span>
                  <span className="text-[10px] text-[#7aa2f7] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    [ EXECUTE ]
                  </span>
                </div>
              </div>
              
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}