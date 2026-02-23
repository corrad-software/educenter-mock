'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStaff } from '@/lib/mock-data/malaysian-staff';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, GraduationCap, Users, Clock, Search, Pencil, Trash2, Eye, UserPlus, Filter, Info } from 'lucide-react';
import Link from 'next/link';
import { useEducationStore } from '@/lib/store/education-store';
import { Tooltip } from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

const TEACHING_ROLES = ['teacher', 'caregiver', 'lecturer'];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'maiwp';

  const levelStaff = level === 'maiwp'
    ? malaysianStaff
    : malaysianStaff.filter(s => s.educationLevel === level);

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  const filteredStaff = levelStaff.filter(staff => {
    const matchesSearch = searchQuery === '' ||
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.centreName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Statistics
  const totalStaff = levelStaff.length;
  const activeStaff = levelStaff.filter(s => s.status === 'active').length;
  const teachingStaff = levelStaff.filter(s => TEACHING_ROLES.includes(s.role)).length;
  const totalStudents = levelInstitutes.reduce((sum, inst) => sum + inst.students, 0);
  const staffRatio = teachingStaff > 0 ? Math.round(totalStudents / teachingStaff) : 0;
  const onLeaveCount = levelStaff.filter(s => s.status === 'on_leave').length;
  const onLeavePercent = totalStaff > 0 ? ((onLeaveCount / totalStaff) * 100).toFixed(1) : '0';
  const activePct = totalStaff > 0 ? (activeStaff / totalStaff) * 100 : 0;
  const onLeavePctNum = totalStaff > 0 ? (onLeaveCount / totalStaff) * 100 : 0;

  const aiAssessment = {
    overview: `Staff operations are currently ${activePct >= 85 ? 'stable' : 'watch-listed'} with ${activeStaff}/${totalStaff} active personnel and 1:${staffRatio} teaching-to-student ratio.`,
    confidence: Math.max(70, Math.min(95, Math.round((activePct + (staffRatio > 0 ? Math.min(100 / staffRatio * 20, 20) : 0) + 65) / 2))),
    strengths: [
      activePct >= 85 ? 'High active workforce availability for daily operations.' : 'Reasonable active workforce coverage is maintained.',
      `Teaching pool size is ${teachingStaff} across ${totalStudents} students.`,
      'Role and centre allocation data are complete for planning.',
    ],
    risks: [
      onLeaveCount > 0 ? `${onLeaveCount} staff on leave (${onLeavePctNum.toFixed(1)}%) may affect timetable continuity.` : 'Leave exposure is currently minimal.',
      staffRatio > 20 ? `Staff-student ratio (1:${staffRatio}) is above recommended comfort range.` : 'Staff-student ratio is within expected operational range.',
      'Potential concentration risk if key subject teachers are absent simultaneously.',
    ],
    actions: [
      'Review weekly leave coverage and assign backups for critical roles.',
      'Prioritize recruitment/rotation for centres with rising ratio pressure.',
      'Track subject-level teaching load to prevent burnout and scheduling gaps.',
    ],
  };

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'on_leave': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'resigned': return 'bg-red-100 text-red-700 border-red-300';
      case 'contract': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'caregiver': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'lecturer': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'assistant': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'admin_staff': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'support': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage teachers, caregivers, lecturers and support staff
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">{activeStaff} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachingStaff}</div>
            <p className="text-xs text-muted-foreground">Teachers, caregivers & lecturers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff : Student Ratio</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 : {staffRatio}</div>
            <p className="text-xs text-muted-foreground">{teachingStaff} teaching / {totalStudents} students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onLeaveCount}</div>
            <p className="text-xs text-muted-foreground">{onLeavePercent}% of total staff</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            AI Staff Assessment
            <Tooltip label="Rationale: Active staff %, on-leave %, teaching-student ratio, role mix, and centre allocation coverage.">
              <Info className="h-4 w-4 text-blue-600 cursor-help" />
            </Tooltip>
          </CardTitle>
          <CardDescription>Automated staffing health summary for operational planning (POC).</CardDescription>
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
                <p key={`str-${idx}`} className="text-xs text-green-700">• {item}</p>
              ))}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="font-semibold text-amber-800 mb-2">Risks</p>
              {aiAssessment.risks.map((item, idx) => (
                <p key={`risk-${idx}`} className="text-xs text-amber-700">• {item}</p>
              ))}
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="font-semibold text-blue-800 mb-2">Recommended Actions</p>
              {aiAssessment.actions.map((item, idx) => (
                <p key={`act-${idx}`} className="text-xs text-blue-700">• {item}</p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Staff</CardTitle>
              <CardDescription>View and manage staff records</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, code, centre..."
                  className="pl-9 w-72"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="admin_staff">Admin Staff</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="resigned">Resigned</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/admin/staff/add">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Staff
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium font-mono text-sm">{staff.employeeCode}</TableCell>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getRoleBadge(staff.role)}`}>
                      {formatRole(staff.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{staff.centreCode}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{staff.centreName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{staff.qualification}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{staff.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(staff.status)}>
                      {staff.status === 'on_leave' ? 'On Leave' : staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tooltip label="View">
                        <Link href={`/admin/staff/${staff.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <Link href={`/admin/staff/edit/${staff.id}`}>
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
            totalItems={filteredStaff.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>
    </div>
  );
}
