'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser, useSupabase } from '@/hooks/use-supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { Globe, Clock, LayoutTemplate, BarChart3 } from 'lucide-react';

const editPostSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  content: z.string().min(1, 'Content is required.'),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type EditPostForm = z.infer<typeof editPostSchema>;

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  image_hint: string;
  date: string;
};

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

function getReadabilityGrade(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Very Easy', color: 'text-green-400' };
  if (score >= 60) return { label: 'Easy', color: 'text-emerald-400' };
  if (score >= 40) return { label: 'Moderate', color: 'text-yellow-400' };
  if (score >= 20) return { label: 'Hard', color: 'text-orange-400' };
  return { label: 'Very Hard', color: 'text-red-400' };
}

function calculateMetrics(htmlContent: string) {
  if (typeof window === 'undefined' || !htmlContent) return { words: 0, readingTime: 0, readabilityScore: 0 };
  
  // Insert spaces before closing block tags so paragraphs don't merge
  let text = htmlContent
    .replace(/<\/(p|div|h[1-6]|li|blockquote|br\s*\/?)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  if (wordCount < 10) return { words: wordCount, readingTime, readabilityScore: 0 };
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score = Math.round(206.835 - 1.015 * (wordCount / sentences) - 84.6 * (totalSyllables / wordCount));
  return { words: wordCount, readingTime, readabilityScore: Math.max(0, Math.min(100, score)) };
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { toast } = useToast();
  const { isAdmin, isUserLoading } = useUser();
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);

  const form = useForm<EditPostForm>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      imageUrl: '',
    },
  });

  const watchTitle = form.watch('title');
  const watchDescription = form.watch('description');
  const watchContent = form.watch('content');
  const watchImageUrl = form.watch('imageUrl');

  const { words, readingTime, readabilityScore } = calculateMetrics(watchContent);
  const readabilityGrade = getReadabilityGrade(readabilityScore);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setPost(data);
        form.reset({
          title: data.title,
          description: data.description,
          content: data.content,
          imageUrl: data.image_url || '',
        });
      }
      setIsPostLoading(false);
    }
    fetchPost();
  }, [slug, supabase, form]);

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to edit this page.' });
      router.push(`/blog/${slug}`);
    }
  }, [isUserLoading, isAdmin, router, slug, toast]);

  const onSubmit = async (data: EditPostForm) => {
    if (!post) return;
    setIsSubmitting(true);

    try {
      const updatedData = {
        title: data.title,
        description: data.description,
        content: data.content,
        updated_at: new Date().toISOString(),
        image_url: data.imageUrl || post.image_url,
        image_hint: data.imageUrl ? 'custom url' : post.image_hint,
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(updatedData)
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: 'Post Updated!',
        description: 'Your changes have been saved successfully.',
      });
      router.push(`/blog/${post.slug}`);
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Could not update the post.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isUserLoading || isPostLoading;

  if (!isLoading && !post) {
    notFound();
    return null;
  }

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-32 px-4">
        <div className="flex items-center space-x-2 text-primary">
           <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
           <span>Loading Editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-gradient-light">Editing: {post?.title}</h1>
        <p className="text-muted-foreground mt-2">Update your engineering blueprint using the Tiptap cinematic editor.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-background/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardContent className="p-0 sm:p-0">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <RichTextEditor content={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage className="p-4" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* SEO & Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-background/60 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-lg">
                  <LayoutTemplate className="w-5 h-5 text-primary" /> Core Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Engineering the perfect stack" {...field} className="bg-black/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>URL Slug (Locked)</FormLabel>
                  <FormControl>
                    <Input value={post?.slug || ''} disabled className="bg-black/50 opacity-50 font-code text-sm cursor-not-allowed" />
                  </FormControl>
                  <FormDescription className="text-xs">The slug cannot be changed after publishing to prevent breaking existing links.</FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenGraph Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://unsplash.com/..." {...field} className="bg-black/50 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center gap-4 text-xs font-code text-muted-foreground p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1">
                     <Clock className="w-4 h-4 text-primary" /> {readingTime} min read
                  </div>
                  <div>
                    {words} words
                  </div>
                </div>

                {/* Readability Score */}
                {words >= 10 && (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-code text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-primary" /> Readability
                      </span>
                      <span className={`text-xs font-bold font-code ${readabilityGrade.color}`}>
                        {readabilityGrade.label} ({readabilityScore})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${readabilityScore}%`,
                          background: readabilityScore >= 60 ? 'linear-gradient(90deg, #34d399, #10b981)' : readabilityScore >= 40 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #f87171, #ef4444)',
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-white/30 font-code">Flesch-Kincaid Reading Ease. Aim for 60+ for general audiences.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-lg">
                  <Globe className="w-5 h-5 text-green-500" /> Search Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A compelling summary for search engines..." {...field} className="h-20 bg-black/50 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Simulated Google SERP */}
                <div className="p-4 bg-white rounded-lg shadow-inner font-sans text-left mt-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                        <img src="/images/profile-circle.png" alt="logo" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-800 leading-none">HopeEngineer</span>
                        <span className="text-[10px] text-slate-500 leading-none">https://hopeengineer.info › blog › {post?.slug}</span>
                     </div>
                  </div>
                  <h3 className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate leading-tight mt-1">
                    {watchTitle || 'Your Post Title Will Appear Here'} | HopeEngineer
                  </h3>
                  <p className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-snug">
                    <span className="text-slate-500">{post?.date ? format(new Date(post.date), 'MMM d, yyyy') : format(new Date(), 'MMM d, yyyy')} - </span>
                    {watchDescription || 'This is how your post will look to people searching on Google. Write a compelling description to increase click-through rates.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()} className="w-full border-white/10 hover:bg-white/5">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
