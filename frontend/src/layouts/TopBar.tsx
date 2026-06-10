"use client";

import React from 'react';
import { useCurrency, Currency, CurrencyFormat } from '@/context/CurrencyContext';

export function TopBar({ className = '', ...props }: any) {
  const { currency, format, setCurrency, setFormat } = useCurrency();

  return (
    <div className={`TopBar-base flex justify-between items-center bg-white border-b border-border-hairline px-6 py-4 ${className}`} {...props}>
      <div className="font-bold text-lg">Cindro Admin</div>
      
      <div className="flex gap-4 items-center">
        {/* Currency Format Toggle */}
        <select 
          className="bg-surface border border-border-hairline rounded px-2 py-1 text-sm outline-none"
          value={format}
          onChange={(e) => setFormat(e.target.value as CurrencyFormat)}
        >
          <option value="SYMBOL">Symbol (£)</option>
          <option value="CODE">Code (GBP)</option>
        </select>

        {/* Currency Toggle */}
        <select 
          className="bg-surface border border-border-hairline rounded px-2 py-1 text-sm outline-none"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
        >
          <option value="GBP">GBP (£)</option>
          <option value="AED">AED (د.إ)</option>
        </select>
        
        <div className="w-8 h-8 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </div>
  );
}
