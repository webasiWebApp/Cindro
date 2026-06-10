import React from 'react';

export function AppShell({ children, className = '', ...props }: any) {
  return (
    <div className={`flex min-h-screen bg-surface ${className}`} {...props}>
      {children}
    </div>
  );
}
