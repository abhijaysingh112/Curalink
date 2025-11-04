'use client';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Check, X, Calendar, Clock } from 'lucide-react';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

interface MeetingRequest {
    id: string;
    patientId: string;
    status: 'pending' | 'accepted' | 'rejected';
    requestTime: { toDate: () => Date };
}

interface PatientProfile {
    firstName: string;
    lastName: string;
}

function MeetingRequestCard({ request }: { request: MeetingRequest }) {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    
    const patientDocRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'users', request.patientId);
    }, [firestore, request.patientId]);
    
    const { data: patient, isLoading } = useDoc<PatientProfile>(patientDocRef);

    const handleUpdateStatus = (newStatus: 'accepted' | 'rejected') => {
        if (!firestore) return;
        const requestDocRef = doc(firestore, 'meeting_requests', request.id);
        updateDocumentNonBlocking(requestDocRef, { status: newStatus });
        toast({
            title: `Meeting ${newStatus}`,
            description: `The meeting request from ${patient?.firstName || 'patient'} has been ${newStatus}.`,
        });
    };

    if (isLoading) {
        return <Skeleton className="h-24 w-full" />;
    }
    
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/${request.patientId}/100/100`} />
                    <AvatarFallback>{patient?.firstName?.charAt(0) || 'P'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{patient ? `${patient.firstName} ${patient.lastName}` : 'Loading...'}</p>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(request.requestTime.toDate(), 'PPP')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {format(request.requestTime.toDate(), 'p')}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="icon" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleUpdateStatus('accepted')}>
                    <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleUpdateStatus('rejected')}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function MeetingRequests({ researcherId }: { researcherId: string }) {
    const { firestore } = useFirebase();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'meeting_requests'),
            where('researcherId', '==', researcherId),
            where('status', '==', 'pending')
        );
    }, [firestore, researcherId]);

    const { data: requests, isLoading } = useCollection<MeetingRequest>(requestsQuery);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pending Meeting Requests</CardTitle>
                     <CardDescription>Review and respond to meeting requests from patients.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!requests || requests.length === 0) {
        return null; // Don't show the card if there are no pending requests
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Meeting Requests</CardTitle>
                <CardDescription>Review and respond to meeting requests from patients.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {requests.map(req => <MeetingRequestCard key={req.id} request={req} />)}
                </div>
            </CardContent>
        </Card>
    );
}
