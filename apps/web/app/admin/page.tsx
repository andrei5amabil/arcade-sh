"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

interface UserSession {
  id: number;
  username: string;
  rank_title: string;
  level: number;
  avatar_url?: string;
  is_admin: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [admin, setAdmin] = useState<UserSession | null>(null);

  useEffect(() => {
    
    const rawData = localStorage.getItem('arcade_user');
    if (!rawData) {
        window.location.href = '/auth';
        return;
    }

    const savedUser = JSON.parse(rawData);

    if (!savedUser?.is_admin) {
      window.location.href = '/'; 
      return;
    }
    setAdmin(savedUser);
    fetchUsers(savedUser.id);
  }, []);

  const fetchUsers = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/users?adminId=${id}`);
      if (!res.ok) throw new Error("FETCH_FAILED");
      const data: AdminUser[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("ADMIN_SYNC_ERROR:", err);
    }
  };

  const deleteUser = async (targetId: number) => {
    if (!admin) return;

    if (!confirm("Confirm Deletion? This is permanent.")) return;
    
    await fetch('/api/admin/users', {
      method: 'DELETE',
      body: JSON.stringify({ adminId: admin.id, targetUserId: targetId })
    });
    fetchUsers(admin.id);
  };

  return (
    <main className="min-h-screen bg-[#1a1b26] p-8 font-mono text-[#c0caf5]">
      <div className="max-w-6xl mx-auto">
        <Navbar />
        <h1 className="text-2xl font-black text-[#e0af68] mb-8 uppercase italic underline">
          System_Administration // User_Registry
        </h1>

        <div className="bg-[#1f2335] border border-[#414868] rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#16161e] text-[#565f89] uppercase text-[10px]">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Pilot_Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Admin_Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24283b]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#24283b] transition-colors">
                  <td className="p-4 font-bold text-[#7aa2f7]">{u.id}</td>
                  <td className="p-4">{u.username}</td>
                  <td className="p-4 text-[#565f89]">{u.email}</td>
                  <td className="p-4">
                    {u.is_admin ? 
                      <span className="text-[#9ece6a]">[ TRUE ]</span> : 
                      <span className="text-[#565f89]">[ FALSE ]</span>
                    }
                  </td>
                  <td className="p-4 text-[10px]">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => deleteUser(u.id)}
                      className="text-[#f7768e] hover:underline uppercase text-[10px] font-bold"
                    >
                      TERMINATE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}