export const dynamic = 'force-dynamic'; // Ensure we fetch latest posts

import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { AdminCreateButton } from './AdminCreateButton';
import { FadeIn } from '@/components/ui/fade-in';

export const metadata: Metadata = {
  title: 'Blog | Transmission Log',
  description: 'Essays on artificial intelligence, systems engineering, and the future of human-computer interaction by HopeEngineer.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  return (
    <div className="relative pt-32 pb-24 z-10 w-full min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <FadeIn delay={0.1}>
          <header className="mb-16">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient-light mb-6">
              Transmission Log
            </h1>
            <p className="max-w-2xl text-xl text-muted-foreground font-body">
              Essays on artificial intelligence, systems engineering, and the future of human-computer interaction.
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.2}>
          <AdminCreateButton />
        </FadeIn>

        <div className="flex flex-col gap-8">
          {posts?.length === 0 ? (
            <FadeIn delay={0.3}>
              <div className="glass-panel p-12 text-center">
                <p className="text-muted-foreground font-code uppercase tracking-widest">No transmissions found.</p>
              </div>
            </FadeIn>
          ) : (
            posts?.map((post: any, i: number) => (
              <FadeIn key={post.slug} delay={0.3 + (i * 0.1)}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <article className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center transition-all duration-500 overflow-hidden relative">
                    
                    {/* Left: Image (if applicable) or Abstract block */}
                    <div className="w-full md:w-1/3 aspect-[4/3] relative rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-500"></div>
                      <Image
                        src={post.image_url || `https://picsum.photos/seed/${post.slug}/600/400`}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Right: Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-xs font-code uppercase tracking-widest text-primary/80 mb-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.max(1, Math.ceil((post.content?.length || 1000) / 4000))} min read</span>
                      </div>
                      
                      <h2 className="text-2xl font-headline font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 font-body line-clamp-3">
                        {post.description || post.excerpt || "Dive deeper into this topic..."}
                      </p>
                      
                      <div className="mt-auto flex items-center text-sm font-semibold text-white/50 group-hover:text-primary transition-colors">
                        Read Full Entry <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
