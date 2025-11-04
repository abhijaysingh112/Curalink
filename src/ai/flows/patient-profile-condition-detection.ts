'use server';

/**
 * @fileOverview Detects medical conditions from patient's natural language input.
 *
 * - detectPatientConditions - A function that extracts medical conditions from patient input.
 * - DetectPatientConditionsInput - The input type for the detectPatientConditions function.
 * - DetectPatientConditionsOutput - The return type for the detectPatientConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPatientConditionsInputSchema = z.object({
  patientDescription: z
    .string()
    .describe('The description of the patient condition in natural language.'),
});
export type DetectPatientConditionsInput = z.infer<
  typeof DetectPatientConditionsInputSchema
>;

const DetectPatientConditionsOutputSchema = z.object({
  medicalConditions: z
    .array(z.string())
    .describe('A list of medical conditions extracted from the patient description.'),
});
export type DetectPatientConditionsOutput = z.infer<
  typeof DetectPatientConditionsOutputSchema
>;

export async function detectPatientConditions(
  input: DetectPatientConditionsInput
): Promise<DetectPatientConditionsOutput> {
  return detectPatientConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectPatientConditionsPrompt',
  input: {schema: DetectPatientConditionsInputSchema},
  output: {schema: DetectPatientConditionsOutputSchema},
  prompt: `You are a medical expert. Extract the medical conditions from the following patient description. Return a list of medical conditions.

Patient description: {{{patientDescription}}}

List of medical conditions:`,
});

const detectPatientConditionsFlow = ai.defineFlow(
  {
    name: 'detectPatientConditionsFlow',
    inputSchema: DetectPatientConditionsInputSchema,
    outputSchema: DetectPatientConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
