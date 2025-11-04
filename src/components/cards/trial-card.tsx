'use client';

import { useState } from 'react';
import type { ClinicalTrial } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, Sparkles } from 'lucide-react';
import { AiSummaryDialog } from '@/components/ai-summary-dialog';
import { getTrialSummary } from '@/app/actions';

interface TrialCardProps {
  trial: ClinicalTrial;
}

export function TrialCard({ trial }: TrialCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const statusVariant = (status: ClinicalTrial['status']) => {
    switch (status) {
      case 'Recruiting':
        return 'default';
      case 'Completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="font-headline text-lg">{trial.title}</CardTitle>
            <Badge variant={statusVariant(trial.status)} className="flex-shrink-0">{trial.status}</Badge>
          </div>
          <CardDescription className="flex items-center gap-2 pt-1">
            <MapPin className="h-4 w-4" />
            {trial.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {trial.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">{keyword}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsDetailsOpen(true)}>
            <Info className="mr-2 h-4 w-4" />
            View Details & AI Summary
          </Button>
        </CardFooter>
      </Card>
      <AiSummaryDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={trial.title}
        contentToSummarize={trial.details}
        summaryAction={getTrialSummary}
      />
    </>
  );
}
