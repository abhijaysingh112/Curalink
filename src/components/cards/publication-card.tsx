'use client';

import { useState } from 'react';
import type { Publication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { AiSummaryDialog } from '@/components/ai-summary-dialog';
import { getPublicationSummary } from '@/app/actions';

interface PublicationCardProps {
  publication: Publication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">{publication.title}</CardTitle>
          <CardDescription>
            {publication.authors.join(', ')} - {publication.journal}, {publication.year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {publication.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">{keyword}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href={publication.url} target="_blank" rel="noopener noreferrer" passHref>
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Read Paper
            </Button>
          </Link>
          {publication.summary && (
            <Button onClick={() => setIsSummaryOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Summary
            </Button>
          )}
        </CardFooter>
      </Card>
      {publication.summary && (
        <AiSummaryDialog
          open={isSummaryOpen}
          onOpenChange={setIsSummaryOpen}
          title={publication.title}
          contentToSummarize={publication.summary}
          summaryAction={getPublicationSummary}
        />
      )}
    </>
  );
}
