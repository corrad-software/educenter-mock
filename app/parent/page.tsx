'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockInvoices, mockStudents, mockSubsidyRules } from '@/lib/mock-data';
import { format } from 'date-fns';
import { DollarSign, FileText, CreditCard, Bell, Calendar, User, Users, MapPin, CheckCircle, Download, Printer, ChevronLeft, ChevronRight, Award, TrendingUp, TrendingDown, Minus, Sparkles, BookOpen, AlertTriangle, Shield, PiggyBank, HandCoins, Info, GraduationCap, School, Building } from 'lucide-react';
import Image from 'next/image';
import type { Invoice } from '@/lib/types';

interface PaymentReceipt {
  receiptNumber: string;
  paymentDate: Date;
  invoiceNumber: string;
  amount: number;
  paymentMethod: string;
  reference: string;
}

// Per-student exam results
type ExamEntry = {
  year: number;
  semester: number;
  examName: string;
  examDate: string;
  class: string;
  subjects: { code: string; name: string; mark: number; grade: string }[];
};

type ChildMeta = {
  level: string;
  levelColor: string;
  yearLabel: string;
  photo?: string;
  LevelIcon: React.ElementType;
};

const childrenMeta: Record<string, ChildMeta> = {
  '1': { level: 'Primary', levelColor: 'bg-blue-100 text-blue-700', yearLabel: 'Year', photo: '/images/shahrul.jpg', LevelIcon: School },
  '3': { level: 'Secondary', levelColor: 'bg-purple-100 text-purple-700', yearLabel: 'Form', photo: '/images/aisyah.jpg', LevelIcon: GraduationCap },
  '4': { level: 'University', levelColor: 'bg-amber-100 text-amber-700', yearLabel: 'Semester', photo: '/images/irfan.jpg', LevelIcon: Building },
};

const allExamResults: Record<string, ExamEntry[]> = {
  '1': [
    {
      year: 5, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2024-05', class: '5 Cemerlang',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 82, grade: 'A' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 71, grade: 'B+' },
        { code: 'MT', name: 'Matematik', mark: 88, grade: 'A' },
        { code: 'SC', name: 'Sains', mark: 79, grade: 'B+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 91, grade: 'A+' },
        { code: 'SE', name: 'Sejarah', mark: 74, grade: 'B+' },
      ],
    },
    {
      year: 4, semester: 2, examName: 'Peperiksaan Akhir Tahun', examDate: '2023-11', class: '4 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 78, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 68, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 85, grade: 'A' },
        { code: 'SC', name: 'Sains', mark: 76, grade: 'B+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 88, grade: 'A' },
        { code: 'SE', name: 'Sejarah', mark: 70, grade: 'B+' },
      ],
    },
    {
      year: 4, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2023-05', class: '4 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 75, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 62, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 80, grade: 'A' },
        { code: 'SC', name: 'Sains', mark: 72, grade: 'B+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 85, grade: 'A' },
        { code: 'SE', name: 'Sejarah', mark: 65, grade: 'B' },
      ],
    },
    {
      year: 3, semester: 2, examName: 'Peperiksaan Akhir Tahun', examDate: '2022-11', class: '3 Amanah',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 70, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 58, grade: 'C+' },
        { code: 'MT', name: 'Matematik', mark: 77, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 68, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 82, grade: 'A' },
        { code: 'SE', name: 'Sejarah', mark: 60, grade: 'B' },
      ],
    },
    {
      year: 3, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2022-05', class: '3 Amanah',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 65, grade: 'B' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 55, grade: 'C+' },
        { code: 'MT', name: 'Matematik', mark: 72, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 64, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 78, grade: 'B+' },
        { code: 'SE', name: 'Sejarah', mark: 58, grade: 'C+' },
      ],
    },
  ],
  '3': [
    {
      year: 2, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2024-05', class: '2 Cendekia',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 70, grade: 'B+' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 65, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 78, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 72, grade: 'B+' },
        { code: 'SE', name: 'Sejarah', mark: 68, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 85, grade: 'A' },
        { code: 'GE', name: 'Geografi', mark: 66, grade: 'B' },
      ],
    },
    {
      year: 1, semester: 2, examName: 'Peperiksaan Akhir Tahun', examDate: '2023-11', class: '1 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 65, grade: 'B' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 60, grade: 'B' },
        { code: 'MT', name: 'Matematik', mark: 72, grade: 'B+' },
        { code: 'SC', name: 'Sains', mark: 68, grade: 'B' },
        { code: 'SE', name: 'Sejarah', mark: 62, grade: 'B' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 80, grade: 'A' },
        { code: 'GE', name: 'Geografi', mark: 60, grade: 'B' },
      ],
    },
    {
      year: 1, semester: 1, examName: 'Peperiksaan Pertengahan Tahun', examDate: '2023-05', class: '1 Bestari',
      subjects: [
        { code: 'BM', name: 'Bahasa Melayu', mark: 60, grade: 'B' },
        { code: 'BI', name: 'Bahasa Inggeris', mark: 55, grade: 'C+' },
        { code: 'MT', name: 'Matematik', mark: 68, grade: 'B' },
        { code: 'SC', name: 'Sains', mark: 64, grade: 'B' },
        { code: 'SE', name: 'Sejarah', mark: 58, grade: 'C+' },
        { code: 'PI', name: 'Pendidikan Islam', mark: 76, grade: 'B+' },
        { code: 'GE', name: 'Geografi', mark: 56, grade: 'C+' },
      ],
    },
  ],
  '4': [
    {
      year: 3, semester: 1, examName: 'Peperiksaan Akhir Semester', examDate: '2024-05', class: 'Diploma Pengajian Islam',
      subjects: [
        { code: 'DPI301', name: 'Islamic Finance', mark: 78, grade: 'B+' },
        { code: 'DPI302', name: 'Business Management', mark: 85, grade: 'A' },
        { code: 'DPI303', name: 'Computer Applications', mark: 72, grade: 'B+' },
        { code: 'DPI304', name: 'Arabic Language III', mark: 80, grade: 'A' },
        { code: 'DPI305', name: 'Statistics', mark: 68, grade: 'B' },
      ],
    },
    {
      year: 2, semester: 1, examName: 'Peperiksaan Akhir Semester', examDate: '2023-11', class: 'Diploma Pengajian Islam',
      subjects: [
        { code: 'DPI201', name: 'Fiqh Muamalat', mark: 75, grade: 'B+' },
        { code: 'DPI202', name: 'Islamic History', mark: 82, grade: 'A' },
        { code: 'DPI203', name: 'English II', mark: 65, grade: 'B' },
        { code: 'DPI204', name: 'Fundamentals of Accounting', mark: 70, grade: 'B+' },
        { code: 'DPI205', name: 'Arabic Language II', mark: 76, grade: 'B+' },
      ],
    },
    {
      year: 1, semester: 1, examName: 'Peperiksaan Akhir Semester', examDate: '2023-05', class: 'Diploma Pengajian Islam',
      subjects: [
        { code: 'DPI101', name: 'Introduction to Islamic Studies', mark: 80, grade: 'A' },
        { code: 'DPI102', name: 'Arabic Language I', mark: 72, grade: 'B+' },
        { code: 'DPI103', name: 'English I', mark: 60, grade: 'B' },
        { code: 'DPI104', name: 'Basic Mathematics', mark: 75, grade: 'B+' },
        { code: 'DPI105', name: 'Malaysian Studies', mark: 78, grade: 'B+' },
      ],
    },
  ],
};

const getGradeColor = (grade: string) => {
  if (grade === 'A+') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (grade === 'A') return 'bg-green-100 text-green-800 border-green-300';
  if (grade === 'B+') return 'bg-blue-100 text-blue-800 border-blue-300';
  if (grade === 'B') return 'bg-sky-100 text-sky-800 border-sky-300';
  if (grade === 'C+') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (grade === 'C') return 'bg-orange-100 text-orange-800 border-orange-300';
  return 'bg-red-100 text-red-800 border-red-300';
};

export default function ParentPortalPage() {
  const guardianId = 'g1'; // demo parent
  const children = mockStudents.filter(s => s.guardianId === guardianId);
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || '1');
  const student = children.find(s => s.id === selectedChildId) || children[0];
  const allInvoices = mockInvoices.filter(inv => inv.studentId === student.id);
  const meta = childrenMeta[student.id] || childrenMeta['1'];

  // Compute exam data for selected child
  const examResults = allExamResults[student.id] || [];
  const resultsByYear = examResults.reduce((acc, exam) => {
    if (!acc[exam.year]) acc[exam.year] = [];
    acc[exam.year].push(exam);
    return acc;
  }, {} as Record<number, ExamEntry[]>);
  const sortedYears = Object.keys(resultsByYear).map(Number).sort((a, b) => b - a);

  const [selectedYear, setSelectedYear] = useState('2024');
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [receiptDialog, setReceiptDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentType, setPaymentType] = useState<'full' | 'partial' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('FPX');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<PaymentReceipt | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [selectedResultYear, setSelectedResultYear] = useState(sortedYears[0] || 0);

  const handleSwitchChild = (childId: string) => {
    setSelectedChildId(childId);
    const childResults = allExamResults[childId] || [];
    const years = [...new Set(childResults.map(r => r.year))].sort((a, b) => b - a);
    setSelectedResultYear(years[0] || 0);
  };

  // Format currency with thousand separators
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const invoices = allInvoices.filter(inv =>
    inv.invoiceNumber.includes(selectedYear)
  );

  const availableYears = Array.from(new Set(
    allInvoices.map(inv => inv.invoiceNumber.split('-')[1])
  )).sort().reverse();

  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.netAmount - inv.paidAmount), 0);

  const openPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialog(true);
    setPaymentType('full');
    setCustomAmount('');
    setPaymentSuccess(false);
  };

  const viewReceipt = (invoice: Invoice) => {
    // Generate a receipt for the paid invoice
    const receipt: PaymentReceipt = {
      receiptNumber: `RCP-${invoice.invoiceNumber.replace('INV-', '')}`,
      paymentDate: new Date(invoice.issueDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days after issue
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.paidAmount,
      paymentMethod: 'FPX',
      reference: `REF${invoice.invoiceNumber.replace('INV-', '')}${Math.floor(Math.random() * 1000)}`,
    };
    setCurrentReceipt(receipt);
    setReceiptDialog(true);
  };

  const getPaymentAmount = () => {
    if (!selectedInvoice) return 0;
    const outstanding = selectedInvoice.netAmount - selectedInvoice.paidAmount;

    if (paymentType === 'full') return outstanding;
    if (paymentType === 'partial') return outstanding / 2;
    if (paymentType === 'custom') return parseFloat(customAmount) || 0;
    return 0;
  };

  const processPayment = () => {
    setPaymentSuccess(true);

    // Generate receipt
    const receipt: PaymentReceipt = {
      receiptNumber: `RCP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      paymentDate: new Date(),
      invoiceNumber: selectedInvoice?.invoiceNumber || '',
      amount: getPaymentAmount(),
      paymentMethod: paymentMethod,
      reference: `REF${new Date().getTime()}`,
    };

    setTimeout(() => {
      setPaymentDialog(false);
      setPaymentSuccess(false);
      setCurrentReceipt(receipt);
      setReceiptDialog(true);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'partially_paid':
        return 'bg-orange-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const payments = paidInvoices.map((inv, idx) => ({
    id: `pay-${idx}`,
    invoiceNumber: inv.invoiceNumber,
    date: new Date(inv.issueDate.getTime() + 10 * 24 * 60 * 60 * 1000),
    amount: inv.paidAmount,
    method: idx % 3 === 0 ? 'FPX' : idx % 3 === 1 ? 'JomPAY' : 'Online Banking',
    reference: `REF${inv.invoiceNumber.replace('INV-', '')}${Math.floor(Math.random() * 1000)}`,
  }));

  const notifications = [
    {
      type: 'reminder',
      title: 'Payment Reminder',
      message: 'Invoice INV-2024-004 is due on 30 Apr 2024. Amount: RM 400.00',
      date: '2 days ago',
      color: 'blue',
    },
    {
      type: 'reminder',
      title: 'Payment Reminder',
      message: 'Invoice INV-2024-005 is due on 31 May 2024. Amount: RM 400.00',
      date: '1 week ago',
      color: 'blue',
    },
    {
      type: 'success',
      title: 'Payment Received',
      message: 'Your payment of RM 400.00 for INV-2024-002 has been successfully processed.',
      date: '2 weeks ago',
      color: 'green',
    },
    {
      type: 'warning',
      title: 'Partial Payment Received',
      message: 'Partial payment of RM 200.00 received for INV-2024-003. Outstanding: RM 200.00',
      date: '3 weeks ago',
      color: 'orange',
    },
    {
      type: 'info',
      title: 'Centre Announcement',
      message: 'The centre will be closed on 1st May for public holiday.',
      date: '1 month ago',
      color: 'yellow',
    },
  ];

  // Attendance helper functions
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Portal</h1>
          <p className="text-muted-foreground">
            Manage your child's fees, payments, and statements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 relative cursor-pointer"
            onClick={() => setNotificationDialog(true)}
          >
            <Bell className="h-4 w-4" />
            Notifications
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Child Switcher */}
      {children.length > 1 && (
        <Card className="border-gray-200">
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
                <Users className="h-4 w-4" />
                <span>Your Children</span>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {children.map(child => {
                  const childMeta = childrenMeta[child.id];
                  const isActive = child.id === selectedChildId;
                  const ChildIcon = childMeta?.LevelIcon || School;
                  return (
                    <button
                      key={child.id}
                      onClick={() => handleSwitchChild(child.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {childMeta?.photo ? (
                        <div className={`h-9 w-9 rounded-full overflow-hidden border ${
                          isActive ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'
                        }`}>
                          <Image
                            src={childMeta.photo}
                            alt={child.name}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {child.name.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                          {child.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <ChildIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{child.centre.name}</span>
                        </div>
                      </div>
                      {childMeta && (
                        <Badge className={`${childMeta.levelColor} text-[10px] px-1.5 py-0 shrink-0`}>
                          {childMeta.level}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {meta.photo ? (
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={meta.photo}
                    alt={student.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full border-2 border-white shadow-sm bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  {student.name.charAt(0)}
                </div>
              )}
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-lg font-bold">{student.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {student.studentCode}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {student.centre.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Fee</p>
                    <p className="font-semibold">RM {formatCurrency(student.monthlyFee)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Subsidy</p>
                    <p className="font-semibold">{student.subsidyCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Guardian</p>
                    <p className="font-semibold">{student.guardian.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Registration</p>
                    <p className="font-semibold">{format(student.registrationDate, 'dd/MM/yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              {student.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(inv => inv.status !== 'paid').length} unpaid invoice(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM 400.00</div>
            <p className="text-xs text-muted-foreground">
              {format(new Date('2024-02-10'), 'dd MMM yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due Date</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(new Date('2024-04-30'), 'dd MMM')}</div>
            <p className="text-xs text-muted-foreground">April payment due</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Process payment for {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>

          {!paymentSuccess ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Invoice Amount:</span>
                  <span className="font-semibold">RM {formatCurrency(selectedInvoice?.netAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-semibold ">RM {formatCurrency(selectedInvoice?.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600 font-medium">Outstanding:</span>
                  <span className="font-bold">
                    RM {selectedInvoice ? formatCurrency(selectedInvoice.netAmount - selectedInvoice.paidAmount) : '0.00'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paymentType === 'full' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentType('full')}
                  >
                    Full
                  </Button>
                  <Button
                    variant={paymentType === 'partial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentType('partial')}
                  >
                    Partial (50%)
                  </Button>
                  <Button
                    variant={paymentType === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentType('custom')}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {paymentType === 'custom' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="0"
                    max={selectedInvoice ? selectedInvoice.netAmount - selectedInvoice.paidAmount : 0}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FPX">FPX (Online Banking)</SelectItem>
                    <SelectItem value="JomPAY">JomPAY</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Amount to Pay:</span>
                  <span className="text-2xl font-bold">
                    RM {formatCurrency(getPaymentAmount())}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setPaymentDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={processPayment}
                  className="flex-1"
                  disabled={paymentType === 'custom' && (!customAmount || parseFloat(customAmount) <= 0)}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your payment of RM {formatCurrency(getPaymentAmount())} has been processed.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={receiptDialog} onOpenChange={setReceiptDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Official payment receipt for your records
            </DialogDescription>
          </DialogHeader>

          {currentReceipt && (
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center space-y-2 border-b pb-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-blue-600">EduCentre</h2>
                    <p className="text-sm text-gray-600">MAIWP</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Integrated Student Management Portal</p>
                <div className="text-xs text-gray-500">
                  <p>Majlis Agama Islam Wilayah Persekutuan</p>
                  <p>Pusat Asuhan Tunas Islam</p>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="text-xs text-gray-600">Receipt No.</p>
                    <p className="font-bold font-mono">{currentReceipt.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Payment Date</p>
                    <p className="font-semibold">{format(currentReceipt.paymentDate, 'dd MMM yyyy, HH:mm:ss')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Reference No.</p>
                    <p className="font-mono text-sm">{currentReceipt.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">PAID</span>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Student Name</p>
                    <p className="font-semibold">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Student Code</p>
                    <p className="font-semibold font-mono">{student.studentCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Centre</p>
                    <p className="font-semibold">{student.centre.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Guardian</p>
                    <p className="font-semibold">{student.guardian.name}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <p className="font-semibold text-sm">Payment Details</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-semibold font-mono">{currentReceipt.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold">{currentReceipt.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-600 font-medium">Amount Paid:</span>
                      <span className="text-2xl font-bold">
                        RM {formatCurrency(currentReceipt.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    This is a computer-generated receipt. No signature is required.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For any queries, please contact your centre administration.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button onClick={() => setReceiptDialog(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </DialogTitle>
            <DialogDescription>
              Recent updates and important announcements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                  notif.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                  notif.color === 'green' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                  notif.color === 'orange' ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' :
                  'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                }`}
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${
                  notif.color === 'blue' ? 'bg-blue-100' :
                  notif.color === 'green' ? 'bg-green-100' :
                  notif.color === 'orange' ? 'bg-orange-100' :
                  'bg-yellow-100'
                }`}>
                  <Bell className={`h-5 w-5 ${
                    notif.color === 'blue' ? 'text-blue-600' :
                    notif.color === 'green' ? 'text-green-600' :
                    notif.color === 'orange' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900">{notif.title}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{notif.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setNotificationDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="statement">Statement of Account</TabsTrigger>
          <TabsTrigger value="subsidy">Subsidy</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
              <CardDescription>View and pay your outstanding invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const outstanding = invoice.netAmount - invoice.paidAmount;
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{format(invoice.issueDate, 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(invoice.dueDate, 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-right font-semibold">
                          RM {formatCurrency(invoice.netAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          RM {formatCurrency(invoice.paidAmount)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          RM {formatCurrency(outstanding)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {invoice.status !== 'paid' && (
                            <Button size="sm" onClick={() => openPayment(invoice)}>
                              Pay Now
                            </Button>
                          )}
                          {invoice.status === 'paid' && (
                            <Button size="sm" variant="ghost" onClick={() => viewReceipt(invoice)}>
                              View Receipt
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your past payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Reference No.</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(payment.date, 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.reference}</TableCell>
                      <TableCell className="text-right font-semibold">RM {formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">COMPLETED</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Statement of Account</CardTitle>
                  <CardDescription>Complete financial summary</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Billed</p>
                    <p className="text-xl font-bold">RM {formatCurrency(invoices.reduce((sum, inv) => sum + inv.netAmount, 0))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Subsidy</p>
                    <p className="text-xl font-bold">
                      RM {formatCurrency(invoices.reduce((sum, inv) => sum + inv.subsidyAmount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="text-xl font-bold">
                      RM {formatCurrency(invoices.reduce((sum, inv) => sum + inv.paidAmount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance Due</p>
                    <p className="text-xl font-bold">RM {formatCurrency(totalOutstanding)}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice, idx) => {
                      const isPaid = invoice.status === 'paid';
                      return (
                        <>
                          <TableRow key={`inv-${invoice.id}`}>
                            <TableCell>{format(invoice.issueDate, 'dd/MM/yyyy')}</TableCell>
                            <TableCell>Invoice {invoice.invoiceNumber}</TableCell>
                            <TableCell className="text-right">RM {formatCurrency(invoice.netAmount)}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right font-semibold">
                              RM {formatCurrency(invoices.slice(0, idx + 1).reduce((sum, inv) => sum + inv.netAmount - inv.paidAmount, 0))}
                            </TableCell>
                          </TableRow>
                          {isPaid && (
                            <TableRow key={`pay-${invoice.id}`}>
                              <TableCell>{format(new Date(invoice.issueDate.getTime() + 10 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy')}</TableCell>
                              <TableCell>Payment - FPX</TableCell>
                              <TableCell className="text-right">-</TableCell>
                              <TableCell className="text-right">RM {formatCurrency(invoice.paidAmount)}</TableCell>
                              <TableCell className="text-right font-semibold">
                                RM {formatCurrency(invoices.slice(0, idx + 1).reduce((sum, inv) => sum + inv.netAmount - inv.paidAmount, 0))}
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsidy" className="space-y-6">
          {(() => {
            const subsidyRule = mockSubsidyRules.find(r => r.category === student.subsidyCategory);
            const subsidyPercentage = subsidyRule?.percentage || 0;
            const maxMonthlySubsidy = subsidyRule?.maxAmount || 0;
            const monthlySubsidy = Math.min(student.monthlyFee * (subsidyPercentage / 100), maxMonthlySubsidy);
            const annualAllocation = maxMonthlySubsidy * 12;
            const totalSubsidyUsed = allInvoices.reduce((sum, inv) => sum + inv.subsidyAmount, 0);
            const utilizationRate = annualAllocation > 0 ? Math.round((totalSubsidyUsed / annualAllocation) * 100) : 0;
            const remainingAllocation = annualAllocation - totalSubsidyUsed;

            const fundSource = student.subsidyCategory === 'Asnaf' ? 'Dana Zakat' : student.subsidyCategory === 'B40' ? 'Dana Zakat' : 'Sumber Am';
            const subsidyCode = `SUB-${student.subsidyCategory}-2024`;
            const validFrom = new Date('2024-01-01');
            const validUntil = new Date('2024-12-31');
            const renewalDate = new Date('2024-11-01');

            return (
              <>
                {/* Subsidy Tier Info */}
                <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-600" />
                          Subsidy Entitlement
                        </CardTitle>
                        <CardDescription>Your child&apos;s subsidy allocation details</CardDescription>
                      </div>
                      <Badge className="bg-green-600 text-white text-sm px-3 py-1">{student.subsidyCategory}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
                        <p className="text-xs text-gray-500">Subsidy Rate</p>
                        <p className="text-2xl font-bold text-green-700">{subsidyPercentage}%</p>
                        <p className="text-xs text-gray-500">of monthly fee</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
                        <p className="text-xs text-gray-500">Monthly Subsidy</p>
                        <p className="text-2xl font-bold text-green-700">RM {formatCurrency(monthlySubsidy)}</p>
                        <p className="text-xs text-gray-500">max RM {formatCurrency(maxMonthlySubsidy)}/mo</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
                        <p className="text-xs text-gray-500">You Pay</p>
                        <p className="text-2xl font-bold text-blue-700">RM {formatCurrency(student.monthlyFee - monthlySubsidy)}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
                        <p className="text-xs text-gray-500">Fund Source</p>
                        <p className="text-lg font-bold text-purple-700">{fundSource}</p>
                        <p className="text-xs text-gray-500 font-mono">{subsidyCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Annual Allocation & Utilization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <PiggyBank className="h-4 w-4 text-green-600" />
                        Annual Allocation
                      </CardTitle>
                      <CardDescription>Year 2024 subsidy budget for your child</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Annual Allocation</span>
                          <span className="font-bold">RM {formatCurrency(annualAllocation)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Used So Far</span>
                          <span className="font-bold text-green-700">RM {formatCurrency(totalSubsidyUsed)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining</span>
                          <span className="font-bold text-blue-700">RM {formatCurrency(remainingAllocation)}</span>
                        </div>
                      </div>

                      {/* Utilization Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Utilization</span>
                          <span>{utilizationRate}%</span>
                        </div>
                        <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              utilizationRate > 80 ? 'bg-orange-500' : utilizationRate > 50 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {allInvoices.filter(inv => inv.subsidyAmount > 0).length} of 12 months claimed
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="h-4 w-4 text-blue-600" />
                        Subsidy Details
                      </CardTitle>
                      <CardDescription>Eligibility and validity information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border">
                          <span className="text-sm text-gray-600">Category</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">{student.subsidyCategory}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border">
                          <span className="text-sm text-gray-600">Household Income</span>
                          <span className="text-sm font-semibold">
                            RM {formatCurrency(subsidyRule?.minIncome || 0)} – RM {formatCurrency(subsidyRule?.maxIncome || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border">
                          <span className="text-sm text-gray-600">Valid Period</span>
                          <span className="text-sm font-semibold">
                            {format(validFrom, 'dd MMM yyyy')} – {format(validUntil, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-yellow-50 border border-yellow-200">
                          <span className="text-sm text-yellow-700">Renewal By</span>
                          <span className="text-sm font-semibold text-yellow-700">{format(renewalDate, 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 border">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Subsidy Breakdown */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <HandCoins className="h-4 w-4 text-green-600" />
                          Monthly Subsidy Breakdown
                        </CardTitle>
                        <CardDescription>How subsidy is applied to each invoice</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead className="text-right">Full Fee</TableHead>
                          <TableHead className="text-right">Subsidy ({subsidyPercentage}%)</TableHead>
                          <TableHead className="text-right">You Pay</TableHead>
                          <TableHead>Fund</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allInvoices.map((inv) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-medium">
                              {format(inv.issueDate, 'MMM yyyy')}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
                            <TableCell className="text-right">RM {formatCurrency(inv.amount)}</TableCell>
                            <TableCell className="text-right font-semibold text-green-700">
                              – RM {formatCurrency(inv.subsidyAmount)}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              RM {formatCurrency(inv.netAmount)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                                {fundSource}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                inv.status === 'paid' ? 'bg-green-500' :
                                inv.status === 'pending' ? 'bg-yellow-500' :
                                inv.status === 'partially_paid' ? 'bg-orange-500' : 'bg-red-500'
                              }>
                                {inv.status === 'paid' ? 'Applied' :
                                 inv.status === 'pending' ? 'Pending' :
                                 inv.status === 'partially_paid' ? 'Partial' : 'Overdue'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Summary Row */}
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-gray-500">Total Fees</p>
                          <p className="text-lg font-bold">RM {formatCurrency(allInvoices.reduce((s, inv) => s + inv.amount, 0))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Subsidy</p>
                          <p className="text-lg font-bold text-green-700">– RM {formatCurrency(totalSubsidyUsed)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Your Total</p>
                          <p className="text-lg font-bold text-blue-700">RM {formatCurrency(allInvoices.reduce((s, inv) => s + inv.netAmount, 0))}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* How Subsidy Works */}
                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-blue-600" />
                      How Subsidy Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="font-semibold text-blue-800 mb-1">1. Eligibility</p>
                        <p className="text-xs text-blue-700">Your household income bracket ({student.subsidyCategory}) determines the subsidy percentage. Verified annually via e-Kasih / MAIWP records.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="font-semibold text-blue-800 mb-1">2. Auto-Offset</p>
                        <p className="text-xs text-blue-700">Each month, {subsidyPercentage}% (up to RM {formatCurrency(maxMonthlySubsidy)}) is automatically deducted from your invoice. You only pay the remaining balance.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="font-semibold text-blue-800 mb-1">3. Fund Source</p>
                        <p className="text-xs text-blue-700">Your subsidy is funded by <strong>{fundSource}</strong> under MAIWP. All allocations are tracked and audited for transparency.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Overall Progress Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Exam Results
                  </CardTitle>
                  <CardDescription>{student.name}&apos;s academic performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress trend — compare latest vs previous */}
              {(() => {
                const latest = examResults[0];
                const previous = examResults[1];
                const latestAvg = Math.round(latest.subjects.reduce((s, sub) => s + sub.mark, 0) / latest.subjects.length);
                const prevAvg = Math.round(previous.subjects.reduce((s, sub) => s + sub.mark, 0) / previous.subjects.length);
                const diff = latestAvg - prevAvg;

                return (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <p className="text-sm text-gray-600">Latest Average</p>
                      <p className="text-3xl font-bold text-blue-700">{latestAvg}%</p>
                      <p className="text-xs text-gray-500">{meta.yearLabel} {latest.year} Sem {latest.semester}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <p className="text-sm text-gray-600">Previous Average</p>
                      <p className="text-3xl font-bold text-gray-700">{prevAvg}%</p>
                      <p className="text-xs text-gray-500">{meta.yearLabel} {previous.year} Sem {previous.semester}</p>
                    </div>
                    <div className={`p-4 rounded-lg border text-center ${diff > 0 ? 'bg-green-50 border-green-200' : diff < 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                      <p className="text-sm text-gray-600">Trend</p>
                      <div className="flex items-center justify-center gap-1">
                        {diff > 0 ? <TrendingUp className="h-5 w-5 text-green-600" /> : diff < 0 ? <TrendingDown className="h-5 w-5 text-red-600" /> : <Minus className="h-5 w-5 text-gray-600" />}
                        <p className={`text-3xl font-bold ${diff > 0 ? 'text-green-700' : diff < 0 ? 'text-red-700' : 'text-gray-700'}`}>
                          {diff > 0 ? '+' : ''}{diff}%
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{diff > 0 ? 'Improving' : diff < 0 ? 'Declining' : 'Stable'}</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {examResults.length >= 2 && (
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-purple-600" />
                AI Performance Analysis
              </CardTitle>
              <CardDescription>Powered by AI — based on {student.name}&apos;s exam history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const first = examResults[examResults.length - 1];
                const last = examResults[0];
                const firstAvg = Math.round(first.subjects.reduce((s, sub) => s + sub.mark, 0) / first.subjects.length);
                const lastAvg = Math.round(last.subjects.reduce((s, sub) => s + sub.mark, 0) / last.subjects.length);
                const growth = lastAvg - firstAvg;

                // Find strongest and weakest subjects across all exams
                const subjectAvgs: Record<string, { name: string; total: number; count: number }> = {};
                examResults.forEach(exam => {
                  exam.subjects.forEach(sub => {
                    if (!subjectAvgs[sub.code]) subjectAvgs[sub.code] = { name: sub.name, total: 0, count: 0 };
                    subjectAvgs[sub.code].total += sub.mark;
                    subjectAvgs[sub.code].count++;
                  });
                });
                const ranked = Object.entries(subjectAvgs)
                  .map(([code, data]) => ({ code, name: data.name, avg: Math.round(data.total / data.count) }))
                  .sort((a, b) => b.avg - a.avg);
                const strongest = ranked[0];
                const weakest = ranked[ranked.length - 1];

                return (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">{growth > 0 ? 'Consistent Upward Trend' : growth === 0 ? 'Stable Performance' : 'Needs Attention'}</p>
                        <p className="text-xs text-green-700 mt-0.5">{student.name.split(' ')[0]} has {growth > 0 ? 'improved' : 'maintained'} performance. Overall average {growth > 0 ? `increased from ${firstAvg}% to ${lastAvg}%` : `stands at ${lastAvg}%`}, a <span className="font-bold">{growth > 0 ? '+' : ''}{growth}% change</span> across {examResults.length} exams.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Strongest Subject: {strongest.name}</p>
                        <p className="text-xs text-blue-700 mt-0.5">Average of {strongest.avg}% across all exams. This subject anchors the overall performance and shows consistent mastery.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800">Focus Area: {weakest.name}</p>
                        <p className="text-xs text-orange-700 mt-0.5">Average of {weakest.avg}% — the lowest across all subjects. Consider additional practice or tuition to strengthen this area.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-purple-800">Outlook</p>
                        <p className="text-xs text-purple-700 mt-0.5">Based on current trajectory, {student.name.split(' ')[0]} is on track to achieve an overall average of <span className="font-bold">{Math.min(lastAvg + 3, 100)}-{Math.min(lastAvg + 6, 100)}%</span> in the next exam. Focusing on {weakest.name} could push this even higher.</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
          )}

          {/* Year Selector + Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {sortedYears.map(year => (
                  <Button
                    key={year}
                    variant={selectedResultYear === year ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedResultYear(year)}
                    className="gap-1"
                  >
                    {meta.yearLabel} {year}
                    {year === sortedYears[0] && (
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">Current</Badge>
                    )}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {(resultsByYear[selectedResultYear] || []).length} exam(s)
              </p>
            </div>

            {(resultsByYear[selectedResultYear] || [])
              .sort((a, b) => b.semester - a.semester)
              .map((exam) => {
                const avg = Math.round(exam.subjects.reduce((s, sub) => s + sub.mark, 0) / exam.subjects.length);
                const highestSubject = exam.subjects.reduce((a, b) => a.mark > b.mark ? a : b);
                const lowestSubject = exam.subjects.reduce((a, b) => a.mark < b.mark ? a : b);

                return (
                  <Card key={`${selectedResultYear}-${exam.semester}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{exam.examName}</CardTitle>
                          <CardDescription>
                            Semester {exam.semester} · Class {exam.class} · {exam.examDate}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-700">{avg}%</div>
                          <p className="text-xs text-muted-foreground">Average</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-center">Mark</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead className="hidden sm:table-cell">Performance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exam.subjects.map(subject => (
                            <TableRow key={subject.code}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{subject.name}</p>
                                  <p className="text-xs text-muted-foreground font-mono">{subject.code}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="text-lg font-semibold">{subject.mark}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`${getGradeColor(subject.grade)} border font-bold px-3`}>
                                  {subject.grade}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-2 rounded-full bg-gray-200">
                                    <div
                                      className={`h-2 rounded-full ${
                                        subject.mark >= 80 ? 'bg-green-500' :
                                        subject.mark >= 60 ? 'bg-blue-500' :
                                        subject.mark >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${subject.mark}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground w-10">{subject.mark}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Semester highlights */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-xs text-green-700">Highest</p>
                          <p className="font-semibold text-green-800">{highestSubject.name}</p>
                          <p className="text-sm text-green-700 font-mono">{highestSubject.mark}% ({highestSubject.grade})</p>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <p className="text-xs text-orange-700">Needs Improvement</p>
                          <p className="font-semibold text-orange-800">{lowestSubject.name}</p>
                          <p className="text-sm text-orange-700 font-mono">{lowestSubject.mark}% ({lowestSubject.grade})</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* KSSR Grading Scale Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">KSSR Grading Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {[
                  { grade: 'A+', range: '90-100', label: 'Cemerlang' },
                  { grade: 'A', range: '80-89', label: 'Terpuji' },
                  { grade: 'B+', range: '70-79', label: 'Kepujian' },
                  { grade: 'B', range: '60-69', label: 'Baik' },
                  { grade: 'C+', range: '50-59', label: 'Sederhana' },
                  { grade: 'C', range: '40-49', label: 'Penguasaan Asas' },
                  { grade: 'D/E', range: '0-39', label: 'Belum Menguasai' },
                ].map(g => (
                  <div key={g.grade} className={`p-2 rounded-lg border text-center ${getGradeColor(g.grade)}`}>
                    <p className="font-bold text-sm">{g.grade}</p>
                    <p className="text-[10px]">{g.range}</p>
                    <p className="text-[10px] mt-0.5 opacity-70">{g.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
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
                      <ChevronLeft className="h-3 w-3" />
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription>Important updates and reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      notif.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                      notif.color === 'green' ? 'bg-green-50 border-green-200' :
                      notif.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <Bell className={`h-5 w-5 mt-0.5 ${
                      notif.color === 'blue' ? 'text-blue-600' :
                      notif.color === 'green' ? 'text-green-600' :
                      notif.color === 'orange' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`} />
                    <div className="flex-1">
                      <p className="font-semibold">{notif.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
