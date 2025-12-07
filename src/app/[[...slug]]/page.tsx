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

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-2xl">Loading...</div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8">FinTechful</h1>
          <p className="text-2xl">Agent Network — Visit any subdomain</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Header */}
      <header className="relative h-96 bg-gradient-to-br from-purple-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-6xl mx-auto px-8 h-full flex items-center">
          <div className="flex items-center gap-10">
            {profile.headshot_url && (
              <img
                src={profile.headshot_url}
                alt={profile.full_name}
                className="w-48 h-48 rounded-full object-cover border-8 border-white shadow-2xl"
              />
            )}
            <div>
              <h1 className="text-5xl md:text-7xl font-black mb-4">
                {profile.full_name}
              </h1>
              <p className="text-2xl opacity-90">Licensed Financial Partner</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main CTA Section */}
      <main className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-10">
          Ready to Grow Your Business?
        </h2>
        <p className="text-2xl mb-12 leading-relaxed">
          Work with {profile.full_name.split(' ')[0]} to unlock funding, build business credit,
          and scale faster than ever.
        </p>

        <a
          href="https://calendly.com/demo"
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white text-3xl font-black px-20 py-8 rounded-3xl hover:shadow-2xl transform hover:scale-105 transition duration-300"
        >
          Book Your Free Strategy Call
        </a>

        {profile.phone && (
          <p className="mt-12 text-2xl">
            Or call now: <strong className="text-pink-400">{profile.phone}</strong>
          </p>
        )}
      </main>

      {/* Private Dashboard Link */}
      <SignedIn>
        <div className="text-center py-12">
          <a href="/dashboard" className="text-pink-400 text-xl underline hover:text-pink-300">
            → Agent Dashboard (private)
          </a>
        </div>
      </SignedIn>
    </div>
  );
}