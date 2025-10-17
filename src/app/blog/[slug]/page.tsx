import { notFound } from "next/navigation";
import Image from "next/image";
import { blogPosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
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
      
      {/* Admin controls for demonstration */}
      <div className="mt-12 flex justify-end gap-4 border-t pt-8">
        <button className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
        <button className="text-sm text-destructive/80 hover:text-destructive">Delete</button>
      </div>

    </article>
  );
}
