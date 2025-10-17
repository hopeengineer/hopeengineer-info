'use client';
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Download } from "lucide-react";
import { useUser } from "@/firebase";

const BlogPage = () => {
  const { isAdmin } = useUser();

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
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Import Posts
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
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
