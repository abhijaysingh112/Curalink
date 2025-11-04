'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { User, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostCardProps {
    post: {
        id: string;
        content: string;
        userId: string;
        timestamp: { toDate: () => Date };
    };
    isPatientPost?: boolean;
}

interface UserProfile {
    firstName: string;
    lastName: string;
    userType: 'patient' | 'researcher';
}

export function PostCard({ post, isPatientPost = false }: PostCardProps) {
    const { firestore } = useFirebase();
    const [userName, setUserName] = useState('Loading...');
    const [userType, setUserType] = useState<'patient' | 'researcher' | null>(null);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !post.userId) return null;
        return doc(firestore, 'users', post.userId);
    }, [firestore, post.userId]);

    const { data: userProfile, isLoading } = useDoc<UserProfile>(userDocRef);

    useEffect(() => {
        if (userProfile) {
            setUserName(`${userProfile.firstName} ${userProfile.lastName}`);
            setUserType(userProfile.userType);
        } else if (!isLoading) {
            setUserName('Anonymous');
        }
    }, [userProfile, isLoading]);

    const timeAgo = post.timestamp ? formatDistanceToNow(post.timestamp.toDate(), { addSuffix: true }) : 'just now';

    const UserIcon = userType === 'patient' ? HeartPulse : User;
    const avatarSeed = userType === 'patient' ? post.userId : `researcher-${post.userId}`;

    if (isLoading) {
        return (
            <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }
    
    return (
        <Card className={cn(isPatientPost && 'bg-accent/50 border-primary/50')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={`https://picsum.photos/seed/${avatarSeed}/100/100`} />
                        <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userType === 'patient' ? 'Patient' : 'Researcher'}</p>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{post.content}</p>
            </CardContent>
        </Card>
    );
}
