'use client';

import { useParams } from 'next/navigation';
import { useFirebase, useDoc, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from './_components/post-card';
import { ReplyForm } from './_components/reply-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface Forum {
    name: string;
    description: string;
}

interface Post {
    id: string;
    content: string;
    userId: string;
    timestamp: { toDate: () => Date };
    userType: 'patient' | 'researcher';
}

export default function ForumPage() {
    const params = useParams();
    const { forumId } = params;
    const { firestore } = useFirebase();
    const { user } = useUser();

    // Fetch Forum Details
    const forumDocRef = useMemoFirebase(() => {
        if (!firestore || !forumId) return null;
        return doc(firestore, 'forums', forumId as string);
    }, [firestore, forumId]);
    const { data: forum, isLoading: isForumLoading } = useDoc<Forum>(forumDocRef);

    // Fetch Posts in Forum
    const postsQuery = useMemoFirebase(() => {
        if (!firestore || !forumId) return null;
        return query(collection(firestore, 'forums', forumId as string, 'posts'), orderBy('timestamp', 'asc'));
    }, [firestore, forumId]);
    const { data: posts, isLoading: arePostsLoading } = useCollection<Post>(postsQuery);

    const patientPost = posts?.find(p => p.userType === 'patient');
    const researcherReplies = posts?.filter(p => p.userType === 'researcher') || [];

    if (isForumLoading || arePostsLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-6 pt-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }
    
    if (!forum) {
        return <PageHeader title="Forum not found" description="This forum does not exist or has been removed." />;
    }

    return (
        <div className="space-y-8">
            <PageHeader title={forum.name} description={forum.description} />
            
            {patientPost ? (
                 <div className="space-y-6">
                    <h2 className="text-xl font-semibold font-headline">Patient's Question</h2>
                    <PostCard post={patientPost} isPatientPost />

                    <h2 className="text-xl font-semibold font-headline pt-4">Expert Answers</h2>
                    {researcherReplies.length > 0 ? (
                        <div className="space-y-4">
                            {researcherReplies.map(reply => (
                                <PostCard key={reply.id} post={reply} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No answers yet. Be the first to reply!</p>
                    )}

                    <ReplyForm forumId={forumId as string} />
                 </div>
            ) : (
                <>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>No Patient Question Found</AlertTitle>
                    <AlertDescription>
                        This forum does not have a question from a patient yet. In a complete application, patients would initiate posts in forums created by researchers.
                    </AlertDescription>
                </Alert>
                <ReplyForm forumId={forumId as string} postAsQuestion />
                </>
            )}
        </div>
    );
}
