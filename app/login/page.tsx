'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, BookOpen, School, GraduationCap, Building, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEducationStore } from '@/lib/store/education-store';
import { LEVEL_META, LEVEL_COLOR_CLASSES } from '@/lib/education-config';
import type { EducationLevel } from '@/lib/types';

type LoginRole = 'maiwp_admin' | 'school_admin' | 'teacher' | 'parent' | 'parent_external_invoice';

const SCHOOL_LEVELS: EducationLevel[] = ['preschool', 'primary', 'secondary', 'university'];

const LEVEL_ICONS: Record<EducationLevel, React.ElementType> = {
  maiwp: Shield,
  preschool: BookOpen,
  primary: School,
  secondary: GraduationCap,
  university: Building,
};

export default function LoginPage() {
  const router = useRouter();
  const { selectLevel } = useEducationStore();

  const [loginRole, setLoginRole] = useState<LoginRole>('maiwp_admin');
  const [schoolType, setSchoolType] = useState<EducationLevel>('primary');

  const isMaiwp = loginRole === 'maiwp_admin';
  const activeLevel: EducationLevel = isMaiwp ? 'maiwp' : schoolType;
  const meta = LEVEL_META[activeLevel];
  const colors = LEVEL_COLOR_CLASSES[activeLevel];
  const Icon = LEVEL_ICONS[activeLevel];

  const handleSignIn = () => {
    if (loginRole === 'maiwp_admin') {
      selectLevel('maiwp', 'admin');
      router.push('/admin');
    } else if (loginRole === 'school_admin') {
      selectLevel(schoolType, 'admin');
      router.push('/admin');
    } else if (loginRole === 'teacher') {
      selectLevel(schoolType, 'teacher');
      router.push('/teacher');
    } else if (loginRole === 'parent_external_invoice') {
      selectLevel(schoolType, 'parent');
      router.push('/parent?mode=external');
    } else {
      selectLevel(schoolType, 'parent');
      router.push('/parent');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logomw.png"
            alt="MW Logo"
            width={200}
            height={200}
            className="h-16 w-auto"
            unoptimized
          />
        </div>
        <h1 className="text-4xl font-bold text-blue-700">EduCentre</h1>
        <p className="text-gray-500 text-base">Malaysian Islamic Education Management System</p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        {/* Colored accent bar — updates with selection */}
        <div className={`${colors.bg} h-1.5 rounded-t-xl transition-colors duration-300`} />

        <CardHeader className="pb-2 pt-5">
          {/* Dynamic portal preview */}
          <div className={`flex items-center gap-3 p-3 rounded-lg ${colors.lightBg} border ${colors.border}`}>
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{meta.label}</p>
              <p className="text-xs text-gray-500">{meta.ageRange} · {meta.labelMs}</p>
            </div>
            <Badge className={`${colors.bg} text-white text-xs font-bold shrink-0`}>
              {meta.badgeLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pb-6">
          {/* Login As */}
          <div className="space-y-2">
            <Label htmlFor="login-role" className="text-sm font-medium">Login As</Label>
            <Select
              value={loginRole}
              onValueChange={(val) => setLoginRole(val as LoginRole)}
            >
              <SelectTrigger id="login-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maiwp_admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-600" />
                    <span>MAIWP Super Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="school_admin">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span>School / Institute Admin</span>
                  </div>
                </SelectItem>
                <SelectItem value="teacher">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-teal-600" />
                    <span>Teacher / Staff</span>
                  </div>
                </SelectItem>
                <SelectItem value="parent">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                    <span>Parent / Guardian</span>
                  </div>
                </SelectItem>
                <SelectItem value="parent_external_invoice">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                    <span>Parent (External Invoice POC)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* School Type — hidden for MAIWP */}
          {!isMaiwp && (
            <div className="space-y-2">
              <Label htmlFor="school-type" className="text-sm font-medium">School Type</Label>
              <Select
                value={schoolType}
                onValueChange={(val) => setSchoolType(val as EducationLevel)}
              >
                <SelectTrigger id="school-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_LEVELS.map((level) => {
                    const m = LEVEL_META[level];
                    const LevelIcon = LEVEL_ICONS[level];
                    const c = LEVEL_COLOR_CLASSES[level];
                    return (
                      <SelectItem key={level} value={level}>
                        <div className="flex items-center gap-2">
                          <LevelIcon className={`h-4 w-4 ${c.text}`} />
                          <span>{m.label}</span>
                          <span className="text-xs text-gray-400">({m.ageRange})</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Demo notice */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-md px-3 py-2 border border-gray-100">
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            <span>Demo Mode · No credentials required — select a portal and sign in</span>
          </div>

          {/* Sign In Button */}
          <Button
            className={`w-full ${colors.bg} ${colors.bgHover} text-white font-semibold text-base py-5`}
            onClick={handleSignIn}
          >
            Sign In to Demo
          </Button>

          {/* Hierarchy note */}
          <div className="text-center text-xs text-gray-400 space-y-0.5">
            <p>MAIWP → School Admins → Teachers → Parents</p>
            <p>Each school operates within its own access scope</p>
          </div>

          <div className="pt-1 text-center">
            <Link href="/register" className="text-xs text-blue-600 hover:underline">
              New Student Self-Service Registration
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-gray-400">
        © 2025 EduCentre · Powered by Datascience · All rights reserved
      </p>
    </div>
  );
}
