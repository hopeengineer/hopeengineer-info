'use server';

import * as admin from 'firebase-admin';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminSdks() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  return {
    app: admin.app(),
    firestore: admin.firestore(),
    auth: admin.auth(),
  };
}
