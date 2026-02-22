'use client';

import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';

const CHILD_COLORS: Record<string, { activeBg: string; activeText: string; avatarBg: string }> = {
  '1': { activeBg: 'bg-blue-100', activeText: 'text-blue-700', avatarBg: 'bg-blue-500' },
  '3': { activeBg: 'bg-purple-100', activeText: 'text-purple-700', avatarBg: 'bg-purple-500' },
  '4': { activeBg: 'bg-amber-100', activeText: 'text-amber-700', avatarBg: 'bg-amber-500' },
};

const DEFAULT_COLOR = { activeBg: 'bg-gray-100', activeText: 'text-gray-700', avatarBg: 'bg-gray-400' };

export function ChildTabBar() {
  const { selectedChildId, selectChild, activeRole } = useParentMobileStore();

  if (activeRole !== 'parent') return null;

  return (
    <div className="sticky top-[49px] z-40 bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex gap-2">
        {guardianChildren.map((child) => {
          const isActive = child.id === selectedChildId;
          const color = CHILD_COLORS[child.id] ?? DEFAULT_COLOR;
          const firstName = child.name.split(' ')[0];
          const initials = child.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

          return (
            <button
              key={child.id}
              onClick={() => selectChild(child.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? `${color.activeBg} ${color.activeText}`
                  : 'text-gray-400 active:bg-gray-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${
                isActive ? color.avatarBg : 'bg-gray-300'
              }`}>
                {initials}
              </span>
              {firstName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
