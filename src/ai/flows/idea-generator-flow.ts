
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

// Input and Output types are defined but the schemas are used inline
export type GenerateIdeasInput = {
  topic: string;
};

export type GenerateIdeasOutput = {
  ideas: string[];
};

export async function generateIdeas(input: GenerateIdeasInput): Promise<GenerateIdeasOutput> {
  // Define Schemas inside the function
  const GenerateIdeasInputSchema = z.object({
    topic: z.string().describe('The topic to generate ideas for.'),
  });

  const GenerateIdeasOutputSchema = z.object({
    ideas: z.array(z.string()).describe('A list of generated ideas.'),
  });

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
    async (flowInput) => {
      const { output } = await ideaGeneratorPrompt(flowInput);
      if (!output) {
        throw new Error('AI failed to generate ideas.');
      }
      return output;
    }
  );
  
  return await ideaGeneratorFlow(input);
}
