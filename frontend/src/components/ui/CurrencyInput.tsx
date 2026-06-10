import React from 'react';

export function CurrencyInput({ label, symbol = '£', className = '', ...props }: any) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-secondary">{label}</label>}
      <div className="flex items-center border border-border-hairline rounded bg-surface focus-within:border-[#FFD700] transition-colors">
        <span className="px-3 py-2 text-secondary text-sm border-r border-border-hairline select-none">
          {symbol}
        </span>
        <input
          type="number"
          step="0.01"
          className="flex-1 px-3 py-2 bg-transparent text-primary outline-none text-sm"
          {...props}
        />
      </div>
    </div>
  );
}
