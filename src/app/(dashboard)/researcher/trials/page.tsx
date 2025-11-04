import { PageHeader } from '@/components/page-header';

export default function ManageTrialsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Clinical Trials"
        description="Add new trials and update your existing ones."
      />
      <div className="text-center py-12 text-muted-foreground">
        <p>Trial management tools will be implemented here.</p>
      </div>
    </div>
  );
}
