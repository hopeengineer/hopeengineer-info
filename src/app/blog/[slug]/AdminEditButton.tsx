'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-supabase';

export function AdminEditButton({ slug }: { slug: string }) {
  const { isAdmin, isUserLoading } = useUser();

  if (isUserLoading || !isAdmin) return null;

  return (
    <div className="animate-in fade-in duration-500">
      <Button asChild className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 font-code tracking-widest uppercase shadow-[0_0_15px_rgba(255,170,0,0.2)]">
        <Link href={`/blog/${slug}/edit`}>
          <Pencil className="mr-2 h-4 w-4" /> Edit Post
        </Link>
      </Button>
    </div>
  );
}
