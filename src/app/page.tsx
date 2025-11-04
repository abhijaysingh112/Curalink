import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, TestTube2, Users, BookOpen, UserPlus, Briefcase, FileText, Search, Handshake, Link2 } from 'lucide-react';
import { CuraLinkLogo } from '@/components/curalink-logo';
import { LandingIllustration } from '@/components/landing-illustration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto p-4 sm:p-6 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
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
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto grid lg:grid-cols-2 items-center gap-12">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 text-foreground leading-tight">
                Connect. Discover. Heal.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
                CuraLink bridges the gap between patients and researchers, unlocking access to clinical trials, expert knowledge, and groundbreaking publications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Features For You</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Whether you're a patient seeking treatment or a researcher driving innovation, CuraLink has tools for you.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* For Patients */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">For Patients & Caregivers</CardTitle>
                            <CardDescription>Empower your health journey.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4">
                                <TestTube2 className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Find Clinical Trials</h3>
                                    <p className="text-muted-foreground text-sm">Discover relevant clinical trials based on your unique medical profile.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Connect with Experts</h3>
                                    <p className="text-muted-foreground text-sm">Find and request meetings with leading researchers in your field of interest.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <BookOpen className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Access Simplified Research</h3>
                                    <p className="text-muted-foreground text-sm">Understand complex publications with AI-powered summaries.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* For Researchers */}
                     <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">For Researchers</CardTitle>
                            <CardDescription>Accelerate your research impact.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4">
                                <UserPlus className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Manage Your Trials</h3>
                                    <p className="text-muted-foreground text-sm">List your clinical trials and manage participant recruitment seamlessly.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Briefcase className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Find Collaborators</h3>
                                    <p className="text-muted-foreground text-sm">Connect with peers and build your research network.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <FileText className="h-8 w-8 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">Engage the Community</h3>
                                    <p className="text-muted-foreground text-sm">Share your knowledge and answer questions in community forums.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h2>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Get started in three simple steps.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Search className="h-8 w-8"/>
                        </div>
                        <h3 className="text-xl font-headline font-semibold mb-2">1. Create Your Profile</h3>
                        <p className="text-muted-foreground">Share your story or your expertise. Our AI helps build a structured profile.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Link2 className="h-8 w-8"/>
                        </div>
                        <h3 className="text-xl font-headline font-semibold mb-2">2. Get Personalized Matches</h3>
                        <p className="text-muted-foreground">Our platform intelligently matches you with relevant trials, experts, and publications.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Handshake className="h-8 w-8"/>
                        </div>
                        <h3 className="text-xl font-headline font-semibold mb-2">3. Connect & Collaborate</h3>
                        <p className="text-muted-foreground">Engage in forums, request meetings, and advance medical science together.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CuraLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
