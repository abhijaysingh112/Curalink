import { PageHeader } from '@/components/page-header';
import { PublicationsList } from './_components/publications-list';

export default function PublicationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Publications"
        description="Explore research papers and articles relevant to you."
      />
      <PublicationsList />
    </div>
  );
}
