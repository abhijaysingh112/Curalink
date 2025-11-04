import { PageHeader } from '@/components/page-header';
import { TrialsList } from './_components/trials-list';

export default function ClinicalTrialsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Clinical Trials"
        description="Search for trials based on your condition, location, and other criteria."
      />
      <TrialsList />
    </div>
  );
}
