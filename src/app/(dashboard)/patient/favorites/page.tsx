import { PageHeader } from '@/components/page-header';

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Favorites"
        description="Your saved trials, publications, and experts."
      />
      <div className="text-center py-12 text-muted-foreground">
        <p>Saved items will be displayed here.</p>
      </div>
    </div>
  );
}
