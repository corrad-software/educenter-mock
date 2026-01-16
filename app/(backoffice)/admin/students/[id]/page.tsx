'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { ChevronRight, Home, Users, ArrowLeft, Calendar, Building2, DollarSign, User, Phone, Mail, MapPin, Check, X, Clock, CreditCard, Receipt, TrendingUp, List, CalendarDays, ChevronLeft as ChevronLeftIcon } from 'lucide-react';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = malaysianStudents.find(s => s.id === id);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  if (!student) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Student not found</p>
          <Link href="/admin/students">
            <Button className="mt-4">Back to Student List</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock attendance data - generate for the past 90 days for calendar view
  const generateAttendanceData = () => {
    const data: Record<string, 'present' | 'absent' | 'late'> = {};
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      // Random attendance status
      const rand = Math.random();
      let status: 'present' | 'absent' | 'late';
      if (rand > 0.15) status = 'present';
      else if (rand > 0.05) status = 'late';
      else status = 'absent';

      data[date.toISOString().split('T')[0]] = status;
    }
    return data;
  };

  // Calendar helper functions
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
    setSelectedMonth(prev => {
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

  const getAttendanceForDate = (day: number, attendanceMap: Record<string, 'present' | 'absent' | 'late'>) => {
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toISOString().split('T')[0];
    return attendanceMap[dateStr] || null;
  };

  const attendanceDataMap = generateAttendanceData();
  const attendanceArray = Object.entries(attendanceDataMap).map(([date, status]) => ({
    date,
    day: new Date(date).toLocaleDateString('en-MY', { weekday: 'short' }),
    status
  }));

  const presentCount = attendanceArray.filter(a => a.status === 'present').length;
  const lateCount = attendanceArray.filter(a => a.status === 'late').length;
  const absentCount = attendanceArray.filter(a => a.status === 'absent').length;
  const attendanceRate = attendanceArray.length > 0 ? ((presentCount / attendanceArray.length) * 100).toFixed(1) : '0';

  // Mock fee payment data - last 6 months
  const generateFeeData = () => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
      const isPaid = i > 0 || Math.random() > 0.3;

      data.push({
        month,
        amount: student.monthlyFee,
        status: isPaid ? 'paid' : 'pending',
        paidDate: isPaid ? new Date(date.getFullYear(), date.getMonth(), Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0] : null
      });
    }
    return data;
  };

  const feeData = generateFeeData();
  const totalPaid = feeData.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = feeData.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'withdrawn': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/admin" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/admin/students" className="flex items-center hover:text-foreground transition-colors">
          <Users className="h-4 w-4 mr-1" />
          Students
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{student.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="font-mono">{student.studentCode}</Badge>
            <Badge className={getStatusColor(student.status)}>
              {student.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              {student.subsidyCategory}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Receipt className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">Out of {attendanceArray.length} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">RM {student.monthlyFee}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">RM {totalPending}</div>
            <p className="text-xs text-muted-foreground">{feeData.filter(f => f.status === 'pending').length} month(s)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IC Number</p>
                <p className="font-medium font-mono">{student.ic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{student.dateOfBirth.toLocaleDateString('en-MY')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-medium">{student.registrationDate.toLocaleDateString('en-MY')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(student.status)}>
                  {student.status.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subsidy Category</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {student.subsidyCategory}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Guardian Name</p>
                <p className="font-medium">{student.guardian.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IC Number</p>
                <p className="font-medium font-mono">{student.guardian.ic}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{student.guardian.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student.guardian.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* School Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Institute Name</p>
              <p className="font-medium text-lg">{student.centre.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Institute Code</p>
              <p className="font-medium font-mono">{student.centre.code}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{student.centre.address}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Centre Head</p>
              <p className="font-medium">{student.centre.head.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Centre Email</p>
                <p className="font-medium">{student.centre.head.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-medium">{student.centre.capacity} students</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History - Split into 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Attendance Summary
            </CardTitle>
            <CardDescription className="text-xs">Last 90 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Present</span>
                </div>
                <span className="text-sm font-bold text-green-700">{presentCount} days</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">Late</span>
                </div>
                <span className="text-sm font-bold text-yellow-700">{lateCount} days</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">Absent</span>
                </div>
                <span className="text-sm font-bold text-red-700">{absentCount} days</span>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Days</span>
                <span className="text-sm font-semibold">{attendanceArray.length}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <span className="text-lg font-bold text-blue-600">{attendanceRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{formatMonthYear(selectedMonth)}</CardTitle>
                <CardDescription className="text-xs">Monthly attendance calendar</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 cursor-pointer"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeftIcon className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs cursor-pointer"
                  onClick={() => setSelectedMonth(new Date())}
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 cursor-pointer"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: getDaysInMonth(selectedMonth).startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: getDaysInMonth(selectedMonth).daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayOfWeek = (getDaysInMonth(selectedMonth).startingDayOfWeek + index) % 7;
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const attendanceStatus = getAttendanceForDate(day, attendanceDataMap);
                  const today = new Date();
                  const isToday = day === today.getDate() &&
                                 selectedMonth.getMonth() === today.getMonth() &&
                                 selectedMonth.getFullYear() === today.getFullYear();

                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square p-1 rounded border transition-all
                        ${isWeekend ? 'bg-gray-50' : 'bg-white'}
                        ${isToday ? 'border-blue-400 border-2' : 'border-gray-200'}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-xs font-medium ${isWeekend ? 'text-gray-400' : ''}`}>
                          {day}
                        </span>
                        {attendanceStatus && !isWeekend && (
                          <div className={`mt-0.5 w-1.5 h-1.5 rounded-full ${
                            attendanceStatus === 'present' ? 'bg-green-500' :
                            attendanceStatus === 'late' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact Legend */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">Late</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded border-2 border-blue-400"></div>
                  <span className="text-gray-600">Today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Fee Payment History
              </CardTitle>
              <CardDescription>Last 6 months payment records</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">RM {totalPaid}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.month}</TableCell>
                  <TableCell className="font-semibold">
                    RM {record.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {record.paidDate ? new Date(record.paidDate).toLocaleDateString('en-MY') : '-'}
                  </TableCell>
                  <TableCell>
                    {record.status === 'paid' ? (
                      <Badge className="bg-green-500">PAID</Badge>
                    ) : (
                      <Badge className="bg-orange-500">PENDING</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.status === 'paid' ? (
                      <Button size="sm" variant="outline" className="gap-2">
                        <Receipt className="h-4 w-4" />
                        Receipt
                      </Button>
                    ) : (
                      <Button size="sm" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
