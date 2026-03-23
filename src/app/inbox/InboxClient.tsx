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

export default function InboxClient() {
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
      <div className="container max-w-4xl mx-auto py-32 px-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-32 px-4 sm:px-6 lg:px-8 relative z-10 glass-panel border-white/10 mt-20">
      <Card className="bg-transparent border-none shadow-none text-white">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-gradient-light">Secure Inbox</CardTitle>
          <CardDescription className="font-code text-white/50 tracking-wider">Messages from the contact form. A green dot indicates an unread message.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-white/5" />
              <Skeleton className="h-12 w-full bg-white/5" />
              <Skeleton className="h-12 w-full bg-white/5" />
            </div>
          )}
          {!isLoading && messages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
              {messages.map((msg) => (
                <AccordionItem key={msg.id} value={msg.id} className="border-b border-white/10">
                  <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors">
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="flex items-center gap-3">
                        {!msg.is_read && <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,170,0,0.8)]" />}
                        <div className="flex flex-col text-left">
                          <span className="font-semibold">{msg.name}</span>
                          <span className="text-sm font-code text-white/40">{msg.service}</span>
                        </div>
                      </div>
                      <span className="text-sm font-code text-white/40">
                        {msg.created_at ? formatDistanceToNow(new Date(msg.created_at)) : ''} ago
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 bg-black/20 p-4 rounded-lg mt-2">
                    <p className="text-sm text-primary font-code">From: {msg.email}</p>
                    <p className="whitespace-pre-wrap font-body text-white/80">{msg.message}</p>
                    <div className="flex justify-end pt-4 border-t border-white/5 mt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-900/40 text-red-200 hover:bg-red-900/80 border border-red-900/50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Erase Record
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass-panel border-white/10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline text-gradient-light">Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              This action permanently removes the transmission from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent text-white hover:bg-white/10 border-white/20">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-900/80 hover:bg-red-900" onClick={() => handleDelete(msg.id)}>
                              Confirm
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
            !isLoading && <p className="text-white/40 text-center font-code tracking-widest uppercase py-8">Inbox Empty.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
