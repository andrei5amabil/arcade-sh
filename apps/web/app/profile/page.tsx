"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UserStats from '@/components/profile/UserStats';

interface UserSession {
  id: number;
  username: string;
  rank_title: string;
  level: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('arcade_user');
    
    if (!savedUser) {
      // No pilot found in local storage, ejecting to registration
      router.push('/register');
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("SESSION_CORRUPT");
      router.push('/register');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#1a1b26] p-8 font-mono text-[#565f89]">INITIALIZING_SESSION...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        <Navbar />

        {/* Identity Section */}
        <section className="bg-[#1f2335] border border-[#414868] rounded-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img 
                src="/sprites/default-avatar.png" 
                className="w-32 h-32 rounded-xl border-2 border-[#7aa2f7]"
                alt="Pilot Avatar"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#7aa2f7] text-[#1a1b26] text-[10px] font-bold px-2 py-1 rounded">
                LVL_{user.level.toString().padStart(2, '0')}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-[#c0caf5] tracking-tighter uppercase italic">
                {user.username} / <span className="text-[#7aa2f7]">{user.rank_title}</span>
              </h1>
              <p className="text-[#565f89] text-sm mt-2 tracking-widest uppercase">
                Status: <span className="text-[#9ece6a]">CONNECTED</span> 
              </p>
            </div>
          </div>
        </section>

        {/* Aggregate Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[#7aa2f7] text-xs font-bold uppercase tracking-[0.3em] border-b border-[#24283b] pb-2">
              SECTOR_PERFORMANCE_LOGS
            </h3>
            {/* Pass the real ID to the stats fetcher */}
            <UserStats userId={user.id} />
          </div>

          <aside className="space-y-6">
             <h3 className="text-[#f7768e] text-xs font-bold uppercase tracking-[0.3em] border-b border-[#24283b] pb-2">
              SESSION_CONTROLS
            </h3>
            <button 
              onClick={() => {
                localStorage.removeItem('arcade_user');
                router.push('/');
              }}
              className="w-full py-2 border border-[#f7768e] text-[#f7768e] text-[10px] font-bold hover:bg-[#f7768e] hover:text-[#1a1b26] transition-all uppercase"
            >
              Terminate_Connection
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}