import { PageHeader } from '@/components/page-header';
import { ProfileForm } from './_components/profile-form';

export default function PatientProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader
        title="Create Your Patient Profile"
        description="Describe your medical history or conditions in your own words. Our AI will help build a profile to find relevant information for you."
      />
      <ProfileForm />
    </div>
  );
}
