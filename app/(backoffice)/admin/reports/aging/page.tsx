'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { generateAgingData } from '@/lib/mock-data/report-data';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';
import { DollarSign, Clock, AlertCircle, AlertTriangle, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ITEMS_PER_PAGE = 15;

export default function AgingReportPage() {
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedBucket, setSelectedBucket] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const allAging = generateAgingData();

  const levelAging = level === 'maiwp'
    ? allAging
    : allAging.filter(r => r.educationLevel === level);

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  // Stats
  const totalOutstanding = levelAging.reduce((sum, r) => sum + r.totalOutstanding, 0);
  const totalCurrent = levelAging.reduce((sum, r) => sum + r.current, 0);
  const total30 = levelAging.reduce((sum, r) => sum + r.days30, 0);
  const total60 = levelAging.reduce((sum, r) => sum + r.days60, 0);
  const total90plus = levelAging.reduce((sum, r) => sum + r.days90plus, 0);

  // Filter
  const filteredRecords = levelAging.filter(record => {
    const matchesCentre = selectedCentre === 'all' || record.centreCode === selectedCentre;
    let matchesBucket = true;
    if (selectedBucket === 'current') matchesBucket = record.current > 0 && record.days30 === 0;
    if (selectedBucket === '30') matchesBucket = record.days30 > 0;
    if (selectedBucket === '60') matchesBucket = record.days60 > 0;
    if (selectedBucket === '90+') matchesBucket = record.days90plus > 0;
    return matchesCentre && matchesBucket;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'centre') setSelectedCentre(value);
    if (type === 'bucket') setSelectedBucket(value);
    setCurrentPage(1);
  };

  // Chart data
  const chartData = [
    { name: 'Current (<30d)', amount: totalCurrent, fill: '#22c55e' },
    { name: '30 Days', amount: total30, fill: '#f59e0b' },
    { name: '60 Days', amount: total60, fill: '#f97316' },
    { name: '90+ Days', amount: total90plus, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aging Report</h1>
          <p className="text-muted-foreground">
            Outstanding balances with aging buckets (30/60/90+ days)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">RM {totalOutstanding.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{levelAging.length} guardians</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current (&lt; 30 days)</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">RM {totalCurrent.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">Recent balances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">30-60 Days</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">RM {(total30 + total60).toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">Needs follow-up</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">90+ Days Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">RM {total90plus.toLocaleString('en-MY')}</div>
            <p className="text-xs text-red-600">{levelAging.filter(r => r.days90plus > 0).length} guardians</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Aging Buckets Breakdown</CardTitle>
          <CardDescription>Outstanding amounts by aging period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `RM ${v.toLocaleString('en-MY')}`} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value) => `RM ${Number(value).toLocaleString('en-MY')}`} />
              <Bar dataKey="amount" name="Outstanding">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle>Guardian Outstanding Balances</CardTitle>
              <CardDescription>Per-guardian aging breakdown</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCentre}
                onChange={(e) => handleFilterChange('centre', e.target.value)}
                className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Centres</option>
                {levelInstitutes.map(inst => (
                  <option key={inst.id} value={inst.code}>{inst.name}</option>
                ))}
              </select>
              <select
                value={selectedBucket}
                onChange={(e) => handleFilterChange('bucket', e.target.value)}
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Buckets</option>
                <option value="current">Current (&lt; 30d)</option>
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="90+">90+ Days</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guardian</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">30 Days</TableHead>
                <TableHead className="text-right">60 Days</TableHead>
                <TableHead className="text-right">90+ Days</TableHead>
                <TableHead>Last Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No outstanding balances found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id} className={record.days90plus > 0 ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.guardianName}</div>
                        <div className="text-xs text-muted-foreground">{record.guardianPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{record.studentName}</TableCell>
                    <TableCell>
                      <div className="text-sm">{record.centreName}</div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      RM {record.totalOutstanding.toLocaleString('en-MY')}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.current > 0 ? `RM ${record.current.toLocaleString('en-MY')}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.days30 > 0 ? <span className="text-yellow-600">RM {record.days30.toLocaleString('en-MY')}</span> : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.days60 > 0 ? <span className="text-orange-600">RM {record.days60.toLocaleString('en-MY')}</span> : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.days90plus > 0 ? <span className="text-red-600 font-bold">RM {record.days90plus.toLocaleString('en-MY')}</span> : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(record.lastPaymentDate).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
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
