// src/app/[[...slug]]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function SubdomainPage() {
  const [subdomain, setSubdomain] = useState<string>('');

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const extracted = parts.length > 2 ? parts[0].toLowerCase() : '';
    setSubdomain(extracted);
  }, []);

  const isMainDomain =
    !subdomain ||
    subdomain === 'www' ||
    subdomain === 'fintechful' ||
    subdomain === 'localhost' ||
    window.location.hostname.includes('vercel.app');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="flex justify-between items-center p-8 bg-white shadow-sm">
        <h1 className="text-3xl font-black text-purple-700">
          {isMainDomain ? 'FinTechful Agent Portal' : `${subdomain.toUpperCase()}'s Agency`}
        </h1>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      <main className="max-w-4xl mx-auto p-12 text-center">
        {isMainDomain ? (
          <>
            <h2 className="text-5xl font-bold mb-8">Main Site Active</h2>
            <p className="text-2xl">Visit any subdomain → it personalizes instantly</p>
          </>
        ) : (
          <>
            <h2 className="text-6xl font-extrabold text-purple-600 mb-8">
              Welcome back, {subdomain.charAt(0).toUpperCase() + subdomain.slice(1)}!
            </h2>
            <p className="text-2xl mb-12">
              Your personal agent portal is live at<br />
              <code className="text-3xl bg-gray-100 px-4 py-2 rounded">
                {subdomain}.fintechful.com
              </code>
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-2xl font-bold px-12 py-6 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition"
            >
              Open Your Dashboard →
            </a>
          </>
        )}
      </main>
    </div>
  );
}