'use client';

import { PageHeader } from '@/components/page-header';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessagesSquare } from 'lucide-react';
import { CreateForumDialog } from './_components/create-forum-dialog';

interface Forum {
    id: string;
    name: string;
    description: string;
    patientId: string;
}

export default function ForumsPage() {
    const { firestore } = useFirebase();

    const forumsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'forums'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: forums, isLoading } = useCollection<Forum>(forumsQuery);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <PageHeader
                    title="Community Forums"
                    description="Ask questions and engage in discussions with experts."
                />
                <CreateForumDialog />
            </div>

            {isLoading && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                </div>
            )}

            {!isLoading && forums && forums.length > 0 && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {forums.map(forum => (
                        <Card key={forum.id}>
                            <CardHeader>
                                <CardTitle className="font-headline">{forum.name}</CardTitle>
                                <CardDescription className="truncate">{forum.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/patient/forums/${forum.id}`} passHref>
                                    <Button className="w-full">
                                        <MessagesSquare className="mr-2 h-4 w-4" />
                                        View Discussion
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!isLoading && (!forums || forums.length === 0) && (
                <div className="text-center py-12 text-muted-foreground bg-card border rounded-lg">
                    <p className="font-semibold">No questions have been asked yet.</p>
                    <p>Be the first to ask a question and start a discussion!</p>
                </div>
            )}
        </div>
    );
}
