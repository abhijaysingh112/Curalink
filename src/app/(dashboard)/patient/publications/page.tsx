import { PageHeader } from '@/components/page-header';

export default function PublicationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Publications"
        description="Explore research papers and articles relevant to you."
      />
      <div className="text-center py-12 text-muted-foreground">
        <p>Publication search will be implemented here.</p>
      </div>
    </div>
  );
}
