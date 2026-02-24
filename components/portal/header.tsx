'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Users, DollarSign, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/parent', label: 'Parent Portal', icon: Users },
    { href: '/admin', label: 'Centre Admin', icon: Users },
    { href: '/finance', label: 'Finance', icon: DollarSign },
    { href: '/audit', label: 'Audit', icon: FileText },
    { href: '/integration', label: 'Integration', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-8 flex items-center space-x-3">
          <Image
            src="/images/logomw.png"
            alt="MW Logo"
            width={200}
            height={200}
            className="h-10 w-auto"
            priority
            unoptimized
          />
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">EduCentre</span>
          </div>
        </Link>
        <nav className="flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Demo User</span>
        </div>
      </div>
    </header>
  );
}
