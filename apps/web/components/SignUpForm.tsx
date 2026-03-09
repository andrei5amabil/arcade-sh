"use client";
import { useState } from 'react';

export default function SignUpForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("New Pilot Registered!");
      setFormData({ username: '', email: '', password: '' });
      window.location.reload(); 
    } else {
      alert("Error: Connection failed or user exists.");
    }
  };

  return (
    <div className="mb-10 p-6 border border-[#414868] rounded-lg bg-[#1f2335]">
      <h2 className="text-xl font-bold mb-4 text-[#9ece6a]">REGISTER_NEW_PLAYER</h2>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
        <input 
          type="text" 
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#7aa2f7]"
          required
        />
        <input 
          type="email" 
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#7aa2f7]"
          required
        />
        <input 
          type="password" 
          placeholder="Secure Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#7aa2f7]"
          required
        />
        <button 
          type="submit" 
          className="bg-[#7aa2f7] text-[#1a1b26] px-6 py-2 rounded font-bold hover:bg-[#b4f9f8] transition-colors"
        >
          INITIALIZE
        </button>
      </form>
    </div>
  );
}