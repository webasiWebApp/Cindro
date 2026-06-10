import React from 'react';

export function Badge({ children, variant = 'default', className = '', ...props }: any) {
  const variants = {
    default: "bg-black/5 text-secondary",
    success: "bg-[#FFD700]/10 text-primary border border-[#FFD700]/50",
    danger: "bg-red-50 text-red-600 border border-red-200"
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${(variants as any)[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
