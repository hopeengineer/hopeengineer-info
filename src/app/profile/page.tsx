'use client';

import { useUser, useSupabase } from '@/hooks/use-supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isUserLoading, isAdmin } = useUser();
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || 'Welcome!';
  const avatarUrl = user.user_metadata?.avatar_url || '';
  const email = user.email || '';

  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{email?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 pt-4">
            <CardTitle className="text-2xl font-headline">
              {displayName}
            </CardTitle>
            {isAdmin && <Badge variant="destructive">Admin</Badge>}
          </div>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
