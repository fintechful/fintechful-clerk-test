// src/app/[[...slug]]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SignedIn } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import PublicAgentTemplate from '@/components/agent/PublicAgentTemplate'; // your new v0 template

export default function AgentSite() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const hostname = window.location.hostname;
  let subdomain = null;

  if (hostname.includes('localhost')) {
    // Local testing: allow jane.localhost:3000
    subdomain = hostname.split('.')[0];
    if (subdomain === 'localhost') subdomain = null; // avoid root localhost
  } else {
    const parts = hostname.split('.');
    subdomain = parts.length > 2 ? parts[0].toLowerCase() : null;
  }

  if (!subdomain || subdomain === 'www' || hostname.includes('vercel.app')) {
    setLoading(false);
    return;
  }
    supabase
      .from('profiles')
      .select('*')
      .eq('subdomain', subdomain)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-gray-900 text-2xl">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">FinTechful</h1>
          <p className="text-2xl">Agent not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PublicAgentTemplate profile={profile} />

      {/* Optional private dashboard link for signed-in agents */}
      <SignedIn>
        <div className="text-center py-8 bg-gray-100">
          <a href="/agent/dashboard" className="text-teal-600 text-lg underline hover:text-teal-700">
            → Go to your private Agent Dashboard
          </a>
        </div>
      </SignedIn>
    </>
  );
}