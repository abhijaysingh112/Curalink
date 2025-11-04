'use client';

import { useParams } from 'next/navigation';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, where } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { PostCard } from './_components/post-card';
import { QuestionForm } from './_components/question-form';

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

    // A single forum should have only one patient question.
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
                    <h2 className="text-xl font-semibold font-headline">The Question</h2>
                    <PostCard post={patientPost} isPatientPost />

                    <h2 className="text-xl font-semibold font-headline pt-4">Expert Answers</h2>
                    {researcherReplies.length > 0 ? (
                        <div className="space-y-4">
                            {researcherReplies.map(reply => (
                                <PostCard key={reply.id} post={reply} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No expert answers yet. Check back soon.</p>
                    )}
                 </div>
            ) : (
                <>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Be the First to Ask!</AlertTitle>
                    <AlertDescription>
                        No one has asked a question in this forum yet. Use the form below to post your question to the experts.
                    </AlertDescription>
                </Alert>
                <QuestionForm forumId={forumId as string} />
                </>
            )}
        </div>
    );
}
