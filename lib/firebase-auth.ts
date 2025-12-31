/**
 * Firebase Authentication Helper
 * Handles getting Firebase ID tokens for API authentication
 */

import { getFirebaseAuth } from './firebase';

/**
 * Get Firebase ID token for the current user
 * Returns null if no user is signed in
 */
export async function getFirebaseIdToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const auth = await getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) return null;
    return await user.getIdToken();
  } catch (error) {
    console.error('Error in getFirebaseIdToken:', error);
    return null;
  }
}

/**
 * Sign in with Firebase using a custom token from NextAuth
 * This bridges NextAuth sessions to Firebase Auth
 */
export async function signInWithFirebaseCustomToken(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
      const auth = await getFirebaseAuth();

    // Get custom token from Next.js API route
    const response = await fetch('/api/firebase-token');
    if (!response.ok) {
      throw new Error('Failed to get Firebase token');
    }

    const { customToken } = await response.json();
    if (!customToken) {
      throw new Error('No custom token received');
    }

    // Sign in with the custom token
    const { signInWithCustomToken } = await import('firebase/auth');
    await signInWithCustomToken(auth, customToken);
  } catch (error) {
    console.error('Error signing in with Firebase custom token:', error);
    throw error;
  }
}
