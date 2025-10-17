import * as admin from 'firebase-admin';
import { GoogleAuth } from 'google-auth-library';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminSdks() {
  if (admin.apps.length === 0) {
    // When running in a managed environment, we can use application default credentials.
    // However, to make this robust across all environments, we explicitly create credentials.
    const auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/datastore',
        'https://www.googleapis.com/auth/devstorage.full_control',
        'https://www.googleapis.com/auth/firebase',
        'https://www.googleapis.com/auth/identitytoolkit',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });

    const credential = admin.credential.applicationDefault();
    
    admin.initializeApp({
      credential,
    });
  }

  return {
    app: admin.app(),
    firestore: admin.firestore(),
    auth: admin.auth(),
  };
}
