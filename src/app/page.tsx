// src/app/page.tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header moved to layout.tsx — keep it empty here */}
      
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-8 -mt-20">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
          FinTechful Agent Portal
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-12">
          Multi-tenant Clerk auth is now 100% working.<br />
          Week 1 of the 12-week MVP is officially complete.
        </p>

        <SignedOut>
          <div className="flex gap-6">
            <SignInButton mode="modal">
              <button className="text-lg underline hover:no-underline">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-white text-purple-600 font-bold text-lg px-8 py-4 rounded-full hover:bg-gray-100 shadow-lg transition">
                Get Started – $1,495
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col items-center gap-6">
            <UserButton afterSignOutUrl="/" />
            <a
              href="/dashboard"
              className="text-2xl font-semibold text-purple-700 hover:text-purple-900 underline"
            >
              Go to Agent Dashboard →
            </a>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}