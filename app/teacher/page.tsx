'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Calendar, Clock, Users, Check, X, Search, BookOpen, Award, AlertTriangle,
  Heart, TrendingUp, Plus, FileText, Download, User, MapPin, Phone,
  Shield, Activity, ClipboardList, Star, Minus, Smile, Meh, Frown, Zap,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import type { LogbookEntryType, MoodIndicator, DisciplineType, DisciplineCategory } from '@/lib/types';

// ============================================================
// INLINE MOCK DATA
// ============================================================

const teacherInfo = {
  name: 'Cikgu Aminah binti Razak',
  staffId: 'TCH-WM001-2024-001',
  centre: 'Pusat Jagaan Wangsa Maju',
  centreCode: 'WM001',
  className: '5 Cemerlang',
  level: 'Primary',
};

const classStudents = [
  { id: '1', studentCode: 'EDU-2024-001', name: 'Ahmad Bin Abdullah', ic: '120102-10-1234', guardianName: 'Abdullah Bin Hassan', guardianPhone: '+60123456789', subsidyCategory: 'B40', status: 'active' as const, attendanceRate: 92.5, healthAlerts: ['Asthma - carries inhaler'] },
  { id: '2', studentCode: 'EDU-2024-002', name: 'Fatimah Binti Ismail', ic: '130305-14-5678', guardianName: 'Ismail Bin Ahmad', guardianPhone: '+60198765432', subsidyCategory: 'M40', status: 'active' as const, attendanceRate: 88.0, healthAlerts: [] },
  { id: '3', studentCode: 'EDU-2024-003', name: 'Muhammad Irfan Bin Rosli', ic: '120815-10-3456', guardianName: 'Rosli Bin Yusof', guardianPhone: '+60177654321', subsidyCategory: 'B40', status: 'active' as const, attendanceRate: 78.5, healthAlerts: [] },
  { id: '4', studentCode: 'EDU-2024-004', name: 'Nurul Aisyah Binti Kamal', ic: '121120-14-7890', guardianName: 'Kamal Bin Othman', guardianPhone: '+60133456789', subsidyCategory: 'M40', status: 'active' as const, attendanceRate: 96.0, healthAlerts: ['Peanut allergy'] },
  { id: '5', studentCode: 'EDU-2024-005', name: 'Aiman Bin Zakaria', ic: '120430-10-2345', guardianName: 'Zakaria Bin Hamid', guardianPhone: '+60145678901', subsidyCategory: 'B40', status: 'active' as const, attendanceRate: 85.0, healthAlerts: [] },
  { id: '6', studentCode: 'EDU-2024-006', name: 'Siti Hajar Binti Osman', ic: '130210-14-6789', guardianName: 'Osman Bin Talib', guardianPhone: '+60156789012', subsidyCategory: 'Asnaf', status: 'active' as const, attendanceRate: 91.0, healthAlerts: [] },
  { id: '7', studentCode: 'EDU-2024-007', name: 'Harith Bin Jamaluddin', ic: '120625-10-4567', guardianName: 'Jamaluddin Bin Razak', guardianPhone: '+60167890123', subsidyCategory: 'M40', status: 'active' as const, attendanceRate: 94.5, healthAlerts: ['Wears glasses'] },
  { id: '8', studentCode: 'EDU-2024-008', name: 'Maryam Binti Idris', ic: '130918-14-8901', guardianName: 'Idris Bin Harun', guardianPhone: '+60178901234', subsidyCategory: 'B40', status: 'active' as const, attendanceRate: 89.0, healthAlerts: [] },
];

const mockLogbookEntries: Array<{
  id: string; studentId: string; studentName: string; date: string;
  type: LogbookEntryType; notes: string; mood: MoodIndicator; recordedBy: string;
}> = [
  { id: 'log-1', studentId: '1', studentName: 'Ahmad Bin Abdullah', date: '2024-01-15', type: 'Achievement', notes: 'Completed Quran recitation Juz 5 with excellent tajweed. Very motivated and focused.', mood: 'Happy', recordedBy: 'Cikgu Aminah' },
  { id: 'log-2', studentId: '3', studentName: 'Muhammad Irfan Bin Rosli', date: '2024-01-15', type: 'Behaviour', notes: 'Was disruptive during morning assembly. Spoken to privately after class.', mood: 'Anxious', recordedBy: 'Cikgu Aminah' },
  { id: 'log-3', studentId: '6', studentName: 'Siti Hajar Binti Osman', date: '2024-01-15', type: 'Health', notes: 'Complained of headache after recess. Given rest in sick bay. Guardian notified at 11:30 AM.', mood: 'Sad', recordedBy: 'Cikgu Aminah' },
  { id: 'log-4', studentId: '4', studentName: 'Nurul Aisyah Binti Kamal', date: '2024-01-14', type: 'Achievement', notes: 'Won first place in class spelling bee competition. Outstanding effort.', mood: 'Happy', recordedBy: 'Cikgu Aminah' },
  { id: 'log-5', studentId: '7', studentName: 'Harith Bin Jamaluddin', date: '2024-01-14', type: 'General', notes: 'Helped clean the classroom after art session without being asked. Good initiative.', mood: 'Energetic', recordedBy: 'Cikgu Aminah' },
  { id: 'log-6', studentId: '5', studentName: 'Aiman Bin Zakaria', date: '2024-01-13', type: 'Incident', notes: 'Fell during recess and scraped his knee. First aid applied. Guardian informed.', mood: 'Sad', recordedBy: 'Cikgu Aminah' },
];

const mockDisciplineRecords: Array<{
  id: string; studentId: string; studentName: string; date: string;
  type: DisciplineType; category: DisciplineCategory; points: number;
  description: string; recordedBy: string;
}> = [
  { id: 'disc-1', studentId: '1', studentName: 'Ahmad Bin Abdullah', date: '2024-01-14', type: 'merit', category: 'Academic', points: 5, description: 'Outstanding performance in Mathematics quiz', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-2', studentId: '3', studentName: 'Muhammad Irfan Bin Rosli', date: '2024-01-15', type: 'demerit', category: 'Behaviour', points: 2, description: 'Talking during assembly', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-3', studentId: '4', studentName: 'Nurul Aisyah Binti Kamal', date: '2024-01-14', type: 'merit', category: 'Academic', points: 5, description: 'Won class spelling bee', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-4', studentId: '7', studentName: 'Harith Bin Jamaluddin', date: '2024-01-14', type: 'merit', category: 'Leadership', points: 3, description: 'Volunteered to clean classroom after art session', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-5', studentId: '5', studentName: 'Aiman Bin Zakaria', date: '2024-01-13', type: 'demerit', category: 'Punctuality', points: 1, description: 'Late to class after recess', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-6', studentId: '2', studentName: 'Fatimah Binti Ismail', date: '2024-01-12', type: 'merit', category: 'Participation', points: 3, description: 'Active participation in group project presentation', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-7', studentId: '8', studentName: 'Maryam Binti Idris', date: '2024-01-12', type: 'merit', category: 'Cleanliness', points: 2, description: 'Kept desk and surrounding area clean all week', recordedBy: 'Cikgu Aminah' },
  { id: 'disc-8', studentId: '3', studentName: 'Muhammad Irfan Bin Rosli', date: '2024-01-10', type: 'demerit', category: 'Uniform', points: 1, description: 'Incomplete uniform - missing name tag', recordedBy: 'Cikgu Aminah' },
];

const mockActivityFeed = [
  { id: 'act-1', type: 'attendance', message: 'Marked attendance for 8 students', time: '08:15 AM', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'act-2', type: 'logbook', message: 'Added health note for Siti Hajar', time: '10:30 AM', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'act-3', type: 'discipline', message: 'Awarded 5 merit points to Ahmad', time: 'Yesterday', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'act-4', type: 'logbook', message: 'Recorded achievement for Nurul Aisyah', time: 'Yesterday', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'act-5', type: 'discipline', message: 'Issued 2 demerit points to M. Irfan', time: '2 days ago', color: 'text-red-600', bg: 'bg-red-50' },
];

const mockSchedule = [
  { time: '08:00 - 08:40', subject: 'Bahasa Melayu', room: 'Room 5A' },
  { time: '08:40 - 09:20', subject: 'Matematik', room: 'Room 5A' },
  { time: '09:20 - 09:40', subject: 'Rehat', room: '' },
  { time: '09:40 - 10:20', subject: 'Sains', room: 'Lab 2' },
  { time: '10:20 - 11:00', subject: 'Bahasa Inggeris', room: 'Room 5A' },
  { time: '11:00 - 11:40', subject: 'Pendidikan Islam', room: 'Surau' },
];

// ============================================================
// HELPERS
// ============================================================

const getLogTypeColor = (type: LogbookEntryType) => {
  switch (type) {
    case 'Achievement': return 'bg-green-100 text-green-800 border-green-300';
    case 'Health': return 'bg-red-100 text-red-800 border-red-300';
    case 'Behaviour': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'General': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Incident': return 'bg-purple-100 text-purple-800 border-purple-300';
  }
};

const getMoodIcon = (mood: MoodIndicator) => {
  switch (mood) {
    case 'Happy': return <Smile className="h-4 w-4 text-green-600" />;
    case 'Neutral': return <Meh className="h-4 w-4 text-gray-600" />;
    case 'Sad': return <Frown className="h-4 w-4 text-blue-600" />;
    case 'Anxious': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case 'Energetic': return <Zap className="h-4 w-4 text-yellow-600" />;
  }
};

const getInitials = (name: string) => {
  return name.split(' ').filter(w => !['Bin', 'Binti'].includes(w)).map(w => w[0]).slice(0, 2).join('');
};

const getInitialColor = (id: string) => {
  const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-orange-500'];
  return colors[parseInt(id) % colors.length];
};

// ============================================================
// COMPONENT
// ============================================================

export default function TeacherPortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Attendance state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMethod, setAttendanceMethod] = useState('Manual');
  const [attendance, setAttendance] = useState<Record<string, { status: string; checkIn: string; checkOut: string }>>(() => {
    const initial: Record<string, { status: string; checkIn: string; checkOut: string }> = {};
    classStudents.forEach(s => {
      initial[s.id] = { status: 'present', checkIn: '08:00', checkOut: '17:00' };
    });
    // Set some variety
    initial['3'] = { status: 'late', checkIn: '08:25', checkOut: '17:00' };
    initial['6'] = { status: 'absent', checkIn: '', checkOut: '' };
    return initial;
  });

  // Student tab
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof classStudents[0] | null>(null);
  const [studentDetailDialog, setStudentDetailDialog] = useState(false);

  // Logbook state
  const [logbookEntries, setLogbookEntries] = useState(mockLogbookEntries);
  const [logbookDialog, setLogbookDialog] = useState(false);
  const [logbookFilterType, setLogbookFilterType] = useState('all');
  const [newLog, setNewLog] = useState({ studentId: '', type: 'General' as LogbookEntryType, mood: 'Neutral' as MoodIndicator, notes: '' });

  // Discipline state
  const [disciplineRecords, setDisciplineRecords] = useState(mockDisciplineRecords);
  const [disciplineFilter, setDisciplineFilter] = useState<'all' | 'merit' | 'demerit'>('all');
  const [disciplineDialog, setDisciplineDialog] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState({ studentId: '', type: 'merit' as DisciplineType, category: 'Academic' as DisciplineCategory, points: 1, description: '' });

  // Reports state
  const [selectedReport, setSelectedReport] = useState<'attendance' | 'absentee' | 'late-pickup' | 'discipline'>('attendance');

  // Computed
  const presentCount = Object.values(attendance).filter(a => a.status === 'present').length;
  const absentCount = Object.values(attendance).filter(a => a.status === 'absent').length;
  const lateCount = Object.values(attendance).filter(a => a.status === 'late').length;
  const excusedCount = Object.values(attendance).filter(a => a.status === 'excused').length;
  const attendanceRate = classStudents.length > 0 ? Math.round(((presentCount + lateCount) / classStudents.length) * 100) : 0;

  const filteredStudents = classStudents.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.studentCode.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredLogbook = logbookEntries.filter(e =>
    logbookFilterType === 'all' || e.type === logbookFilterType
  );

  const filteredDiscipline = disciplineRecords.filter(r =>
    disciplineFilter === 'all' || r.type === disciplineFilter
  );

  const markAllPresent = () => {
    const updated: typeof attendance = {};
    classStudents.forEach(s => {
      updated[s.id] = { status: 'present', checkIn: format(new Date(), 'HH:mm'), checkOut: '' };
    });
    setAttendance(updated);
  };

  const toggleAttendance = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        checkIn: status === 'absent' ? '' : prev[studentId]?.checkIn || format(new Date(), 'HH:mm'),
        checkOut: status === 'absent' ? '' : prev[studentId]?.checkOut || '',
      },
    }));
  };

  const addLogEntry = () => {
    if (!newLog.studentId || !newLog.notes) return;
    const student = classStudents.find(s => s.id === newLog.studentId);
    const entry = {
      id: `log-${Date.now()}`,
      studentId: newLog.studentId,
      studentName: student?.name || '',
      date: new Date().toISOString().split('T')[0],
      type: newLog.type,
      notes: newLog.notes,
      mood: newLog.mood,
      recordedBy: teacherInfo.name,
    };
    setLogbookEntries(prev => [entry, ...prev]);
    setLogbookDialog(false);
    setNewLog({ studentId: '', type: 'General', mood: 'Neutral', notes: '' });
  };

  const addDisciplineRecord = () => {
    if (!newDiscipline.studentId || !newDiscipline.description) return;
    const student = classStudents.find(s => s.id === newDiscipline.studentId);
    const record = {
      id: `disc-${Date.now()}`,
      studentId: newDiscipline.studentId,
      studentName: student?.name || '',
      date: new Date().toISOString().split('T')[0],
      type: newDiscipline.type,
      category: newDiscipline.category,
      points: newDiscipline.points,
      description: newDiscipline.description,
      recordedBy: teacherInfo.name,
    };
    setDisciplineRecords(prev => [record, ...prev]);
    setDisciplineDialog(false);
    setNewDiscipline({ studentId: '', type: 'merit', category: 'Academic', points: 1, description: '' });
  };

  // Per-student discipline summary
  const disciplineSummary = classStudents.map(s => {
    const records = disciplineRecords.filter(r => r.studentId === s.id);
    const merits = records.filter(r => r.type === 'merit').reduce((sum, r) => sum + r.points, 0);
    const demerits = records.filter(r => r.type === 'demerit').reduce((sum, r) => sum + r.points, 0);
    return { ...s, merits, demerits, net: merits - demerits };
  }).sort((a, b) => b.net - a.net);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Portal</h1>
          <p className="text-muted-foreground">Manage your class, attendance, and student activities</p>
        </div>
      </div>

      {/* Teacher & Class Info Banner */}
      <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                CA
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-lg font-bold">{teacherInfo.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {teacherInfo.staffId}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {teacherInfo.centre}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-gray-600">Class</p>
                    <p className="font-semibold">{teacherInfo.className}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Level</p>
                    <p className="font-semibold">{teacherInfo.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Today</p>
                    <p className="font-semibold">{format(new Date(), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-300">
              {classStudents.length} Students
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStudents.length}</div>
            <p className="text-xs text-muted-foreground">Class {teacherInfo.className}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{presentCount}</div>
            <p className="text-xs text-muted-foreground">{lateCount > 0 ? `+ ${lateCount} late` : 'All on time'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{absentCount}</div>
            <p className="text-xs text-muted-foreground">{excusedCount > 0 ? `${excusedCount} excused` : 'No excused'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Today&apos;s rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="logbook">Logbook</TabsTrigger>
          <TabsTrigger value="discipline">Discipline</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: DASHBOARD */}
        {/* ============================================================ */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Jump to common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-teal-50 hover:border-teal-300" onClick={() => setActiveTab('attendance')}>
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <span className="text-sm">Mark Attendance</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300" onClick={() => { setActiveTab('logbook'); setLogbookDialog(true); }}>
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Add Log Entry</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300" onClick={() => { setActiveTab('discipline'); setDisciplineDialog(true); }}>
                    <Award className="h-5 w-5 text-amber-600" />
                    <span className="text-sm">Record Merit</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300" onClick={() => setActiveTab('reports')}>
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockActivityFeed.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                        {item.type === 'attendance' && <Calendar className={`h-4 w-4 ${item.color}`} />}
                        {item.type === 'logbook' && <BookOpen className={`h-4 w-4 ${item.color}`} />}
                        {item.type === 'discipline' && <Award className={`h-4 w-4 ${item.color}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{item.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-teal-600" />
                Today&apos;s Schedule
              </CardTitle>
              <CardDescription>Class {teacherInfo.className} timetable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {mockSchedule.map((slot, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border text-center ${slot.subject === 'Rehat' ? 'bg-gray-50 border-gray-200' : 'bg-teal-50 border-teal-200'}`}>
                    <p className="text-xs text-gray-500">{slot.time}</p>
                    <p className="font-semibold text-sm mt-1">{slot.subject}</p>
                    {slot.room && <p className="text-xs text-gray-500 mt-0.5">{slot.room}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: ATTENDANCE */}
        {/* ============================================================ */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Daily Attendance
                  </CardTitle>
                  <CardDescription>Mark attendance for Class {teacherInfo.className}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                  <Select value={attendanceMethod} onValueChange={setAttendanceMethod}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Face ID">Face ID</SelectItem>
                      <SelectItem value="QR Code">QR Code</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={markAllPresent} className="gap-2">
                    <Check className="h-4 w-4" />
                    Mark All Present
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((student) => {
                    const att = attendance[student.id] || { status: '', checkIn: '', checkOut: '' };
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full ${getInitialColor(student.id)} flex items-center justify-center text-white text-xs font-bold`}>
                              {getInitials(student.name)}
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.studentCode}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {['present', 'absent', 'late', 'excused'].map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={att.status === status ? 'default' : 'outline'}
                                className={`text-xs px-2 py-1 h-7 ${
                                  att.status === status
                                    ? status === 'present' ? 'bg-green-600 hover:bg-green-700' :
                                      status === 'absent' ? 'bg-red-600 hover:bg-red-700' :
                                      status === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                      'bg-blue-600 hover:bg-blue-700'
                                    : ''
                                }`}
                                onClick={() => toggleAttendance(student.id, status)}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {att.status !== 'absent' && (
                            <Input
                              type="time"
                              value={att.checkIn}
                              onChange={(e) => setAttendance(prev => ({ ...prev, [student.id]: { ...prev[student.id], checkIn: e.target.value } }))}
                              className="w-28 h-8 text-sm"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {att.status !== 'absent' && (
                            <Input
                              type="time"
                              value={att.checkOut}
                              onChange={(e) => setAttendance(prev => ({ ...prev, [student.id]: { ...prev[student.id], checkOut: e.target.value } }))}
                              className="w-28 h-8 text-sm"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{attendanceMethod}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Summary Footer */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-sm"><span className="font-semibold text-green-700">{presentCount}</span> Present</span>
                  <span className="text-sm"><span className="font-semibold text-red-700">{absentCount}</span> Absent</span>
                  <span className="text-sm"><span className="font-semibold text-yellow-700">{lateCount}</span> Late</span>
                  <span className="text-sm"><span className="font-semibold text-blue-700">{excusedCount}</span> Excused</span>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 gap-2">
                  <Check className="h-4 w-4" />
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: STUDENTS */}
        {/* ============================================================ */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or student code..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">{filteredStudents.length} student(s)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedStudent(student); setStudentDetailDialog(true); }}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-full ${getInitialColor(student.id)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {getInitials(student.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{student.name}</p>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{student.studentCode}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {student.guardianName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {student.guardianPhone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                          {student.subsidyCategory}
                        </Badge>
                        <div className="flex items-center gap-1 flex-1">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-200">
                            <div
                              className={`h-1.5 rounded-full ${student.attendanceRate >= 90 ? 'bg-green-500' : student.attendanceRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500">{student.attendanceRate}%</span>
                        </div>
                        {student.healthAlerts.length > 0 && (
                          <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 gap-1">
                            <Heart className="h-2.5 w-2.5" />
                            Alert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Student Detail Dialog */}
          <Dialog open={studentDetailDialog} onOpenChange={setStudentDetailDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Student Details</DialogTitle>
                <DialogDescription>{selectedStudent?.name}</DialogDescription>
              </DialogHeader>
              {selectedStudent && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-full ${getInitialColor(selectedStudent.id)} flex items-center justify-center text-white font-bold text-lg`}>
                      {getInitials(selectedStudent.name)}
                    </div>
                    <div>
                      <p className="text-lg font-bold">{selectedStudent.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{selectedStudent.studentCode}</p>
                      <p className="text-sm text-muted-foreground">IC: {selectedStudent.ic}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50 border">
                      <p className="text-xs text-gray-500">Guardian</p>
                      <p className="font-semibold text-sm">{selectedStudent.guardianName}</p>
                      <p className="text-xs text-gray-600">{selectedStudent.guardianPhone}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border">
                      <p className="text-xs text-gray-500">Subsidy & Attendance</p>
                      <p className="font-semibold text-sm">{selectedStudent.subsidyCategory} · {selectedStudent.attendanceRate}%</p>
                    </div>
                  </div>

                  {selectedStudent.healthAlerts.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-xs text-red-700 font-semibold flex items-center gap-1">
                        <Heart className="h-3 w-3" /> Health Alerts
                      </p>
                      {selectedStudent.healthAlerts.map((alert, idx) => (
                        <p key={idx} className="text-sm text-red-700 mt-1">{alert}</p>
                      ))}
                    </div>
                  )}

                  {/* Recent Logbook for this student */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Recent Logbook</p>
                    {logbookEntries.filter(e => e.studentId === selectedStudent.id).length > 0 ? (
                      <div className="space-y-2">
                        {logbookEntries.filter(e => e.studentId === selectedStudent.id).slice(0, 3).map(entry => (
                          <div key={entry.id} className="flex items-start gap-2 p-2 rounded bg-gray-50 border">
                            <Badge className={`${getLogTypeColor(entry.type)} border text-[10px] shrink-0`}>{entry.type}</Badge>
                            <p className="text-xs text-gray-700">{entry.notes}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No recent entries</p>
                    )}
                  </div>

                  {/* Discipline for this student */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Discipline Records</p>
                    {(() => {
                      const records = disciplineRecords.filter(r => r.studentId === selectedStudent.id);
                      const merits = records.filter(r => r.type === 'merit').reduce((s, r) => s + r.points, 0);
                      const demerits = records.filter(r => r.type === 'demerit').reduce((s, r) => s + r.points, 0);
                      return (
                        <div className="flex gap-3">
                          <div className="p-2 rounded bg-green-50 border border-green-200 text-center flex-1">
                            <p className="text-lg font-bold text-green-700">{merits}</p>
                            <p className="text-[10px] text-green-600">Merit Points</p>
                          </div>
                          <div className="p-2 rounded bg-red-50 border border-red-200 text-center flex-1">
                            <p className="text-lg font-bold text-red-700">{demerits}</p>
                            <p className="text-[10px] text-red-600">Demerit Points</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: LOGBOOK */}
        {/* ============================================================ */}
        <TabsContent value="logbook" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select value={logbookFilterType} onValueChange={setLogbookFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Behaviour">Behaviour</SelectItem>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Incident">Incident</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">{filteredLogbook.length} entries</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 gap-2" onClick={() => setLogbookDialog(true)}>
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </div>

          <div className="space-y-3">
            {filteredLogbook.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      {getMoodIcon(entry.mood)}
                      <span className="text-[10px] text-gray-400">{entry.mood}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{entry.studentName}</p>
                        <Badge className={`${getLogTypeColor(entry.type)} border text-[10px]`}>{entry.type}</Badge>
                        <span className="text-xs text-gray-400 ml-auto">{entry.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{entry.notes}</p>
                      <p className="text-xs text-gray-400 mt-1">By {entry.recordedBy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Logbook Dialog */}
          <Dialog open={logbookDialog} onOpenChange={setLogbookDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Logbook Entry</DialogTitle>
                <DialogDescription>Record a student activity or observation</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select value={newLog.studentId} onValueChange={(v) => setNewLog(prev => ({ ...prev, studentId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {classStudents.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Entry Type</Label>
                  <Select value={newLog.type} onValueChange={(v) => setNewLog(prev => ({ ...prev, type: v as LogbookEntryType }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Behaviour">Behaviour</SelectItem>
                      <SelectItem value="Achievement">Achievement</SelectItem>
                      <SelectItem value="Incident">Incident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mood</Label>
                  <div className="flex gap-2">
                    {(['Happy', 'Neutral', 'Sad', 'Anxious', 'Energetic'] as MoodIndicator[]).map(mood => (
                      <Button
                        key={mood}
                        variant={newLog.mood === mood ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 gap-1 text-xs"
                        onClick={() => setNewLog(prev => ({ ...prev, mood }))}
                      >
                        {getMoodIcon(mood)}
                        {mood}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Describe the activity or observation..."
                    value={newLog.notes}
                    onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setLogbookDialog(false)} className="flex-1">Cancel</Button>
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={addLogEntry} disabled={!newLog.studentId || !newLog.notes}>Save Entry</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 5: DISCIPLINE */}
        {/* ============================================================ */}
        <TabsContent value="discipline" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(['all', 'merit', 'demerit'] as const).map(f => (
                <Button
                  key={f}
                  variant={disciplineFilter === f ? 'default' : 'outline'}
                  size="sm"
                  className={disciplineFilter === f && f === 'merit' ? 'bg-green-600 hover:bg-green-700' : disciplineFilter === f && f === 'demerit' ? 'bg-red-600 hover:bg-red-700' : ''}
                  onClick={() => setDisciplineFilter(f)}
                >
                  {f === 'all' ? 'All' : f === 'merit' ? 'Merit' : 'Demerit'}
                </Button>
              ))}
              <p className="text-sm text-muted-foreground ml-2">{filteredDiscipline.length} records</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 gap-2" onClick={() => setDisciplineDialog(true)}>
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscipline.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>
                        <Badge className={record.type === 'merit' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}>
                          {record.type === 'merit' ? '+ Merit' : '- Demerit'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{record.category}</TableCell>
                      <TableCell className="text-center font-semibold">{record.points}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">{record.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Per-Student Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student Discipline Summary</CardTitle>
              <CardDescription>Merit vs demerit totals per student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {disciplineSummary.map(s => (
                  <div key={s.id} className="p-3 rounded-lg border bg-gray-50 text-center">
                    <p className="font-semibold text-sm truncate">{s.name.split(' ')[0]}</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-green-700 font-bold text-sm">+{s.merits}</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-red-700 font-bold text-sm">-{s.demerits}</span>
                    </div>
                    <p className={`text-xs font-semibold mt-0.5 ${s.net > 0 ? 'text-green-600' : s.net < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      Net: {s.net > 0 ? '+' : ''}{s.net}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Discipline Dialog */}
          <Dialog open={disciplineDialog} onOpenChange={setDisciplineDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Discipline Record</DialogTitle>
                <DialogDescription>Record a merit or demerit entry</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select value={newDiscipline.studentId} onValueChange={(v) => setNewDiscipline(prev => ({ ...prev, studentId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {classStudents.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={newDiscipline.type === 'merit' ? 'default' : 'outline'}
                      className={`flex-1 ${newDiscipline.type === 'merit' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      onClick={() => setNewDiscipline(prev => ({ ...prev, type: 'merit' }))}
                    >
                      <Star className="h-4 w-4 mr-2" /> Merit
                    </Button>
                    <Button
                      variant={newDiscipline.type === 'demerit' ? 'default' : 'outline'}
                      className={`flex-1 ${newDiscipline.type === 'demerit' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                      onClick={() => setNewDiscipline(prev => ({ ...prev, type: 'demerit' }))}
                    >
                      <Minus className="h-4 w-4 mr-2" /> Demerit
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newDiscipline.category} onValueChange={(v) => setNewDiscipline(prev => ({ ...prev, category: v as DisciplineCategory }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['Academic', 'Behaviour', 'Punctuality', 'Uniform', 'Participation', 'Leadership', 'Cleanliness'] as DisciplineCategory[]).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={newDiscipline.points}
                    onChange={(e) => setNewDiscipline(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the reason..."
                    value={newDiscipline.description}
                    onChange={(e) => setNewDiscipline(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setDisciplineDialog(false)} className="flex-1">Cancel</Button>
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={addDisciplineRecord} disabled={!newDiscipline.studentId || !newDiscipline.description}>Save Record</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 6: REPORTS */}
        {/* ============================================================ */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { id: 'attendance' as const, label: 'Attendance Summary', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50 border-green-200 hover:bg-green-100' },
              { id: 'absentee' as const, label: 'Absentee Report', icon: X, color: 'text-red-600', bg: 'bg-red-50 border-red-200 hover:bg-red-100' },
              { id: 'late-pickup' as const, label: 'Late Pickup', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
              { id: 'discipline' as const, label: 'Discipline Summary', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
            ]).map(report => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all border ${selectedReport === report.id ? report.bg + ' ring-2 ring-offset-1 ring-teal-400' : 'hover:shadow-sm'}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardContent className="py-4 text-center">
                  <report.icon className={`h-6 w-6 mx-auto ${report.color}`} />
                  <p className="text-sm font-medium mt-2">{report.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Report Content */}
          {selectedReport === 'attendance' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Weekly Attendance Summary</CardTitle>
                    <CardDescription>This week&apos;s attendance overview</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Download className="h-3 w-3" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { day: 'Monday', present: 7, absent: 1, late: 0 },
                      { day: 'Tuesday', present: 8, absent: 0, late: 0 },
                      { day: 'Wednesday', present: 6, absent: 1, late: 1 },
                      { day: 'Thursday', present: 7, absent: 0, late: 1 },
                      { day: 'Friday', present: presentCount, absent: absentCount, late: lateCount },
                    ].map(row => (
                      <TableRow key={row.day}>
                        <TableCell className="font-medium">{row.day}</TableCell>
                        <TableCell className="text-center text-green-700 font-semibold">{row.present}</TableCell>
                        <TableCell className="text-center text-red-700 font-semibold">{row.absent}</TableCell>
                        <TableCell className="text-center text-yellow-700 font-semibold">{row.late}</TableCell>
                        <TableCell className="text-center font-semibold">{Math.round(((row.present + row.late) / 8) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {selectedReport === 'absentee' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Absentee Report</CardTitle>
                <CardDescription>Students sorted by absence frequency this month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Days Absent</TableHead>
                      <TableHead className="text-center">Attendance Rate</TableHead>
                      <TableHead>Guardian Contact</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classStudents.sort((a, b) => a.attendanceRate - b.attendanceRate).map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-center font-semibold">{Math.round((100 - student.attendanceRate) / 100 * 20)}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={student.attendanceRate >= 90 ? 'bg-green-100 text-green-800' : student.attendanceRate >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                            {student.attendanceRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{student.guardianPhone}</TableCell>
                        <TableCell>
                          {student.attendanceRate < 80 && (
                            <Badge className="bg-red-100 text-red-800 border border-red-300">Needs Attention</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {selectedReport === 'late-pickup' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Late Pickup Report</CardTitle>
                <CardDescription>Students picked up after 5:30 PM — penalty may apply</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Check-out Time</TableHead>
                      <TableHead>Late By</TableHead>
                      <TableHead className="text-right">Penalty (RM)</TableHead>
                      <TableHead>Guardian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2024-01-15', studentName: 'Ahmad Bin Abdullah', checkOut: '17:45', lateBy: '15 min', penalty: 5, guardian: 'Abdullah Bin Hassan' },
                      { date: '2024-01-14', studentName: 'Muhammad Irfan Bin Rosli', checkOut: '18:10', lateBy: '40 min', penalty: 15, guardian: 'Rosli Bin Yusof' },
                      { date: '2024-01-12', studentName: 'Aiman Bin Zakaria', checkOut: '17:50', lateBy: '20 min', penalty: 5, guardian: 'Zakaria Bin Hamid' },
                    ].map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-sm">{entry.date}</TableCell>
                        <TableCell className="font-medium">{entry.studentName}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.checkOut}</TableCell>
                        <TableCell>
                          <Badge className="bg-orange-100 text-orange-800 border border-orange-300">{entry.lateBy}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-red-700">RM {entry.penalty.toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{entry.guardian}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200 text-sm text-orange-800">
                  <p className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Penalty rule: RM 5.00 per 15 minutes after 5:30 PM (as configured by centre admin)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedReport === 'discipline' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Discipline Summary</CardTitle>
                <CardDescription>Student rankings by net discipline points</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Merit</TableHead>
                      <TableHead className="text-center">Demerit</TableHead>
                      <TableHead className="text-center">Net Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disciplineSummary.map((s, idx) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-semibold">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-center text-green-700 font-semibold">{s.merits}</TableCell>
                        <TableCell className="text-center text-red-700 font-semibold">{s.demerits}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={s.net > 0 ? 'bg-green-100 text-green-800' : s.net < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                            {s.net > 0 ? '+' : ''}{s.net}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {s.net >= 5 && <Badge className="bg-green-500 text-white">Excellent</Badge>}
                          {s.net >= 1 && s.net < 5 && <Badge className="bg-blue-500 text-white">Good</Badge>}
                          {s.net === 0 && <Badge variant="outline">Neutral</Badge>}
                          {s.net < 0 && <Badge className="bg-orange-500 text-white">Monitor</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
