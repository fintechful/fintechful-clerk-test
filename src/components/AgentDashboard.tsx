// src/components/AgentDashboard.tsx
'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AgentDashboard() {
  const { user } = useUser();
  const [smbs, setSmbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const hostname = window.location.hostname;
      const subdomain = hostname.split('.')[0].toLowerCase();

      if (!subdomain || subdomain === 'www' || hostname.includes('vercel.app')) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('smbs')
        .select('business_name, monthly_revenue_cents')
        .eq('agent_subdomain', subdomain);

      setSmbs(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-3xl">Loading...</div>;

  const total = smbs.reduce((s, c) => s + (c.monthly_revenue_cents || 0), 0);
  const commission = Math.round(total * 0.5);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Agent Dashboard
        </h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="bg-purple-700 p-8 rounded-3xl text-center">
          <p className="text-xl">Clients</p>
          <p className="text-6xl font-black">{smbs.length}</p>
        </div>
        <div className="bg-pink-700 p-8 rounded-3xl text-center">
          <p className="text-xl">Revenue</p>
          <p className="text-6xl font-black">${(total/100).toLocaleString()}</p>
        </div>
        <div className="bg-emerald-700 p-8 rounded-3xl text-center">
          <p className="text-xl">Your Commission</p>
          <p className="text-6xl font-black">${commission.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6">Your Clients</h2>
        {smbs.map((s, i) => (
          <div key={i} className="bg-black/30 p-6 rounded-xl mb-4 flex justify-between">
            <p className="text-2xl">{s.business_name}</p>
            <p className="text-2xl font-bold text-emerald-400">
              ${Math.round(s.monthly_revenue_cents * 0.5).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}