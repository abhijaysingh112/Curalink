'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { clinicalTrials, publications, researchers } from '@/lib/data';
import { TrialCard } from '@/components/cards/trial-card';
import { PublicationCard } from '@/components/cards/publication-card';
import { ExpertCard } from '@/components/cards/expert-card';
import { useUser, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

export default function PatientDashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [patientName, setPatientName] = useState('there');

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{firstName: string}>(userDocRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      setPatientName('there');
    } else if (userProfile) {
      setPatientName(userProfile.firstName || 'there');
    } else {
        const storedProfile = localStorage.getItem('patientProfile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setPatientName(profile.name?.split(' ')[0] || 'there');
        }
    }
  }, [userProfile, isUserLoading, isProfileLoading]);

  const recommendedTrials = clinicalTrials.slice(0, 2);
  const recommendedPublications = publications.slice(0, 2);
  const recommendedExperts = researchers.slice(0, 2);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${patientName}!`}
        description="Here are personalized recommendations based on your profile."
      />

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Recommended Clinical Trials</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {recommendedTrials.map((trial) => (
            <TrialCard key={trial.id} trial={trial} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Recommended Publications</h2>
        <div className="space-y-4">
          {recommendedPublications.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Recommended Health Experts</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </section>
    </div>
  );
}
