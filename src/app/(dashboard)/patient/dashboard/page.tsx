'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { clinicalTrials, publications, researchers } from '@/lib/data';
import { TrialCard } from '@/components/cards/trial-card';
import { PublicationCard } from '@/components/cards/publication-card';
import { ExpertCard } from '@/components/cards/expert-card';
import { useUser, useFirebase, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import type { ClinicalTrial, Publication, Researcher } from '@/lib/types';

export default function PatientDashboardPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [patientName, setPatientName] = useState('there');
  const [recommendations, setRecommendations] = useState<{
    trials: ClinicalTrial[];
    publications: Publication[];
    experts: Researcher[];
  }>({ trials: [], publications: [], experts: [] });

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  
  const patientProfileDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'patient_profile', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{firstName: string}>(userDocRef);
  const { data: patientProfile, isLoading: isPatientProfileLoading } = useDoc<{medicalConditions: string}>(patientProfileDocRef);

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

  useEffect(() => {
    if (isPatientProfileLoading || !patientProfile) {
      // Show generic recommendations while loading or if no profile
      setRecommendations({
        trials: clinicalTrials.slice(0, 2),
        publications: publications.slice(0, 2),
        experts: researchers.slice(0, 2),
      });
      return;
    }

    const patientConditions = patientProfile.medicalConditions.toLowerCase().split(',').map(c => c.trim());
    if (patientConditions.length === 0 || patientConditions[0] === '') {
      setRecommendations({
        trials: clinicalTrials.slice(0, 2),
        publications: publications.slice(0, 2),
        experts: researchers.slice(0, 2),
      });
      return;
    }

    const recommendedTrials = clinicalTrials.filter(trial => 
      patientConditions.some(condition => 
        trial.keywords.some(kw => kw.toLowerCase().includes(condition))
      )
    ).slice(0, 2);

    const recommendedPublications = publications.filter(pub => 
      patientConditions.some(condition => 
        pub.keywords.some(kw => kw.toLowerCase().includes(condition))
      )
    ).slice(0, 2);

    const recommendedExperts = researchers.filter(expert =>
      patientConditions.some(condition =>
        expert.specialties.some(sp => sp.toLowerCase().includes(condition)) ||
        expert.researchInterests.some(ri => ri.toLowerCase().includes(condition))
      )
    ).slice(0, 2);

    setRecommendations({
      trials: recommendedTrials,
      publications: recommendedPublications,
      experts: recommendedExperts,
    });

  }, [patientProfile, isPatientProfileLoading]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${patientName}!`}
        description="Here are personalized recommendations based on your profile."
      />

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Recommended Clinical Trials</h2>
        {recommendations.trials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.trials.map((trial) => (
              <TrialCard key={trial.id} trial={trial} />
            ))}
          </div>
        ) : (
            <div className="text-center py-8 text-muted-foreground bg-card border rounded-lg">
                <p>No specific clinical trials found for your conditions. Showing general recommendations.</p>
                 <div className="grid gap-6 md:grid-cols-2 p-4">
                    {clinicalTrials.slice(0, 2).map((trial) => (
                      <TrialCard key={trial.id} trial={trial} />
                    ))}
                 </div>
            </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Recommended Publications</h2>
        {recommendations.publications.length > 0 ? (
          <div className="space-y-4">
            {recommendations.publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        ) : (
            <div className="text-center py-8 text-muted-foreground bg-card border rounded-lg">
                <p>No specific publications found for your conditions. Showing general recommendations.</p>
                <div className="space-y-4 p-4">
                    {publications.slice(0, 2).map((pub) => (
                      <PublicationCard key={pub.id} publication={pub} />
                    ))}
                </div>
            </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4">Recommended Health Experts</h2>
        {recommendations.experts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        ) : (
            <div className="text-center py-8 text-muted-foreground bg-card border rounded-lg">
                <p>No specific experts found for your conditions. Showing general recommendations.</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
                    {researchers.slice(0, 2).map((expert) => (
                      <ExpertCard key={expert.id} expert={expert} />
                    ))}
                </div>
            </div>
        )}
      </section>
    </div>
  );
}
