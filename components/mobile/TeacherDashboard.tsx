'use client';

import { useParentMobileStore } from '@/lib/store/parent-mobile-store';
import { Calendar, ClipboardCheck, Users, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

const TODAY_SCHEDULE = [
  { time: '08:00 - 09:30', subject: 'Bahasa Melayu', class: '5 Cemerlang', room: 'Bilik 3A' },
  { time: '09:30 - 10:00', subject: 'Rehat', class: '', room: '' },
  { time: '10:00 - 11:30', subject: 'Pendidikan Islam', class: '4 Bestari', room: 'Bilik 2B' },
  { time: '11:30 - 13:00', subject: 'Bahasa Melayu', class: '6 Amanah', room: 'Bilik 4A' },
  { time: '13:00 - 14:00', subject: 'Rehat Tengah Hari', class: '', room: '' },
  { time: '14:00 - 15:30', subject: 'Sejarah', class: '5 Cemerlang', room: 'Bilik 3A' },
];

const STATS = [
  { label: 'My Classes', value: '4', Icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
  { label: 'Students', value: '112', Icon: Users, color: 'text-purple-600 bg-purple-50' },
  { label: 'Today Attendance', value: '96%', Icon: ClipboardCheck, color: 'text-green-600 bg-green-50' },
  { label: 'Periods Today', value: '4', Icon: Clock, color: 'text-orange-600 bg-orange-50' },
];

export function TeacherDashboard() {
  const { guardian } = useParentMobileStore();

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Assalamualaikum, Ustazah</h1>
        <p className="text-xs text-gray-500">{guardian?.name} · Pusat Jagaan Wangsa Maju</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Today&apos;s Schedule</p>
          <Link href="/m/schedule" className="text-xs text-blue-600 font-medium">Full Week</Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {TODAY_SCHEDULE.map((item, i) => {
            const isBreak = !item.class;
            return (
              <div key={i} className={`px-4 py-3 flex items-center gap-3 ${isBreak ? 'bg-gray-50' : ''}`}>
                <p className="text-xs text-gray-400 font-mono w-24 flex-shrink-0">{item.time}</p>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isBreak ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                    {item.subject}
                  </p>
                  {item.class && (
                    <p className="text-xs text-gray-500">{item.class} · {item.room}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/m/attendance"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
        >
          <ClipboardCheck className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Attendance</p>
            <p className="text-[10px] text-gray-500">Mark today</p>
          </div>
        </Link>
        <Link href="/m/schedule"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
        >
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Schedule</p>
            <p className="text-[10px] text-gray-500">View timetable</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
