'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LogOut, Users, BookOpen, ChevronDown, Check } from 'lucide-react';
import { useParentMobileStore } from '@/lib/store/parent-mobile-store';
import type { MobileRole } from '@/lib/store/parent-mobile-store';
import { useRouter } from 'next/navigation';

const ROLES: { id: MobileRole; label: string; Icon: React.ElementType; bg: string; text: string }[] = [
  { id: 'parent', label: 'Parent', Icon: Users, bg: 'bg-green-100', text: 'text-green-700' },
  { id: 'teacher', label: 'Teacher', Icon: BookOpen, bg: 'bg-blue-100', text: 'text-blue-700' },
];

export function MobileHeader() {
  const { guardian, activeRole, switchRole, logout } = useParentMobileStore();
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);

  const current = ROLES.find(r => r.id === activeRole) ?? ROLES[0];

  const handleLogout = () => {
    logout();
    router.push('/m/login');
  };

  const handleSwitch = (role: MobileRole) => {
    switchRole(role);
    setShowPicker(false);
    router.push('/m');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logodsc.png" alt="EduCentre" width={100} height={20} className="h-5 w-auto" />
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={`flex items-center gap-1 text-[10px] ${current.bg} ${current.text} px-2 py-0.5 rounded font-medium active:opacity-80`}
          >
            <current.Icon className="h-3 w-3" />
            {current.label}
            <ChevronDown className="h-2.5 w-2.5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 hidden min-[360px]:inline">{guardian?.name}</span>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <LogOut className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </header>

      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className="fixed top-[52px] left-4 z-50 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-56">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide px-3 pt-3 pb-1">Switch Role</p>
            {ROLES.map(({ id, label, Icon, bg, text }) => {
              const isActive = activeRole === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSwitch(id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                    isActive ? 'bg-gray-50' : 'active:bg-gray-100'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${bg}`}>
                    <Icon className={`h-4 w-4 ${text}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 flex-1">{label}</span>
                  {isActive && <Check className="h-4 w-4 text-green-600" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
