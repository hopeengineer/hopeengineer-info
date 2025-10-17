'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // If no app is initialized, create one using the configuration object.
    // This is the most reliable way to ensure an app exists, especially in development.
    initializeApp(firebaseConfig);
  }

  // Now that we're sure an app exists, we can safely get it and return the SDKs.
  return getSdks(getApp());
}

// Public read-only instance for logged-out users
const publicApp = initializeApp(firebaseConfig, 'publicApp');
export const publicFirestore = getFirestore(publicApp);

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
