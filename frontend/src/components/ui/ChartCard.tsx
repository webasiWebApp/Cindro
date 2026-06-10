import React from 'react';

export function ChartCard({ children, title, className = '', ...props }: any) {
  return (
    <div
      className={`bg-white border border-border-hairline rounded-lg shadow-sm p-6 ${className}`}
      {...props}
    >
      {title && <h3 className="font-semibold text-sm text-secondary uppercase tracking-wide mb-4">{title}</h3>}
      {children}
    </div>
  );
}
