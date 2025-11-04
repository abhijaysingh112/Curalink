import type { Researcher } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface ExpertCardProps {
  expert: Researcher;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <Image src={expert.avatarUrl} alt={expert.name} width={64} height={64} data-ai-hint={expert.imageHint} />
          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline text-xl">{expert.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{expert.specialties[0]}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Research Interests</h4>
          <div className="flex flex-wrap gap-1">
            {expert.researchInterests.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <UserPlus className="mr-2 h-4 w-4" /> Follow
        </Button>
        {expert.isAvailableForMeetings && (
            <Button className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" /> Request Meeting
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
