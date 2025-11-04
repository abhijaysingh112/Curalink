'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  HeartPulse,
  TestTube2,
  BookOpen,
  MessagesSquare,
  Star,
  User,
  Users,
  FlaskConical,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  tooltip: string;
};

const patientNavItems: NavItem[] = [
  { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/patient/experts', label: 'Health Experts', icon: HeartPulse, tooltip: 'Health Experts' },
  { href: '/patient/trials', label: 'Clinical Trials', icon: TestTube2, tooltip: 'Clinical Trials' },
  { href: '/patient/publications', label: 'Publications', icon: BookOpen, tooltip: 'Publications' },
  { href: '/patient/forums', label: 'Forums', icon: MessagesSquare, tooltip: 'Forums' },
  { href: '/patient/favorites', label: 'Favorites', icon: Star, tooltip: 'Favorites' },
  { href: '/patient/profile', label: 'Profile', icon: User, tooltip: 'Profile' },
];

const researcherNavItems: NavItem[] = [
    { href: '/researcher/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
    { href: '/researcher/collaborators', label: 'Collaborators', icon: Users, tooltip: 'Collaborators' },
    { href: '/researcher/trials', label: 'Manage Trials', icon: FlaskConical, tooltip: 'Manage Trials' },
    { href: '/researcher/forums', label: 'Forums', icon: MessagesSquare, tooltip: 'Forums' },
    { href: '/researcher/favorites', label: 'Favorites', icon: Star, tooltip: 'Favorites' },
    { href: '/researcher/profile', label: 'Profile', icon: User, tooltip: 'Profile' },
];

export function SidebarNav({ userType }: { userType: 'patient' | 'researcher' }) {
  const pathname = usePathname();
  const navItems = userType === 'patient' ? patientNavItems : researcherNavItems;

  return (
    <nav className="p-2">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.tooltip }}
                className="w-full justify-start"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
