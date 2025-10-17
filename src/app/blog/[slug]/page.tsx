'use client';

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
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

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

type BlogPost = {
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin } = useUser();
  const firestore = useFirestore();

  const postRef = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return doc(firestore, "blogPosts", slug);
  }, [firestore, slug]);
  
  const { data: post, isLoading } = useDoc<BlogPost>(postRef);

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
  }

  const handleDelete = () => {
    if (postRef) {
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
            <Button variant="outline" disabled>Edit</Button>
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
