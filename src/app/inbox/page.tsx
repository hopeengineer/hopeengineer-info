
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  isRead?: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function InboxPage() {
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

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contacts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);
  
  const handleAccordionChange = (value: string) => {
    // Value is the ID of the opened message
    if (value && firestore) {
      const message = messages?.find(m => m.id === value);
      // Only update if it's not already marked as read
      if (message && !message.isRead) {
        const messageRef = doc(firestore, 'contacts', value);
        updateDoc(messageRef, { isRead: true }).catch(err => {
            console.error("Failed to mark message as read:", err);
            // Optionally, show a toast notification for failure
        });
      }
    }
  };


  if (isUserLoading || !isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Inbox</CardTitle>
          <CardDescription>Messages from the contact form. Unread messages are bold.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          )}
          {!isLoading && messages && messages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
              {messages.map((msg) => (
                <AccordionItem key={msg.id} value={msg.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                        <div className="flex flex-col text-left">
                            <span className={cn("font-semibold", !msg.isRead && "font-bold")}>{msg.name}</span>
                            <span className="text-sm text-muted-foreground">{msg.service}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt.seconds * 1000)) : ''} ago
                        </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">From: {msg.email}</p>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            !isLoading && <p className="text-muted-foreground text-center">Your inbox is empty.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
