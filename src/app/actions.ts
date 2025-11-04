
'use server';

import { detectPatientConditions } from '@/ai/flows/patient-profile-condition-detection';
import { summarizeClinicalTrial } from '@/ai/flows/clinical-trial-ai-summaries';
import { generatePublicationSummary } from '@/ai/flows/researcher-publication-summaries';

export async function getMedicalConditions(patientDescription: string): Promise<string[]> {
  if (!patientDescription.trim()) {
    return [];
  }
  try {
    const result = await detectPatientConditions({ patientDescription });
    return result.medicalConditions || [];
  } catch (error) {
    console.error('Error detecting patient conditions:', error);
    // In a real app, you'd want more robust error handling
    return [];
  }
}

export async function getTrialSummary(clinicalTrialDetails: string): Promise<string> {
  try {
    const result = await summarizeClinicalTrial({ clinicalTrialDetails });
    return result.summary;
  } catch (error) {
    console.error('Error summarizing clinical trial:', error);
    return 'Could not generate summary.';
  }
}

export async function getPublicationSummary(publicationText: string): Promise<string> {
    try {
      const result = await generatePublicationSummary({ publicationText });
      return result.summary;
    } catch (error) {
      console.error('Error summarizing publication:', error);
      return 'Could not generate summary.';
    }
  }
