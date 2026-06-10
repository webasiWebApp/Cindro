import React from 'react';

export function PageHeader({ children, className = '', ...props }: any) {
  return (
    <header className={`mb-6 ${className}`} {...props}>
      {children}
    </header>
  );
}
