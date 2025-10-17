
'use client';

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCollection, useUser, useMemoFirebase, publicFirestore } from "@/firebase";
import { doc, query, collection, where, limit, Firestore } from "firebase/firestore";
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
  // Get user status separately for showing admin buttons. This does not affect public data fetching.
  const { isAdmin } = useUser();
  
  // ALWAYS use the public firestore instance for viewing posts. This works for logged-out users.
  const firestore: Firestore = publicFirestore;

  // The query will be null until `slug` from useParams is available. This prevents premature fetching.
  const postQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, "blogPosts"), where("slug", "==", slug), limit(1));
  }, [firestore, slug]);
  
  // `isLoading` will be true only when the query is valid and fetching starts.
  const { data: posts, isLoading } = useCollection<BlogPost>(postQuery);
  const post = posts?.[0];
  
  // This effect is the final guard. It only runs after loading is complete.
  // If, after all that, we still have no post, then it's a real 404.
  useEffect(() => {
    if (!isLoading && !post && postQuery) {
      notFound();
    }
  }, [isLoading, post, postQuery]);
  
  // This action requires an authenticated admin.
  const handleDelete = () => {
    // Re-check for admin firestore instance inside the handler to be safe.
    const { firestore: adminFirestore } = useUser();
    if (adminFirestore && post) {
      const postRef = doc(adminFirestore, 'blogPosts', post.id);
      deleteDocumentNonBlocking(postRef);
      toast({
        title: "Post deleted",
        description: `"${post.title}" has been successfully deleted.`,
      });
      router.push("/blog");
    } else {
        toast({variant: 'destructive', title: 'Admin permissions required.'});
    }
  };

  // Show a skeleton while the data is loading. This also handles the initial state where the query is not yet ready.
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
  
  // Because of the useEffect above, if we reach this point and `post` is null,
  // it's only for a brief moment before the notFound() redirect happens. We can return null.
  if (!post) {
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
