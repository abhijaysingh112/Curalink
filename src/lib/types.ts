export type User = {
    id: string;
    name: string;
    avatarUrl: string;
    imageHint: string;
};
  
export type Publication = {
    id: string;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    url: string;
    summary?: string;
    keywords: string[];
};
  
export type ClinicalTrial = {
    id: string;
    title: string;
    status: 'Recruiting' | 'Completed' | 'Not yet recruiting';
    location: string;
    details: string;
    contactEmail: string;
    keywords: string[];
};
  
export type Researcher = User & {
    specialties: string[];
    researchInterests: string[];
    publications: string[]; // ids of publications
    isAvailableForMeetings: boolean;
    isExternal?: boolean;
};
  
export type Patient = User & {
    conditions: string[];
    location: string;
};
  
export type ForumPost = {
    id: string;
    title: string;
    authorId: string; // patient id
    category: string;
    content: string;
    timestamp: string;
    replies: ForumReply[];
};
  
export type ForumReply = {
    id: string;
    authorId: string; // researcher id
    content: string;
    timestamp: string;
};
  
export type ForumCategory = {
    id: string;
    name: string;
    description: string;
};
  
