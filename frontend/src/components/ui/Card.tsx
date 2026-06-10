import React from 'react';

export function Card({ children, className = '', ...props }: any) {
  return (
    <div className={`bg-white border border-border-hairline rounded-lg shadow-sm p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
