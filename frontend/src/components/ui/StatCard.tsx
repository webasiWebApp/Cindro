import React from 'react';

export function StatCard({ label, value, delta, deltaLabel, icon, className = '' }: any) {
  const isPositive = delta >= 0;
  return (
    <div className={`bg-white border border-border-hairline rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(delta)}% {deltaLabel}
        </p>
      )}
    </div>
  );
}
