'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getMedicalConditions } from '@/app/actions';

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
import { X, Sparkles, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  description: z.string().min(10, 'Please provide a more detailed description.'),
  location: z.string().min(2, 'Please enter a valid location.'),
});

export function ProfileForm() {
  const router = useRouter();
  const [conditions, setConditions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newCondition, setNewCondition] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
    },
  });

  const handleAnalyze = async () => {
    const description = form.getValues('description');
    if (!description) {
      form.setError('description', {
        type: 'manual',
        message: 'Please enter a description to analyze.',
      });
      return;
    }
    setIsAnalyzing(true);
    const detectedConditions = await getMedicalConditions(description);
    setConditions((prev) => [...new Set([...prev, ...detectedConditions])]);
    setIsAnalyzing(false);
  };
  
  const handleAddCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions(prev => [...prev, newCondition.trim()]);
    }
    setNewCondition('');
  };

  const handleRemoveCondition = (conditionToRemove: string) => {
    setConditions(prev => prev.filter(c => c !== conditionToRemove));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would save the profile data
    console.log({ ...values, conditions });
    // For now, we just navigate to the dashboard
    router.push('/patient/dashboard');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Your Story</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I was diagnosed with Brain Cancer two years ago and have undergone chemotherapy...'"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The more details you provide, the better we can personalize your results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="button" variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Analyze and Suggest Conditions
        </Button>
        
        {conditions.length > 0 && (
            <Card>
                <CardContent className="p-4">
                    <FormLabel className="text-lg mb-4 block">Detected & Added Conditions</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {conditions.map(condition => (
                            <Badge key={condition} variant="secondary" className="text-base py-1 pl-3 pr-2">
                                {condition}
                                <button type="button" onClick={() => handleRemoveCondition(condition)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="space-y-2">
          <FormLabel className="text-lg">Add More Conditions</FormLabel>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g., Glioma"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCondition();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddCondition}>Add</Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Your Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New York, USA" {...field} />
              </FormControl>
              <FormDescription>
                This helps in finding clinical trials and experts near you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg">
          Complete Profile & View Dashboard
        </Button>
      </form>
    </Form>
  );
}
