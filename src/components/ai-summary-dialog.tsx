'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface AiSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  contentToSummarize: string;
  summaryAction: (content: string) => Promise<string>;
}

export function AiSummaryDialog({
  open,
  onOpenChange,
  title,
  contentToSummarize,
  summaryAction,
}: AiSummaryDialogProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');
    const result = await summaryAction(contentToSummarize);
    setSummary(result);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{title}</DialogTitle>
          <DialogDescription>
            Read the full details below or generate an AI-powered summary.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleSummarize} disabled={isLoading} variant="outline">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {summary ? 'Regenerate Summary' : 'Generate AI Summary'}
          </Button>

          {isLoading && (
            <div className="space-y-2 rounded-lg border p-4">
               <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted" />
               <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
               <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted" />
            </div>
          )}

          {summary && (
            <div className="rounded-lg border bg-accent/50 p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Summary
              </h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          <ScrollArea className="h-60 w-full rounded-md border p-4">
            <h3 className="font-semibold mb-2">Full Details</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contentToSummarize}
            </p>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
