// src/components/admin/AdminDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAgents() {
      console.log('Fetching agents...');
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'agent');

      console.log('Raw data from Supabase:', data);
      console.log('Error:', error);
      console.log('Total count:', count);

      if (error) {
        alert('Error: ' + error.message);
      } else if (!data || data.length === 0) {
        alert('No agents found — check if anyone has role = "agent"');
      }

      setAgents(data || []);
      setLoading(false);
    }

    fetchAgents();
  }, []);

  if (loading) return <div className="p-8 text-2xl">Loading agents...</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Super Admin Dashboard</h1>
      <p className="text-xl mb-4">Found {agents.length} agent(s):</p>
      <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-auto text-sm">
        {JSON.stringify(agents, null, 2)}
      </pre>
    </div>
  );
}