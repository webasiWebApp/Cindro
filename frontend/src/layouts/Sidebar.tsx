import React from 'react';

export function Sidebar({ children, className = '', ...props }: any) {
  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border-hairline z-20 hidden md:flex flex-col ${className}`} {...props}>
      {children}
    </aside>
  );
}
