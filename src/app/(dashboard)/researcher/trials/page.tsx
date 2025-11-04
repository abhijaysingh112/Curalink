import { PageHeader } from '@/components/page-header';
import { TrialsList } from '@/app/(dashboard)/patient/trials/_components/trials-list';

export default function ManageTrialsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Clinical Trials"
        description="View all available clinical trials."
      />
      <TrialsList />
    </div>
  );
}
