'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { ChildTabBar } from '@/components/mobile/ChildTabBar';
import { BottomTabs } from '@/components/mobile/BottomTabs';
import { useParentMobileStore } from '@/lib/store/parent-mobile-store';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, _hasHydrated } = useParentMobileStore();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/m/login';

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!_hasHydrated) return; // Wait for localStorage to load
    if (!isLoggedIn && !isLoginPage) {
      router.replace('/m/login');
    }
  }, [isLoggedIn, isLoginPage, router, _hasHydrated]);

  // Login page — no header or tabs
  if (isLoginPage) {
    return <div className="min-h-dvh bg-gray-50">{children}</div>;
  }

  // Still hydrating or not logged in — show loading
  if (!_hasHydrated || !isLoggedIn) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col">
      <MobileHeader />
      <ChildTabBar />
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <BottomTabs />
    </div>
  );
}
