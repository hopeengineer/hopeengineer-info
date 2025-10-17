'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isUserLoading, auth, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
      router.push('/');
    }
  };

  if (isUserLoading || !user) {
    // Show a loading state while we check for the user
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

  // Display user information once loaded
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{user.email?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 pt-4">
            <CardTitle className="text-2xl font-headline">
              {user.displayName ?? 'Welcome!'}
            </CardTitle>
            {isAdmin && <Badge variant="destructive">Admin</Badge>}
          </div>
          <CardDescription>{user.email}</CardDescription>
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
