// src/app/dashboard/page.tsx
import { UserButton, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
          <header className="flex justify-between items-center p-8 bg-white shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              Agent Dashboard
            </h1>
            <UserButton afterSignOutUrl="/" />
          </header>

          <main className="max-w-6xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
              <h2 className="text-5xl font-extrabold text-purple-600 mb-4">
                Welcome back, Agent!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                You are logged in and this page is 100% protected.
              </p>
              <div className="text-8xl">Success</div>
              <p className="mt-8 text-lg text-gray-600">
                Week 1 of the 12-week MVP is now <strong>fully complete</strong>.
              </p>
            </div>
          </main>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}