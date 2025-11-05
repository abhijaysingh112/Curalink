'use client';
import { useParams } from 'next/navigation';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, FlaskConical, Mail, MapPin, ExternalLink, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

interface ResearcherProfile {
    bio: string;
    specialties: string[];
    researchInterests: string[];
    location: string;
    orcidId?: string;
    researchGateId?: string;
}


export default function ExpertDetailPage() {
    const params = useParams();
    const { id } = params;
    const { firestore } = useFirebase();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'users', id as string);
    }, [firestore, id]);
    
    const researcherProfileDocRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'users', id as string, 'researcher_profile', id as string);
    }, [firestore, id]);

    const { data: userProfile, isLoading: isUserLoading } = useDoc<UserProfile>(userDocRef);
    const { data: researcherProfile, isLoading: isResearcherLoading } = useDoc<ResearcherProfile>(researcherProfileDocRef);

    const isLoading = isUserLoading || isResearcherLoading;
    const expertName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Expert';

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <Skeleton className="h-48 w-full md:col-span-2" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }
    
    if (!userProfile || !researcherProfile) {
        return (
            <PageHeader
              title="Expert Not Found"
              description="The profile you are looking for does not exist or could not be loaded."
            />
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={`https://picsum.photos/seed/${id}/200/200`} alt={expertName} />
                    <AvatarFallback className="text-3xl">{expertName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl font-bold font-headline">{expertName}</h1>
                    <p className="text-lg text-muted-foreground">{researcherProfile.specialties[0]}</p>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Bio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{researcherProfile.bio}</p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> Specialties</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {researcherProfile.specialties.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FlaskConical /> Research Interests</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {researcherProfile.researchInterests.map(i => <Badge key={i} variant="outline">{i}</Badge>)}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{researcherProfile.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">{userProfile.email}</span>
                            </div>
                            {researcherProfile.orcidId && (
                                <div className="flex items-center gap-3">
                                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                                    <Link href={`https://orcid.org/${researcherProfile.orcidId}`} target="_blank" className="text-sm text-primary hover:underline">
                                        ORCID Profile
                                    </Link>
                                </div>
                            )}
                            {researcherProfile.researchGateId && (
                                <div className="flex items-center gap-3">
                                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                                    <Link href={`https://www.researchgate.net/profile/${researcherProfile.researchGateId}`} target="_blank" className="text-sm text-primary hover:underline">
                                        ResearchGate
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Button size="lg" className="w-full">Request a Meeting</Button>
                </div>
            </div>

        </div>
    );
}
