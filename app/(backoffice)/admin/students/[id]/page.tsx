'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { ChevronRight, Home, Users, ArrowLeft, Calendar, Building2, DollarSign, User, Phone, Mail, MapPin, Check, X, Clock, CreditCard, Receipt, TrendingUp, List, CalendarDays, ChevronLeft as ChevronLeftIcon, Gift, ArrowRightLeft, UserMinus, History, Info } from 'lucide-react';
import { generateStudentPDF } from '@/lib/utils/generate-student-pdf';
import { StudentTimeline } from '@/components/student-lifecycle/student-timeline';

const studentPhotoMap: Record<string, string> = {
  'pri-001': '/images/ahmad.jpg',
  '3': '/images/aisyah.jpg',
  '4': '/images/irfan.jpg',
};

const studentHealthMap: Record<string, {
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  lastScreeningDate: string;
}> = {
  'pri-001': {
    bloodType: 'A+',
    allergies: ['Seafood'],
    chronicConditions: ['Mild asthma'],
    emergencyContact: 'Abdul Rahman bin Hassan (+60123456701)',
    lastScreeningDate: '2026-01-15',
  },
};

const studentCurriculumMap: Record<string, Array<{ term: string; subject: string; score: number; grade: string; remark: string }>> = {
  'pri-001': [
    { term: 'Term 1', subject: 'Bahasa Melayu', score: 82, grade: 'A', remark: 'Good reading fluency' },
    { term: 'Term 1', subject: 'Matematik', score: 88, grade: 'A', remark: 'Strong numeracy skills' },
    { term: 'Term 1', subject: 'Sains', score: 79, grade: 'B+', remark: 'Improving practical understanding' },
    { term: 'Term 1', subject: 'Pendidikan Islam', score: 91, grade: 'A+', remark: 'Excellent mastery' },
  ],
};

const studentCommentsMap: Record<string, string[]> = {
  'pri-001': [
    'Shows positive classroom behaviour and participates actively in discussions.',
    'Punctuality improved this term, with fewer late arrivals compared to prior months.',
    'Benefits from additional reading practice at home for language enrichment.',
  ],
};

const studentRecommendationsMap: Record<string, string[]> = {
  'pri-001': [
    'Continue weekly reading log with guardian verification.',
    'Maintain attendance above 95% with focus on morning punctuality.',
    'Provide extension activities in Mathematics to sustain high performance.',
  ],
};

interface StudentReceiptData {
  receiptNo: string;
  month: string;
  amount: number;
  paidDate: string;
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = malaysianStudents.find(s => s.id === id);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<StudentReceiptData | null>(null);

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

  // Subsidy calculation based on category
  const subsidyCoverage: Record<string, number> = { B40: 0.80, M40: 0.50, Asnaf: 1.00, T20: 0, None: 0 };
  const subsidyFundSource: Record<string, string> = { B40: 'Zakat', M40: 'Sumber Am', Asnaf: 'Wakaf', T20: 'N/A', None: 'N/A' };
  const coverageRate = subsidyCoverage[student.subsidyCategory] ?? 0;
  const monthlySubsidy = Math.round(student.monthlyFee * coverageRate);
  const paidMonths = feeData.filter(f => f.status === 'paid').length;
  const totalSubsidyCredited = monthlySubsidy * paidMonths;
  const fundSource = subsidyFundSource[student.subsidyCategory] ?? 'N/A';
  const studentPhoto = studentPhotoMap[student.id];
  const attendanceNumeric = Number(attendanceRate);

  const aiAssessment = {
    overview: `Based on attendance (${attendanceRate}%), payment pattern, and curriculum trend, ${student.name} is currently in a ${
      attendanceNumeric >= 90 && totalPending === 0 ? 'stable' : attendanceNumeric >= 80 ? 'watch' : 'intervention'
    } performance band.`,
    strengths: [
      attendanceNumeric >= 90 ? 'Strong and consistent attendance behavior.' : 'Attendance remains generally acceptable.',
      coverageRate >= 0.5 ? `Subsidy coverage supports continuity (${(coverageRate * 100).toFixed(0)}%).` : 'Financial independence without subsidy dependency.',
      'Guardian contactability and profile completeness are available for follow-up.',
    ],
    risks: [
      totalPending > 0 ? `Outstanding fee exposure detected (RM ${totalPending.toLocaleString('en-MY')}).` : 'No major fee delinquency observed.',
      attendanceNumeric < 85 ? 'Attendance trend below target threshold (<85%).' : 'Attendance variance should still be monitored monthly.',
      'Performance consistency depends on sustained guardian engagement.',
    ],
    nextActions: [
      'Run monthly advisor review with attendance and fee checkpoints.',
      'Prioritize support on lowest-performing subject in next assessment cycle.',
      totalPending > 0 ? 'Initiate payment reminder and structured repayment communication.' : 'Maintain current cadence and monitor for early warning signals.',
    ],
    confidence: Math.max(72, Math.min(95, Math.round((attendanceNumeric + (totalPending === 0 ? 10 : 0) + (coverageRate * 20)) / 1.3))),
  };

  const handleGenerateReport = async () => {
    await generateStudentPDF(
      student,
      { presentCount, lateCount, absentCount, totalDays: attendanceArray.length, attendanceRate },
      feeData,
      { subsidyCategory: student.subsidyCategory, monthlySubsidy, totalSubsidyCredited, monthsCovered: paidMonths, fundSource },
      {
        profilePhotoUrl: studentPhoto,
        health: studentHealthMap[student.id],
        curriculum: studentCurriculumMap[student.id],
        comments: studentCommentsMap[student.id],
        recommendations: studentRecommendationsMap[student.id],
        aiAssessment,
      },
    );
  };

  const openReceipt = (record: { month: string; amount: number; paidDate: string | null }) => {
    if (!record.paidDate) return;
    const token = `${record.month.slice(0, 3).toUpperCase()}-${student.studentCode.slice(-4)}-${record.paidDate.replace(/\//g, '')}`;
    setSelectedReceipt({
      receiptNo: `RCP-${token}`,
      month: record.month,
      amount: record.amount,
      paidDate: record.paidDate,
    });
    setReceiptOpen(true);
  };

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
        <div className="flex items-start gap-4">
          {studentPhoto ? (
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <Image
                src={studentPhoto}
                alt={student.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full border-2 border-white shadow-sm bg-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {student.name.charAt(0)}
            </div>
          )}
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
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 cursor-pointer"
            onClick={handleGenerateReport}
          >
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subsidy Credited</CardTitle>
            <Gift className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">RM {totalSubsidyCredited}</div>
            <p className="text-xs text-muted-foreground">{student.subsidyCategory} — {fundSource}</p>
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

      {/* Subsidy Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Subsidy Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Subsidy Category</p>
              <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-300">
                {student.subsidyCategory}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fund Source</p>
              <p className="font-medium">{fundSource}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coverage Rate</p>
              <p className="font-medium">{(coverageRate * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Subsidy</p>
              <p className="font-medium text-teal-600">RM {monthlySubsidy.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credited ({paidMonths} months)</p>
              <p className="font-semibold text-lg text-teal-600">RM {totalSubsidyCredited.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          {coverageRate === 0 && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-muted-foreground">This student is not eligible for subsidy under the {student.subsidyCategory} category.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Assessment */}
      <Card className="border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            AI Student Assessment
            <Tooltip label="Rationale: Attendance trend, outstanding fees, subsidy coverage, guardian profile readiness, and curriculum pattern signals.">
              <Info className="h-4 w-4 text-blue-600 cursor-help" />
            </Tooltip>
          </CardTitle>
          <CardDescription>Automated summary from attendance, billing and profile signals (POC model).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-white/80 p-3">
            <p className="text-sm leading-relaxed">{aiAssessment.overview}</p>
            <p className="text-xs text-muted-foreground mt-2">Model confidence: <span className="font-semibold">{aiAssessment.confidence}%</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="font-semibold text-green-800 mb-2">Strengths</p>
              {aiAssessment.strengths.map((item, idx) => (
                <p key={`s-${idx}`} className="text-xs text-green-700">• {item}</p>
              ))}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="font-semibold text-amber-800 mb-2">Risks</p>
              {aiAssessment.risks.map((item, idx) => (
                <p key={`r-${idx}`} className="text-xs text-amber-700">• {item}</p>
              ))}
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="font-semibold text-blue-800 mb-2">Recommended Actions</p>
              {aiAssessment.nextActions.map((item, idx) => (
                <p key={`a-${idx}`} className="text-xs text-blue-700">• {item}</p>
              ))}
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
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => openReceipt(record)}>
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

      {/* Lifecycle Actions & Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Student Lifecycle
            </CardTitle>
            <div className="flex gap-2">
              {student.status === 'active' && (
                <>
                  <Link href="/admin/students/transfers">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      Transfer
                    </Button>
                  </Link>
                  <Link href="/admin/students/alumni">
                    <Button variant="outline" size="sm" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50">
                      <UserMinus className="h-3.5 w-3.5" />
                      Withdraw
                    </Button>
                  </Link>
                </>
              )}
              {(student.status === 'withdrawn') && (
                <Link href="/admin/students/alumni">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    Re-enroll
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentTimeline studentId={student.id} />
        </CardContent>
      </Card>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>Official payment reference for student account history.</DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-semibold">{student.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Student Code</span><span className="font-semibold">{student.studentCode}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Receipt No.</span><span className="font-semibold font-mono">{selectedReceipt.receiptNo}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Billing Month</span><span className="font-semibold">{selectedReceipt.month}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Paid Date</span><span className="font-semibold">{selectedReceipt.paidDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-green-700">RM {selectedReceipt.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span></div>
              </div>
              <p className="text-xs text-muted-foreground">This receipt is generated in demo mode for POC presentation.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
