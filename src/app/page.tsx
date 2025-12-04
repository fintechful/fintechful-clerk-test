import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <header className="flex justify-end items-center p-6 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <SignedOut>
          <a href="/sign-in" className="mr-4 underline">
            Sign In
          </a>
          <a
            href="/sign-up"
            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Get Started – $1,495
          </a>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
          FinTechful Agent Portal
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl">
          Multi-tenant auth is working. You are one deploy away from MVP Week 1 complete.
        </p>
      </main>
    </div>
  );
}
