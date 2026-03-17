"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UserStats from '@/components/profile/UserStats';
import AvatarSelector from '@/components/profile/AvatarSelector';
import Link from 'next/link';

const AVATAR_OPTIONS = ['Tux.png', 'fedora.png', 'arch.png', 'gnome.png', 'bash.png', 'evil1.png'];

interface UserSession {
  id: number;
  username: string;
  rank_title: string;
  level: number;
  avatar_url?: string;
  is_admin: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  useEffect(() => {
  const savedUser = localStorage.getItem('arcade_user');
  if (!savedUser) {
    router.push('/register');
    return;
  }

  const session = JSON.parse(savedUser);

  const fetchLiveUser = async () => {
    try {
      const res = await fetch(`/api/users/profile?id=${session.id}`);
      const liveData = await res.json();
      
      if (res.ok) {
        setUser(liveData);
        localStorage.setItem('arcade_user', JSON.stringify(liveData));
      } else {
        setUser(session); 
      }
    } catch (e) {
      setUser(session);
    } finally {
      setLoading(false);
    }
  };

  fetchLiveUser();
}, [router]);

  if (loading) return <div className="min-h-screen bg-[#1a1b26] p-8 font-mono text-[#565f89]">INITIALIZING_SESSION...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        <Navbar />

        <section className="bg-[#1f2335] border border-[#414868] rounded-xl p-8 shadow-2xl relative">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            
            <div className="relative group">
              <img 
                src={`/sprites/${user.avatar_url || 'default-avatar.png'}`} 
                className={`w-32 h-32 rounded-xl border-2 transition-all cursor-pointer ${
                  isEditingAvatar ? 'border-[#bb9af7] scale-105' : 'border-[#7aa2f7] hover:border-[#bb9af7]'
                }`}
                alt="Pilot Avatar"
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              />
              
              <div className="absolute -bottom-2 -right-2 bg-[#7aa2f7] text-[#1a1b26] text-[10px] font-bold px-2 py-1 rounded">
                LVL_{user.level.toString().padStart(2, '0')}
              </div>

              {isEditingAvatar && (
                <div className="absolute top-[110%] left-0 z-[100] animate-in fade-in slide-in-from-top-2">
                  <AvatarSelector 
                    currentAvatar={user.avatar_url ?? 'default-avatar.png'} 
                    userId={user.id} 
                    onUpdate={(newSprite) => {
                      const updatedUser = { ...user, avatar_url: newSprite };
                      setUser(updatedUser);
                      
                      localStorage.setItem('arcade_user', JSON.stringify(updatedUser));
                      
                      setIsEditingAvatar(false);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-[#c0caf5] tracking-tighter uppercase italic">
                {user.username} / <span className="text-[#7aa2f7]">{user.rank_title}</span>
              </h1>
              <p className="text-[#565f89] text-sm mt-2 tracking-widest uppercase font-mono">
                Status: <span className="text-[#9ece6a]">CONNECTED</span> | ID: <span className="text-[#bb9af7]">{user.id.toString().padStart(4, '0')} </span>{user.is_admin && (<span className="text-[#e0af68] font-bold uppercase tracking-widest">| [!] ADMIN_ACCESS_GRANTED</span>)}
              </p>
            </div>
          </div>
        </section>

        {user.is_admin && (
          <div className="bg-[#1f2335] border-2 border-[#e0af68] p-4 rounded-xl shadow-[0_0_15px_rgba(224,175,104,0.1)] mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#e0af68] rounded-full animate-ping"></div>
              <h3 className="text-[#e0af68] text-[10px] font-bold uppercase tracking-widest">
                Admin_Detected
              </h3>
            </div>
            <p className="text-[#565f89] text-[10px] mb-4 uppercase">
              Root-level control over user registry and arcade telemetry is available.
            </p>
            <Link 
              href="/admin" 
              className="block text-center bg-[#e0af68] text-[#1a1b26] py-2 rounded font-bold text-xs uppercase hover:bg-[#b4f9f8] transition-colors"
            >
              Open_Control_Panel
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[#7aa2f7] text-xs font-bold uppercase tracking-[0.3em] border-b border-[#24283b] pb-2">
              SECTOR_PERFORMANCE_LOGS
            </h3>
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