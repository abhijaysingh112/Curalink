'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const formSchema = z.object({
  content: z.string().min(10, 'Please enter a question with at least 10 characters.'),
});

interface QuestionFormProps {
    forumId: string;
}

export function QuestionForm({ forumId }: QuestionFormProps) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: '' },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You must be logged in to post a question.',
      });
      return;
    }

    const postsColRef = collection(firestore, 'forums', forumId, 'posts');
    const newPostData = {
        content: values.content,
        userId: user.uid,
        userType: 'patient',
        forumId: forumId,
        timestamp: serverTimestamp(),
      };

    addDocumentNonBlocking(postsColRef, newPostData);
    
    // Optimistically update UI
    form.reset();
    toast({
        title: 'Question Posted!',
        description: 'Your question has been posted for experts to answer.',
    });
  };

  if (!user) {
      return null; // Don't show form if not logged in
  }

  return (
    <Card className="mt-6">
        <CardContent className="pt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea
                                placeholder="Ask your question here... Be specific and provide relevant details."
                                className="min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                           Post Question
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
