'use client';

import { useRouter } from 'next/navigation';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  content: z.string().min(1, 'Content is required.'),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAdmin, isUserLoading } = useUser();
  const firestore = useFirestore();

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to create posts.' });
      router.push('/blog');
    }
  }, [isUserLoading, isAdmin, router, toast]);

  const onSubmit = (data: CreatePostForm) => {
    if (!firestore) return;

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/[\s-]+/g, '-');

    const newPost = {
      ...data,
      slug,
      author: 'HopeEngineer',
      date: format(new Date(), 'MMMM d, yyyy'),
      image: PlaceHolderImages.find(p => p.id === 'blog-4') || PlaceHolderImages[0],
    };

    const postsCollection = collection(firestore, 'blogPosts');
    addDocumentNonBlocking(postsCollection, newPost);

    toast({
      title: 'Post Created!',
      description: 'Your new post has been saved.',
    });
    router.push(`/blog/${slug}`);
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
          <CardTitle className="font-headline text-3xl">Create New Blog Post</CardTitle>
          <CardDescription>Fill out the details below to publish a new article.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your amazing post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A short and catchy summary" {...field} className="h-24" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="<p>Start writing your masterpiece here...</p>" {...field} className="h-64 font-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
