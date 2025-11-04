'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

interface UserNavProps {
  userType: 'patient' | 'researcher';
}

export function UserNav({ userType }: UserNavProps) {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const profileLink = `/${userType}/profile`;
  const avatarSeed = userType === 'patient' ? 'patient-1' : 'expert-2';

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<{firstName: string, lastName: string, email: string}>(userDocRef);

  useEffect(() => {
    if (isUserLoading) {
      setUserName('Loading...');
      setUserEmail('');
      return;
    }

    if (userProfile) {
      setUserName(`${userProfile.firstName} ${userProfile.lastName}`);
      setUserEmail(userProfile.email);
    } else if (user) {
      setUserName(user.displayName || 'Anonymous User');
      setUserEmail(user.email || '');
    } else {
        const defaultName = userType === 'patient' ? 'Jane Doe' : 'Dr. Alan Grant';
        const defaultEmail = userType === 'patient' ? 'jane.doe@email.com' : 'alan.grant@email.com';
        setUserName(defaultName);
        setUserEmail(defaultEmail);
    }
  }, [user, userProfile, isUserLoading, userType]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-2 p-2"
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={`https://picsum.photos/seed/${avatarSeed}/100/100`}
              alt={userName}
            />
            <AvatarFallback>{isUserLoading ? '' : userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left group-data-[state=expanded]:block">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={profileLink}>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/">
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
