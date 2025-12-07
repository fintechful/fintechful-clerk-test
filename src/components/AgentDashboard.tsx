// src/components/AgentDashboard.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
  full_name: string;
  headshot_url: string;
  phone: string;
};

export default function AgentDashboard() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [smbCount] = useState(7); // fake for now
  const [monthlyEarnings] = useState(2842); // fake for now

  useEffect(() => {
    if (user?.id) {
      supabase
        .from('profiles')
        .select('full_name, headshot_url, phone')
        .eq('clerk_user_id', user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <header className="bg-black/50 backdrop-blur border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Hero Stats */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center gap-8 mb-12">
          {profile?.headshot_url ? (
            <img src={profile.headshot_url} alt={profile.full_name} className="w-32 h-32 rounded-full border-4 border-purple-500" />
          ) : (
            <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-5xl font-bold">
              {user?.firstName?.[0]}
            </div>
          )}
          <div>
            <h2 className="text-5xl font-bold mb-2">Welcome back, {profile?.full_name || user?.firstName || 'Agent'}!</h2>
            <p className="text-2xl opacity-80">Here's how your business is performing</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl shadow-2xl">
            <p className="text-xl opacity-90">Active SMB Clients</p>
            <p className="text-6xl font-black mt-4">{smbCount}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600 to-red-600 p-8 rounded-3xl shadow-2xl">
            <p className="text-xl opacity-90">Earnings This Month</p>
            <p className="text-6xl font-black mt-4">${monthlyEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-3xl shadow-2xl">
            <p className="text-xl opacity-90">Commission Rate</p>
            <p className="text-6xl font-black mt-4">50%</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold px-16 py-8 rounded-3xl hover:shadow-2xl transform hover:scale-105 transition">
            + Add New SMB Client
          </button>
        </div>
      </div>
    </div>
  );
}