// src/app/[[...slug]]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SignedIn } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import PublicAgentTemplate from '@/components/agent/PublicAgentTemplate'; // your new v0 template

export default function AgentSite() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRootDomain, setIsRootDomain] = useState(false);

  useEffect(() => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');


  // Detect root domain (fintechful.com, www, localhost, vercel)
    const rootDomain = hostname === 'fintechful.com' || 
                       hostname === 'www.fintechful.com' || 
                       hostname.includes('localhost') || 
                       hostname.includes('vercel.app');

    if (rootDomain) {
      setIsRootDomain(true);
      setLoading(false);
      return;
    }

  const subdomain = parts.length > 2 ? parts[0].toLowerCase() : null;

    if (!subdomain || subdomain === 'www') {
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

// Root domain — show main site homepage
  if (isRootDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-purple-900">FinTechful</h1>
          <p className="text-3xl font-medium text-purple-700 mb-12">Welcome to the future of agent-led embedded finance</p>
          <p className="text-xl">Visit any agent subdomain to see their personalized site</p>
          {/* Add your main site hero, CTA, etc. here */}
        </div>
      </div>
    );
  }

  // Valid agent subdomain
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