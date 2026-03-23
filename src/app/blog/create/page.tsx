'use client';

import { useRouter } from 'next/navigation';
import { useUser, useSupabase } from '@/hooks/use-supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { Globe, Clock, LayoutTemplate, BarChart3 } from 'lucide-react';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().optional(),
  description: z.string().min(1, 'Description is required.'),
  content: z.string().min(1, 'Content is required.'),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

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

  // Flesch-Kincaid Reading Ease
  if (wordCount < 10) return { words: wordCount, readingTime, readabilityScore: 0 };
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score = Math.round(
    206.835 - 1.015 * (wordCount / sentences) - 84.6 * (totalSyllables / wordCount)
  );
  return { words: wordCount, readingTime, readabilityScore: Math.max(0, Math.min(100, score)) };
}

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, isUserLoading } = useUser();
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      imageUrl: '',
    },
  });

  const watchTitle = form.watch('title');
  const watchDescription = form.watch('description');
  const watchContent = form.watch('content');
  const watchSlug = form.watch('slug');

  const { words, readingTime, readabilityScore } = calculateMetrics(watchContent);
  const readabilityGrade = getReadabilityGrade(readabilityScore);

  // Auto-generate slug if left empty
  const activeSlug = watchSlug || watchTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You do not have permission to create posts.' });
      router.push('/blog');
    }
  }, [isUserLoading, isAdmin, router, toast]);

  const onSubmit = async (data: CreatePostForm) => {
    setIsSubmitting(true);

    try {
      const finalSlug = data.slug || data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s-]+/g, '-');

      const newPost = {
        title: data.title,
        description: data.description,
        content: data.content,
        slug: finalSlug,
        author: 'HopeEngineer',
        date: format(new Date(), 'MMMM d, yyyy'),
        image_url: data.imageUrl || `https://picsum.photos/seed/${finalSlug}/1200/630`,
        image_hint: data.imageUrl ? 'custom url' : 'abstract placeholder',
      };

      const { error } = await supabase.from('blog_posts').insert(newPost);

      if (error) throw error;

      toast({
        title: 'Post Created!',
        description: 'Your new post has been saved.',
      });
      router.push(`/blog/${finalSlug}`);
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error?.message || 'Could not create the post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || !isAdmin) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center space-x-2 text-primary">
           <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
           <span>Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-gradient-light">Authoring Engine</h1>
        <p className="text-muted-foreground mt-2">Craft your next engineering blueprint using the Tiptap cinematic editor.</p>
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

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="engineering-the-perfect-stack" {...field} className="bg-black/50 font-code text-sm" />
                      </FormControl>
                      <FormDescription className="text-xs">Leave empty to auto-generate from title.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <div className="p-4 bg-white rounded-lg shadow-inner font-sans text-left mt-4">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative">
                        <img src="/images/profile-circle.png" alt="logo" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-slate-800 leading-none">HopeEngineer</span>
                        <span className="text-[10px] text-slate-500 leading-none">https://hopeengineer.info › blog {activeSlug ? `› ${activeSlug}` : ''}</span>
                     </div>
                  </div>
                  <h3 className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate leading-tight">
                    {watchTitle || 'Your Post Title Will Appear Here'} | HopeEngineer
                  </h3>
                  <p className="text-sm text-[#4d5156] mt-1 line-clamp-2 leading-snug">
                    <span className="text-slate-500">{format(new Date(), 'MMM d, yyyy')} - </span>
                    {watchDescription || 'This is how your post will look to people searching on Google. Write a compelling description to increase click-through rates.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
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
