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
    <div className="flex flex-col h-full bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md pt-5 pb-3 px-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-b border-gray-200/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-none mb-1">Attendance</h1>
        <p className="text-[14px] text-slate-500 font-medium">{child?.name ?? 'Student'}</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">

        {/* Attendance Rate Banner */}
        <div className={`rounded-3xl p-5 shadow-lg shadow-black/5 relative overflow-hidden flex items-center justify-between ${attendanceRate >= 90 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
          attendanceRate >= 75 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
            'bg-gradient-to-br from-red-500 to-rose-600'
          } text-white`}>
          {/* decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[40px] font-black tracking-tight leading-none mb-1">{attendanceRate}%</p>
            <p className="text-[12px] font-bold tracking-widest uppercase opacity-90">Attendance Rate</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-right relative z-10">
            <div className="flex flex-col items-end">
              <p className="text-[18px] font-black leading-none mb-0.5">{stats['present']}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">{STATUS_LABEL['present'].text}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[18px] font-black leading-none mb-0.5">{stats['absent']}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">{STATUS_LABEL['absent'].text}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[18px] font-black leading-none mb-0.5">{stats['late']}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">{STATUS_LABEL['late'].text}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[18px] font-black leading-none mb-0.5">{stats['excused']}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">{STATUS_LABEL['excused'].text}</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden pb-1">
          {/* Month Navigator */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50/80 bg-slate-50/30">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center active:bg-gray-50 transition-colors shadow-sm">
              <ChevronLeft className="h-5 w-5 text-gray-600 pr-0.5" />
            </button>
            <span className="text-[16px] font-black text-slate-800 tracking-tight">{format(currentMonth, 'MMMM yyyy')}</span>
            <button
              onClick={() => canGoForward && setCurrentMonth(addMonths(currentMonth, 1))}
              className={`w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center transition-colors shadow-sm ${canGoForward ? 'active:bg-gray-50' : 'opacity-40'}`}
              disabled={!canGoForward}
            >
              <ChevronRight className="h-5 w-5 text-gray-600 pl-0.5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 text-center px-3 pt-4">
            {DAY_HEADERS.map((d, i) => (
              <div key={i} className="text-[11px] font-black tracking-widest text-slate-400 py-1 uppercase">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1.5 text-center px-3 py-3">
            {calendarDays.map((day, i) => {
              const inMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const key = format(day, 'yyyy-MM-dd');
              const record = recordMap.get(key);
              const isWeekend = getDay(day) === 0 || getDay(day) === 6;

              return (
                <div key={i} className="py-1 flex flex-col items-center justify-center min-h-[44px]">
                  <div className={`w-9 h-9 flex flex-col items-center justify-center rounded-2xl relative transition-all ${!inMonth ? 'text-slate-200' :
                    isToday ? 'bg-slate-900 text-white shadow-md' :
                      isWeekend ? 'text-slate-300 font-medium' :
                        'text-slate-700 font-bold'
                    }`}>
                    <span className={`text-[15px] ${isToday ? 'font-black' : ''}`}>{day.getDate()}</span>
                    {record && inMonth && (
                      <span className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ring-2 ring-white ${STATUS_DOT[record.status]}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-slate-50/30">
            {(['present', 'late', 'absent', 'excused'] as const).map(status => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                <span className="text-[11px] font-bold text-slate-500 hidden sm:inline-block">{STATUS_LABEL[status].text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Daily Log */}
        <div className="pb-8">
          <h3 className="text-[13px] font-bold text-slate-800 tracking-tight mb-3 px-1">Daily Log</h3>
          {sortedRecords.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-[14px] font-medium">No records for this month</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
              {sortedRecords.map((record, i) => {
                const label = STATUS_LABEL[record.status];
                return (
                  <div key={i} className="flex items-center px-5 py-3.5 gap-3 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center shrink-0 ${record.status === 'present' ? 'bg-green-50 text-green-700' : record.status === 'late' ? 'bg-amber-50 text-amber-700' : record.status === 'absent' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                      <span className="text-[15px] font-black leading-none">{format(record.date, 'dd')}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 mt-0.5">{format(record.date, 'EEE')}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <span className={`text-[14px] font-bold ${label.color}`}>{label.text}</span>
                        {record.lateMinutes > 0 && (
                          <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">+{record.lateMinutes}m late</span>
                        )}
                      </div>
                      <span className="text-[13px] font-medium text-slate-500 block truncate">
                        {record.checkIn ? (
                          <>
                            In: <span className="font-bold text-slate-700">{record.checkIn}</span>
                            {record.checkOut && <> · Out: <span className="font-bold text-slate-700">{record.checkOut}</span></>}
                          </>
                        ) : record.status === 'absent' ? 'No check-in recorded' : record.status === 'excused' ? 'Approved Leave' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
