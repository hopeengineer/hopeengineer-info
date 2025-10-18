'use client';

import Hero from "@/components/hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCollection, publicFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function Home() {
  // Use the public, read-only firestore instance. This ensures blog posts are always visible.
  const firestore = publicFirestore;

  const latestPostsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('date', 'desc'), limit(3));
  }, [firestore]);

  const { data: latestPosts, isLoading } = useCollection<BlogPost>(latestPostsQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />

        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Services</div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Engineering Your Impact</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Unlock your potential with my bespoke services, from one-on-one coaching to AI-powered content solutions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
              {services.map((service) => (
                <Card key={service.title} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                  <CardHeader>
                    <CardTitle className="font-headline">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/work-with-me">
                      <Button className="w-full">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">From the Blog</div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Latest Articles</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore insights on AI, engineering, and personal growth.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-12">
              {isLoading && (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-2" />
                    </CardContent>
                  </Card>
                ))
              )}
              {latestPosts?.map((post) => (
                 <Card key={post.slug} className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
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
                    <CardContent className="p-6">
                      <h3 className="text-xl font-headline font-bold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{post.date}</p>
                      <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                       <Link href={`/blog/${post.slug}`} className="mt-4 inline-block">
                         <Button variant="link" className="px-0">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                       </Link>
                    </CardContent>
                 </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
