import React from 'react';

export function Toast({ message, type = 'info', className = '' }: any) {
  const styles: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const icons: Record<string, string> = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium ${styles[type] ?? styles.info} ${className}`}
    >
      <span>{icons[type] ?? icons.info}</span>
      <span>{message}</span>
    </div>
  );
}
