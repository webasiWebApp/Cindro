import React from 'react';

export function Button({ children, variant = 'primary', className = '', ...props }: any) {
  const baseStyle = "px-4 py-2 text-sm font-medium rounded transition-colors duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#FFD700] text-black hover:brightness-105 active:scale-95",
    secondary: "bg-surface border border-border-hairline text-primary hover:bg-black/5",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button className={`${baseStyle} ${(variants as any)[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
