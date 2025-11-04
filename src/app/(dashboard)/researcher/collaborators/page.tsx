'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { ExpertCard } from '@/components/cards/expert-card';
import type { Researcher } from '@/lib/types';
import { researchers as mockResearchers } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export default function CollaboratorsPage() {
    const [researchers, setResearchers] = useState<Researcher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { firestore } = useFirebase();

    useEffect(() => {
        const fetchResearchers = async () => {
            if (!firestore) return;
            setIsLoading(true);

            // This is a simplified fetch. In a real-world app with many users,
            // this would need pagination and more robust querying/indexing.
            try {
                const q = query(collection(firestore, 'users'));
                const querySnapshot = await getDocs(q);
                const allUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                const researcherProfilesPromises = allUsers
                    .filter((user: any) => user.userType === 'researcher')
                    .map(async (user: any) => {
                        const profileSnap = await getDocs(query(collection(firestore, 'users', user.id, 'researcher_profile')));
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
                        return null;
                    });
                
                const resolvedProfiles = (await Promise.all(researcherProfilesPromises)).filter(p => p !== null) as Researcher[];
                setResearchers(resolvedProfiles);

            } catch (error) {
                console.error("Error fetching researchers:", error);
                // Fallback to mock data on error
                setResearchers(mockResearchers);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResearchers();
    }, [firestore]);

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
