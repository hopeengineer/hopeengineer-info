// ❌ DO NOT put "use server"; here
import * as admin from 'firebase-admin';

// This check ensures that Firebase is only initialized once.
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // If the service account key is provided as an environment variable, use it.
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Otherwise, use application default credentials.
    // This is useful for managed environments like App Hosting.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

// Export the initialized admin services.
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
