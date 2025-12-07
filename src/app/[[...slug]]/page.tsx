// src/app/[[...slug]]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export default function AgentSite() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const subdomain = parts.length > 2 ? parts[0].toLowerCase() : null;

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-6xl font-black mb-8">FinTechful Agent Network</h1>
          <p className="text-2xl">Visit any agent subdomain to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {profile.headshot_url && (
              <img src={profile.headshot_url} alt={profile.full_name} className="w-24 h-24 rounded-full object-cover border-4 border-purple-600" />
            )}
            <div>
              <h1 className="text-4xl font-bold">{profile.full_name}</h1>
              <p className="text-xl text-gray-600">Licensed Financial Partner</p>
            </div>
          </div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-12 text-center">
        <h2 className="text-5xl font-extrabold mb-8">
          Get Your Free Financial Review with {profile.full_name.split(' ')[0]}
        </h2>
        <p className="text-2xl mb-12">
          {profile.bio}
        </p>
        <a
          href="https://calendly.com/demo"
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-3xl font-bold px-16 py-8 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition"
        >
          Book Free Consultation →
        </a>
        {profile.phone && (
          <p className="mt-10 text-2xl">
            Or call directly: <strong>{profile.phone}</strong>
          </p>
        )}
      </main>
    </div>
  );
}