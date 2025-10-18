'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateIdeas, GenerateIdeasInputSchema, GenerateIdeasOutput } from '@/ai/flows/idea-generator-flow';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type IdeaGeneratorForm = z.infer<typeof GenerateIdeasInputSchema>;

export default function IdeaGeneratorPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateIdeasOutput | null>(null);

  const form = useForm<IdeaGeneratorForm>({
    resolver: zodResolver(GenerateIdeasInputSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit = async (data: IdeaGeneratorForm) => {
    setIsGenerating(true);
    setGeneratedIdeas(null);
    try {
      const result = await generateIdeas(data);
      setGeneratedIdeas(result);
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not generate ideas. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Lightbulb className="w-12 h-12 text-accent" />
          </div>
          <CardTitle className="font-headline text-3xl">AI Idea Generator</CardTitle>
          <CardDescription>Never run out of ideas again. Enter a topic and let the AI do the brainstorming.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Sustainable living', 'sci-fi movie plots', 'healthy breakfast recipes'" {...field} disabled={isGenerating}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  'Generating...'
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Ideas
                  </>
                )}
              </Button>
            </form>
          </Form>

          {isGenerating && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-center">Generating brilliance...</h3>
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-4/6" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          )}

          {generatedIdeas && generatedIdeas.ideas.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Here are some ideas:</h3>
              <ul className="space-y-3 list-disc list-inside bg-muted/50 p-4 rounded-md">
                {generatedIdeas.ideas.map((idea, index) => (
                  <li key={index} className="text-foreground/80">{idea}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
