import { PageHeader } from '@/components/page-header';

export default function HealthExpertsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Health Experts"
        description="Search for specialists and researchers in your field of interest."
      />
      <div className="text-center py-12 text-muted-foreground">
        <p>Expert search and filtering will be implemented here.</p>
      </div>
    </div>
  );
}
