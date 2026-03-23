import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AdminEditButton } from './AdminEditButton';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', resolvedParams.slug).single();
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} | HopeEngineer`,
    description: post.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated_at || post.date,
      authors: [post.author || 'HopeEngineer'],
      url: `https://hopeengineer.info/blog/${post.slug}`,
      images: [
        {
          url: post.image_url || `https://picsum.photos/seed/${post.slug}/1200/630`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.excerpt,
      images: [post.image_url || `https://picsum.photos/seed/${post.slug}/1200/630`],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Generate JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hopeengineer.info/blog/${post.slug}`
    },
    headline: post.title,
    description: post.description || post.excerpt,
    image: post.image_url || `https://picsum.photos/seed/${post.slug}/1200/630`,
    datePublished: post.date,
    dateModified: post.updated_at || post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'HopeEngineer',
      url: 'https://hopeengineer.info/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'HopeEngineer Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hopeengineer.info/images/profile-circle.png'
      }
    }
  };

  return (
    <article className="relative z-10 w-full min-h-screen pt-32 pb-24">
      {/* JSON-LD for perfect SEO indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="flex justify-between items-center mb-12">
          <Link href="/blog" className="inline-flex items-center text-sm font-code tracking-widest uppercase text-white/50 hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Log
          </Link>
          <AdminEditButton slug={post.slug} />
        </div>
        
        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-code uppercase tracking-widest text-primary/80 mb-6 border-b border-white/10 pb-6 inline-flex w-full">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-gradient-light leading-tight mb-8">
            {post.title}
          </h1>

          <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-panel border-white/10 mb-12">
            <Image
              src={post.image_url || `https://picsum.photos/seed/${post.slug}/1200/630`}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </header>
        
        <div className="prose prose-invert prose-lg max-w-none font-body prose-headings:font-headline prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        <footer className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-primary font-bold font-headline">{post.author ? post.author.charAt(0) : 'H'}</span>
             </div>
             <div>
               <p className="text-sm font-headline font-bold text-foreground">{post.author || 'HopeEngineer'}</p>
               <p className="text-xs font-code text-muted-foreground">Systems Architect</p>
             </div>
          </div>
        </footer>
        
      </div>
    </article>
  );
}
