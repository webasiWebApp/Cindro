import React from 'react';

export function EmptyState({ title = 'No data found', description = '', icon, className = '' }: any) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="text-5xl mb-4 opacity-30">{icon || '📭'}</div>
      <p className="font-semibold text-primary">{title}</p>
      {description && <p className="text-sm text-secondary mt-1">{description}</p>}
    </div>
  );
}
