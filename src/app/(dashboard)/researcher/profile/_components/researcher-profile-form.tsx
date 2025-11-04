'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { useFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  bio: z.string().min(10, 'Please provide a professional bio.'),
  location: z.string().min(2, 'Please enter your location (e.g., university, city).'),
  orcidId: z.string().optional(),
  researchGateId: z.string().optional(),
  isAvailableForMeetings: z.boolean().default(false),
});

export function ResearcherProfileForm() {
  const router = useRouter();
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [researchInterests, setResearchInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      orcidId: '',
      researchGateId: '',
      isAvailableForMeetings: false,
    },
  });
  
  const handleAddItem = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    newItemSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (item.trim() && !list.includes(item.trim())) {
      setter(prev => [...prev, item.trim()]);
    }
    newItemSetter('');
  };

  const handleRemoveItem = (
    itemToRemove: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(prev => prev.filter(c => c !== itemToRemove));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) return;
    
    const { name, isAvailableForMeetings, orcidId, researchGateId } = values;

    const researcherProfileData = {
        id: user.uid,
        userId: user.uid,
        specialties,
        researchInterests,
        availableForMeetings: isAvailableForMeetings,
        orcidId: orcidId || '',
        researchGateId: researchGateId || '',
    };

    const userProfileData = {
        id: user.uid,
        userType: 'researcher',
        email: user.email,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
    };
    
    const researcherProfileRef = doc(firestore, 'users', user.uid, 'researcher_profile', user.uid);
    const userProfileRef = doc(firestore, 'users', user.uid);
    
    setDocumentNonBlocking(researcherProfileRef, researcherProfileData, { merge: true });
    setDocumentNonBlocking(userProfileRef, userProfileData, { merge: true });

    // For instant UI update, we'll still use local storage for the dashboard redirect
    localStorage.setItem('researcherProfile', JSON.stringify({ name: values.name }));
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));

    router.push('/researcher/dashboard');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. Alan Grant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Professional Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I am an oncologist at the National Cancer Institute with a focus on...'"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe your expertise and research focus.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <FormLabel className="text-lg">Your Specialties</FormLabel>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g., Oncology"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(newSpecialty, specialties, setSpecialties, setNewSpecialty);
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={() => handleAddItem(newSpecialty, specialties, setSpecialties, setNewSpecialty)}>Add</Button>
            </div>
          </div>
          {specialties.length > 0 && (
              <Card>
                  <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                          {specialties.map(item => (
                              <Badge key={item} variant="secondary" className="text-base py-1 pl-3 pr-2">
                                  {item}
                                  <button type="button" onClick={() => handleRemoveItem(item, setSpecialties)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                      <X className="h-3 w-3" />
                                  </button>
                              </Badge>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <FormLabel className="text-lg">Research Interests</FormLabel>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g., Cancer Vaccines"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(newInterest, researchInterests, setResearchInterests, setNewInterest);
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={() => handleAddItem(newInterest, researchInterests, setResearchInterests, setNewInterest)}>Add</Button>
            </div>
          </div>
          {researchInterests.length > 0 && (
              <Card>
                  <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                          {researchInterests.map(item => (
                              <Badge key={item} variant="outline" className="text-base py-1 pl-3 pr-2">
                                  {item}
                                  <button type="button" onClick={() => handleRemoveItem(item, setResearchInterests)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                      <X className="h-3 w-3" />
                                  </button>
                              </Badge>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="orcidId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">ORCID ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="0000-0000-0000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="researchGateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">ResearchGate Profile (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alan-Grant-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Your Institution / Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., CuraLink Institute, San Francisco" {...field} />
              </FormControl>
              <FormDescription>
                This helps patients and other researchers find you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isAvailableForMeetings"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Available for Meetings</FormLabel>
                <FormDescription>
                  Allow patients to request introductory meetings with you.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" disabled={!user}>
          Complete Profile & View Dashboard
        </Button>
      </form>
    </Form>
  );
}
