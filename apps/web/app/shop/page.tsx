"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface Prize {
  id: number;
  name: string;
  description: string;
  cost: number;
  category: string;
}

export default function PrizeShop() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchLatestUserData = async () => {
      const saved = localStorage.getItem('arcade_user');
      if (!saved) return;
      
      const localUser = JSON.parse(saved);
      
      try {
        const res = await fetch(`/api/users/profile?id=${localUser.id}`);
        const freshData = await res.json();
        
        console.log("DEBUG_SHOP_UPLINK:", freshData); 
        
        setUser(freshData);
        localStorage.setItem('arcade_user', JSON.stringify(freshData));
      } catch (e) {
        setUser(localUser);
      }
    };

    fetchLatestUserData();
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    const res = await fetch('/api/shop/prizes');
    const data = await res.json();
    setPrizes(data);
    setLoading(false);
  };

  const handlePurchase = async (prizeId: number, cost: number) => {
    if (user.tickets < cost) {
      alert("INSUFFICIENT_TICKETS: Go play more Space-Intruder!");
      return;
    }

    const res = await fetch('/api/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, prizeId }),
    });

    if (res.ok) {
      const updatedUser = { ...user, tickets: user.tickets - cost };
      setUser(updatedUser);
      localStorage.setItem('arcade_user', JSON.stringify(updatedUser));
      alert("PURCHASE_COMPLETE: Check your inventory!");
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
      <div className="max-w-5xl mx-auto space-y-10">
        <Navbar />

        <header className="flex justify-between items-center border-b border-[#24283b] pb-6">
          <div>
            <h1 className="text-4xl font-black text-[#bb9af7] uppercase italic">Prize_Redemption</h1>
            <p className="text-[#565f89] text-xs mt-1">EXCHANGE TICKETS FOR DIGITAL GOODS</p>
          </div>
          <div className="bg-[#1f2335] border border-[#7aa2f7] px-6 py-3 rounded-md">
            <span className="text-[#7aa2f7] text-[10px] uppercase font-bold block mb-1">Current_Balance</span>
            <span className="text-2xl font-black text-[#9ece6a]">{user?.tickets || 0} 🎟️</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prizes.map((prize) => (
            <div key={prize.id} className="bg-[#1f2335] border border-[#24283b] p-6 rounded-lg hover:border-[#7aa2f7] transition-all group">
              <span className="text-[9px] text-[#565f89] uppercase tracking-widest">{prize.category}</span>
              <h3 className="text-lg font-bold text-[#7aa2f7] mt-1">{prize.name}</h3>
              <p className="text-sm text-[#565f89] mt-2 mb-6 h-10">{prize.description}</p>
              
              <button 
                onClick={() => handlePurchase(prize.id, prize.cost)}
                className="w-full bg-[#414868] text-[#c0caf5] py-2 rounded font-bold text-xs uppercase group-hover:bg-[#7aa2f7] group-hover:text-[#1a1b26] transition-colors"
              >
                Redeem for {prize.cost} Tickets
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}