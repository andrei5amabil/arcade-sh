"use client";
import { useEffect, useRef } from 'react';

export default function GameCanvas({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // We will dynamically import the game logic here
    // This keeps our main bundle small!
    const initGame = async () => {
      const { startDodgeWin } = await import('@/games/dodge-win/game');
      
      if (gameId === 'dodge-win') {
        startDodgeWin(canvasRef.current!);
      }
    };

    initGame();
  }, [gameId]);

  return (
    <div className="relative w-full aspect-video bg-black flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}