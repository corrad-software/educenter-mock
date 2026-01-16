'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Calendar, Search, Check, X, Clock, Users, TrendingUp, AlertCircle, List, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock attendance data - in real app, this would come from API
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | null>>({});

  const getAttendanceColor = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'late':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  // Filter students by institute and search query
  const filteredStudents = malaysianStudents.filter(student => {
    const matchesInstitute = selectedInstitute === 'all' || student.centre.code === selectedInstitute;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.studentCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInstitute && matchesSearch && student.status === 'active';
  });

  // Calculate attendance statistics
  const totalStudents = filteredStudents.length;
  const presentCount = filteredStudents.filter(s => attendance[s.id] === 'present').length;
  const absentCount = filteredStudents.filter(s => attendance[s.id] === 'absent').length;
  const lateCount = filteredStudents.filter(s => attendance[s.id] === 'late').length;
  const unmarkedCount = totalStudents - presentCount - absentCount - lateCount;
  const attendanceRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '0';

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    return dateStr === selectedDate;
  };

  const handleDateClick = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setViewMode('list'); // Switch to list view when a date is selected
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Mark and track student attendance
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">{totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(0) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">{totalStudents > 0 ? ((absentCount / totalStudents) * 100).toFixed(0) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            <p className="text-xs text-muted-foreground">{totalStudents > 0 ? ((lateCount / totalStudents) * 100).toFixed(0) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">{unmarkedCount} unmarked</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert if there are unmarked students */}
      {unmarkedCount > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">
                {unmarkedCount} student{unmarkedCount > 1 ? 's' : ''} not marked yet
              </p>
              <p className="text-sm text-yellow-700">
                Please mark all students before submitting attendance
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Marking */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Select date and mark student attendance</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  className="gap-2"
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarDays className="h-4 w-4" />
                  Calendar View
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
              </div>

              <select
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Institutes</option>
                {malaysianInstitutes.map(institute => (
                  <option key={institute.id} value={institute.code}>
                    {institute.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                className="gap-2"
                disabled={unmarkedCount > 0}
              >
                <Check className="h-4 w-4" />
                Submit Attendance
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Institute</TableHead>
                  <TableHead>Subsidy</TableHead>
                  <TableHead className="text-center">Mark Attendance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium font-mono text-sm">{student.studentCode}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-sm">{student.centre.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          {student.subsidyCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                            className={`h-8 w-20 gap-1 ${attendance[student.id] === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            onClick={() => markAttendance(student.id, 'present')}
                          >
                            <Check className="h-4 w-4" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={attendance[student.id] === 'late' ? 'default' : 'outline'}
                            className={`h-8 w-16 gap-1 ${attendance[student.id] === 'late' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
                            onClick={() => markAttendance(student.id, 'late')}
                          >
                            <Clock className="h-4 w-4" />
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={attendance[student.id] === 'absent' ? 'default' : 'outline'}
                            className={`h-8 w-20 gap-1 ${attendance[student.id] === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                            onClick={() => markAttendance(student.id, 'absent')}
                          >
                            <X className="h-4 w-4" />
                            Absent
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {attendance[student.id] ? (
                          <Badge className={getAttendanceColor(attendance[student.id])}>
                            {attendance[student.id]?.toUpperCase()}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">
                            UNMARKED
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="space-y-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{formatMonthYear(currentMonth)}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: getDaysInMonth(currentMonth).startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: getDaysInMonth(currentMonth).daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayOfWeek = (getDaysInMonth(currentMonth).startingDayOfWeek + index) % 7;
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square p-2 rounded-lg border transition-all cursor-pointer
                        ${isSelectedDate(day) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 hover:border-blue-400'}
                        ${isToday(day) && !isSelectedDate(day) ? 'border-blue-400 border-2' : ''}
                        ${isWeekend ? 'bg-gray-50' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-sm font-medium ${isWeekend && !isSelectedDate(day) ? 'text-gray-400' : ''}`}>
                          {day}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-400"></div>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-sm text-gray-600">Selected Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
                  <span className="text-sm text-gray-600">Weekend</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Selected Date:</strong> {new Date(selectedDate).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Click on any date to select it and switch to list view to mark attendance for that day.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
