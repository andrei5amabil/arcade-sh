"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem('arcade_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("NAV_SESSION_ERROR");
      }
    } else {
      setUser(null);
    }
  }, [pathname]); 

  const handleLogout = () => {
    localStorage.removeItem('arcade_user');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center border-b border-[#414868] pb-6 mb-8">
      <Link href="/" className="text-2xl font-bold text-[#7aa2f7] hover:opacity-80 transition-opacity tracking-tighter italic">
        ARCADE.SH
      </Link>

      <Link href="/posts" className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${ 
        pathname === '/posts' ? 'text-[#9ece6a] underline underline-offset-4' : 'text-[#565f89] hover:text-[#c0caf5]' }`}
      >
        [ POSTS ]
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-6">
            <Link 
              href="/profile" 
              className={`text-xs font-mono transition-colors ${
                pathname === '/profile' ? 'text-[#bb9af7]' : 'text-[#565f89] hover:text-[#c0caf5]'
              }`}
            >
              PLAYER: <span className={pathname === '/profile' ? 'underline underline-offset-4' : 'text-[#9ece6a]'}>
                {user.username}
              </span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="border border-[#f7768e] text-[#f7768e] px-4 py-1 rounded text-xs font-bold hover:bg-[#f7768e] hover:text-[#1a1b26] transition-all uppercase"
            >
              LOG_OUT
            </button>
          </div>
        ) : (
          <Link 
            href="/auth" 
            className="border border-[#7aa2f7] text-[#7aa2f7] px-4 py-1 rounded text-xs font-bold hover:bg-[#7aa2f7] hover:text-[#1a1b26] transition-all uppercase"
          >
            CONNECT_PLAYER
          </Link>
        )}
      </div>
    </header>
  );
}