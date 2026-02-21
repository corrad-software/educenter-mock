'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { generateAttendanceRecords } from '@/lib/mock-data/report-data';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';
import { Calendar, CheckCircle, Clock, AlertCircle, DollarSign, Search, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ITEMS_PER_PAGE = 15;
const STATUS_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6b7280'];

export default function AttendanceReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const allRecords = generateAttendanceRecords();

  const levelRecords = level === 'maiwp'
    ? allRecords
    : allRecords.filter(r => r.educationLevel === level);

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  // Stats
  const totalRecords = levelRecords.length;
  const presentCount = levelRecords.filter(r => r.status === 'present').length;
  const lateCount = levelRecords.filter(r => r.status === 'late').length;
  const absentCount = levelRecords.filter(r => r.status === 'absent').length;
  const excusedCount = levelRecords.filter(r => r.status === 'excused').length;
  const attendanceRate = totalRecords > 0
    ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(1)
    : '0';
  const totalPenalties = levelRecords.reduce((sum, r) => sum + r.penaltyRM, 0);

  // Filter
  const filteredRecords = levelRecords.filter(record => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.centreName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCentre = selectedCentre === 'all' || record.centreCode === selectedCentre;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesCentre && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'search') setSearchQuery(value);
    if (type === 'centre') setSelectedCentre(value);
    if (type === 'status') setSelectedStatus(value);
    setCurrentPage(1);
  };

  // Line chart: daily attendance rate (last 30 days)
  const dateMap = new Map<string, { total: number; present: number }>();
  levelRecords.forEach(r => {
    const entry = dateMap.get(r.date) ?? { total: 0, present: 0 };
    entry.total++;
    if (r.status === 'present' || r.status === 'late') entry.present++;
    dateMap.set(r.date, entry);
  });

  const lineData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-MY', { day: '2-digit', month: 'short' }),
      rate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }));

  // Pie chart: status distribution
  const pieData = [
    { name: 'Present', value: presentCount },
    { name: 'Late', value: lateCount },
    { name: 'Absent', value: absentCount },
    { name: 'Excused', value: excusedCount },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      case 'excused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance & Penalty Report</h1>
          <p className="text-muted-foreground">
            Daily attendance trends, late pickups & penalty values
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
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">{totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0}% of records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            <p className="text-xs text-muted-foreground">{totalRecords > 0 ? Math.round((lateCount / totalRecords) * 100) : 0}% of records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">{totalRecords > 0 ? Math.round((absentCount / totalRecords) * 100) : 0}% of records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">RM {totalPenalties.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">From late pickups</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Attendance Rate</CardTitle>
            <CardDescription>30-day attendance trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[70, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} name="Attendance %" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Present / Late / Absent / Excused</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Daily attendance details with penalties</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student or centre..."
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
                value={selectedStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Late (min)</TableHead>
                <TableHead className="text-right">Penalty (RM)</TableHead>
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
                  <TableRow key={record.id} className={record.status === 'absent' ? 'bg-red-50' : record.status === 'late' ? 'bg-yellow-50' : ''}>
                    <TableCell className="text-sm">
                      {new Date(record.date).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-medium">{record.studentName}</TableCell>
                    <TableCell>
                      <div className="text-sm">{record.centreName}</div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{record.checkIn ?? '-'}</TableCell>
                    <TableCell className="text-sm font-mono">{record.checkOut ?? '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(record.status)}>
                        {record.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {record.lateMinutes > 0 ? <span className="text-yellow-600">{record.lateMinutes}</span> : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.penaltyRM > 0 ? <span className="text-red-600 font-semibold">RM {record.penaltyRM}</span> : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Summary row */}
          <div className="mt-4 flex justify-end">
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
              <span className="text-sm text-muted-foreground">Total Penalties (filtered): </span>
              <span className="text-sm font-bold text-orange-600">
                RM {filteredRecords.reduce((sum, r) => sum + r.penaltyRM, 0).toLocaleString('en-MY')}
              </span>
            </div>
          </div>

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
