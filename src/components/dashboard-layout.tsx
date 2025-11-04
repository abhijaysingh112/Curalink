'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { UserNav } from '@/components/user-nav';
import { CuraLinkLogo } from '@/components/curalink-logo';
import Link from 'next/link';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const userType = pathname.includes('/patient') ? 'patient' : 'researcher';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="CuraLink Home">
              <CuraLinkLogo />
              <span className="font-bold text-lg font-headline">CuraLink</span>
            </Link>
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav userType={userType} />
        </SidebarContent>
        <SidebarFooter>
          <UserNav userType={userType} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
           <SidebarTrigger />
           <h1 className="text-lg font-semibold font-headline">CuraLink</h1>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
