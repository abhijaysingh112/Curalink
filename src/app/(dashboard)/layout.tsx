
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { DashboardLayout as DashboardLayoutComponent } from '@/components/dashboard-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const userType = pathname.includes('/patient') ? 'patient' : 'researcher';
  const profilePath = `/${userType}/profile`;
  const isProfilePage = pathname === profilePath;

  const profileDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const profileCollection = userType === 'patient' ? 'patient_profile' : 'researcher_profile';
    return doc(firestore, 'users', user.uid, profileCollection, user.uid);
  }, [user, firestore, userType]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileDocRef);
  
  useEffect(() => {
    // Wait until both user and profile loading states are resolved
    if (isUserLoading || isProfileLoading) {
      return; // Don't do anything while loading
    }
    
    // If we have a logged-in user, but they don't have a profile document...
    if (user && !profile) {
        // ...and they are NOT already on the profile page, redirect them.
        if (!isProfilePage) {
            router.replace(profilePath);
        }
    }
  }, [user, profile, isUserLoading, isProfileLoading, isProfilePage, profilePath, router]);

  // While loading, if the user is not on the profile page, show a skeleton.
  // This prevents content flashes and shows a loading state.
  if ((isUserLoading || isProfileLoading) && !isProfilePage) {
    return (
      <DashboardLayoutComponent userType={userType}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-2/3" />
          <div className="pt-8 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        </div>
      </DashboardLayoutComponent>
    );
  }
  
  // If loading is complete, or if it's the profile page, render the children
  return <DashboardLayoutComponent userType={userType}>{children}</DashboardLayoutComponent>;
}
