// IMPORTANT: This file is only used for server-side operations (e.g., in server actions)
// It uses a service account for admin-level access to Firebase services.
// Do NOT import or use this file on the client-side.

import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

// This is a simplified check. In a real production app, you'd use something more robust
// like environment variables to differentiate environments.
const isDevelopment = process.env.NODE_ENV === 'development';

function getServiceAccount() {
  if (isDevelopment && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON.", e);
      return undefined;
    }
  }
  // In production (e.g., on Google Cloud Run/Functions), the service account is
  // automatically available via the Application Default Credentials.
  return undefined;
}


export function initializeFirebase() {
    if (getApps().length > 0) {
      const app = getApp();
      return getSdks(app);
    }
  
    const serviceAccount = getServiceAccount();
  
    const app = initializeApp({
      credential: serviceAccount ? credential.cert(serviceAccount) : undefined,
    });
  
    return getSdks(app);
  }
  

function getSdks(app: App) {
  return {
    app,
    firestore: getFirestore(app),
  };
}
