'use client';

import Image from 'next/image';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';

const CHILD_COLORS: Record<string, { activeBg: string; activeText: string; ring: string }> = {
  '1': { activeBg: 'bg-blue-100', activeText: 'text-blue-700', ring: 'ring-blue-500' },
  '3': { activeBg: 'bg-purple-100', activeText: 'text-purple-700', ring: 'ring-purple-500' },
  '4': { activeBg: 'bg-amber-100', activeText: 'text-amber-700', ring: 'ring-amber-500' },
};

const DEFAULT_COLOR = { activeBg: 'bg-gray-100', activeText: 'text-gray-700', ring: 'ring-gray-400' };

const CHILD_PHOTOS: Record<string, string> = {
  '1': '/images/irfan.jpg',
  '3': '/images/aisyah.jpg',
  '4': '/images/ahmad.jpg',
};

export function ChildTabBar() {
  const { selectedChildId, selectChild, activeRole } = useParentMobileStore();

  if (activeRole !== 'parent') return null;

  return (
    <div className="glass border-none no-tap-highlight">
      <div className="flex gap-3 px-4 py-[10px] overflow-x-auto hide-scrollbar relative">
        {guardianChildren.map((child) => {
          const isActive = child.id === selectedChildId;
          const color = CHILD_COLORS[child.id] ?? DEFAULT_COLOR;
          const firstName = child.name.split(' ')[0];
          const photo = CHILD_PHOTOS[child.id];

          return (
            <button
              key={child.id}
              onClick={() => selectChild(child.id)}
              className={`flex items-center gap-2 py-1.5 pl-1.5 pr-4 rounded-full text-sm font-semibold transition-all shrink-0 border ${isActive
                  ? `${color.activeBg} ${color.activeText} border-transparent shadow-sm`
                  : 'bg-white text-gray-500 border-gray-200 active:bg-gray-50'
                }`}
            >
              <span className={`w-8 h-8 rounded-full shrink-0 overflow-hidden ${isActive ? `ring-2 ring-white shadow-sm` : 'opacity-80 grayscale'
                }`}>
                {photo ? (
                  <Image src={photo} alt={child.name} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-gray-200 text-[10px] font-bold text-gray-500">
                    {firstName.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </span>
              {firstName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
