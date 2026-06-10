"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Input, Button } from '@/components/ui';
import { dealService } from '@/services/dealService';
import { useCurrency } from '@/context/CurrencyContext';
import toast from 'react-hot-toast';

export default function NewDealPage() {
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dealName: '', itemName: '', quantity: 0, costPricePerItem: 0,
    flightCost: 0, luggageCost: 0, transportCost: 0, packageCost: 0,
    salaryExpense: 0, additionalExpenses: 0,
    investor1Name: '', investor1Contribution: 0,
    investor2Name: '', investor2Contribution: 0,
    totalSaleRevenue: 0,
    currency: 'GBP'
  });

  // Live preview calculation (frontend only, backend overrides this)
  const totalStockCost = formData.quantity * formData.costPricePerItem;
  const totalExpenses = totalStockCost + formData.flightCost + formData.luggageCost + formData.transportCost + formData.packageCost + formData.salaryExpense + formData.additionalExpenses;
  const netProfit = formData.totalSaleRevenue - totalExpenses;

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await dealService.createDeal(formData);
      toast.success('Deal created successfully!');
      router.push('/deals');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <h1 className="font-headline-lg">Create New Deal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-col-reverse lg:flex-row">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="font-bold mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Deal Name" name="dealName" value={formData.dealName} onChange={handleChange} />
              <Input label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} />
              <Input label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
              <Input label="Cost Price" name="costPricePerItem" type="number" value={formData.costPricePerItem} onChange={handleChange} />
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Flight Cost" name="flightCost" type="number" value={formData.flightCost} onChange={handleChange} />
              <Input label="Luggage Cost" name="luggageCost" type="number" value={formData.luggageCost} onChange={handleChange} />
              <Input label="Transport Cost" name="transportCost" type="number" value={formData.transportCost} onChange={handleChange} />
              <Input label="Package Cost" name="packageCost" type="number" value={formData.packageCost} onChange={handleChange} />
              <Input label="Salary Expense" name="salaryExpense" type="number" value={formData.salaryExpense} onChange={handleChange} />
              <Input label="Additional Expenses" name="additionalExpenses" type="number" value={formData.additionalExpenses} onChange={handleChange} />
            </div>
          </Card>
          
          <Card>
            <h2 className="font-bold mb-4">Investor Contributions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input label="Investor 1 Name" name="investor1Name" value={formData.investor1Name} onChange={handleChange} />
               <Input label="Contribution" name="investor1Contribution" type="number" value={formData.investor1Contribution} onChange={handleChange} />
               <Input label="Investor 2 Name" name="investor2Name" value={formData.investor2Name} onChange={handleChange} />
               <Input label="Contribution" name="investor2Contribution" type="number" value={formData.investor2Contribution} onChange={handleChange} />
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-4">Sales</h2>
            <Input label="Total Expected/Actual Revenue" name="totalSaleRevenue" type="number" value={formData.totalSaleRevenue} onChange={handleChange} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <h2 className="font-bold mb-4">Live Preview</h2>
            <p className="text-xs text-secondary mb-4 italic">Note: Final verified calculations happen securely on the backend when saved.</p>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between"><span>Stock Cost</span><span>{formatAmount(totalStockCost)}</span></div>
              <div className="flex justify-between"><span>Total Expenses</span><span>{formatAmount(totalExpenses)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2 font-bold">
                 <span>Net Profit Preview</span>
                 <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatAmount(netProfit)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving Deal...' : 'Save Deal to Backend'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
