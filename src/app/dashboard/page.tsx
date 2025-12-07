// src/app/dashboard/page.tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import AgentDashboard from '@/components/agentDashboard';  // ← lowercase

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