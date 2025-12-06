// src/app/page.tsx
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8">
          FinTechful Agent Portal
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12">
          One dashboard. Unlimited SMB clients. 50% commissions on every fintech close.
        </p>

        <SignedOut>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <!-- <SignInButton mode="modal">
              <button className="text-lg underline hover:no-underline">Already have access? Sign in</button>
            </SignInButton> -->
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl px-10 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition">
                Join as Agent – $1,495 one-time + $295/mo
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col items-center gap-8">
            <UserButton afterSignOutUrl="/" />
            <a href="/dashboard" className="text-3xl font-bold text-purple-700 hover:text-purple-900">
              → Open Your Agent Dashboard
            </a>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}