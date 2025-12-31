"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

/**
 * Centralized guard for /auth routes
 * Redirects to /app/inbox if already authenticated
 * Never redirects while login is in progress
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { authReady, user, authInProgress } = useAuth();

  useEffect(() => {
    if (!authReady) return; // Wait for auth to be ready
    if (authInProgress) return; // Never redirect while login is in progress

    // Redirect ONLY when user exists and login is complete
    if (user) {
      router.replace("/app/inbox");
    }
  }, [authReady, user, authInProgress, router]);

  // Block rendering until authReady
  if (!authReady) {
    return null;
  }

  // Show nothing while redirecting (if authenticated)
  if (user) {
    return null;
  }

  // Render auth UI
  return <>{children}</>;
}
