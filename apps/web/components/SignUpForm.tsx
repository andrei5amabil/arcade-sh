"use client";
import { useState } from 'react';

export default function SignUpForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState("");

  const validateUsername = (name: string) => {
    if (/\s/.test(name)) return "Username cannot contain spaces.";
    if (name.length > 0 && name.length < 3) return "Username too short (min 3).";
    if (name.length > 20) return "Username too long (max 20).";
    return ""; 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the main form object
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // If the field being changed is the username, update the error state
    if (name === 'username') {
      setError(validateUsername(value));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Final defensive check
    const finalError = validateUsername(formData.username);
    if (finalError) {
      setError(finalError);
      return;
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // We trim the username one last time before sending
      body: JSON.stringify({
        ...formData,
        username: formData.username.trim()
      }),
    });

    if (response.ok) {
      alert("New Pilot Registered!");
      setFormData({ username: '', email: '', password: '' });
      window.location.reload(); 
    } else {
      const data = await response.json();
      alert(`Error: ${data.error || "Connection failed."}`);
    }
  };

  return (
    <div className="mb-10 p-6 border border-[#414868] rounded-lg bg-[#1f2335] shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-[#9ece6a] tracking-tighter italic uppercase">
        REGISTER_NEW_PLAYER
      </h2>
      <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <input 
            name="username" // Added name attribute for the generic handler
            type="text" 
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`bg-[#1a1b26] border ${error ? 'border-[#f7768e]' : 'border-[#414868]'} p-2 rounded text-[#c0caf5] outline-none focus:border-[#7aa2f7] transition-all`}
            required
          />
          {error && (
            <span className="text-[#f7768e] text-[10px] font-bold animate-pulse mt-1">
              [!] {error}
            </span>
          )}
        </div>

        <input 
          name="email"
          type="email" 
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#7aa2f7]"
          required
        />
        
        <input 
          name="password"
          type="password" 
          placeholder="Secure Password"
          value={formData.password}
          onChange={handleChange}
          className="bg-[#1a1b26] border border-[#414868] p-2 rounded text-[#c0caf5] outline-none focus:border-[#7aa2f7]"
          required
        />

        <button 
          type="submit" 
          disabled={!!error || formData.username.length === 0}
          className="bg-[#7aa2f7] text-[#1a1b26] px-6 py-2 rounded font-bold hover:bg-[#b4f9f8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs"
        >
          INITIALIZE_PILOT
        </button>
      </form>
    </div>
  );
}