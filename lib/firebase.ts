"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Strict singleton pattern - these are module-level variables
let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let persistenceInitialized = false;

function isFirebaseConfigValid(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

/**
 * Get Firebase App instance (singleton)
 * Ensures initializeApp is called exactly once
 */
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    if (!isFirebaseConfigValid()) {
      throw new Error('Firebase configuration is missing. Please check your environment variables.');
    }
    
    const existingApps = getApps();
    console.log("[Firebase] Existing apps count:", existingApps.length);
    
    if (existingApps.length > 0) {
      firebaseApp = getApp();
      console.log("[Firebase] Using existing app:", firebaseApp.name);
    } else {
      firebaseApp = initializeApp(firebaseConfig);
      console.log("[Firebase] App initialized successfully:", firebaseApp.name);
    }
    
    // Debug: verify singleton
    console.log("[Firebase] Total apps after init:", getApps().length);
  }
  
  return firebaseApp;
}

/**
 * Get Firebase Auth instance (singleton)
 * Ensures getAuth is called exactly once
 * Sets browserLocalPersistence ONCE
 */
export async function getFirebaseAuth(): Promise<Auth> {
  if (typeof window === 'undefined') {
    throw new Error('getFirebaseAuth can only be called on the client side');
  }
  
  if (!firebaseAuth) {
    const app = getFirebaseApp();
    firebaseAuth = getAuth(app);
    console.log("[Firebase] Auth instance created for app:", app.name);
    console.log("[Firebase] Auth instance ID:", firebaseAuth.app.name);
  }
  
  // Set persistence ONCE - await it to ensure it's applied
  if (!persistenceInitialized) {
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      persistenceInitialized = true;
      console.log("[Firebase] Auth persistence set to browserLocalPersistence");
    } catch (error) {
      console.error("[Firebase] Failed to set auth persistence:", error);
      throw error;
    }
  }
  
  return firebaseAuth;
}

/**
 * Get Firebase configuration error (if any)
 * Used by FirebaseConfigError component
 */
export function getFirebaseError(): Error | null {
  if (!isFirebaseConfigValid()) {
    return new Error('Firebase configuration is missing. Please check your environment variables.');
  }
  return null;
}
