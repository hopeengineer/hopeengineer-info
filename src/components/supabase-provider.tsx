'use client';

/**
 * SupabaseProvider — creates the Supabase client and provides it via context.
 */

import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createClient as createSupabaseClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';
import { SupabaseContext, type SupabaseContextState } from '@/hooks/use-supabase';

// --- CONSTANTS ---
const ADMIN_EMAIL = 'csoft.sameera@gmail.com';

// --- Singleton ---
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
    if (supabaseInstance) return supabaseInstance;
    supabaseInstance = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    return supabaseInstance;
}

// --- PROVIDER ---

export function SupabaseProvider({ children }: { children: ReactNode }) {
    const [supabase] = useState(() => getSupabaseClient());
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsUserLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setIsUserLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    const contextValue = useMemo((): SupabaseContextState => {
        const isAdmin = user?.email === ADMIN_EMAIL;
        return {
            supabase,
            user,
            session,
            isUserLoading,
            isAdmin,
        };
    }, [supabase, user, session, isUserLoading]);

    return (
        <SupabaseContext.Provider value={contextValue}>
            {children}
        </SupabaseContext.Provider>
    );
}
