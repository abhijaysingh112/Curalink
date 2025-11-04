'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { ExpertCard } from '@/components/cards/expert-card';
import type { Researcher } from '@/lib/types';
import { researchers as mockResearchers } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function CollaboratorsPage() {
    const [researchers, setResearchers] = useState<Researcher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { firestore } = useFirebase();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Query for users who are researchers
        return query(collection(firestore, 'users'), where("userType", "==", "researcher"));
    }, [firestore]);

    // Use useCollection for live updates, though getDocs would also work for a one-time fetch.
    const { data: researcherUsers, isLoading: usersLoading, error: usersError } = useCollection<any>(usersQuery);

    useEffect(() => {
        if (usersLoading || !firestore) {
            setIsLoading(true);
            return;
        }
        
        if (usersError) {
             // The useCollection hook already emits the error, so we just log it and handle UI state.
             console.error("Error fetching researcher users:", usersError);
             setIsLoading(false);
             // Optionally fallback to mock data if needed
             setResearchers(mockResearchers);
             return;
        }

        if (researcherUsers) {
            const fetchProfiles = async () => {
                const profilesPromises = researcherUsers.map(async (user) => {
                    const profileCollectionRef = collection(firestore, 'users', user.id, 'researcher_profile');
                    try {
                        const profileSnap = await getDocs(profileCollectionRef);
                        if (!profileSnap.empty) {
                            const profile = profileSnap.docs[0].data();
                            return {
                                id: user.id,
                                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                                avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`, // Placeholder
                                imageHint: 'researcher portrait', // Placeholder
                                specialties: profile.specialties || [],
                                researchInterests: profile.researchInterests || [],
                                publications: [], // This would require another query
                                isAvailableForMeetings: profile.availableForMeetings || false,
                            } as Researcher;
                        }
                    } catch (e: any) {
                        // If fetching subcollection fails, emit error
                        const contextualError = new FirestorePermissionError({
                            operation: 'list',
                            path: profileCollectionRef.path
                        });
                        errorEmitter.emit('permission-error', contextualError);
                        console.error(`Could not fetch profile for ${user.id}:`, e);
                    }
                    return null;
                });

                const resolvedProfiles = (await Promise.all(profilesPromises)).filter(p => p !== null) as Researcher[];
                setResearchers(resolvedProfiles);
                setIsLoading(false);
            };
            fetchProfiles();
        } else {
             setIsLoading(false);
             setResearchers([]);
        }

    }, [researcherUsers, usersLoading, usersError, firestore]);

    const filteredResearchers = researchers.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.researchInterests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Find Collaborators"
                description="Connect with other researchers and experts in the CuraLink network."
            />
            
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by name, specialty, or research interest"
                    className="pl-10 max-w-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredResearchers.length > 0 ? (
                        filteredResearchers.map((expert) => (
                            <ExpertCard key={expert.id} expert={expert} />
                        ))
                    ) : (
                         <div className="text-center py-12 text-muted-foreground col-span-full">
                            <p>No researchers found matching your criteria.</p>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
}
