'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Pagination } from '@/components/ui/pagination';
import { Building2, Search, Eye, UserPlus, UserMinus, ArrowRightLeft, ChevronRight, Home, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 15;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InstituteDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const instituteId = resolvedParams.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Find the institute
  const institute = malaysianInstitutes.find(i => i.id === instituteId);

  if (!institute) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/admin/institutes" className="hover:text-foreground">
            Institutes
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Not Found</span>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Institute not found</p>
              <Link href="/admin/institutes">
                <Button className="mt-4">Back to Institutes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter students by this institute
  const instituteStudents = malaysianStudents.filter(s => s.centreId === institute.id);

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

  const filteredStudents = instituteStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.ic.includes(searchQuery)
  );

  // Calculate statistics
  const totalStudents = instituteStudents.length;
  const activeStudents = instituteStudents.filter(s => s.status === 'active').length;
  const pendingStudents = instituteStudents.filter(s => s.status === 'pending').length;
  const b40Students = instituteStudents.filter(s => s.subsidyCategory === 'B40').length;
  const m40Students = instituteStudents.filter(s => s.subsidyCategory === 'M40').length;
  const capacityUtilization = ((totalStudents / institute.capacity) * 100).toFixed(0);

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

  const handleAddStudent = () => {
    alert('Add Student functionality - Opens dialog to add/transfer a student to this institute');
  };

  const handleTransferStudent = (studentId: string, studentName: string) => {
    alert(`Transfer Student: ${studentName}\n\nThis will open a dialog to transfer the student to another institute.`);
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    const confirmed = confirm(`Are you sure you want to remove ${studentName} from ${institute.name}?`);
    if (confirmed) {
      alert(`Student ${studentName} has been removed from the institute.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground flex items-center gap-1">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/admin/institutes" className="hover:text-foreground">
          Institutes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{institute.name}</span>
      </div>

      {/* Institute Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{institute.name}</h1>
              <p className="text-muted-foreground font-mono text-sm">{institute.code}</p>
            </div>
          </div>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleAddStudent}>
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Institute Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Institute Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-sm font-medium">{institute.address}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <p className="text-sm font-medium">{institute.city}, {institute.state}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Capacity</p>
              <p className="text-sm font-medium">{institute.capacity} students</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Badge className={institute.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                {institute.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <GraduationCap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingStudents}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">B40 Category</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{b40Students}</div>
            <p className="text-xs text-muted-foreground">{totalStudents > 0 ? ((b40Students / totalStudents) * 100).toFixed(0) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">M40 Category</CardTitle>
            <GraduationCap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{m40Students}</div>
            <p className="text-xs text-muted-foreground">{totalStudents > 0 ? ((m40Students / totalStudents) * 100).toFixed(0) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacityUtilization}%</div>
            <p className="text-xs text-muted-foreground">{totalStudents}/{institute.capacity} capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Students List</CardTitle>
              <CardDescription>Students enrolled in this institute</CardDescription>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {searchQuery ? (
                <p>No students found matching your search</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">No students enrolled yet</p>
                  <p className="text-sm mb-4">Start by adding students to this institute</p>
                  <Button onClick={handleAddStudent} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add First Student
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Code</TableHead>
                    <TableHead>Name</TableHead>
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
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/students/${student.id}`} className="cursor-pointer">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Transfer Student"
                            onClick={() => handleTransferStudent(student.id, student.name)}
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            title="Remove Student"
                            onClick={() => handleRemoveStudent(student.id, student.name)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
