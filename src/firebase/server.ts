import * as admin from 'firebase-admin';
import { firebaseConfig } from './config';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminSdks() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      ...firebaseConfig,
    });
  }

  return {
    app: admin.app(),
    firestore: admin.firestore(),
    auth: admin.auth(),
  };
}
