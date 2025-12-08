import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import './globals.css';
import { Toaster } from 'sonner';
import { TOASTER_TEMPLATE } from '@/components/ui/toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
          <header className="flex justify-end items-center p-6 gap-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="underline">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100">
                  Get Started – $1,495
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>

          <main className="p-10">{children}</main>

          <Toaster position="top-center" richColors />
          {TOASTER_TEMPLATE}
        </body>
      </html>
    </ClerkProvider>
  );
}