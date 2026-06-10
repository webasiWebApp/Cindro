import React from 'react';

export function Input({ label, className = '', ...props }: any) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-secondary">{label}</label>}
      <input 
        className="w-full px-3 py-2 border border-border-hairline rounded bg-surface text-primary outline-none focus:border-[#FFD700] transition-colors"
        {...props}
      />
    </div>
  );
}
