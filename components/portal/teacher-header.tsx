'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TeacherHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/teacher" className="flex items-center space-x-3">
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
            <span className="text-xl font-bold text-teal-600">EduCentre</span>
            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
              Teacher
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Image
              src="/images/cikgu.JPG"
              alt="Teacher profile photo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
              unoptimized
            />
            <span>Cikgu Aminah binti Razak</span>
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
