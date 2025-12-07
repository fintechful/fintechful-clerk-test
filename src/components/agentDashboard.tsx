// src/components/AgentDashboard.tsx
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = { full_name: string; headshot_url: string };
type SMB = { business_name: string; monthly_revenue_cents: number };

export default function AgentDashboard() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [smbs, setSmbs] = useState<SMB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;

      // Get agent profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, headshot_url')
        .eq('clerk_user_id', user.id)
        .single();

      // Get agent's subdomain from hostname
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      const subdomain = parts.length > 2 ? parts[0].toLowerCase() : '';

      // Get SMBs
      const { data: smbData } = await supabase
        .from('smbs')
        .select('business_name, monthly_revenue_cents')
        .eq('agent_subdomain', subdomain);

      setProfile(profileData);
      setSmbs(smbData || []);
      setLoading(false);
    }

    loadData();
  }, [user]);

  const totalRevenue = smbs.reduce((sum, s) => sum + s.monthly_revenue_cents, 0);
  const commission = Math.round(totalRevenue * 0.5); // 50%

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-3xl">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black/70 backdrop-blur border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center gap-8 mb-12">
          {profile?.headshot_url ? (
            <img src={profile.headshot_url} alt={profile?.full_name} className="w-32 h-32 rounded-full border-4 border-purple-500" />
          ) : (
            <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-5xl font-bold">
              {user?.firstName?.[0]}
            </div>
          )}
          <div>
            <h2 className="text-5xl font-bold mb-2">Welcome back, {profile?.full_name || user?.firstName}!</h2>
            <p className="text-2xl opacity-80">Here’s your business at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-10 rounded-3xl">
            <p className="text-xl opacity-90">Active Clients</p>
            <p className="text-7xl font-black mt-4">{smbs.length}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600 to-red-600 p-10 rounded-3xl">
            <p className="text-xl opacity-90">Total Monthly Revenue</p>
            <p className="text-6xl font-black mt-4">${(totalRevenue / 100).toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-3xl">
            <p className="text-xl opacity-90">Your Commission (50%)</p>
            <p className="text-7xl font-black mt-4">${commission.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-10 border border-purple-500/30">
          <h3 className="text-3xl font-bold mb-8">Your Clients</h3>
          <div className="space-y-6">
            {smbs.map((smb, i) => (
              <div key={i} className="bg-black/40 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{smb.business_name}</p>
                  <p className="text-lg opacity-80">Revenue: ${(smb.monthly_revenue_cents / 100).toLocaleString()}/mo</p>
                </div>
                <p className="text-3xl font-black text-emerald-400">
                  ${Math.round(smb.monthly_revenue_cents * 0.5).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl font-bold px-20 py-8 rounded-3xl hover:shadow-2xl transform hover:scale-105 transition">
            + Add New Client
          </button>
        </div>
      </div>
    </div>
  );
}