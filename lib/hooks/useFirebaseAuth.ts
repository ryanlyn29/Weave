'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithFirebaseCustomToken } from '@/lib/firebase-auth';
import { onAuthStateChanged, User } from 'firebase/auth';

/**
 * Hook to sync Firebase Auth with NextAuth session
 * This ensures Firebase Auth is initialized when user is signed in via NextAuth
 */
export function useFirebaseAuth() {
  const { data: session, status } = useSession();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        setLoading(false);
        unsub = onAuthStateChanged(auth, (user) => {
          setFirebaseUser(user);
        });
      } catch (error) {
        console.error('[useFirebaseAuth] Failed to initialize:', error);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  useEffect(() => {
    async function syncAuth() {
      // Only sync if NextAuth session exists but Firebase user doesn't
      if (status === 'authenticated' && session && !firebaseUser && !isSyncing) {
        setIsSyncing(true);
        try {
          await signInWithFirebaseCustomToken();
        } catch (error) {
          console.error('Failed to sync Firebase Auth:', error);
          // Continue without Firebase Auth - API calls will fail gracefully
        } finally {
          setIsSyncing(false);
        }
      }

      // Sign out of Firebase if NextAuth session is gone
      if (status === 'unauthenticated' && firebaseUser) {
        try {
          const auth = await getFirebaseAuth();
          await auth.signOut();
        } catch (error) {
          console.error('Failed to sign out of Firebase:', error);
        }
      }
    }

    if (status !== 'loading') {
      syncAuth();
    }
  }, [session, status, firebaseUser, isSyncing]);

  return { firebaseUser, isSyncing, loading };
}
