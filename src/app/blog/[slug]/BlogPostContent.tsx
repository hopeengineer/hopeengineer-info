
'use client';

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCollection, useUser, useMemoFirebase, publicFirestore } from "@/firebase";
import { doc, query, collection, where, limit, getDocs, writeBatch, Firestore } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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
import { useEffect } from "react";

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
    content: string;
}

export default function BlogPostContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();
  // We get isAdmin here, but we will not use isUserLoading for the main loading state
  const { user, isAdmin } = useUser();
  
  // ALWAYS use the public firestore instance for viewing posts.
  const firestore: Firestore = publicFirestore;

  // The query will be null until `slug` is available.
  const postQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, "blogPosts"), where("slug", "==", slug), limit(1));
  }, [firestore, slug]);
  
  // The loading state `isPostsLoading` is now the primary indicator.
  const { data: posts, isLoading: isPostsLoading } = useCollection<BlogPost>(postQuery);
  const post = posts?.[0];
  
  // This is the simplified, robust loading state. It's only true if the query is valid and we are fetching.
  const isLoading = !!postQuery && isPostsLoading;
  
  // A stable determination of notFound, only true after loading is complete and we still have no post.
  const isNotFound = !isLoading && !!postQuery && !post;

  useEffect(() => {
    // This effect will trigger the notFound() page only when `isNotFound` becomes stably true.
    if (isNotFound) {
      notFound();
    }
  }, [isNotFound]);
  
  const handleClearAllPosts = async () => {
    // This action still requires an authenticated admin.
    const { firestore: adminFirestore } = useUser();
    if (!user || !adminFirestore) {
        toast({variant: "destructive", title: "You must be logged in as an admin."});
        return;
    }

    toast({ title: "Clearing all posts..."});
    const allPostsQuery = collection(adminFirestore, 'blogPosts');
    const snapshot = await getDocs(allPostsQuery);
    const batch = writeBatch(adminFirestore);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    toast({ title: "All posts have been cleared.", description: "You can now re-import them from the blog page."});
    router.push("/blog");
  }

  // Show a skeleton if the query isn't ready yet, or if we are actively loading.
  if (isLoading || !postQuery) {
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
  
  // This condition now safely handles the case where a post genuinely doesn't exist.
  // The useEffect above will handle the actual 404 redirection.
  if (isNotFound) {
      // For an admin, we can show a special recovery UI. For others, the notFound() will take over.
      if (isAdmin) {
        return (
          <div className="container text-center py-20">
            <h1 className="text-3xl font-bold text-destructive mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested post does not exist or could not be loaded.</p>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">TEMPORARY: Clear All Blog Posts</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete ALL posts from the database. This is a temporary tool to fix import issues.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllPosts}>Yes, delete everything</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        );
      }
      // For non-admins, this will be a blank screen for a moment before the useEffect redirects to the 404 page.
      return null;
  }
  
  // We can only get here if isLoading is false and post exists.
  if (!post) {
      // This state should rarely be reached if the above logic is correct, but it's a safe fallback.
      return (
        <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-8 text-center">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
            </header>
            <Skeleton className="w-full aspect-video rounded-lg" />
        </div>
      );
  }

  const handleDelete = () => {
    // This action requires an authenticated admin firestore instance
    const { firestore: adminFirestore } = useUser();
    if (adminFirestore && post) {
      const postRef = doc(adminFirestore, 'blogPosts', post.id);
      deleteDocumentNonBlocking(postRef);
      toast({
        title: "Post deleted",
        description: `"${post.title}" has been successfully deleted.`,
      });
      router.push("/blog");
    }
  };

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
          src={post.image.imageUrl}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full rounded-lg object-cover aspect-video shadow-lg"
          data-ai-hint={post.image.imageHint}
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
                    "{post.title}".
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
