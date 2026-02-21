'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, BookOpen } from 'lucide-react';
import { useEducationStore } from '@/lib/store/education-store';
import { LEVEL_META, LEVEL_SCHEDULE, LEVEL_SUBJECTS, LEVEL_COLOR_CLASSES } from '@/lib/education-config';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

// Fixed color palette for subjects (not dynamic Tailwind)
const SUBJECT_COLORS = [
  '#dbeafe', '#dcfce7', '#fef9c3', '#ede9fe', '#fee2e2',
  '#ffedd5', '#f0fdf4', '#e0f2fe', '#fce7f3', '#f1f5f9',
  '#d1fae5', '#cffafe',
];

function getSubjectColor(index: number) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

export default function SchedulePage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';
  const meta = LEVEL_META[level];
  const schedule = LEVEL_SCHEDULE[level];
  const subjects = LEVEL_SUBJECTS[level];
  const colors = LEVEL_COLOR_CLASSES[level];

  // Build a subject → color index map
  const subjectColorMap: Record<string, number> = {};
  subjects.forEach((s, i) => { subjectColorMap[s.code] = i; });

  // ---- PRESCHOOL: Session View ----
  if (level === 'preschool') {
    const morningActivities = ['Circle Time', 'Literacy', 'Numeracy', 'Snack Break', 'Arts & Craft', 'Islamic Ed', 'Outdoor Play'];
    const afternoonActivities = ['Circle Time', 'Storytelling', 'Physical Ed', 'Arts & Craft', 'Social-Emotional', 'Free Play'];

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Session Schedule</h1>
            <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
          </div>
          <p className="text-muted-foreground">Daily session plan for Pre-school / Tadika</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Morning Session */}
          <Card className="border-emerald-200">
            <CardHeader className="bg-emerald-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-800">Morning Session</CardTitle>
                  <CardDescription className="text-emerald-600">8:00 AM – 12:00 PM · 4 hours</CardDescription>
                </div>
                <Badge className="bg-emerald-500 text-white">AM</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {[
                  { time: '8:00 – 8:20', activity: 'Circle Time & Morning Dua' },
                  { time: '8:20 – 9:00', activity: 'Literacy (BM/English)' },
                  { time: '9:00 – 9:40', activity: 'Numeracy' },
                  { time: '9:40 – 10:00', activity: 'Snack Break' },
                  { time: '10:00 – 10:40', activity: 'Islamic Education' },
                  { time: '10:40 – 11:20', activity: 'Arts & Craft' },
                  { time: '11:20 – 12:00', activity: 'Outdoor Play & PE' },
                ].map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50/50">
                    <span className="text-xs font-mono text-emerald-600 w-28 shrink-0">{slot.time}</span>
                    <span className="text-sm font-medium">{slot.activity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {morningActivities.map(act => (
                  <Badge key={act} variant="outline" className="text-xs text-emerald-700 border-emerald-200">{act}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Afternoon Session */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-800">Afternoon Session</CardTitle>
                  <CardDescription className="text-blue-600">1:00 PM – 5:00 PM · 4 hours</CardDescription>
                </div>
                <Badge className="bg-blue-500 text-white">PM</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {[
                  { time: '1:00 – 1:20', activity: 'Circle Time & Afternoon Dua' },
                  { time: '1:20 – 2:00', activity: 'Storytelling / Reading' },
                  { time: '2:00 – 2:40', activity: 'Physical Education' },
                  { time: '2:40 – 3:00', activity: 'Snack Break' },
                  { time: '3:00 – 3:40', activity: 'Arts & Craft / Creativity' },
                  { time: '3:40 – 4:20', activity: 'Social-Emotional Learning' },
                  { time: '4:20 – 5:00', activity: 'Free Play & Parent Pickup' },
                ].map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50">
                    <span className="text-xs font-mono text-blue-600 w-28 shrink-0">{slot.time}</span>
                    <span className="text-sm font-medium">{slot.activity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {afternoonActivities.map(act => (
                  <Badge key={act} variant="outline" className="text-xs text-blue-700 border-blue-200">{act}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly grid */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Session Coverage</CardTitle>
            <CardDescription>Which days run morning and/or afternoon sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {DAYS.map(day => (
                <div key={day} className="text-center">
                  <div className="text-xs font-semibold text-gray-500 mb-2">{day.slice(0, 3).toUpperCase()}</div>
                  <div className="space-y-1">
                    <div className="p-1.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium">AM</div>
                    {day !== 'Friday' && (
                      <div className="p-1.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">PM</div>
                    )}
                    {day === 'Friday' && (
                      <div className="p-1.5 rounded bg-gray-100 text-gray-400 text-xs">—</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- UNIVERSITY: Lecture View ----
  if (level === 'university') {
    const maxCreditHours = 21;
    const enrolledHours = 18;
    const modules = [
      { code: 'QUR101', name: 'Quran & Sunnah Studies I', lecture: 2, tutorial: 1, lab: 0, day: 'Monday', time: '8:00 – 10:00' },
      { code: 'ARA101', name: 'Arabic Language I', lecture: 2, tutorial: 1, lab: 0, day: 'Tuesday', time: '10:00 – 12:00' },
      { code: 'ISL201', name: 'Islamic Jurisprudence', lecture: 3, tutorial: 0, lab: 0, day: 'Wednesday', time: '8:00 – 11:00' },
      { code: 'MGT301', name: 'Islamic Management', lecture: 2, tutorial: 1, lab: 0, day: 'Thursday', time: '2:00 – 4:00' },
      { code: 'HIS101', name: 'Islamic Civilization', lecture: 2, tutorial: 1, lab: 0, day: 'Monday', time: '11:00 – 1:00' },
      { code: 'RES401', name: 'Research Methodology', lecture: 2, tutorial: 1, lab: 0, day: 'Friday', time: '8:00 – 10:00' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Semester Timetable</h1>
            <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
          </div>
          <p className="text-muted-foreground">Lecture, tutorial and lab schedule — 2024/2025 Semester 2</p>
        </div>

        {/* Credit hours enrollment panel */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Hour Enrollment</CardTitle>
            <CardDescription>Current semester registration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${colors.text}`}>{enrolledHours}</div>
                <div className="text-xs text-muted-foreground">Enrolled</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Credit Hours Enrolled</span>
                  <span className="font-semibold">{enrolledHours} / {maxCreditHours}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${colors.bg}`}
                    style={{ width: `${(enrolledHours / maxCreditHours) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                  <span>Min: 12 hrs</span>
                  <span>Max: {maxCreditHours} hrs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Module Schedule</CardTitle>
            <CardDescription>Weekly lecture, tutorial and lab hours per module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Module</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Day & Time</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Lecture</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Tutorial</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-600">Lab</th>
                    <th className="text-center py-2 pl-4 font-semibold text-gray-600">Total hrs/wk</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod, i) => (
                    <tr key={mod.code} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="font-semibold font-mono text-xs text-gray-500">{mod.code}</div>
                        <div className="font-medium">{mod.name}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="text-xs mr-1">{mod.day}</Badge>
                        <span className="text-xs text-muted-foreground">{mod.time}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{mod.lecture}h</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {mod.tutorial > 0
                          ? <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">{mod.tutorial}h</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {mod.lab > 0
                          ? <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium">{mod.lab}h</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3 pl-4 text-center font-semibold">{mod.lecture + mod.tutorial + mod.lab}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- PRIMARY / SECONDARY: Period Timetable ----
  const periodsPerDay = schedule.periodsPerDay ?? 10;
  const periodDuration = schedule.periodDurationMin ?? 35;

  // Generate period start times starting at 7:30 AM
  const getPeriodTime = (period: number) => {
    const startMinutes = 7 * 60 + 30 + (period - 1) * periodDuration + (period > 4 ? 20 : 0); // +20 for recess after period 4
    const h = Math.floor(startMinutes / 60);
    const m = startMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Sample timetable data
  const timetable: Record<string, Record<number, string>> = {
    Monday:    { 1: 'BM', 2: 'MT', 3: 'SC', 4: 'BI', 5: 'PI', 6: 'BM', 7: 'MT', 8: 'SE', 9: 'PJ', 10: 'SN' },
    Tuesday:   { 1: 'BI', 2: 'BM', 3: 'MT', 4: 'SC', 5: 'PI', 6: 'SE', 7: 'RBT', 8: 'MT', 9: 'BI', 10: 'MZ' },
    Wednesday: { 1: 'MT', 2: 'SC', 3: 'BI', 4: 'BM', 5: 'PI', 6: 'MT', 7: 'SC', 8: 'BI', 9: 'SE', 10: 'PJ' },
    Thursday:  { 1: 'SC', 2: 'BI', 3: 'BM', 4: 'MT', 5: 'PI', 6: 'SE', 7: 'BM', 8: 'SC', 9: 'SN', 10: 'RBT' },
    Friday:    { 1: 'PI', 2: 'BM', 3: 'MT', 4: 'BI', 5: 'SC', 6: 'SE', 7: 'PJ', 8: 'MT', 9: 'BI', 10: 'BM' },
  };

  // For secondary, use different subjects
  const secTimetable: Record<string, Record<number, string>> = {
    Monday:    { 1: 'BM', 2: 'MT', 3: 'AM', 4: 'BI', 5: 'PI', 6: 'BM', 7: 'PHY', 8: 'SEJ', 9: 'MT', 10: 'BI' },
    Tuesday:   { 1: 'BI', 2: 'BM', 3: 'MT', 4: 'CHEM', 5: 'PI', 6: 'SEJ', 7: 'AM', 8: 'MT', 9: 'BIO', 10: 'BI' },
    Wednesday: { 1: 'MT', 2: 'AM', 3: 'BI', 4: 'BM', 5: 'PI', 6: 'PHY', 7: 'CHEM', 8: 'BI', 9: 'SEJ', 10: 'GEO' },
    Thursday:  { 1: 'CHEM', 2: 'BI', 3: 'BM', 4: 'MT', 5: 'PI', 6: 'SEJ', 7: 'BM', 8: 'BIO', 9: 'AM', 10: 'MT' },
    Friday:    { 1: 'PI', 2: 'BM', 3: 'MT', 4: 'BI', 5: 'AM', 6: 'SEJ', 7: 'PHY', 8: 'MT', 9: 'BI', 10: 'BM' },
  };

  const activeTimetable = level === 'secondary' ? secTimetable : timetable;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold tracking-tight">Period Timetable</h1>
          <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
        </div>
        <p className="text-muted-foreground">
          Weekly {periodsPerDay}-period timetable · {periodDuration} minutes per period
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periods/Day</CardTitle>
            <Clock className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodsPerDay}</div>
            <p className="text-xs text-muted-foreground">{periodDuration} min each</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Days</CardTitle>
            <CalendarDays className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Mon – Fri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className={`h-4 w-4 ${colors.text}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">This level</p>
          </CardContent>
        </Card>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Period Schedule</CardTitle>
          <CardDescription>Color-coded by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-3 text-left text-gray-500 font-semibold border-b bg-gray-50 w-24">Period</th>
                  {DAYS.map(day => (
                    <th key={day} className="py-2 px-2 text-center text-gray-600 font-semibold border-b bg-gray-50">
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: periodsPerDay }, (_, i) => i + 1).map(period => (
                  <tr key={period} className={period === 4 ? 'border-b-2 border-gray-300' : ''}>
                    <td className="py-1.5 px-3 border-b border-gray-100 text-gray-500 font-mono">
                      <div>{getPeriodTime(period)}</div>
                      <div className="text-gray-300">P{period}</div>
                    </td>
                    {DAYS.map(day => {
                      const subjectCode = activeTimetable[day]?.[period] ?? '';
                      const subjectName = subjects.find(s => s.code === subjectCode)?.name ?? subjectCode;
                      const colorIdx = subjectColorMap[subjectCode] ?? 0;
                      return (
                        <td key={day} className="py-1 px-1 border-b border-gray-100 text-center">
                          <div
                            className="rounded px-1 py-1.5 font-semibold text-gray-700"
                            style={{ backgroundColor: getSubjectColor(colorIdx) }}
                            title={subjectName}
                          >
                            {subjectCode}
                          </div>
                        </td>
                      );
                    })}
                    {period === 4 && (
                      <tr>
                        <td colSpan={6} className="py-1 px-3 bg-orange-50 text-orange-600 text-center text-xs font-medium">
                          ☕ Recess — 20 minutes
                        </td>
                      </tr>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2">
            {subjects.map((s, i) => (
              <div
                key={s.code}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-gray-700"
                style={{ backgroundColor: getSubjectColor(i) }}
              >
                <span className="font-mono font-bold">{s.code}</span>
                <span className="opacity-70">{s.name.length > 12 ? s.name.slice(0, 12) + '…' : s.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
