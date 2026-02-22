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
    <div className="sticky top-[49px] z-40 bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex gap-2">
        {guardianChildren.map((child) => {
          const isActive = child.id === selectedChildId;
          const color = CHILD_COLORS[child.id] ?? DEFAULT_COLOR;
          const firstName = child.name.split(' ')[0];
          const photo = CHILD_PHOTOS[child.id];

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
              <span className={`w-6 h-6 rounded-full shrink-0 overflow-hidden ${
                isActive ? `ring-2 ${color.ring}` : 'opacity-60 grayscale'
              }`}>
                {photo ? (
                  <Image src={photo} alt={child.name} width={24} height={24} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-gray-300 text-[9px] font-bold text-white">
                    {child.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
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
