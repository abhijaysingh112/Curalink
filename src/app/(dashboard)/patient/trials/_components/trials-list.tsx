'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getClinicalTrials } from '@/app/actions';
import type { ClinicalTrial } from '@/lib/types';
import { TrialCard } from '@/components/cards/trial-card';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function TrialsList() {
  const [allTrials, setAllTrials] = useState<ClinicalTrial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchTrials = async () => {
      setIsLoading(true);
      const trials = await getClinicalTrials();
      setAllTrials(trials);
      setIsLoading(false);
    };
    fetchTrials();
  }, []);

  const filteredTrials = allTrials.filter((trial) => {
    const matchesSearch = trial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || trial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by keyword (e.g., Immunotherapy)"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Recruiting">Recruiting</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Not yet recruiting">Not yet recruiting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTrials.length > 0 ? (
            filteredTrials.map((trial) => <TrialCard key={trial.id} trial={trial} />)
          ) : (
            <div className="text-center text-muted-foreground col-span-full py-12">
              <p>No trials found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
