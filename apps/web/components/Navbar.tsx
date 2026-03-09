"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('arcade_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('arcade_user');
    setUser(null);
    window.location.reload(); 
  };

  return (
    <header className="flex justify-between items-center border-b border-[#414868] pb-6 mb-8">
      <Link href="/" className="text-2xl font-bold text-[#7aa2f7] hover:opacity-80 transition-opacity">
        ARCADE.SH
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-[#565f89] text-xs font-mono">PLAYER: <span className="text-[#9ece6a]">{user.username}</span></span>
            <button 
              onClick={handleLogout}
              className="border border-[#f7768e] text-[#f7768e] px-4 py-1 rounded text-sm hover:bg-[#f7768e] hover:text-[#1a1b26] transition-all"
            >
              LOG_OUT
            </button>
          </div>
        ) : (
          <Link 
            href="/auth" 
            className="border border-[#7aa2f7] text-[#7aa2f7] px-4 py-1 rounded text-sm hover:bg-[#7aa2f7] hover:text-[#1a1b26] transition-all"
          >
            CONNECT_PLAYER
          </Link>
        )}
      </div>
    </header>
  );
}