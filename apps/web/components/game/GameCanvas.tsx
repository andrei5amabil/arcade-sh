"use client";
import { useEffect, useRef, useState } from 'react';

export default function GameCanvas({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEngineReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!engineReady || !canvasRef.current) return;

    let kInstance: any = null;

    const initGame = async () => {
      const { startDodgeWin } = await import('@/games/dodge-win/game');
      
      if (gameId === 'dodge-win') {
        kInstance = await startDodgeWin(canvasRef.current!);
      }
    };

    initGame();

    return () => {
      if (kInstance && typeof kInstance.quit === 'function') {
        kInstance.quit(); 
      }
    };

  }, [engineReady, gameId]);

  return (
    <div className="relative w-full aspect-video bg-[#1a1b26] rounded-lg overflow-hidden flex items-center justify-center">
      {!engineReady && (
        <div className="text-[#565f89] font-mono text-xs animate-pulse">
          INITIALIZING...
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={`w-full h-full block transition-opacity duration-500 ${engineReady ? 'opacity-100' : 'opacity-0'}`} 
      />
    </div>
  );
}