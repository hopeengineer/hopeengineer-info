'use client';

/**
 * Supabase context and hooks.
 * 
 * IMPORTANT: This file does NOT import @supabase/supabase-js directly.
 * It only defines the React context and hooks. The actual Supabase client
 * is created in supabase-provider.tsx and injected via context.
 * 
 * This separation is crucial for Node.js 25+ compatibility, where
 * globalThis.localStorage throws a SecurityError during module evaluation.
 * Pages can safely import these hooks without triggering SSR errors.
 */

import { createContext, useContext } from 'react';

// Re-export the context and hooks that pages use.
// The actual SupabaseClient type is 'any' here to avoid importing @supabase/supabase-js.

export interface SupabaseContextState {
    supabase: any;
    user: any;
    session: any;
    isUserLoading: boolean;
    isAdmin: boolean;
}

export const SupabaseContext = createContext<SupabaseContextState | undefined>(undefined);

export function useSupabase(): SupabaseContextState {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider.');
    }
    return context;
}

export function useUser() {
    const context = useSupabase();
    return {
        user: context.user,
        isUserLoading: context.isUserLoading,
        isAdmin: context.isAdmin,
        supabase: context.supabase,
    };
}

export function useAuth() {
    const context = useSupabase();
    return context.supabase.auth;
}
