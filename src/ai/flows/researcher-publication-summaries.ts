'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI summaries of researcher publications.
 *
 * The flow takes a publication text as input and returns a concise AI-generated summary.
 * - generatePublicationSummary - A function that generates an AI summary for a given publication.
 * - PublicationSummaryInput - The input type for the generatePublicationSummary function.
 * - PublicationSummaryOutput - The return type for the generatePublicationSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PublicationSummaryInputSchema = z.object({
  publicationText: z
    .string()
    .describe('The text content of the publication to be summarized.'),
});
export type PublicationSummaryInput = z.infer<typeof PublicationSummaryInputSchema>;

const PublicationSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise AI-generated summary of the publication.'),
});
export type PublicationSummaryOutput = z.infer<typeof PublicationSummaryOutputSchema>;

export async function generatePublicationSummary(input: PublicationSummaryInput): Promise<PublicationSummaryOutput> {
  return generatePublicationSummaryFlow(input);
}

const publicationSummaryPrompt = ai.definePrompt({
  name: 'publicationSummaryPrompt',
  input: {schema: PublicationSummaryInputSchema},
  output: {schema: PublicationSummaryOutputSchema},
  prompt: `Summarize the following publication text in a concise and informative manner:

{{{publicationText}}}`,
});

const generatePublicationSummaryFlow = ai.defineFlow(
  {
    name: 'generatePublicationSummaryFlow',
    inputSchema: PublicationSummaryInputSchema,
    outputSchema: PublicationSummaryOutputSchema,
  },
  async input => {
    const {output} = await publicationSummaryPrompt(input);
    return output!;
  }
);
