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
      <header className="glass px-4 py-3 pb-3 pt-[max(env(safe-area-inset-top,12px),12px)] flex items-center justify-between no-tap-highlight">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
            <span className="text-white font-bold text-xs tracking-wider z-10 hidden">EC</span>
            <Image src="/logodsc.png" alt="EduCentre" width={40} height={40} className="w-full h-full object-cover absolute inset-0 mix-blend-screen opacity-90 p-1" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[15px] font-bold tracking-tight text-gray-900 leading-none">EduCentre</h1>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-1 mt-0.5 active:opacity-60 transition-opacity"
            >
              <span className={`text-[11px] font-bold tracking-wide uppercase ${current.text}`}>
                {current.label}
              </span>
              <ChevronDown className={`h-3 w-3 ${current.text}`} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-col items-end hidden min-[360px]:flex">
            <span className="text-xs font-semibold text-gray-900 leading-none">{guardian?.name?.split(' ')[0] || 'User'}</span>
            <span className="text-[10px] text-gray-400 font-medium">Profile</span>
          </div>
          <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform no-tap-highlight shadow-sm border border-gray-200">
            <LogOut className="h-4 w-4 text-gray-500 ml-0.5" />
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
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${isActive ? 'bg-gray-50' : 'active:bg-gray-100'
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
