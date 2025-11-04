import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CuraLinkLogo } from '@/components/curalink-logo';
import { LandingIllustration } from '@/components/landing-illustration';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto p-4 sm:p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="CuraLink Home">
          <CuraLinkLogo />
          <span className="font-bold text-xl font-headline text-primary">CuraLink</span>
        </Link>
        <nav>
            <Link href="/login" passHref>
                <Button variant="outline">Sign In</Button>
            </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container mx-auto grid lg:grid-cols-2 items-center gap-12">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 text-foreground leading-tight">
              Connect. Discover. Heal.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              CuraLink bridges the gap between patients and researchers, unlocking access to clinical trials, expert knowledge, and groundbreaking publications.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login?type=patient" passHref>
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold">
                  I am a Patient / Caregiver <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/login?type=researcher" passHref>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold">
                  I am a Researcher
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <LandingIllustration className="w-full max-w-lg h-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}
