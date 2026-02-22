'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const WEEKLY_SCHEDULE: Record<string, { time: string; subject: string; class: string; room: string }[]> = {
  Monday: [
    { time: '08:00 - 09:30', subject: 'Bahasa Melayu', class: '5 Cemerlang', room: 'Bilik 3A' },
    { time: '09:30 - 10:00', subject: 'Rehat', class: '', room: '' },
    { time: '10:00 - 11:30', subject: 'Pendidikan Islam', class: '4 Bestari', room: 'Bilik 2B' },
    { time: '11:30 - 13:00', subject: 'Bahasa Melayu', class: '6 Amanah', room: 'Bilik 4A' },
    { time: '13:00 - 14:00', subject: 'Rehat Tengah Hari', class: '', room: '' },
    { time: '14:00 - 15:30', subject: 'Sejarah', class: '5 Cemerlang', room: 'Bilik 3A' },
  ],
  Tuesday: [
    { time: '08:00 - 09:30', subject: 'Pendidikan Islam', class: '5 Cemerlang', room: 'Bilik 3A' },
    { time: '09:30 - 10:00', subject: 'Rehat', class: '', room: '' },
    { time: '10:00 - 11:30', subject: 'Bahasa Melayu', class: '3 Bijak', room: 'Bilik 1C' },
    { time: '11:30 - 13:00', subject: 'Sejarah', class: '4 Bestari', room: 'Bilik 2B' },
    { time: '13:00 - 14:00', subject: 'Rehat Tengah Hari', class: '', room: '' },
    { time: '14:00 - 15:30', subject: 'Bahasa Melayu', class: '6 Amanah', room: 'Bilik 4A' },
  ],
  Wednesday: [
    { time: '08:00 - 09:30', subject: 'Bahasa Melayu', class: '4 Bestari', room: 'Bilik 2B' },
    { time: '09:30 - 10:00', subject: 'Rehat', class: '', room: '' },
    { time: '10:00 - 11:30', subject: 'Pendidikan Islam', class: '6 Amanah', room: 'Bilik 4A' },
    { time: '11:30 - 13:00', subject: 'Bahasa Melayu', class: '5 Cemerlang', room: 'Bilik 3A' },
    { time: '13:00 - 14:00', subject: 'Rehat Tengah Hari', class: '', room: '' },
    { time: '14:00 - 15:30', subject: 'Mesyuarat Guru', class: '', room: 'Bilik Mesyuarat' },
  ],
  Thursday: [
    { time: '08:00 - 09:30', subject: 'Sejarah', class: '6 Amanah', room: 'Bilik 4A' },
    { time: '09:30 - 10:00', subject: 'Rehat', class: '', room: '' },
    { time: '10:00 - 11:30', subject: 'Bahasa Melayu', class: '3 Bijak', room: 'Bilik 1C' },
    { time: '11:30 - 13:00', subject: 'Pendidikan Islam', class: '5 Cemerlang', room: 'Bilik 3A' },
    { time: '13:00 - 14:00', subject: 'Rehat Tengah Hari', class: '', room: '' },
    { time: '14:00 - 15:30', subject: 'Bahasa Melayu', class: '4 Bestari', room: 'Bilik 2B' },
  ],
  Friday: [
    { time: '08:00 - 09:30', subject: 'Pendidikan Islam', class: '4 Bestari', room: 'Bilik 2B' },
    { time: '09:30 - 10:00', subject: 'Rehat', class: '', room: '' },
    { time: '10:00 - 11:30', subject: 'Bahasa Melayu', class: '6 Amanah', room: 'Bilik 4A' },
    { time: '11:30 - 12:30', subject: 'Solat Jumaat', class: '', room: 'Surau' },
    { time: '12:30 - 13:00', subject: 'Rehat', class: '', room: '' },
    { time: '13:00 - 14:30', subject: 'Sejarah', class: '3 Bijak', room: 'Bilik 1C' },
  ],
};

export default function SchedulePage() {
  const todayIndex = Math.min(new Date().getDay() - 1, 4); // Mon=0..Fri=4
  const [selectedDay, setSelectedDay] = useState(todayIndex >= 0 ? todayIndex : 0);

  const dayName = DAYS[selectedDay];
  const periods = WEEKLY_SCHEDULE[dayName] ?? [];
  const teachingPeriods = periods.filter(p => p.class !== '');

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">Weekly Schedule</h1>
        <p className="text-xs text-gray-500">Pusat Jagaan Wangsa Maju · Semester 1 2024/25</p>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-1">
        {SHORT_DAYS.map((d, i) => {
          const isSelected = i === selectedDay;
          const isToday = i === todayIndex;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : isToday
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Day Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{dayName}</p>
          <p className="text-xs text-gray-500">{teachingPeriods.length} teaching period{teachingPeriods.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
            disabled={selectedDay === 0}
            className="p-1.5 rounded-lg bg-gray-100 active:bg-gray-200 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => setSelectedDay(Math.min(4, selectedDay + 1))}
            disabled={selectedDay === 4}
            className="p-1.5 rounded-lg bg-gray-100 active:bg-gray-200 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {periods.map((item, i) => {
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

      {/* Summary */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
        <p className="text-xs font-medium text-blue-800 mb-2">Weekly Summary</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-lg font-bold text-blue-900">20</p>
            <p className="text-[10px] text-blue-600">Total Periods</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-900">4</p>
            <p className="text-[10px] text-blue-600">Classes</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-900">3</p>
            <p className="text-[10px] text-blue-600">Subjects</p>
          </div>
        </div>
      </div>
    </div>
  );
}
