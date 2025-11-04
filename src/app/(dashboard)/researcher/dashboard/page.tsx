import { PageHeader } from '@/components/page-header';

export default function ResearcherDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Researcher Dashboard"
        description="An overview of your trials, collaborations, and community engagement."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card border rounded-lg">
          <h3 className="font-semibold text-lg">Manage Clinical Trials</h3>
          <p className="text-muted-foreground mt-2">View your active trials, add new ones, and manage recruitment.</p>
        </div>
        <div className="p-6 bg-card border rounded-lg">
          <h3 className="font-semibold text-lg">Find Collaborators</h3>
          <p className="text-muted-foreground mt-2">Discover and connect with peers in your field of research.</p>
        </div>
        <div className="p-6 bg-card border rounded-lg">
          <h3 className="font-semibold text-lg">Engage in Forums</h3>
          <p className="text-muted-foreground mt-2">Answer patient questions and contribute to community discussions.</p>
        </div>
      </div>
       <div className="text-center py-12 text-muted-foreground">
        <p>Detailed dashboard components will be implemented here.</p>
      </div>
    </div>
  );
}
