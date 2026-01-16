'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Users, DollarSign, FileText, Activity, LogOut, Settings, ChevronDown, ChevronRight, UserPlus, Building2, GraduationCap, Calendar, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(['manage']);

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [menuId] // Only keep the clicked menu open, close others
    );
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-3">
          <Image
            src="/images/logodsc.png"
            alt="Datascience Logo"
            width={492}
            height={98}
            className="h-8 w-auto"
            priority
            unoptimized
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link href="/admin" className="cursor-pointer">
          <Button
            variant={isActive('/admin') && !pathname.includes('/admin/') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Button>
        </Link>

        {/* Manage - Collapsible */}
        <div className="overflow-hidden">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 cursor-pointer"
            onClick={() => toggleMenu('manage')}
          >
            <Users className="h-5 w-5" />
            Manage
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-200 ${openMenus.includes('manage') ? 'rotate-0' : '-rotate-90'}`} />
          </Button>
          <div
            className={`ml-4 space-y-1 transition-all duration-300 ease-in-out ${
              openMenus.includes('manage')
                ? 'max-h-40 opacity-100 mt-1'
                : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <Link href="/admin/students" className="cursor-pointer">
              <Button
                variant={isActive('/admin/students') ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start gap-3 cursor-pointer"
              >
                <GraduationCap className="h-4 w-4" />
                Student List
              </Button>
            </Link>
            <Link href="/admin/institutes" className="cursor-pointer">
              <Button
                variant={isActive('/admin/institutes') ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start gap-3 cursor-pointer"
              >
                <Building2 className="h-4 w-4" />
                Institute / School
              </Button>
            </Link>
          </div>
        </div>

        {/* Attendance */}
        <Link href="/admin/attendance" className="cursor-pointer">
          <Button
            variant={isActive('/admin/attendance') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <Calendar className="h-5 w-5" />
            Attendance
          </Button>
        </Link>

        {/* Fees */}
        <Link href="/admin/fees" className="cursor-pointer">
          <Button
            variant={isActive('/admin/fees') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <DollarSign className="h-5 w-5" />
            Fee Monitoring
          </Button>
        </Link>

        <div className="border-t border-gray-200 my-2"></div>

        {/* Other Modules */}
        <Link href="/finance" className="cursor-pointer">
          <Button
            variant={isActive('/finance') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <DollarSign className="h-5 w-5" />
            Finance Console
          </Button>
        </Link>

        <Link href="/audit" className="cursor-pointer">
          <Button
            variant={isActive('/audit') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <FileText className="h-5 w-5" />
            Audit & Compliance
          </Button>
        </Link>

        <Link href="/integration" className="cursor-pointer">
          <Button
            variant={isActive('/integration') ? 'default' : 'ghost'}
            className="w-full justify-start gap-3 cursor-pointer"
          >
            <Activity className="h-5 w-5" />
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
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  );
}
