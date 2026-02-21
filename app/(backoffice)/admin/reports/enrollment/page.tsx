'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';
import { Users, UserPlus, UserMinus, UserCheck, Search, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ITEMS_PER_PAGE = 15;

export default function EnrollmentReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const levelStudents = level === 'maiwp'
    ? malaysianStudents
    : malaysianStudents.filter(s => s.educationLevel === level);

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  // Stats
  const totalStudents = levelStudents.length;
  const activeStudents = levelStudents.filter(s => s.status === 'active').length;
  const pendingStudents = levelStudents.filter(s => s.status === 'pending').length;
  const withdrawnStudents = levelStudents.filter(s => s.status === 'withdrawn').length;
  const transferredStudents = levelStudents.filter(s => s.status === 'transferred').length;

  // Filter
  const filteredStudents = levelStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.ic.includes(searchQuery);
    const matchesCentre = selectedCentre === 'all' || student.centre.code === selectedCentre;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesCentre && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'search') setSearchQuery(value);
    if (type === 'centre') setSelectedCentre(value);
    if (type === 'status') setSelectedStatus(value);
    setCurrentPage(1);
  };

  // Chart data — enrollment by centre, stacked by status
  const chartData = levelInstitutes.map(inst => {
    const centreStudents = levelStudents.filter(s => s.centre.code === inst.code);
    return {
      name: inst.code,
      active: centreStudents.filter(s => s.status === 'active').length,
      pending: centreStudents.filter(s => s.status === 'pending').length,
      withdrawn: centreStudents.filter(s => s.status === 'withdrawn').length,
      transferred: centreStudents.filter(s => s.status === 'transferred').length,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'withdrawn': return 'bg-red-500';
      case 'transferred': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Enrollment Report</h1>
          <p className="text-muted-foreground">
            Active, pending, withdrawn & transferred students by centre
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
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">All registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">{totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingStudents}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Withdrawn</CardTitle>
            <UserMinus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{withdrawnStudents}</div>
            <p className="text-xs text-muted-foreground">Left programme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferred</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{transferredStudents}</div>
            <p className="text-xs text-muted-foreground">Moved centres</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment by Centre</CardTitle>
          <CardDescription>Student count by status per centre</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" stackId="a" fill="#22c55e" name="Active" />
              <Bar dataKey="pending" stackId="a" fill="#eab308" name="Pending" />
              <Bar dataKey="withdrawn" stackId="a" fill="#ef4444" name="Withdrawn" />
              <Bar dataKey="transferred" stackId="a" fill="#3b82f6" name="Transferred" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>Complete enrollment records</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, code, or IC..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
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
                value={selectedStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Centre</TableHead>
                {level === 'maiwp' && <TableHead>Level</TableHead>}
                <TableHead>Registration</TableHead>
                <TableHead>Subsidy</TableHead>
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={level === 'maiwp' ? 8 : 7} className="text-center text-muted-foreground py-8">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-sm">{student.studentCode}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{student.centre.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{student.centre.code}</div>
                      </div>
                    </TableCell>
                    {level === 'maiwp' && (
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{student.educationLevel}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-sm">
                      {student.registrationDate.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                        {student.subsidyCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      RM {student.monthlyFee.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status.toUpperCase()}
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
            totalItems={filteredStudents.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>
    </div>
  );
}
