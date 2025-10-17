'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const apps = getApps();
  const defaultApp = apps.find(app => app.name === '[DEFAULT]');

  if (!defaultApp) {
    // If no default app is initialized, create one using the configuration object.
    // This is the most reliable way to ensure an app exists.
    initializeApp(firebaseConfig);
  }

  // Now that we're sure an app exists, we can safely get it and return the SDKs.
  return getSdks(getApp());
}

// --- CORRECTED PUBLIC INSTANCE INITIALIZATION ---
// This robust check ensures the public app is initialized correctly on the client.
const getPublicApp = () => {
    const apps = getApps();
    const publicApp = apps.find(app => app.name === 'publicApp');
    return publicApp ? publicApp : initializeApp(firebaseConfig, 'publicApp');
}

// Public read-only instance for logged-out users
export const publicFirestore = getFirestore(getPublicApp());


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
