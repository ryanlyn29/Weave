'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { api } from '@/lib/api-client';
import { useAuth } from '@/components/auth/AuthProvider';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authReady, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [useEmailPassword, setUseEmailPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authReady) return;
    
    if (user) {
      const next = searchParams.get('next') || '/app/inbox';
      router.replace(next);
    }
  }, [authReady, user, router, searchParams]);

  // Show loading while checking auth
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show nothing while redirecting (if authenticated)
  if (user) {
    return null;
  }

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const auth = getFirebaseAuth();
      
      if (isSignUp) {
        // Sign up flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        console.log('[Auth] Created user in Firebase:', firebaseUser.uid);

        // Update profile with name if provided
        if (name) {
          await updateProfile(firebaseUser, { displayName: name });
        }

        // Ensure user exists in backend database
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const backendUser = await api.getCurrentUser();
          if (backendUser) {
            console.log('[Auth] User found/created in backend:', backendUser.id);
          }
        } catch (err) {
          console.log('[Auth] Backend user will be created on first API call');
        }
      } else {
        // Sign in flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('[Auth] Signed in with email/password:', userCredential.user.uid);

        // Ensure user exists in backend database
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const backendUser = await api.getCurrentUser();
          if (backendUser) {
            console.log('[Auth] User found in backend:', backendUser.id);
          }
        } catch (err) {
          console.log('[Auth] Backend user will be created on first API call');
        }
      }

      // Wait for onAuthStateChanged to fire and update auth state
      await new Promise(resolve => setTimeout(resolve, 100));
      const next = searchParams.get('next') || '/app/inbox';
      router.replace(next);
    } catch (err: any) {
      console.error('[Auth] Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      // Force account chooser to appear
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      
      // Wait for popup to complete - DO NOT redirect before this resolves
      const userCredential = await signInWithPopup(auth, provider);
      console.log(`[Auth] ${isSignUp ? 'Signed up' : 'Signed in'} with Google:`, userCredential.user.uid);

      // Ensure user exists in backend database
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const backendUser = await api.getCurrentUser();
        if (backendUser) {
          console.log('[Auth] User found/created in backend:', backendUser.id);
        }
      } catch (err) {
        console.log('[Auth] Backend user will be created on first API call');
      }

      // Wait for onAuthStateChanged to fire and update auth state
      await new Promise(resolve => setTimeout(resolve, 100));
      const next = searchParams.get('next') || '/app/inbox';
      router.replace(next);
    } catch (err: any) {
      console.error('[Auth] Google auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError(`${isSignUp ? 'Sign up' : 'Sign in'} was cancelled.`);
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups and try again.');
      } else {
        setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'} with Google. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      const next = searchParams.get('next') || '/app/inbox';
      const result = await signIn('facebook', {
        callbackUrl: next,
        redirect: false,
      });
      
      if (result?.error) {
        setError(`Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`);
      } else if (result?.ok) {
        router.replace(next);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex">
        {/* Left side - Auth Information */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-4xl font-normal text-black mb-2">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-lg text-black/60">
                {isSignUp ? 'Start building with StorySprint today' : 'Sign in to continue to StorySprint'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {!useEmailPassword ? (
                <>
                  <Button
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full bg-white text-black border-2 border-gray-300 hover:bg-gray-50 rounded-2xl h-12 text-base font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : 'Continue with Google'}
                  </Button>

                  <Button
                    onClick={handleFacebookAuth}
                    disabled={isLoading}
                    className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] rounded-2xl h-12 text-base font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : 'Continue with Facebook'}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-black/60">Or</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setUseEmailPassword(true)}
                    variant="outline"
                    className="w-full rounded-2xl h-12 text-base font-medium"
                  >
                    {isSignUp ? 'Sign up with Email' : 'Sign in with Email'}
                  </Button>
                </>
              ) : (
                <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Your name"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="••••••••"
                    />
                    {isSignUp && (
                      <p className="text-xs text-black/60 mt-1">At least 6 characters</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white hover:bg-black/90 rounded-2xl h-12 text-base font-medium disabled:opacity-50"
                  >
                    {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Create account' : 'Sign in')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setUseEmailPassword(false)}
                    variant="ghost"
                    className="w-full rounded-2xl h-12 text-base font-medium"
                  >
                    Back to other options
                  </Button>
                </form>
              )}

              <div className="text-sm text-center text-black/60">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setIsSignUp(false);
                        setError('');
                        setEmail('');
                        setPassword('');
                        setName('');
                        setUseEmailPassword(false);
                      }}
                      className="text-black font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setIsSignUp(true);
                        setError('');
                        setEmail('');
                        setPassword('');
                        setName('');
                        setUseEmailPassword(false);
                      }}
                      className="text-black font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-xs text-black/60">
                By continuing, you agree to StorySprint's{' '}
                <Link href="#" className="underline">Terms of Service</Link> and{' '}
                <Link href="#" className="underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-amber-50 via-blue-50 to-orange-50">
          <div className="max-w-lg space-y-6">
            <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-amber-900/80 via-blue-400/60 to-red-500/80 p-12 backdrop-blur min-h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-700/40 via-blue-500/50 via-50% to-orange-600/60 blur-3xl" />
              
              <div className="relative z-10 text-center space-y-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
                  <h2 className="text-2xl font-normal text-black mb-4">
                    {isSignUp ? 'Join thousands of creators' : 'Start creating with AI'}
                  </h2>
                  <p className="text-black/60 leading-relaxed">
                    {isSignUp 
                      ? 'Build prototypes faster with AI-powered code generation and voice commands.'
                      : 'Generate prototypes with voice commands, review with swipe gestures, and deploy to GitHub instantly.'
                    }
                  </p>
                  {isSignUp && (
                    <div className="flex items-center justify-center gap-2 text-sm text-black/60 mt-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No credit card required</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
