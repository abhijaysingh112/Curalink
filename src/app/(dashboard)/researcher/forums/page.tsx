import { PageHeader } from '@/components/page-header';

export default function ForumsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Forums"
        description="Create communities, lead discussions, and answer questions."
      />
      <div className="text-center py-12 text-muted-foreground">
        <p>Community forums will be implemented here.</p>
      </div>
    </div>
  );
}
