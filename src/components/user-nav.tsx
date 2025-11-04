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

interface UserNavProps {
  userType: 'patient' | 'researcher';
}

export function UserNav({ userType }: UserNavProps) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const profileLink = `/${userType}/profile`;
  const avatarSeed = userType === 'patient' ? 'patient-1' : 'expert-2';
  const defaultName = userType === 'patient' ? 'Jane Doe' : 'Dr. Alan Grant';
  const defaultEmail = userType === 'patient' ? 'jane.doe@email.com' : 'alan.grant@email.com';

  useEffect(() => {
    const profileKey = userType === 'patient' ? 'patientProfile' : 'researcherProfile';
    const storedProfile = localStorage.getItem(profileKey);
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserName(profile.name || defaultName);
      // Assuming email isn't in the profile, so we'll keep the default for now
      setUserEmail(profile.email || defaultEmail); 
    } else {
        setUserName(defaultName);
        setUserEmail(defaultEmail);
    }
  }, [userType, defaultName, defaultEmail]);

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
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
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
