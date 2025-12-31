import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

/**
 * GET /api/firebase-token
 * Creates a Firebase custom token from NextAuth session
 * This allows clients to sign in to Firebase Auth using NextAuth credentials
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Firebase Admin SDK
    let admin;
    try {
      admin = require('firebase-admin');
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || `${process.env.FIREBASE_PROJECT_ID}@appspot.gserviceaccount.com`,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
          }),
        });
      }
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 500 });
    }

    // Create a Firebase custom token using the user's ID from NextAuth
    // Use email as UID if ID is not available (for consistency with backend)
    const uid = (session.user as any).id || session.user.email;
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const customToken = await admin.auth().createCustomToken(uid, {
      email: session.user.email,
      name: session.user.name,
    });

    return NextResponse.json({ customToken });
  } catch (error: any) {
    console.error('Error creating Firebase token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Firebase token' },
      { status: 500 }
    );
  }
}
