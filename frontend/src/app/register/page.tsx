"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please enter name, email, and password');
      return;
    }

    try {
      setLoading(true);
      await authService.register(name, email, password);
      toast.success('Registered successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full  p-8">
        <h1 className="font-headline-lg text-primary text-center mb-6">Create an Account</h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          <Input 
            label="Name" 
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="john@cindro.com" 
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <Button className="w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          <div className="text-center mt-4 text-sm text-foreground/80">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
