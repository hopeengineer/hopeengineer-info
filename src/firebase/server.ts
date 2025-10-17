'use server';
import * as admin from 'firebase-admin';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminSdks() {
  if (admin.apps.length === 0) {
    // When running in a managed environment like App Hosting,
    // initializeApp() can discover credentials and config automatically.
    admin.initializeApp();
  }

  return {
    app: admin.app(),
    firestore: admin.firestore(),
    auth: admin.auth(),
  };
}
