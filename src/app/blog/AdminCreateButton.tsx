'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-supabase';

export function AdminCreateButton() {
  const { isAdmin, isUserLoading } = useUser();

  if (isUserLoading || !isAdmin) return null;

  return (
    <div className="flex justify-end mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button asChild className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 font-code tracking-widest uppercase shadow-[0_0_15px_rgba(255,170,0,0.2)]">
        <Link href="/blog/create">
          <Plus className="mr-2 h-4 w-4" /> Create Transmission
        </Link>
      </Button>
    </div>
  );
}
