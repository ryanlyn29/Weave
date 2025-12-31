"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthContextType {
  authReady: boolean;
  user: User | null;
  authInProgress: boolean;
  setAuthInProgress: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  authReady: false,
  user: null,
  authInProgress: false,
  setAuthInProgress: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);
  const listenerRegistered = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Debug: log provider mount
    console.log("[AuthProvider] Mounted");
    mountedRef.current = true;

    // Prevent duplicate listeners on fast refresh
    if (listenerRegistered.current) {
      console.log("[AuthProvider] Listener already registered, skipping");
      return;
    }

    let unsub: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        
        // Debug: verify auth instance
        console.log("[AuthProvider] Using auth instance:", auth.app.name);
        console.log("[AuthProvider] Current user before listener:", auth.currentUser?.uid ?? null);
        
        // Handle redirect result ONCE on client boot
        try {
          const result = await getRedirectResult(auth);
          if (result?.user) {
            console.log("[Auth] Redirect result found:", result.user.uid);
            setAuthInProgress(true); // Set during redirect handling
          }
        } catch (err) {
          // No redirect result, that's fine
        }

        // Register listener ONCE - NO routing logic here
        unsub = onAuthStateChanged(auth, (firebaseUser) => {
          if (!mountedRef.current) {
            console.log("[AuthProvider] Ignoring callback after unmount");
            return;
          }

          console.log("[Auth] onAuthStateChanged fired:", firebaseUser?.uid ?? null);
          
          if (firebaseUser) {
            console.log("[Auth] User authenticated:", firebaseUser.uid);
          } else {
            console.log("[Auth] User not authenticated");
          }
          
          setUser(firebaseUser);
          setAuthReady(true);
          // Clear authInProgress ONLY after auth resolves
          setAuthInProgress(false);
          console.log("[Auth] authInProgress = false");
        });

        listenerRegistered.current = true;
        console.log("[AuthProvider] Listener registered");
      } catch (error) {
        console.error("[Auth] Failed to initialize auth:", error);
        setAuthReady(true); // Set ready even on error to prevent infinite loading
        setAuthInProgress(false);
      }
    };

    initAuth();

    return () => {
      console.log("[AuthProvider] Unmounting");
      mountedRef.current = false;
      if (unsub) {
        unsub();
      }
    };
  }, []); // Empty deps - run once only

  // Expose user, authReady, and authInProgress - NO routing logic
  return (
    <AuthContext.Provider value={{ authReady, user, authInProgress, setAuthInProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
