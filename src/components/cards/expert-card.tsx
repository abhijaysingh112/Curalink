'use client';
import { useState, useEffect } from 'react';
import type { Researcher } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCheck, MessageSquare, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useUser, useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { MeetingRequestDialog } from '../meeting-request-dialog';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ExpertCardProps {
  expert: Researcher;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  // Memoize the query to prevent re-renders
  const favoritesQuery = useMemoFirebase(() => {
    if (!user || !firestore || expert.isExternal) return null; // Don't query for external experts
    return query(
      collection(firestore, 'users', user.uid, 'favorites'),
      where('itemType', '==', 'expert'),
      where('itemId', '==', expert.id)
    );
  }, [user, firestore, expert.id, expert.isExternal]);

  // useCollection will update when the query result changes.
  const { data: favorites, isLoading } = useCollection(favoritesQuery);

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      setIsFollowing(true);
      setFavoriteId(favorites[0].id);
    } else {
      setIsFollowing(false);
      setFavoriteId(null);
    }
  }, [favorites]);


  const handleFollow = async () => {
    if (!user || !firestore || expert.isExternal) return;
    const favoritesColRef = collection(firestore, 'users', user.uid, 'favorites');
    
    if (isFollowing && favoriteId) {
      const favDocRef = doc(firestore, 'users', user.uid, 'favorites', favoriteId);
      deleteDocumentNonBlocking(favDocRef);
      setIsFollowing(false);
      setFavoriteId(null);
    } else {
        const newFav = {
            userId: user.uid,
            itemType: 'expert',
            itemId: expert.id,
        };
        const docRef = await addDocumentNonBlocking(favoritesColRef, newFav);
        if (docRef) {
          setFavoriteId(docRef.id);
        }
        setIsFollowing(true);
    }
  };

  const isActionDisabled = !user || expert.isExternal;

  return (
    <>
      <Card className="flex flex-col relative">
        {expert.isExternal && (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="absolute top-2 right-2 p-1.5 bg-secondary text-secondary-foreground rounded-full">
                            <ExternalLink className="h-4 w-4" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>This expert is not on the CuraLink platform.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )}
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
          <Button variant="outline" className="flex-1" onClick={handleFollow} disabled={isActionDisabled || isLoading}>
            {isFollowing ? (
              <UserCheck className="mr-2 h-4 w-4" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          {expert.isAvailableForMeetings && (
              <Button className="flex-1" onClick={() => setIsDialogOpen(true)} disabled={isActionDisabled}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Request Meeting
              </Button>
          )}
        </CardFooter>
      </Card>
      {user && expert.isAvailableForMeetings && !expert.isExternal && (
        <MeetingRequestDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            researcherId={expert.id}
            patientId={user.uid}
        />
      )}
    </>
  );
}
