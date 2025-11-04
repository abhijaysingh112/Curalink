
'use server';

import { detectPatientConditions } from '@/ai/flows/patient-profile-condition-detection';
import { summarizeClinicalTrial } from '@/ai/flows/clinical-trial-ai-summaries';
import { generatePublicationSummary } from '@/ai/flows/researcher-publication-summaries';
import { publications as mockPublications } from '@/lib/data';
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
  console.log('Fetching live publications from PubMed...');
  try {
    const searchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=(cancer+OR+neurology)+AND+("2023"[pdat]:"3000"[pdat])&retmax=50&sort=pub_date&retmode=json';
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`PubMed ESearch API call failed: ${searchResponse.status}`);
    }
    const searchData = await searchResponse.json();
    const pmids = searchData.esearchresult.idlist;

    if (!pmids || pmids.length === 0) {
      return [];
    }

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
    const summaryResponse = await fetch(summaryUrl);
    if (!summaryResponse.ok) {
      throw new Error(`PubMed ESummary API call failed: ${summaryResponse.status}`);
    }
    const summaryData = await summaryResponse.json();
    const results = summaryData.result;

    const publications: Publication[] = pmids.map((id: string) => {
        const pub = results[id];
        return {
            id: pub.uid,
            title: pub.title || 'No title available',
            authors: pub.authors.map((a: { name: string }) => a.name) || ['N/A'],
            journal: pub.fulljournalname || 'N/A',
            year: parseInt(pub.pubdate?.substring(0, 4) || new Date().getFullYear().toString(), 10),
            url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            summary: `No AI summary available for this live article. Full text may be available at the source.`, // Placeholder for summary
            keywords: pub.attributes?.meshheadinglist?.map((h: string) => h.replace(/ /g, '')) || [],
        };
    });

    return publications;
  } catch (error) {
    console.error('Error fetching publications from PubMed:', error);
    // Fallback to mock data if the API fails
    return mockPublications;
  }
}
