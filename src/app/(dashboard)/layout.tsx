
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
    // If we are not on a loading state, we have a user, but we're not on the profile page and the profile doc doesn't exist...
    if (!isUserLoading && !isProfileLoading && user && !isProfilePage && !profile) {
      // ...redirect to the profile page.
      router.replace(profilePath);
    }
  }, [isUserLoading, isProfileLoading, user, profile, isProfilePage, profilePath, router]);

  // While checking, show a loading skeleton to prevent flashes of content
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
  
  // If user is on profile page, or has a profile, or is not logged in yet, show the children
  return <DashboardLayoutComponent userType={userType}>{children}</DashboardLayoutComponent>;
}
