'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { ExpertCard } from '@/components/cards/expert-card';
import type { Researcher } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function HealthExpertsPage() {
    const [researchers, setResearchers] = useState<Researcher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { firestore } = useFirebase();

    // Memoize the query to fetch users who are researchers
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), where("userType", "==", "researcher"));
    }, [firestore]);

    // Use a hook to get the researcher user documents
    const { data: researcherUsers, isLoading: usersLoading, error: usersError } = useCollection<any>(usersQuery);

    useEffect(() => {
        if (usersLoading || !firestore) {
            setIsLoading(true);
            return;
        }
        
        if (usersError) {
             console.error("Error fetching researchers:", usersError);
             setIsLoading(false);
             setResearchers([]); // Clear data on error
             return;
        }

        if (researcherUsers) {
            const fetchProfiles = async () => {
                // For each researcher user, fetch their corresponding profile from the subcollection
                const profilesPromises = researcherUsers.map(async (user) => {
                    const profileCollectionRef = collection(firestore, 'users', user.id, 'researcher_profile');
                    try {
                        const profileSnap = await getDocs(profileCollectionRef);
                        if (!profileSnap.empty) {
                            const profile = profileSnap.docs[0].data();
                            // Combine user and profile data into the Researcher type
                            return {
                                id: user.id,
                                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                                avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`,
                                imageHint: 'researcher portrait',
                                specialties: profile.specialties || [],
                                researchInterests: profile.researchInterests || [],
                                publications: [], // Note: This would require another query to populate fully
                                isAvailableForMeetings: profile.availableForMeetings || false,
                            } as Researcher;
                        }
                    } catch (e: any) {
                        // Emit a contextual error if fetching a subcollection fails
                        const contextualError = new FirestorePermissionError({
                            operation: 'list',
                            path: profileCollectionRef.path
                        });
                        errorEmitter.emit('permission-error', contextualError);
                        console.error(`Could not fetch profile for ${user.id}:`, e);
                    }
                    return null;
                });

                // Wait for all profile fetches to complete and filter out any nulls (errors)
                const resolvedProfiles = (await Promise.all(profilesPromises)).filter(p => p !== null) as Researcher[];
                setResearchers(resolvedProfiles);
                setIsLoading(false);
            };
            fetchProfiles();
        } else {
             // No researcher users found
             setIsLoading(false);
             setResearchers([]);
        }

    }, [researcherUsers, usersLoading, usersError, firestore]);

    // Filter researchers based on the search term
    const filteredResearchers = researchers.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.researchInterests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Health Experts"
                description="Search for specialists and researchers in your field of interest."
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
                            <p>No experts found matching your criteria.</p>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
}
