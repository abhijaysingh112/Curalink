
'use server';

import { detectPatientConditions } from '@/ai/flows/patient-profile-condition-detection';
import { summarizeClinicalTrial } from '@/ai/flows/clinical-trial-ai-summaries';
import { generatePublicationSummary } from '@/ai/flows/researcher-publication-summaries';
import { publications } from '@/lib/data';
import type { ClinicalTrial, Publication } from '@/lib/types';


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

export async function getClinicalTrials(): Promise<ClinicalTrial[]> {
  console.log('Fetching live clinical trials from ClinicalTrials.gov...');
  try {
    // API v2 endpoint. We fetch 50 recent studies that are recruiting.
    const response = await fetch('https://clinicaltrials.gov/api/v2/studies?filter.overallStatus=RECRUITING&pageSize=50');
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    
    // Map the API response to our app's ClinicalTrial type
    const trials: ClinicalTrial[] = data.studies.map((study: any) => {
        const protocol = study.protocolSection;
        const idModule = protocol.identificationModule;
        const statusModule = protocol.statusModule;
        const descriptionModule = protocol.descriptionModule;
        const contactsLocationsModule = protocol.contactsLocationsModule;
        const conditionsModule = protocol.conditionsModule;

        // Helper to safely get a location name
        const getLocation = () => {
            const facility = contactsLocationsModule?.locations?.[0];
            if (!facility) return 'N/A';
            return `${facility.city}, ${facility.country}`;
        }
        
        // Helper to map API status to our app's status type
        const getStatus = (apiStatus: string): ClinicalTrial['status'] => {
            switch(apiStatus) {
                case 'RECRUITING': return 'Recruiting';
                case 'COMPLETED': return 'Completed';
                case 'NOT_YET_RECRUITING': return 'Not yet recruiting';
                default: return 'Not yet recruiting'; // A safe default
            }
        }

        return {
            id: idModule?.nctId || 'N/A',
            title: idModule?.briefTitle || 'No title provided',
            status: getStatus(statusModule?.overallStatus),
            location: getLocation(),
            details: descriptionModule?.briefSummary || 'No details provided.',
            contactEmail: contactsLocationsModule?.centralContacts?.[0]?.email || 'Not available',
            keywords: conditionsModule?.keywords || [],
        };
    });

    return trials;

  } catch (error) {
    console.error('Error fetching clinical trials:', error);
    // Return an empty array or cached data in case of an error
    return [];
  }
}

export async function getPublications(): Promise<Publication[]> {
  // TODO: Replace with actual API call to PubMed
  console.log('Fetching publications...');
  return new Promise(resolve => setTimeout(() => resolve(publications), 500));
}
