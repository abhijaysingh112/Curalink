import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clinicalTrials, publications, researchers } from '@/lib/data';
import { TrialCard } from '@/components/cards/trial-card';
import { PublicationCard } from '@/components/cards/publication-card';
import { ExpertCard } from '@/components/cards/expert-card';

export default function PatientDashboardPage() {
  const recommendedTrials = clinicalTrials.slice(0, 2);
  const recommendedPublications = publications.slice(0, 2);
  const recommendedExperts = researchers.slice(0, 2);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Dashboard"
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
