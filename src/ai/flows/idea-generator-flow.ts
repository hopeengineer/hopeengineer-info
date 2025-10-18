'use server';
/**
 * @fileOverview An AI flow for generating creative ideas.
 *
 * - generateIdeas - A function that generates a list of ideas based on a topic.
 * - GenerateIdeasInput - The input type for the generateIdeas function.
 * - GenerateIdeasOutput - The output type for the generateIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateIdeasInputSchema = z.object({
  topic: z.string().describe('The topic to generate ideas for.'),
});
export type GenerateIdeasInput = z.infer<typeof GenerateIdeasInputSchema>;

const GenerateIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of generated ideas.'),
});
export type GenerateIdeasOutput = z.infer<typeof GenerateIdeasOutputSchema>;

export async function generateIdeas(input: GenerateIdeasInput): Promise<GenerateIdeasOutput> {
  const ideaGeneratorPrompt = ai.definePrompt({
    name: 'ideaGeneratorPrompt',
    input: { schema: GenerateIdeasInputSchema },
    output: { schema: GenerateIdeasOutputSchema },
    prompt: `You are an expert idea generator, a creative powerhouse that can brainstorm innovative and actionable ideas on any topic.

  The user will provide a topic. Your task is to generate a list of 5-7 distinct, creative, and interesting ideas related to that topic.

  Topic: {{{topic}}}
  `,
  });

  const ideaGeneratorFlow = ai.defineFlow(
    {
      name: 'ideaGeneratorFlow',
      inputSchema: GenerateIdeasInputSchema,
      outputSchema: GenerateIdeasOutputSchema,
    },
    async (input) => {
      const { output } = await ideaGeneratorPrompt(input);
      if (!output) {
        throw new Error('AI failed to generate ideas.');
      }
      return output;
    }
  );
  
  return await ideaGeneratorFlow(input);
}
