"use client";
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <main className="min-h-screen bg-[#1a1b26] text-[#c0caf5] p-8 font-mono">
      <div className="max-w-4xl mx-auto border border-[#414868] rounded-lg bg-[#24283b] shadow-2xl">
        {/* Mock Terminal Header */}
        <div className="bg-[#414868] p-2 flex gap-2 rounded-t-lg">
          <div className="w-3 h-3 rounded-full bg-[#f7768e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#e0af68]"></div>
          <div className="w-3 h-3 rounded-full bg-[#9ece6a]"></div>
          <span className="text-xs ml-2 opacity-70">arcade.sh — leaderboard</span>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-[#7aa2f7]">{'>'} GLOBAL_LEADERBOARD</h1>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#414868] text-[#bb9af7]">
                <th className="py-2">RANK</th>
                <th className="py-2">USER</th>
                <th className="py-2">LVL</th>
                <th className="py-2 text-right">XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, index) => (
                <tr key={user.id} className="border-b border-[#292e42] hover:bg-[#2f3549] transition-colors">
                  <td className="py-3 text-[#565f89]">#0{index + 1}</td>
                  <td className="py-3 font-bold text-[#73daca]">{user.username}</td>
                  <td className="py-3">[{user.level}]</td>
                  <td className="py-3 text-right text-[#ff9e64]">{user.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}