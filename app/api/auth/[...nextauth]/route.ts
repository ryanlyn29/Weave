import NextAuth, { NextAuthOptions } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let firestore;
try {
  if (!require('firebase-admin').apps.length) {
    const admin = require('firebase-admin');
    admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || `${process.env.FIREBASE_PROJECT_ID}@appspot.gserviceaccount.com`,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      }),
    });
    firestore = getFirestore();
  } else {
    firestore = getFirestore();
  }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    firestore = null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  adapter: firestore ? FirestoreAdapter(firestore) : undefined,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

