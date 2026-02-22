'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ParentHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/parent" className="flex items-center space-x-3">
          <Image
            src="/images/logodsc.png"
            alt="Datascience Logo"
            width={492}
            height={98}
            className="h-8 w-auto"
            priority
            unoptimized
          />
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">EduCentre</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              Parent
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Abdullah Bin Hassan</span>
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
