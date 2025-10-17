// ❌ DO NOT put "use server"; here
import * as admin from 'firebase-admin';

// This check ensures that Firebase is only initialized once.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Export the initialized admin services.
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
