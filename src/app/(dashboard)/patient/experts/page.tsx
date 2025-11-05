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
import { getExternalExperts } from '@/app/actions';

export default function HealthExpertsPage() {
    const [internalResearchers, setInternalResearchers] = useState<Researcher[]>([]);
    const [externalResearchers, setExternalResearchers] = useState<Researcher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { firestore } = useFirebase();

    // Memoize the query to fetch users who are researchers
    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), where("userType", "==", "researcher"));
    }, [firestore]);

    // Use a hook to get the researcher user documents from Firestore
    const { data: researcherUsers, isLoading: usersLoading, error: usersError } = useCollection<any>(usersQuery);

    // Effect for fetching internal researchers from Firestore
    useEffect(() => {
        if (usersLoading || !firestore) {
            setIsLoading(true);
            return;
        }
        
        if (usersError) {
             console.error("Error fetching researchers:", usersError);
             setIsLoading(false);
             setInternalResearchers([]); // Clear data on error
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
                                avatarUrl: `https://picsum.photos/seed/${user.id}/100/100`,
                                imageHint: 'researcher portrait',
                                specialties: profile.specialties || [],
                                researchInterests: profile.researchInterests || [],
                                publications: [], 
                                isAvailableForMeetings: profile.availableForMeetings || false,
                                isExternal: false,
                            } as Researcher;
                        }
                    } catch (e: any) {
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
                setInternalResearchers(resolvedProfiles);
                setIsLoading(false);
            };
            fetchProfiles();
        } else {
             setIsLoading(false);
             setInternalResearchers([]);
        }

    }, [researcherUsers, usersLoading, usersError, firestore]);
    
    // Effect for fetching external experts
    useEffect(() => {
        const fetchExternal = async () => {
            setIsLoading(true);
            const external = await getExternalExperts();
            setExternalResearchers(external);
            setIsLoading(false);
        }
        fetchExternal();
    }, []);

    // Combine and filter all researchers
    const allResearchers = [...internalResearchers, ...externalResearchers];
    const filteredResearchers = allResearchers.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.researchInterests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Health Experts"
                description="Search for specialists and researchers in your field of interest, including experts from outside the CuraLink platform."
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

            {isLoading && allResearchers.length === 0 ? (
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
