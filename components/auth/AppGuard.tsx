"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

/**
 * Centralized guard for /app routes
 * Blocks rendering until authReady
 * Redirects to /auth if not authenticated (but not during login)
 */
export function AppGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { authReady, user, authInProgress } = useAuth();

  useEffect(() => {
    if (!authReady) return; // Wait for auth to be ready
    if (authInProgress) return; // Never redirect while login is in progress

    // Block app only when authReady AND no user AND login is not in progress
    if (!user) {
      router.replace("/auth");
    }
  }, [authReady, user, authInProgress, router]);

  // Block rendering until authReady
  if (!authReady) {
    return null;
  }

  // Show nothing while redirecting unauthenticated users (but not during login)
  if (!authInProgress && !user) {
    return null;
  }

  // Render children if authenticated or login is in progress
  return <>{children}</>;
}
