'use server';
/**
 * @fileOverview An AI assistant flow for the CuraLink platform.
 *
 * - askAssistant - A function that takes a user's question and returns an AI-generated answer.
 * - AskAssistantInput - The input type for the askAssistant function.
 * - AskAssistantOutput - The return type for the askAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s question to the assistant.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() }))
  })).optional().describe('The conversation history.'),
});
export type AskAssistantInput = z.infer<typeof AskAssistantInputSchema>;

const AskAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s question.'),
});
export type AskAssistantOutput = z.infer<typeof AskAssistantOutputSchema>;

export async function askAssistant(input: AskAssistantInput): Promise<AskAssistantOutput> {
  return askAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAssistantPrompt',
  input: {schema: AskAssistantInputSchema},
  output: {schema: AskAssistantOutputSchema},
  prompt: `You are a friendly and helpful AI assistant for CuraLink, a platform that connects patients and researchers.
Your role is to answer user questions about the platform's features and guide them on how to use it.
Be concise and helpful.

Here are the platform's main features:
- Patients can find clinical trials, connect with health experts, and read simplified research papers.
- Researchers can manage their trials, find collaborators, and answer patient questions in forums.
- Both can save their favorite items.

Based on the conversation history and the user's latest question, provide a helpful answer.

{{#if history}}
{{#each history}}
{{role}}: {{{this.content.[0].text}}}
{{/each}}
{{/if}}

User: {{{question}}}
You:`,
});

const askAssistantFlow = ai.defineFlow(
  {
    name: 'askAssistantFlow',
    inputSchema: AskAssistantInputSchema,
    outputSchema: AskAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
