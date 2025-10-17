'use client';

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useCollection, useFirestore, useUser, useMemoFirebase, publicFirestore } from "@/firebase";
import { doc, query, collection, where, limit, getDocs, writeBatch } from "firebase/firestore";
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
import { useRouter } from "next/navigation";

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

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();
  const { user, isAdmin, isUserLoading } = useUser();
  const loggedInFirestore = useFirestore();

  const firestore = user ? loggedInFirestore : publicFirestore;

  const postQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, "blogPosts"), where("slug", "==", slug), limit(1));
  }, [firestore, slug]);

  const { data: posts, isLoading: isPostsLoading } = useCollection<BlogPost>(postQuery);
  const post = posts?.[0];

  const isLoading = isUserLoading || isPostsLoading;
  
  const isNotFound = !isLoading && !!postQuery && !post;

  const handleClearAllPosts = async () => {
    if (!loggedInFirestore) return; // Must use authenticated instance
    toast({ title: "Clearing all posts..."});
    const allPostsQuery = collection(loggedInFirestore, 'blogPosts');
    const snapshot = await getDocs(allPostsQuery);
    const batch = writeBatch(loggedInFirestore);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    toast({ title: "All posts have been cleared.", description: "You can now re-import them from the blog page."});
    router.push("/blog");
  }

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

  if (isNotFound) {
      if (isAdmin) {
      return (
        <div className="container text-center py-20">
          <h1 className="text-3xl font-bold text-destructive mb-4">Post Not Found (404)</h1>
          <p className="text-muted-foreground mb-8">The data might be improperly structured or not imported correctly.</p>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">TEMPORARY: Clear All Blog Posts</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete ALL posts from the database. This is a temporary tool to fix the import issue.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllPosts}>Yes, delete everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      )
    }
    notFound();
    return null;
  }
  
  if (!post) {
    // This case handles the initial render where post is null but we are not yet in a "not found" state.
    // Returning null or a skeleton here prevents the rest of the component from trying to access post.title etc.
    return null; 
  }

  const handleDelete = () => {
    if (loggedInFirestore && post) { // Must use authenticated instance
      const postRef = doc(loggedInFirestore, 'blogPosts', post.id);
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
