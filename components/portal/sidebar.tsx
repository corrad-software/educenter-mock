'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DynamicIcon } from './dynamic-icon';
import { useEducationStore } from '@/lib/store/education-store';
import { LEVEL_META, LEVEL_NAV_ITEMS, LEVEL_COLOR_CLASSES } from '@/lib/education-config';
import type { NavItem } from '@/lib/education-config';

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';
  const meta = LEVEL_META[level];
  const colors = LEVEL_COLOR_CLASSES[level];
  const navItems = LEVEL_NAV_ITEMS[level];

  // Reset open menus when level changes
  useEffect(() => {
    setOpenMenus([]);
  }, [level]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const renderNavItem = (item: NavItem) => {
    if (!item.children) {
      return (
        <Link key={item.id} href={item.href} className="cursor-pointer">
          <Button
            variant={isActive(item.href) ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <DynamicIcon name={item.iconName} className="h-5 w-5" />
            {item.label}
          </Button>
        </Link>
      );
    }

    return (
      <div key={item.id} className="overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 cursor-pointer"
          onClick={() => toggleMenu(item.id)}
        >
          <DynamicIcon name={item.iconName} className="h-5 w-5" />
          {item.label}
          <ChevronDown
            className={`h-4 w-4 ml-auto transition-transform duration-200 ${
              openMenus.includes(item.id) ? 'rotate-0' : '-rotate-90'
            }`}
          />
        </Button>
        <div
          className={`ml-4 space-y-1 transition-all duration-300 ease-in-out ${
            openMenus.includes(item.id)
              ? 'max-h-96 opacity-100 mt-1'
              : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          {item.children.map(child => (
            <Link key={child.id} href={child.href} className="cursor-pointer">
              <Button
                variant={pathname === child.href ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start gap-3 cursor-pointer"
              >
                <DynamicIcon name={child.iconName} className="h-4 w-4" />
                {child.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-3">
          <Image
            src="/images/logomw.png"
            alt="MW Logo"
            width={200}
            height={200}
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </Link>
      </div>

      {/* Level Badge */}
      <div className={`px-4 py-2 border-b border-gray-100 ${colors.lightBg}`}>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
          <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
            {meta.badgeLabel}
          </span>
          <Badge variant="outline" className={`ml-auto text-xs py-0 ${colors.text} ${colors.border}`}>
            {meta.label}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => renderNavItem(item))}

        <div className="border-t border-gray-200 my-2" />

        {/* Static system modules */}
        <Link href="/finance" className="cursor-pointer">
          <Button
            variant={pathname?.startsWith('/finance') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <DynamicIcon name="DollarSign" className="h-5 w-5" />
            Finance Console
          </Button>
        </Link>

        <Link href="/audit" className="cursor-pointer">
          <Button
            variant={pathname?.startsWith('/audit') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <DynamicIcon name="FileText" className="h-5 w-5" />
            Audit & Compliance
          </Button>
        </Link>

        <Link href="/integration" className="cursor-pointer">
          <Button
            variant={pathname?.startsWith('/integration') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <DynamicIcon name="Activity" className="h-5 w-5" />
            Integration Dashboard
          </Button>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-3 cursor-pointer">
          <Settings className="h-5 w-5" />
          Settings
        </Button>
        <Link href="/login">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  );
}
