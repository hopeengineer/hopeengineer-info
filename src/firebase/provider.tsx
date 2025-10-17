'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

// --- CONSTANTS ---
// For demonstration purposes, we'll hardcode an admin email.
// In a real application, this would be managed via custom claims or a database role.
const ADMIN_EMAIL = 'csoft.sameera@gmail.com';


// --- INTERFACES & TYPES ---

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
}

// Return type for useUser()
export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  auth: Auth | null;
  isAdmin: boolean;
  firestore: Firestore | null;
  firebaseApp: FirebaseApp | null;
  storage: FirebaseStorage | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);


// --- PROVIDER COMPONENT ---

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  storage,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
    isAdmin: false,
  });

  useEffect(() => {
    if (!auth) {
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided."), isAdmin: false });
      return;
    }

    setUserAuthState(prev => ({ ...prev, isUserLoading: true }));

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        const isAdmin = firebaseUser?.email === ADMIN_EMAIL;
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null, isAdmin });
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error, isAdmin: false });
      }
    );
    return () => unsubscribe();
  }, [auth]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth && storage);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      storage: servicesAvailable ? storage : null,
      ...userAuthState,
    };
  }, [firebaseApp, firestore, auth, storage, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


// --- HOOKS ---

export const useFirebase = (): FirebaseServicesAndUser | {
  user: null;
  isUserLoading: boolean;
  userError: Error | null;
  isAdmin: boolean;
  firebaseApp: null;
  firestore: null;
  auth: null;
  storage: null;
} => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  
  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth || !context.storage) {
    // If services are not ready, return a state that reflects this for non-authenticated users.
    return {
      user: context.user,
      isUserLoading: context.isUserLoading,
      userError: context.userError,
      isAdmin: context.isAdmin,
      firebaseApp: null,
      firestore: null,
      auth: null,
      storage: null
    };
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    storage: context.storage,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    isAdmin: context.isAdmin,
  };
};

export const useAuth = (): Auth => {
  const context = useFirebase();
  if (!context.auth) {
    throw new Error('useAuth requires an authenticated user and must be used within a component that is guarded by an authentication check.');
  }
  return context.auth;
};

export const useFirestore = (): Firestore => {
  const context = useFirebase();
  if (!context.firestore) {
    throw new Error('useFirestore requires an authenticated user and must be used within a component that is guarded by an authentication check.');
  }
  return context.firestore;
};

export const useStorage = (): FirebaseStorage => {
    const context = useFirebase();
    if (!context.storage) {
        throw new Error('useStorage requires an authenticated user and must be used within a component that is guarded by an authentication check.');
    }
    return context.storage;
}

export const useFirebaseApp = (): FirebaseApp => {
  const context = useFirebase();
  if (!context.firebaseApp) {
      throw new Error('useFirebaseApp requires an authenticated user and must be used within a component that is guarded by an authentication check.');
  }
  return context.firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  
  // For useUser, it's okay for services to be null if the user is not logged in.
  return { 
    user: context.user, 
    isUserLoading: context.isUserLoading, 
    userError: context.userError, 
    auth: context.auth, 
    isAdmin: context.isAdmin,
    firestore: context.firestore,
    firebaseApp: context.firebaseApp,
    storage: context.storage,
  };
};
