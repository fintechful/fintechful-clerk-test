// src/app/dashboard/page.tsx
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/nextjs';
import AgentDashboard from '@/components/AgentDashboard';

export default function DashboardPage() {
  return (
    <>
      <SignedIn>
        <AgentDashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}