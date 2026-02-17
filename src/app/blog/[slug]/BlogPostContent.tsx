
'use client';

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useUser, useSupabase } from "@/hooks/use-supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
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
import Link from "next/link";
import { useEffect, useState } from "react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image_url: string;
  image_hint: string;
  content: string;
}

export default function BlogPostContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();
  const { isAdmin } = useUser();
  const { supabase } = useSupabase();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setIsLoading(false);
        return;
      }

      setPost(data);
      setIsLoading(false);
    }
    fetchPost();
  }, [slug, supabase]);

  const handleDelete = async () => {
    if (!post) return;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the post.' });
    } else {
      toast({
        title: "Post deleted",
        description: `"${post.title}" has been successfully deleted.`,
      });
      router.push("/blog");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
          <Skeleton className="h-4 w-1/3 mx-auto mt-6" />
        </header>
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
    return null;
  }

  return (
    <article className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-6 flex justify-center items-center space-x-4 text-sm text-muted-foreground">
          <span>By {post.author}</span>
          <span>&bull;</span>
          <span>{post.date}</span>
        </div>
      </header>

      <div className="my-8">
        <Image
          src={post.image_url || 'https://picsum.photos/seed/default/1200/675'}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full rounded-lg object-cover aspect-video shadow-lg"
          data-ai-hint={post.image_hint}
        />
      </div>

      <div
        className="prose prose-invert prose-lg max-w-none mx-auto space-y-6 text-foreground/80"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {isAdmin && (
        <div className="mt-12 flex justify-end gap-4 border-t pt-8">
          <Button variant="outline" asChild>
            <Link href={`/blog/${post.slug}/edit`}>Edit</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the blog post
                  &quot;{post.title}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </article>
  );
}
