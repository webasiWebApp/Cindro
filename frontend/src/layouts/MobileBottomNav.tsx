import React from 'react';

export function MobileBottomNav({ children, className = '', ...props }: any) {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border-hairline flex md:hidden ${className}`} {...props}>
      {children}
    </nav>
  );
}
