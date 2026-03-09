"use client";
import { useState } from 'react';
import {useRouter} from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('AUTHENTICATING...');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus(`WELCOME BACK, ${data.user.username.toUpperCase()}`);
      localStorage.setItem('arcade_user', JSON.stringify(data.user));
      router.push('/');
    } else {
      setStatus(`ERROR: ${data.error.toUpperCase()}`);
    }
  };

  return (
    <div className="p-6 border border-[#414868] rounded-lg bg-[#1f2335]">
      <h2 className="text-xl font-bold mb-4 text-[#7aa2f7]">PLAYER_LOGIN</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
        <input 
          type="text" 
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#bb9af7]"
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#bb9af7]"
          required
        />
        <button 
          type="submit" 
          className="bg-[#bb9af7] text-[#1a1b26] px-6 py-2 rounded font-bold hover:bg-[#c0caf5] transition-colors"
        >
          AUTH_START
        </button>
        {status && <p className="text-xs mt-2 text-[#565f89] animate-pulse">{'>'} {status}</p>}
      </form>
    </div>
  );
}