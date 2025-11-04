'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { getPublications } from '@/app/actions';
import type { Publication } from '@/lib/types';
import { PublicationCard } from '@/components/cards/publication-card';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function PublicationsList() {
  const [allPublications, setAllPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoading(true);
      const publications = await getPublications();
      setAllPublications(publications);
      setIsLoading(false);
    };
    fetchPublications();
  }, []);

  const filteredPublications = allPublications.filter((pub) => {
    const searchLower = searchTerm.toLowerCase();
    return pub.title.toLowerCase().includes(searchLower) ||
      pub.authors.some(a => a.toLowerCase().includes(searchLower)) ||
      pub.keywords.some(k => k.toLowerCase().includes(searchLower));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or keyword"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))
          ) : (
            <div className="text-center text-muted-foreground col-span-full py-12">
              <p>No publications found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
