import { config } from 'dotenv';
config();

import '@/ai/flows/clinical-trial-ai-summaries.ts';
import '@/ai/flows/researcher-publication-summaries.ts';
import '@/ai/flows/patient-profile-condition-detection.ts';