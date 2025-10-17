'use server';
/**
 * @fileOverview An AI flow for importing and parsing articles from raw HTML.
 *
 * - importArticle - A function that parses raw article HTML.
 * - ImportArticleInput - The input type for the importArticle function.
 * - ImportArticleOutput - The output type for the importArticle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ImportArticleInputSchema = z.object({
  htmlContent: z.string().describe('The full HTML content of the article to import.'),
});
export type ImportArticleInput = z.infer<typeof ImportArticleInputSchema>;

const ArticleDataSchema = z.object({
    title: z.string().describe('The main title of the article.'),
    description: z.string().describe('A short, one or two-sentence summary of the article.'),
    author: z.string().describe('The name of the article\'s author.'),
    imageUrl: z.string().url().describe('The URL for the main hero image of the article. If no image is found, use a placeholder from picsum.photos.'),
    content: z.string().describe('The full, cleaned inner HTML of the main article body. All navigation, ads, headers, footers, and other non-article content should be removed.'),
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
    prompt: `You are an expert web content parser. You will be given the full HTML content of a blog post.
    Your task is to extract the following information:
    1.  **Title**: The main title of the article.
    2.  **Description**: A concise one or two-sentence summary of the article.
    3.  **Author**: The name of the article's author.
    4.  **Image URL**: The URL of the main feature image. If no prominent image is found, use a random placeholder URL from 'https://picsum.photos/seed/RANDOM_SEED/1200/675'.
    5.  **Content**: The complete, full, and unabridged inner HTML of the main article body.
        - **CRITICAL**: You must remove all unrelated content like navigation bars, sidebars, author bios, advertisements, social media sharing buttons, "related posts" sections, and footers.
        - **CRITICAL**: The content MUST NOT include the main title or the main hero image, as those are already extracted into separate fields.
        - **CRITICAL**: Return the ENTIRE article content, not just the first few paragraphs.

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
  async ({ htmlContent }) => {
    // 1. Use the LLM to extract structured and CLEANED data from the messy HTML
    const { output } = await articleParserPrompt({ articleHtml: htmlContent });
    
    if (!output) {
        throw new Error('AI parsing failed to return data.');
    }
    
    // 2. Return the structured, cleaned data to the client
    return output;
  }
);
