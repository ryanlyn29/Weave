"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export function useAuthReady() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        unsub = onAuthStateChanged(auth, (user) => {
          console.log("[Auth] onAuthStateChanged fired:", user?.uid ?? null);
          setUser(user);
          setReady(true);
          if (user) {
            console.log("[Auth] User authenticated");
          } else {
            console.log("[Auth] User not authenticated");
          }
        });
      } catch (error) {
        console.error('[useAuthReady] Failed to initialize:', error);
        setReady(true); // Set ready even on error
      }
    };

    initAuth();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return { 
    ready, 
    user,
    // Aliases for compatibility
    authReady: ready,
    isReady: ready,
    isAuthenticated: !!user
  };
}
