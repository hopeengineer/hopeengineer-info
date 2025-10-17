'use client';
import { AuthForm } from '@/components/auth-form';

export default function SignupPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
