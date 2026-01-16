'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Pagination } from '@/components/ui/pagination';
import { DollarSign, Search, AlertCircle, Bell, CheckCircle, Clock, CreditCard, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 15;

// Generate fee records for all students
const generateFeeRecords = () => {
  const records: any[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  malaysianStudents.forEach(student => {
    // Generate last 3 months of fee records
    for (let i = 2; i >= 0; i--) {
      const month = currentMonth - i;
      const year = month < 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = month < 0 ? 12 + month : month;

      const dueDate = new Date(year, adjustedMonth, 5);
      const isPaid = i > 0 || Math.random() > 0.3; // Current month has some unpaid
      const paidDate = isPaid ? new Date(year, adjustedMonth, Math.floor(Math.random() * 10) + 1) : null;

      records.push({
        id: `${student.id}-${year}-${adjustedMonth}`,
        studentId: student.id,
        studentCode: student.studentCode,
        studentName: student.name,
        centreId: student.centreId,
        centreName: student.centre.name,
        centreCode: student.centre.code,
        monthYear: new Date(year, adjustedMonth, 1).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' }),
        amount: student.monthlyFee,
        status: isPaid ? 'paid' : 'pending',
        dueDate: dueDate.toISOString().split('T')[0],
        paidDate: paidDate ? paidDate.toISOString().split('T')[0] : null,
        subsidyCategory: student.subsidyCategory,
        guardianName: student.guardian.name,
        guardianPhone: student.guardian.phoneNumber,
        guardianEmail: student.guardian.email,
      });
    }
  });

  return records;
};

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const allFeeRecords = generateFeeRecords();

  // Filter records
  const filteredRecords = allFeeRecords.filter(record => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.centreName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesInstitute = selectedInstitute === 'all' || record.centreCode === selectedInstitute;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;

    return matchesSearch && matchesInstitute && matchesStatus;
  });

  // Calculate statistics
  const totalAmount = allFeeRecords.reduce((sum, r) => sum + r.amount, 0);
  const paidAmount = allFeeRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = allFeeRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const pendingCount = allFeeRecords.filter(r => r.status === 'pending').length;
  const overdueRecords = allFeeRecords.filter(r => r.status === 'pending' && new Date(r.dueDate) < new Date());
  const overdueAmount = overdueRecords.reduce((sum, r) => sum + r.amount, 0);
  const collectionRate = totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : '0';

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (type: 'search' | 'institute' | 'status', value: string) => {
    if (type === 'search') setSearchQuery(value);
    if (type === 'institute') setSelectedInstitute(value);
    if (type === 'status') setSelectedStatus(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-500' : 'bg-orange-500';
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === 'pending' && new Date(dueDate) < new Date();
  };

  const handleSendReminder = (record: any) => {
    // In a real app, this would trigger an email/SMS
    alert(`Reminder sent to ${record.guardianName}\nEmail: ${record.guardianEmail}\nPhone: ${record.guardianPhone}\n\nMessage: Payment reminder for ${record.studentName} - ${record.monthYear} (RM ${record.amount})`);
  };

  const handleBulkReminder = () => {
    const pendingRecords = filteredRecords.filter(r => r.status === 'pending');
    if (pendingRecords.length === 0) {
      alert('No pending payments to remind');
      return;
    }
    const confirmed = confirm(`Send reminder to ${pendingRecords.length} guardian(s) with pending payments?`);
    if (confirmed) {
      alert(`Bulk reminder sent to ${pendingRecords.length} guardian(s)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Monitoring</h1>
          <p className="text-muted-foreground">
            Track and manage student fee payments
          </p>
        </div>
        <Button
          className="gap-2 bg-orange-600 hover:bg-orange-700"
          onClick={handleBulkReminder}
          disabled={pendingCount === 0}
        >
          <Bell className="h-4 w-4" />
          Send Bulk Reminder ({pendingCount})
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalAmount.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{allFeeRecords.length} records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">RM {paidAmount.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{allFeeRecords.filter(r => r.status === 'paid').length} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">RM {pendingAmount.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{pendingCount} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">RM {overdueAmount.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{overdueRecords.length} overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{collectionRate}%</div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records Table */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fee Records</CardTitle>
                <CardDescription>View and manage student fee payments</CardDescription>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student, code, or centre..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <select
                value={selectedInstitute}
                onChange={(e) => handleFilterChange('institute', e.target.value)}
                className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Institutes</option>
                {malaysianInstitutes.map(institute => (
                  <option key={institute.id} value={institute.code}>
                    {institute.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Month/Year</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Subsidy</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No fee records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id} className={isOverdue(record.dueDate, record.status) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div>
                        <Link href={`/admin/students/${record.studentId}`} className="font-medium hover:underline cursor-pointer">
                          {record.studentName}
                        </Link>
                        <div className="text-xs text-muted-foreground font-mono">{record.studentCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{record.centreName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{record.centreCode}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{record.monthYear}</TableCell>
                    <TableCell className="font-semibold">
                      RM {record.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                        {record.subsidyCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={isOverdue(record.dueDate, record.status) ? 'text-red-600 font-medium' : ''}>
                        {new Date(record.dueDate).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.paidDate ? (
                        new Date(record.paidDate).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.toUpperCase()}
                        </Badge>
                        {isOverdue(record.dueDate, record.status) && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {record.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 cursor-pointer text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => handleSendReminder(record)}
                            >
                              <Bell className="h-3 w-3" />
                              Remind
                            </Button>
                            <Button size="sm" className="h-8 gap-1 cursor-pointer bg-green-600 hover:bg-green-700">
                              <CreditCard className="h-3 w-3" />
                              Pay
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" className="h-8 gap-1 cursor-pointer">
                            <CheckCircle className="h-3 w-3" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredRecords.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>
    </div>
  );
}
