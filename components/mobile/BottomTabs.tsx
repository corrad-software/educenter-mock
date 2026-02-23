'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, Calendar, ClipboardCheck, DollarSign, Award } from 'lucide-react';
import { useParentMobileStore } from '@/lib/store/parent-mobile-store';

const PARENT_TABS = [
  { href: '/m', label: 'Home', Icon: Home },
  { href: '/m/attendance-parent', label: 'Attend', Icon: ClipboardCheck },
  { href: '/m/results', label: 'Results', Icon: Award },
  { href: '/m/fees', label: 'Fees', Icon: DollarSign },
  { href: '/m/notifications', label: 'Alerts', Icon: Bell },
];

const TEACHER_TABS = [
  { href: '/m', label: 'Home', Icon: Home },
  { href: '/m/schedule', label: 'Schedule', Icon: Calendar },
  { href: '/m/attendance', label: 'Attendance', Icon: ClipboardCheck },
  { href: '/m/notifications', label: 'Alerts', Icon: Bell },
];

export function BottomTabs() {
  const pathname = usePathname();
  const { activeRole } = useParentMobileStore();
  const tabs = activeRole === 'teacher' ? TEACHER_TABS : PARENT_TABS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[max(env(safe-area-inset-bottom,16px),16px)] px-4 pointer-events-none no-tap-highlight">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/50 flex items-center justify-around h-[60px] pointer-events-auto overflow-hidden relative">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          const activeColorText = activeRole === 'teacher' ? 'text-blue-600' : 'text-green-600';
          const activeColorBg = activeRole === 'teacher' ? 'bg-blue-600' : 'bg-green-600';

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${isActive ? activeColorText : 'text-gray-400 hover:text-gray-500'
                }`}
            >
              {isActive && (
                <div className={`absolute top-0 w-8 h-1 rounded-b-full ${activeColorBg} animate-in slide-in-from-top-1`} />
              )}
              <Icon
                className={`h-[22px] w-[22px] mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] leading-none transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
