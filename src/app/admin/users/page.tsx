
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type UserProfile = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  registrationDate: Timestamp;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, isUserLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to view this page.' });
      router.push('/');
    }
  }, [isUserLoading, isAdmin, router, toast]);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'PPP');
  };

  if (isUserLoading || !isAdmin) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Registered Users</CardTitle>
          <CardDescription>A list of all users who have signed up.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && users && (
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Admin Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName || ''} {user.lastName || ''}</TableCell>
                    <TableCell>{formatDate(user.registrationDate)}</TableCell>
                    <TableCell>
                      {user.email === 'csoft.sameera@gmail.com' && <Badge variant="destructive">Admin</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && !users?.length && <p className="text-muted-foreground text-center py-8">No users found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
