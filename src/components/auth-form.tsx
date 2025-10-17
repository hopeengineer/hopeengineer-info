'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { initiateEmailSignIn, initiateEmailSignUp, useAuth } from '@/firebase';
import { GoogleIcon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

const signupSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const isLogin = mode === 'login';
  const schema = isLogin ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    if (!auth) return;
    if (isLogin) {
      initiateEmailSignIn(auth, data.email, data.password);
    } else {
      initiateEmailSignUp(auth, data.email, data.password);
    }
  }

  const handleGoogleSignIn = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error('Google sign-in error', error);
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Enter your credentials to access your account.'
            : 'Enter your email and password to sign up.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        {isLogin ? (
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold underline">
              Login
            </Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
