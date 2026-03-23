'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollSection } from '../scroll/ScrollSection';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogPreviewSection() {
  const { supabase } = useSupabase();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);

      if (error) {
        console.warn('[BlogPreview] Failed to fetch blog posts:', error.message);
      } else if (data) {
        setLatestPosts(data);
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, [supabase]);

  return (
    <ScrollSection triggerOffset="top 80%" className="min-h-screen py-24 md:py-32 flex flex-col justify-center">
      <div className="container px-4 md:px-6 z-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-code tracking-[0.2em] text-primary uppercase mb-4">Transmission Log</h2>
            <h3 className="text-4xl md:text-5xl font-headline font-bold text-gradient-light">Latest Signals</h3>
          </div>
          <Button variant="link" className="mt-4 md:mt-0 text-white/50 hover:text-white glass px-6" asChild>
            <Link href="/blog">View All Records <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 min-h-[300px] flex flex-col space-y-4">
                <Skeleton className="h-6 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-1/4 bg-white/10" />
                <Skeleton className="flex-1 w-full bg-white/10" />
              </div>
            ))
          ) : (
            latestPosts.map((post, i) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                <div 
                  className="glass-card h-full p-8 flex flex-col items-start transition-all duration-300 relative overflow-hidden"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Hover Accent Line */}
                  <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 ease-out"></div>
                  
                  <span className="text-xs font-code text-primary/80 mb-4 tracking-widest uppercase">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                  </span>
                  
                  <h4 className="text-2xl font-headline font-bold mb-4 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h4>
                  
                  <p className="text-muted-foreground text-sm flex-1 leading-relaxed">
                    {post.excerpt || post.description || "Read more about this transmission..."}
                  </p>
                  
                  <div className="mt-8 flex items-center text-sm font-semibold text-white/60 group-hover:text-primary">
                    Read Terminal <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </ScrollSection>
  );
}
