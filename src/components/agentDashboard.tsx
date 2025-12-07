// src/components/agentDashboard.tsx
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AgentDashboard() {
  const { user } = useUser();
  const [smbs, setSmbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;

      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      const subdomain = parts.length > 2 ? parts[0].toLowerCase() : '';

      if (!subdomain || subdomain === 'www' || hostname.includes('vercel.app')) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('smbs')
        .select('business_name, monthly_revenue_cents')
        .eq('agent_subdomain', subdomain);

      if (error) console.error('Supabase error:', error);
      else setSmbs(data || []);

      setLoading(false);
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-3xl">
        Loading...
      </div>
    );
  }

  const totalRevenue = smbs.reduce((sum, s) => sum + (s.monthly_revenue_cents || 0), 0);
  const commission = Math.round(totalRevenue * 0.5);
  const subdomain = window.location.hostname.split('.')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black/50 backdrop-blur border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-5xl font-bold mb-12 text-center">
          Welcome back, {subdomain}!
        </h2>

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
          {smbs.map((s, i) => (
            <div key={i} className="bg-black/40 rounded-2xl p-6 mb-4 flex justify-between items-center">
              <p className="text-2xl font-bold">{s.business_name}</p>
              <p className="text-3xl font-black text-emerald-400">
                ${Math.round(s.monthly_revenue_cents * 0.5).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}