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
import { mockInvoices, mockStudents } from '@/lib/mock-data';
import { format } from 'date-fns';
import { DollarSign, FileText, CreditCard, Bell, Calendar, User, MapPin, CheckCircle, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function ParentPortalPage() {
  const student = mockStudents[0];
  const allInvoices = mockInvoices.filter(inv => inv.studentId === student.id);

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

      <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src="/images/shahrul.jpg"
                  alt={student.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
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
