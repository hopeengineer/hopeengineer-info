'use client';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Download } from "lucide-react";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { blogPosts as hardcodedBlogPosts } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type BlogPost = {
    id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    image: {
      imageUrl: string;
      imageHint: string;
    };
}

const BlogPage = () => {
  const { isAdmin } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  
  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: blogPosts, isLoading } = useCollection<BlogPost>(postsQuery);

  const handleImportPosts = async () => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not available.",
      });
      return;
    }
    setIsImporting(true);

    try {
      const batch = writeBatch(firestore);
      const postsCollection = collection(firestore, "blogPosts");

      hardcodedBlogPosts.forEach(post => {
        // The document ID will be the slug to ensure uniqueness and clean URLs
        const docRef = doc(postsCollection, post.slug);
        const postData = {
          ...post,
          // content is already in the hardcoded data
        };
        batch.set(docRef, postData);
      });

      await batch.commit();
      
      toast({
        title: "Success!",
        description: `${hardcodedBlogPosts.length} posts have been imported to Firestore.`,
      });
    } catch (error: any) {
      console.error("Error importing posts: ", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "An unexpected error occurred while importing posts.",
      });
    } finally {
      setIsImporting(false);
    }
  };


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
          <Button variant="outline" disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
          <Button variant="outline" onClick={handleImportPosts} disabled={isImporting || (blogPosts && blogPosts.length > 0)}>
            <Download className="mr-2 h-4 w-4" />
            {isImporting ? "Importing..." : "Import Posts"}
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

      {!isLoading && blogPosts?.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <h2 className="text-2xl font-semibold">No posts yet!</h2>
          <p className="mt-2">
            {isAdmin ? "Click the 'Import Posts' button to add the initial blog posts." : "Check back soon for new content."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts?.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
            <Link href={`/blog/${post.slug}`} className="block">
              <Image
                src={post.image.imageUrl}
                alt={post.title}
                width={600}
                height={400}
                className="aspect-video w-full object-cover"
                data-ai-hint={post.image.imageHint}
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
