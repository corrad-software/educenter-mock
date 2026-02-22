'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, CreditCard, Bell, Calendar, ClipboardCheck } from 'lucide-react';
import { useParentMobileStore } from '@/lib/store/parent-mobile-store';

const PARENT_TABS = [
  { href: '/m', label: 'Home', Icon: Home },
  { href: '/m/invoices', label: 'Invoices', Icon: FileText },
  { href: '/m/payments', label: 'Payments', Icon: CreditCard },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          const activeColor = activeRole === 'teacher' ? 'text-blue-600' : 'text-green-600';
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? activeColor : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
