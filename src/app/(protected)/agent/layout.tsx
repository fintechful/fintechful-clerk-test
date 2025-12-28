// src/app/(protected)/agent/layout.tsx
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import '../../globals.css';  // main CSS if needed
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
import ClientThemeToggle from '@/components/ClientThemeToggle';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <header className="flex justify-end items-center p-6 gap-6 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 text-white">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="underline hover:no-underline">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition">
                    Get Started – $1,495
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-4">
                  <ClientThemeToggle />
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </header>
            <main className="p-10">{children}</main>
            <Toaster position="top-center" richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}