
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useSupabase } from '@/hooks/use-supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function InboxPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, isUserLoading } = useUser();
  const { supabase } = useSupabase();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to view this page.' });
      router.push('/');
    }
  }, [isUserLoading, isAdmin, router, toast]);

  useEffect(() => {
    if (!isAdmin) return;

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data);
      }
      setIsLoading(false);
    }
    fetchMessages();
  }, [supabase, isAdmin]);

  const handleAccordionChange = async (value: string) => {
    if (value) {
      const message = messages.find(m => m.id === value);
      if (message && !message.is_read) {
        const { error } = await supabase
          .from('contacts')
          .update({ is_read: true })
          .eq('id', value);

        if (!error) {
          setMessages(prev => prev.map(m => m.id === value ? { ...m, is_read: true } : m));
        }
      }
    }
  };

  const handleDelete = async (messageId: string) => {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', messageId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the message.',
      });
    } else {
      setMessages(prev => prev.filter(m => m.id !== messageId));
      toast({
        title: 'Message Deleted',
        description: 'The message has been permanently removed.',
      });
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
          <CardDescription>Messages from the contact form. A green dot indicates an unread message.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {!isLoading && messages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
              {messages.map((msg) => (
                <AccordionItem key={msg.id} value={msg.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="flex items-center gap-3">
                        {!msg.is_read && <div className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                        <div className="flex flex-col text-left">
                          <span className="font-semibold">{msg.name}</span>
                          <span className="text-sm text-muted-foreground">{msg.service}</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {msg.created_at ? formatDistanceToNow(new Date(msg.created_at)) : ''} ago
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">From: {msg.email}</p>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex justify-end pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this message.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(msg.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
