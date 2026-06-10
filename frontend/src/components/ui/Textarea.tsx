import React from 'react';

export function Textarea({ label, className = '', rows = 4, ...props }: any) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-secondary">{label}</label>}
      <textarea
        rows={rows}
        className="px-3 py-2 border border-border-hairline rounded bg-surface text-primary outline-none focus:border-[#FFD700] transition-colors resize-y text-sm"
        {...props}
      />
    </div>
  );
}
