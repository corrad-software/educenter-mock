import { ReactNode } from 'react';

export function Tooltip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative group/tip">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs font-medium bg-white text-gray-700 border border-gray-200 rounded shadow-sm opacity-0 group-hover/tip:opacity-100 transition-opacity duration-75 pointer-events-none whitespace-nowrap z-50">
        {label}
      </span>
    </div>
  );
}
