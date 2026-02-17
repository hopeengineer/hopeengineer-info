'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useSupabase } from '@/hooks/use-supabase';
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
  description: string;
  content: string;
  image_url: string;
  image_hint: string;
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();
  const { isAdmin, isUserLoading } = useUser();
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);

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
    if (!slug) return;

    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setPost(data);
        form.reset({
          title: data.title,
          description: data.description,
          content: data.content,
          imageUrl: data.image_url || '',
        });
      }
      setIsPostLoading(false);
    }
    fetchPost();
  }, [slug, supabase, form]);

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to edit this page.' });
      router.push(`/blog/${slug}`);
    }
  }, [isUserLoading, isAdmin, router, slug, toast]);

  const onSubmit = async (data: EditPostForm) => {
    if (!post) return;
    setIsSubmitting(true);

    try {
      const updatedData = {
        title: data.title,
        description: data.description,
        content: data.content,
        updated_at: new Date().toISOString(),
        image_url: data.imageUrl || post.image_url,
        image_hint: data.imageUrl ? 'custom url' : post.image_hint,
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(updatedData)
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: 'Post Updated!',
        description: 'Your changes have been saved successfully.',
      });
      router.push(`/blog/${slug}`);
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Could not update the post.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isUserLoading || isPostLoading;

  if (!isLoading && !post) {
    notFound();
    return null;
  }

  if (isLoading) {
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
                    {post?.image_url && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Current Image:</p>
                        <Image src={post.image_url} alt="Current featured image" width={192} height={108} className="w-48 h-auto rounded-md border" />
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
