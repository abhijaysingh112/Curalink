import { PageHeader } from '@/components/page-header';

export default function ResearcherProfilePage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Create Your Researcher Profile"
        description="Showcase your expertise to connect with patients and collaborators."
      />
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
        <p>Researcher profile form will be implemented here.</p>
      </div>
    </div>
  );
}
