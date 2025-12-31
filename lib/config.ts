/**
 * Centralized configuration management
 * Handles environment variables and validation
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  sse: {
    // Feature flag: Set to true when backend SSE endpoint is ready
    // Can be controlled via environment variable: NEXT_PUBLIC_SSE_ENABLED=true
    enabled: process.env.NEXT_PUBLIC_SSE_ENABLED === 'true' || false,
  },
};

/**
 * Check if Firebase configuration is complete
 */
export function isFirebaseConfigValid(): boolean {
  return !!(
    config.firebase.apiKey &&
    config.firebase.authDomain &&
    config.firebase.projectId &&
    config.firebase.appId
  );
}

/**
 * Check if API base URL is configured
 */
export function isApiConfigValid(): boolean {
  return !!config.api.baseUrl;
}
