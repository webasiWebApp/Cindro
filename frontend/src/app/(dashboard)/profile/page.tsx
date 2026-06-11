"use client";
import React, { useEffect, useState } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    authService.getMe()
      .then((data) => {
        setUser(data);
        setName(data.name);
      })
      .catch(() => {
        // Ignore or handle
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const updateData: any = { name };
      if (password) {
        updateData.password = password;
      }
      
      const updatedUser = await authService.updateProfile(updateData);
      setUser(updatedUser);
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile updated successfully');
      
      // Reload to update sidebar and context
      window.location.reload(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-secondary animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="font-headline-lg text-primary">Your Profile</h1>
      
      <Card className="p-8 space-y-6 bg-surface shadow-sm border border-border-hairline">
        <div className="flex items-center gap-6 pb-6 border-b border-border-hairline">
          <div className="w-20 h-20 rounded-full bg-secondary-container text-primary flex items-center justify-center font-headline-lg shrink-0">
            {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-headline-md">{user.name}</h2>
            <p className="text-secondary">{user.role}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Email Address (Read Only)</p>
              <Input value={user.email} disabled />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Account ID (Read Only)</p>
              <Input value={user.id} disabled />
            </div>
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Full Name</p>
              <Input value={name} onChange={(e: any) => setName(e.target.value)} required />
            </div>
            
            <div className="pt-4 border-t border-border-hairline">
              <h3 className="font-label-lg mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-secondary font-medium mb-1">New Password (leave blank to keep current)</p>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e: any) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                </div>
                <div>
                  <p className="text-sm text-secondary font-medium mb-1">Confirm New Password</p>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e: any) => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
