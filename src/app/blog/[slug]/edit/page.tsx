'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, query, collection, where, limit, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const editPostSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  content: z.string().min(1, 'Content is required.'),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type EditPostForm = z.infer<typeof editPostSchema>;

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description:string;
  content: string;
  image: {
    imageUrl: string;
    imageHint: string;
  };
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();
  const { user, isAdmin, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The query will be null until `firestore` and `slug` are available.
  const postQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'blogPosts'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  // isPostLoading will be false initially, and then true when the query is valid and fetching starts.
  const { data: posts, isLoading: isPostLoading } = useCollection<BlogPost>(postQuery);
  const post = posts?.[0];
  
  const form = useForm<EditPostForm>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        description: post.description,
        content: post.content,
        imageUrl: post.image?.imageUrl || '',
      });
    }
  }, [post, form]);

  useEffect(() => {
    // Wait for auth check to complete before making decisions
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to edit this page.' });
      router.push(`/blog/${slug}`);
    }
  }, [isUserLoading, isAdmin, router, slug, toast]);

  const onSubmit = async (data: EditPostForm) => {
    if (!firestore || !post) return;
    setIsSubmitting(true);

    try {
        const postRef = doc(firestore, 'blogPosts', post.id);
        const updatedData = {
            title: data.title,
            description: data.description,
            content: data.content,
            updatedAt: serverTimestamp(),
            image: {
                imageUrl: data.imageUrl || post.image?.imageUrl,
                imageHint: data.imageUrl ? 'custom url' : post.image?.imageHint,
            }
        };

        await updateDoc(postRef, updatedData);

        toast({
        title: 'Post Updated!',
        description: 'Your changes have been saved successfully.',
        });
        router.push(`/blog/${slug}`);
        
    } catch (error) {
        console.error("Error updating post:", error);
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Could not update the post.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // Overall loading state is true if we are waiting for the user OR the query is valid and we're fetching the post.
  const isLoading = isUserLoading || (!!postQuery && isPostLoading);
  
  // Condition for not found: query is valid, loading is finished, and we still have no post.
  const isNotFound = !isLoading && !!postQuery && !post;

  if (isNotFound) {
    notFound();
    return null; // notFound() throws an error, but this makes it explicit.
  }

  // Show skeleton while loading or if the query isn't ready yet.
  if (isLoading || !postQuery) {
    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
        </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Edit Blog Post</CardTitle>
          <CardDescription>Make changes to your post below. Your slug cannot be changed.</CardDescription>
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
                      <Input {...field} />
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
                      <Textarea {...field} className="h-24" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                     {post?.image && (
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Current Image:</p>
                            <img src={post.image.imageUrl} alt="Current featured image" className="w-48 h-auto rounded-md border" />
                        </div>
                     )}
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/your-image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Enter a new URL to replace the current image.</FormDescription>
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
                      <Textarea {...field} className="h-64 font-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
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
