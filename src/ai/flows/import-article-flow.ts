'use server';
/**
 * @fileOverview An AI flow for importing and parsing articles from URLs.
 *
 * - importArticle - A function that fetches and parses an article.
 * - ImportArticleInput - The input type for the importArticle function.
 * - ImportArticleOutput - The output type for the importArticle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { parse } from 'node-html-parser';

const ImportArticleInputSchema = z.object({
  url: z.string().url({ message: "Please provide a valid URL." }).describe('The URL of the Medium or Substack article to import.'),
});
export type ImportArticleInput = z.infer<typeof ImportArticleInputSchema>;

const ArticleDataSchema = z.object({
    title: z.string().describe('The main title of the article.'),
    description: z.string().describe('A short, one or two-sentence summary of the article.'),
    author: z.string().describe('The name of the article\'s author.'),
    imageUrl: z.string().url().describe('The URL for the main hero image of the article. If no image is found, use a placeholder from picsum.photos.'),
    content: z.string().describe('The full inner HTML of the article body.'),
});
export type ImportArticleOutput = z.infer<typeof ArticleDataSchema>;


// This is the main function that will be called from the client
export async function importArticle(input: ImportArticleInput): Promise<ImportArticleOutput> {
  return await importArticleFlow(input);
}

// Define the prompt that will instruct the LLM on how to parse the article
const articleParserPrompt = ai.definePrompt({
    name: 'articleParserPrompt',
    input: { schema: z.object({ articleHtml: z.string() }) },
    output: { schema: ArticleDataSchema },
    prompt: `You are a web content parsing expert. You will be given the HTML content of a blog post.
    Your task is to extract the following information:
    1.  The main title of the article.
    2.  A concise one or two-sentence summary to be used as a description.
    3.  The author's name.
    4.  The URL of the main feature image for the article. If no prominent image is found, generate a random placeholder image URL from 'https://picsum.photos/seed/RANDOM_SEED/1200/675'.
    5.  The full inner HTML of the main article content.

    Analyze the provided HTML and return the data in the specified JSON format.

    HTML Content:
    {{{articleHtml}}}
    `,
});

const importArticleFlow = ai.defineFlow(
  {
    name: 'importArticleFlow',
    inputSchema: ImportArticleInputSchema,
    outputSchema: ArticleDataSchema,
  },
  async ({ url }) => {
    // 1. Fetch the article content
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch article. Status: ${response.status}`);
    }
    const htmlContent = await response.text();

    // 2. Parse the HTML to get the main article body for the LLM
    const root = parse(htmlContent);
    const articleBody = root.querySelector('article')?.innerHTML || root.querySelector('body')?.innerHTML || '';

    if (!articleBody) {
        throw new Error('Could not find article content to parse.');
    }

    // 3. Use the LLM to extract structured data from the messy HTML
    const { output } = await articleParserPrompt({ articleHtml: articleBody });
    
    if (!output) {
        throw new Error('AI parsing failed to return data.');
    }
    
    // 4. Return the structured data to the client
    return { ...output, content: articleBody };
  }
);
