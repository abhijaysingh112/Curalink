import { PageHeader } from '@/components/page-header';
import { ResearcherProfileForm } from './_components/researcher-profile-form';

export default function ResearcherProfilePage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Create Your Researcher Profile"
        description="Showcase your expertise to connect with patients and collaborators."
      />
      <ResearcherProfileForm />
    </div>
  );
}
