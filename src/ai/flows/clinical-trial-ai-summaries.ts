'use server';
/**
 * @fileOverview A flow that generates AI summaries of clinical trials.
 *
 * - summarizeClinicalTrial - A function that takes clinical trial details and returns an AI-generated summary.
 * - SummarizeClinicalTrialInput - The input type for the summarizeClinicalTrial function.
 * - SummarizeClinicalTrialOutput - The return type for the summarizeClinicalTrial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClinicalTrialInputSchema = z.object({
  clinicalTrialDetails: z
    .string()
    .describe('The detailed description of the clinical trial.'),
});
export type SummarizeClinicalTrialInput = z.infer<typeof SummarizeClinicalTrialInputSchema>;

const SummarizeClinicalTrialOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the clinical trial.'),
});
export type SummarizeClinicalTrialOutput = z.infer<typeof SummarizeClinicalTrialOutputSchema>;

export async function summarizeClinicalTrial(input: SummarizeClinicalTrialInput): Promise<SummarizeClinicalTrialOutput> {
  return summarizeClinicalTrialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeClinicalTrialPrompt',
  input: {schema: SummarizeClinicalTrialInputSchema},
  output: {schema: SummarizeClinicalTrialOutputSchema},
  prompt: `You are an expert medical summarizer.  Please provide a concise summary of the following clinical trial details:\n\n{{{clinicalTrialDetails}}}`,
});

const summarizeClinicalTrialFlow = ai.defineFlow(
  {
    name: 'summarizeClinicalTrialFlow',
    inputSchema: SummarizeClinicalTrialInputSchema,
    outputSchema: SummarizeClinicalTrialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
