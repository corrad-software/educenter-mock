'use client';

import { useState, useMemo } from 'react';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  subMonths, addMonths, isSameMonth, startOfWeek, endOfWeek, isSameDay,
} from 'date-fns';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface AttendanceDay {
  date: Date;
  status: 'present' | 'late' | 'absent' | 'excused';
  checkIn: string | null;
  checkOut: string | null;
  lateMinutes: number;
}

function generateChildAttendance(studentId: string, month: Date): AttendanceDay[] {
  const seed = parseInt(studentId, 10) * 1000 + month.getFullYear() * 12 + month.getMonth();
  const rand = seededRandom(seed);

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  return days
    .filter(d => {
      const day = getDay(d);
      return day !== 0 && day !== 6;
    })
    .filter(d => d <= new Date())
    .map(date => {
      const r = rand();
      let status: AttendanceDay['status'];
      let lateMinutes = 0;
      let checkIn: string | null = null;
      let checkOut: string | null = null;

      if (r < 0.85) {
        status = 'present';
        const min = Math.floor(rand() * 30);
        checkIn = `07:${String(min).padStart(2, '0')}`;
        const outHour = 14 + Math.floor(rand() * 3);
        const outMin = Math.floor(rand() * 60);
        checkOut = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
      } else if (r < 0.92) {
        status = 'late';
        lateMinutes = 5 + Math.floor(rand() * 45);
        const hour = 8 + Math.floor(rand() * 2);
        const min = Math.floor(rand() * 60);
        checkIn = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        const outHour = 14 + Math.floor(rand() * 3);
        const outMin = Math.floor(rand() * 60);
        checkOut = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
      } else if (r < 0.96) {
        status = 'absent';
      } else {
        status = 'excused';
      }

      return { date, status, checkIn, checkOut, lateMinutes };
    });
}

const STATUS_DOT: Record<string, string> = {
  present: 'bg-green-500',
  late: 'bg-amber-500',
  absent: 'bg-red-500',
  excused: 'bg-blue-500',
};

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  present: { text: 'Present', color: 'text-green-600' },
  late: { text: 'Late', color: 'text-amber-600' },
  absent: { text: 'Absent', color: 'text-red-600' },
  excused: { text: 'Excused', color: 'text-blue-600' },
};

const DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MobileAttendanceParentPage() {
  const { selectedChildId } = useParentMobileStore();
  const child = guardianChildren.find(c => c.id === selectedChildId);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const records = useMemo(
    () => generateChildAttendance(selectedChildId, currentMonth),
    [selectedChildId, currentMonth]
  );

  // Map date string to record for calendar lookup
  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceDay>();
    records.forEach(r => map.set(format(r.date, 'yyyy-MM-dd'), r));
    return map;
  }, [records]);

  const stats = useMemo(() => {
    const s = { present: 0, late: 0, absent: 0, excused: 0, total: records.length };
    records.forEach(r => s[r.status]++);
    return s;
  }, [records]);

  const attendanceRate = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;
  const canGoForward = !isSameMonth(currentMonth, new Date());

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  // Sorted newest first for the log
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [records]
  );

  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Attendance</h1>
        <p className="text-xs text-gray-500">{child?.name ?? 'Student'}</p>
      </div>

      {/* Attendance Rate Banner */}
      <div className={`rounded-xl p-3 flex items-center justify-between ${
        attendanceRate >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
        attendanceRate >= 75 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
        'bg-gradient-to-r from-red-500 to-rose-600'
      } text-white`}>
        <div>
          <p className="text-2xl font-bold">{attendanceRate}%</p>
          <p className="text-xs opacity-80">Attendance Rate</p>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          {(['present', 'late', 'absent', 'excused'] as const).map(status => (
            <div key={status}>
              <p className="text-lg font-bold">{stats[status]}</p>
              <p className="text-[9px] opacity-80">{STATUS_LABEL[status].text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Month Navigator */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 rounded-lg active:bg-gray-100">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</span>
          <button
            onClick={() => canGoForward && setCurrentMonth(addMonths(currentMonth, 1))}
            className={`p-1 rounded-lg ${canGoForward ? 'active:bg-gray-100' : 'opacity-30'}`}
            disabled={!canGoForward}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 text-center px-2 pt-2">
          {DAY_HEADERS.map((d, i) => (
            <div key={i} className="text-[10px] font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 text-center px-2 pb-3">
          {calendarDays.map((day, i) => {
            const inMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const key = format(day, 'yyyy-MM-dd');
            const record = recordMap.get(key);
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;

            return (
              <div key={i} className="py-1 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs relative ${
                  !inMonth ? 'text-gray-200' :
                  isToday ? 'bg-gray-900 text-white font-bold' :
                  isWeekend ? 'text-gray-300' :
                  'text-gray-700'
                }`}>
                  {day.getDate()}
                  {record && inMonth && (
                    <span className={`absolute -bottom-0.5 w-1.5 h-1.5 rounded-full ${STATUS_DOT[record.status]}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 px-4 pb-3 pt-1 border-t border-gray-50">
          {(['present', 'late', 'absent', 'excused'] as const).map(status => (
            <div key={status} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[status]}`} />
              <span className="text-[9px] text-gray-500">{STATUS_LABEL[status].text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Daily Log */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Daily Log</p>
        {sortedRecords.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">No records for this month</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {sortedRecords.map((record, i) => {
              const label = STATUS_LABEL[record.status];
              return (
                <div key={i} className="flex items-center px-3 py-2 gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[record.status]}`} />
                  <span className="text-xs text-gray-500 w-16 shrink-0">{format(record.date, 'dd MMM')}</span>
                  <span className="text-xs text-gray-400 w-10 shrink-0">{format(record.date, 'EEE')}</span>
                  <span className={`text-xs font-medium w-14 shrink-0 ${label.color}`}>{label.text}</span>
                  <span className="text-[10px] text-gray-400 flex-1 text-right truncate">
                    {record.checkIn && (
                      <>
                        {record.checkIn}
                        {record.checkOut && ` — ${record.checkOut}`}
                        {record.lateMinutes > 0 && (
                          <span className="text-amber-600 ml-1">+{record.lateMinutes}m</span>
                        )}
                      </>
                    )}
                    {record.status === 'absent' && 'No check-in'}
                    {record.status === 'excused' && 'Leave'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
