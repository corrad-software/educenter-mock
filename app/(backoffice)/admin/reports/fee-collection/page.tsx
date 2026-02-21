'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { generateFeeCollectionRecords, generateFundBreakdown } from '@/lib/mock-data/report-data';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';
import { DollarSign, CheckCircle, Clock, AlertCircle, TrendingUp, Search, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ITEMS_PER_PAGE = 15;
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b'];

export default function FeeCollectionReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedFund, setSelectedFund] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const allRecords = generateFeeCollectionRecords();
  const fundBreakdown = generateFundBreakdown();

  const levelRecords = level === 'maiwp'
    ? allRecords
    : allRecords.filter(r => r.educationLevel === level);

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  // Stats
  const totalInvoiced = levelRecords.reduce((sum, r) => sum + r.amount, 0);
  const paidRecords = levelRecords.filter(r => r.status === 'paid');
  const pendingRecords = levelRecords.filter(r => r.status === 'pending');
  const collected = paidRecords.reduce((sum, r) => sum + r.amount, 0);
  const pending = pendingRecords.reduce((sum, r) => sum + r.amount, 0);
  const overdueRecords = pendingRecords.filter(r => new Date(r.dueDate) < new Date());
  const overdue = overdueRecords.reduce((sum, r) => sum + r.amount, 0);
  const collectionRate = totalInvoiced > 0 ? ((collected / totalInvoiced) * 100).toFixed(1) : '0';

  // Filter
  const filteredRecords = levelRecords.filter(record => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.centreName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCentre = selectedCentre === 'all' || record.centreCode === selectedCentre;
    const matchesFund = selectedFund === 'all' || record.fundSource === selectedFund;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesCentre && matchesFund && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'search') setSearchQuery(value);
    if (type === 'centre') setSelectedCentre(value);
    if (type === 'fund') setSelectedFund(value);
    if (type === 'status') setSelectedStatus(value);
    setCurrentPage(1);
  };

  // Chart: collection by centre
  const centreChartData = levelInstitutes.map(inst => {
    const centreRecords = levelRecords.filter(r => r.centreCode === inst.code);
    return {
      name: inst.code,
      invoiced: centreRecords.reduce((s, r) => s + r.amount, 0),
      collected: centreRecords.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0),
      outstanding: centreRecords.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0),
    };
  });

  // Chart: fund source pie
  const fundPieData = fundBreakdown.map(f => ({
    name: f.fundSource,
    value: f.collected,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Collection Report</h1>
          <p className="text-muted-foreground">
            Invoiced, collected & outstanding by fund source
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => alert('Export PDF — coming soon')}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => alert('Export Excel — coming soon')}>
            <Download className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalInvoiced.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{levelRecords.length} records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">RM {collected.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{paidRecords.length} payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">RM {pending.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{pendingRecords.length} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">RM {overdue.toLocaleString('en-MY')}</div>
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
            <p className="text-xs text-muted-foreground">Payment success</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Collection by Centre</CardTitle>
            <CardDescription>Invoiced vs Collected vs Outstanding</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={centreChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value) => `RM ${Number(value).toLocaleString('en-MY')}`} />
                <Legend />
                <Bar dataKey="invoiced" fill="#93c5fd" name="Invoiced" />
                <Bar dataKey="collected" fill="#22c55e" name="Collected" />
                <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Fund Source</CardTitle>
            <CardDescription>Collection by fund</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fundPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {fundPieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `RM ${Number(value).toLocaleString('en-MY')}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fund Source Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Source Summary</CardTitle>
          <CardDescription>Collection breakdown by fund source (Zakat / Wakaf / Sumber Am)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Source</TableHead>
                <TableHead className="text-right">Invoiced</TableHead>
                <TableHead className="text-right">Collected</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundBreakdown.map((fund) => (
                <TableRow key={fund.fundSource}>
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="text-xs">{fund.fundSource}</Badge>
                  </TableCell>
                  <TableCell className="text-right">RM {fund.invoiced.toLocaleString('en-MY')}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">RM {fund.collected.toLocaleString('en-MY')}</TableCell>
                  <TableCell className="text-right text-red-600">RM {fund.outstanding.toLocaleString('en-MY')}</TableCell>
                  <TableCell className="text-right font-semibold">{fund.collectionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle>Fee Records</CardTitle>
              <CardDescription>Detailed fee collection records</CardDescription>
            </div>
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
                value={selectedCentre}
                onChange={(e) => handleFilterChange('centre', e.target.value)}
                className="flex h-10 w-56 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Centres</option>
                {levelInstitutes.map(inst => (
                  <option key={inst.id} value={inst.code}>{inst.name}</option>
                ))}
              </select>
              <select
                value={selectedFund}
                onChange={(e) => handleFilterChange('fund', e.target.value)}
                className="flex h-10 w-44 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Funds</option>
                <option value="Zakat">Zakat</option>
                <option value="Wakaf">Wakaf</option>
                <option value="Sumber Am">Sumber Am</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
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
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Fund Source</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id} className={record.status === 'pending' && new Date(record.dueDate) < new Date() ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.studentName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{record.studentCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{record.centreName}</div>
                    </TableCell>
                    <TableCell className="text-sm">{record.monthYear}</TableCell>
                    <TableCell className="text-right font-semibold">
                      RM {record.amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{record.fundSource}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(record.dueDate).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.paidDate
                        ? new Date(record.paidDate).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
                        : <span className="text-muted-foreground">-</span>
                      }
                    </TableCell>
                    <TableCell>
                      <Badge className={record.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}>
                        {record.status.toUpperCase()}
                      </Badge>
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
