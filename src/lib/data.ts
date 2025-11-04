import type { Researcher, Patient, ClinicalTrial, Publication, ForumCategory, ForumPost } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return img ? img.imageUrl : 'https://picsum.photos/seed/default/100/100';
}

const getImageHint = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return img ? img.imageHint : 'person';
}

export const researchers: Researcher[] = [
  {
    id: 'researcher-1',
    name: 'Dr. Emily Carter',
    avatarUrl: getImageUrl('expert-1'),
    imageHint: getImageHint('expert-1'),
    specialties: ['Oncology', 'Immunology'],
    researchInterests: ['CAR-T cell therapy', 'Cancer vaccines', 'Tumor microenvironment'],
    publications: ['pub-1', 'pub-3'],
    isAvailableForMeetings: true,
  },
  {
    id: 'researcher-2',
    name: 'Dr. Ben Adams',
    avatarUrl: getImageUrl('expert-2'),
    imageHint: getImageHint('expert-2'),
    specialties: ['Neurology', 'Genetics'],
    researchInterests: ['Alzheimer\'s disease', 'Neuroinflammation', 'Gene therapy'],
    publications: ['pub-2'],
    isAvailableForMeetings: false,
  },
  {
    id: 'researcher-3',
    name: 'Dr. Chloe Davis',
    avatarUrl: getImageUrl('expert-3'),
    imageHint: getImageHint('expert-3'),
    specialties: ['Cardiology'],
    researchInterests: ['Heart failure', 'Arrhythmia', 'Cardiac imaging'],
    publications: [],
    isAvailableForMeetings: true,
  },
  {
    id: 'researcher-4',
    name: 'Dr. David Wilson',
    avatarUrl: getImageUrl('expert-4'),
    imageHint: getImageHint('expert-4'),
    specialties: ['Oncology', 'Genetics'],
    researchInterests: ['Lung Cancer', 'Targeted Therapy', 'Precision Medicine'],
    publications: ['pub-4'],
    isAvailableForMeetings: false,
  },
];

export const patients: Patient[] = [
  {
    id: 'patient-1',
    name: 'John Smith',
    avatarUrl: getImageUrl('patient-1'),
    imageHint: getImageHint('patient-1'),
    conditions: ['Brain Cancer', 'Glioma'],
    location: 'New York, USA',
  },
];

export const clinicalTrials: ClinicalTrial[] = [
  {
    id: 'trial-1',
    title: 'A Study of a New Immunotherapy for Advanced Brain Cancer',
    status: 'Recruiting',
    location: 'New York, NY',
    details: 'This is a phase II clinical trial to evaluate the efficacy and safety of a novel immunotherapy agent in patients with recurrent glioblastoma. Participants must have a confirmed diagnosis of glioblastoma and have previously received standard radiation and chemotherapy. The primary outcome measure is overall survival.',
    contactEmail: 'brain-cancer-trial@example.com',
    keywords: ['Brain Cancer', 'Immunotherapy', 'Glioblastoma'],
  },
  {
    id: 'trial-2',
    title: 'Gene Therapy for Early-Stage Alzheimer\'s Disease',
    status: 'Not yet recruiting',
    location: 'San Francisco, CA',
    details: 'A phase I/II study to assess the safety and potential efficacy of a new gene therapy approach for individuals with early-stage Alzheimer\'s disease. The study involves a one-time administration of the therapeutic agent. Key inclusion criteria include a diagnosis of mild cognitive impairment or early Alzheimer\'s and specific biomarker profiles.',
    contactEmail: 'alz-trial@example.com',
    keywords: ['Alzheimer\'s', 'Gene Therapy', 'Neurology'],
  },
  {
    id: 'trial-3',
    title: 'Targeted Therapy for KRAS-Mutated Lung Cancer',
    status: 'Recruiting',
    location: 'Global',
    details: 'A global, randomized, phase III trial comparing a new targeted agent against standard-of-care chemotherapy in patients with advanced non-small cell lung cancer (NSCLC) harboring a KRAS G12C mutation. Patients must not have received prior systemic therapy for advanced disease.',
    contactEmail: 'lung-cancer-trial@example.com',
    keywords: ['Lung Cancer', 'Targeted Therapy', 'KRAS'],
  },
  {
    id: 'trial-4',
    title: 'Completed Study on Beta-blockers for Heart Failure',
    status: 'Completed',
    location: 'Chicago, IL',
    details: 'This large-scale, long-term study evaluated the impact of beta-blocker therapy on morbidity and mortality in patients with chronic heart failure. The results, published in a leading cardiology journal, have helped shape current treatment guidelines. Data analysis is ongoing.',
    contactEmail: 'heart-trial-info@example.com',
    keywords: ['Heart Failure', 'Beta-blockers', 'Cardiology'],
  },
];

export const publications: Publication[] = [
  {
    id: 'pub-1',
    title: 'Efficacy of CAR-T Cell Therapy in Relapsed Glioblastoma',
    authors: ['Carter E', 'Jones M', 'Lee S'],
    journal: 'New England Journal of Medicine',
    year: 2023,
    url: 'https://www.nejm.org',
    summary: 'This landmark study demonstrates significant improvement in progression-free survival for patients with relapsed glioblastoma treated with a novel CAR-T cell construct. The therapy was generally well-tolerated, with manageable side effects.',
    keywords: ['Brain Cancer', 'CAR-T', 'Immunotherapy'],
  },
  {
    id: 'pub-2',
    title: 'Neuroinflammatory Pathways in Alzheimer\'s Disease Pathogenesis',
    authors: ['Adams B', 'Chen L'],
    journal: 'Nature Neuroscience',
    year: 2022,
    url: 'https://www.nature.com/neuro/',
    summary: 'This review details the critical role of neuroinflammation in the progression of Alzheimer\'s disease, highlighting potential new therapeutic targets within microglial activation pathways. It synthesizes findings from genetic, preclinical, and clinical studies.',
    keywords: ['Alzheimer\'s', 'Neuroinflammation'],
  },
   {
    id: 'pub-3',
    title: 'The Tumor Microenvironment as a Barrier to Immunotherapy',
    authors: ['Carter E', 'Rodriguez F'],
    journal: 'Cancer Cell',
    year: 2021,
    url: 'https://www.cell.com/cancer-cell/home',
    summary: 'This paper explores the complex interplay of cells and signaling molecules within the tumor microenvironment that can suppress anti-tumor immune responses. Strategies to overcome these barriers, such as combination therapies, are discussed.',
    keywords: ['Immunotherapy', 'Tumor Microenvironment'],
  },
  {
    id: 'pub-4',
    title: 'Precision Medicine in KRAS-Mutant Lung Cancer',
    authors: ['Wilson D', 'Patel A'],
    journal: 'The Lancet Oncology',
    year: 2023,
    url: 'https://www.thelancet.com/journals/lanonc/home',
    summary: 'A comprehensive overview of the development of targeted therapies for KRAS-mutant lung cancer, focusing on the success of KRAS G12C inhibitors and the ongoing search for therapies for other KRAS mutations.',
    keywords: ['Lung Cancer', 'KRAS', 'Precision Medicine'],
  },
];
