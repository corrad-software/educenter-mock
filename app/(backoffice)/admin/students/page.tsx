'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Search, Pencil, Trash2, Eye, Filter } from 'lucide-react';
import Link from 'next/link';
import { useEducationStore } from '@/lib/store/education-store';
import { Tooltip } from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subsidyFilter, setSubsidyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  // For MAIWP show all; otherwise filter to the selected education level
  const levelStudents = level === 'maiwp'
    ? malaysianStudents
    : malaysianStudents.filter(s => s.educationLevel === level);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'withdrawn':
        return 'bg-red-500';
      case 'transferred':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredStudents = levelStudents.filter(student => {
    const matchesSearch = searchQuery === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.ic.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesSubsidy = subsidyFilter === 'all' || student.subsidyCategory === subsidyFilter;
    return matchesSearch && matchesStatus && matchesSubsidy;
  });

  // Calculate statistics
  const totalStudents = levelStudents.length;
  const activeStudents = levelStudents.filter(s => s.status === 'active').length;
  const pendingStudents = levelStudents.filter(s => s.status === 'pending').length;
  const b40Students = levelStudents.filter(s => s.subsidyCategory === 'B40').length;
  const m40Students = levelStudents.filter(s => s.subsidyCategory === 'M40').length;

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student List</h1>
          <p className="text-muted-foreground">
            Manage all registered students
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">All registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingStudents}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">B40 Category</CardTitle>
            <UserPlus className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{b40Students}</div>
            <p className="text-xs text-muted-foreground">{((b40Students / totalStudents) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">M40 Category</CardTitle>
            <UserPlus className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{m40Students}</div>
            <p className="text-xs text-muted-foreground">{((m40Students / totalStudents) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>View and manage student records</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subsidyFilter} onValueChange={(value) => { setSubsidyFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Subsidy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subsidy</SelectItem>
                  <SelectItem value="B40">B40</SelectItem>
                  <SelectItem value="M40">M40</SelectItem>
                  <SelectItem value="T20">T20</SelectItem>
                  <SelectItem value="Asnaf">Asnaf</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/admin/students/add">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </Link>
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
                <TableHead>Guardian</TableHead>
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Subsidy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium font-mono text-sm">{student.studentCode}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.centre.name}</TableCell>
                  <TableCell>{student.guardian.name}</TableCell>
                  <TableCell>RM {student.monthlyFee.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {student.subsidyCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tooltip label="View">
                        <Link href={`/admin/students/${student.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <Link href={`/admin/students/edit/${student.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
