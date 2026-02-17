'use client';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle } from "lucide-react";
import { useUser, useSupabase } from "@/hooks/use-supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image_url: string;
  image_hint: string;
}

const BlogPage = () => {
  const { isAdmin, isUserLoading } = useUser();
  const { supabase } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch blog posts.' });
      } else {
        setBlogPosts(data || []);
      }
      setIsPostsLoading(false);
    }
    fetchPosts();
  }, [supabase, toast]);

  const isLoading = isUserLoading || isPostsLoading;

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          The HopeEngineer Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights on AI, software engineering, productivity, and personal growth.
        </p>
      </header>

      {isAdmin && (
        <div className="mb-8 flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/blog/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <Card key={i} className="flex flex-col overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && blogPosts.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <h2 className="text-2xl font-semibold">No posts yet!</h2>
          <p className="mt-2">
            {isAdmin ? "Click 'Create Post' to add your first post." : "Check back soon for new content."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
            <Link href={`/blog/${post.slug}`} className="block">
              <Image
                src={post.image_url || 'https://picsum.photos/seed/default/600/400'}
                alt={post.title}
                width={600}
                height={400}
                className="aspect-video w-full object-cover"
                data-ai-hint={post.image_hint}
              />
            </Link>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
              <CardDescription>{post.date} by {post.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground line-clamp-3">
                {post.description}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/blog/${post.slug}`} className="w-full">
                <Button variant="secondary" className="w-full">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
