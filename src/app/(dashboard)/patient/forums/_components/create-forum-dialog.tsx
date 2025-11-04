'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useUser, useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(5, 'Question title must be at least 5 characters.'),
  description: z.string().min(10, 'Please provide more details for your question.'),
});

export function CreateForumDialog() {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a forum.',
      });
      return;
    }
    
    try {
      const forumsColRef = collection(firestore, 'forums');
      const newForumData = {
          name: values.name,
          description: values.description, // Keep description for list view
          patientId: user.uid,
          createdAt: serverTimestamp(),
      };
      
      // Create the forum document and get its reference
      const forumDocRef = await addDoc(forumsColRef, newForumData);

      // Immediately add the initial question as the first post in the forum
      const postsColRef = collection(firestore, 'forums', forumDocRef.id, 'posts');
      addDocumentNonBlocking(postsColRef, {
          content: values.description,
          userId: user.uid,
          userType: 'patient',
          forumId: forumDocRef.id,
          timestamp: serverTimestamp(),
      });

      toast({
        title: 'Question Posted!',
        description: `Your question "${values.name}" is now live for experts to answer.`,
      });
      form.reset();
      setIsOpen(false);

    } catch (error) {
       console.error("Error creating forum:", error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Could not post your question. Please try again.',
       });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ask a New Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ask a New Question</DialogTitle>
          <DialogDescription>
            Create a new discussion topic for researchers to answer. Your detailed question will be the first post.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Best treatments for Glioma?" {...field} />
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
                  <FormLabel>Your Question in Detail</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide background, what you've tried, and what you want to know."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Question
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
