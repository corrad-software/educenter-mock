'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Users, BookOpen, ChevronRight } from 'lucide-react';
import { useParentMobileStore } from '@/lib/store/parent-mobile-store';

type MobileRole = 'parent' | 'teacher';

const ROLES: { id: MobileRole; label: string; description: string; Icon: React.ElementType; color: string }[] = [
  {
    id: 'parent',
    label: 'Parent / Guardian',
    description: 'View fees, make payments & track children',
    Icon: Users,
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    id: 'teacher',
    label: 'Teacher / Staff',
    description: 'View schedule, attendance & announcements',
    Icon: BookOpen,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
];

export default function MobileLoginPage() {
  const router = useRouter();
  const { login } = useParentMobileStore();
  const [selectedRole, setSelectedRole] = useState<MobileRole>('parent');

  const handleSignIn = () => {
    if (selectedRole === 'parent') {
      // Mock login as guardian g1
      login('800505-10-5678', '+60123456789');
      router.replace('/m');
    } else {
      // Teacher goes to web teacher portal
      router.replace('/teacher');
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logomw.png" alt="MW Logo" width={180} height={180} className="h-16 w-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">EduCentre</h1>
          <p className="text-xs text-gray-500 mt-1">MAIWP Education Portal</p>
        </div>

        {/* Role Picker */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Sign In As</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select your role to continue</p>
          </div>

          <div className="space-y-3">
            {ROLES.map(({ id, label, description, Icon, color }) => {
              const isSelected = selectedRole === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedRole(id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white active:bg-gray-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg border ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Demo notice */}
          <p className="text-[10px] text-gray-400 text-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            Demo Mode — No credentials required
          </p>

          {/* Sign In */}
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            Sign In to Demo
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-6">
          © 2025 EduCentre · Powered by Datascience
        </p>
      </div>
    </div>
  );
}
