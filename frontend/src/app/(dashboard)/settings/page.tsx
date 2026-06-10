"use client";
import React, { useEffect, useState } from 'react';
import { Card, Select, Button, Input } from '@/components/ui';
import { settingsService } from '@/services/settingsService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { currency, format, setCurrency, setFormat } = useCurrency();
  const [businessName, setBusinessName] = useState('Cindro Deals Ltd');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data && data.businessName) {
          setBusinessName(data.businessName);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings({ businessName });
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-headline-lg">Settings</h1>
      
      <Card>
         <h2 className="font-bold mb-4">Business Details</h2>
         <Input 
           label="Business Name (Used on PDFs)" 
           value={businessName} 
           onChange={(e: any) => setBusinessName(e.target.value)}
           className="mb-4" 
         />
         
         <div className="grid grid-cols-2 gap-4 mb-4">
           <div>
             <label className="text-sm font-medium text-secondary">Default Currency</label>
             <select 
               className="w-full mt-1 bg-surface border border-border-hairline rounded px-3 py-2 outline-none"
               value={currency}
               onChange={(e: any) => setCurrency(e.target.value)}
             >
               <option value="GBP">GBP (£)</option>
               <option value="AED">AED (د.إ)</option>
             </select>
           </div>
           
           <div>
             <label className="text-sm font-medium text-secondary">Display Format</label>
             <select 
               className="w-full mt-1 bg-surface border border-border-hairline rounded px-3 py-2 outline-none"
               value={format}
               onChange={(e: any) => setFormat(e.target.value)}
             >
               <option value="SYMBOL">Symbol (£)</option>
               <option value="CODE">Code (GBP)</option>
             </select>
           </div>
         </div>
         
         <Button onClick={handleSave} disabled={saving}>
           {saving ? 'Saving...' : 'Save Settings'}
         </Button>
      </Card>
    </div>
  );
}
