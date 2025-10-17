'use client';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Download } from "lucide-react";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, serverTimestamp, addDoc } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { importArticle } from "@/ai/flows/import-article-flow";
import { format } from "date-fns";
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
}

const BlogPage = () => {
  const { isAdmin } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [importHtml, setImportHtml] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: blogPosts, isLoading } = useCollection<BlogPost>(postsQuery);

  const handleImport = async () => {
    if (!importHtml || !firestore) {
        toast({
            variant: "destructive",
            title: "HTML is missing",
            description: "Please paste the article's HTML content to import.",
        });
        return;
    }
    setIsImporting(true);
    try {
        const parsedArticle = await importArticle({ htmlContent: importHtml });
        
        const slug = parsedArticle.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/[\s-]+/g, '-');

        const newPost = {
            title: parsedArticle.title,
            description: parsedArticle.description,
            content: parsedArticle.content,
            slug,
            author: parsedArticle.author || 'HopeEngineer',
            date: format(new Date(), 'MMMM d, yyyy'),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            image: {
                imageUrl: parsedArticle.imageUrl,
                imageHint: 'imported article',
            }
        };

        const postsCollection = collection(firestore, 'blogPosts');
        await addDoc(postsCollection, newPost);

        toast({
            title: "Import Successful",
            description: "The article has been imported and saved.",
        });
        setIsDialogOpen(false);
        setImportHtml('');
        // No need to manually refetch, useCollection will update automatically
    } catch (error) {
        console.error("Import error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: `Could not import the article. ${errorMessage}`,
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
          <Button variant="outline" asChild>
            <Link href="/blog/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Import from HTML
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Import Article from HTML</DialogTitle>
                    <DialogDescription>
                        Go to your article, view the page source, and paste the full HTML here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="import-html">Article HTML</Label>
                        <Textarea
                            id="import-html"
                            value={importHtml}
                            onChange={(e) => setImportHtml(e.target.value)}
                            className="h-64 font-code text-xs"
                            placeholder="<!DOCTYPE html>..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleImport} disabled={isImporting}>
                        {isImporting ? "Importing..." : "Import"}
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
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
            {isAdmin ? "Click 'Import from HTML' to add your first post." : "Check back soon for new content."}
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
