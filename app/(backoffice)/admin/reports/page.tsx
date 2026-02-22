'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LEVEL_STATS } from '@/lib/mock-data/level-data';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { malaysianStaff } from '@/lib/mock-data/malaysian-staff';
import { generateAgingData, generateAttendanceRecords, generateSubsidyData, generateFundBreakdown } from '@/lib/mock-data/report-data';
import { useEducationStore } from '@/lib/store/education-store';
import { TrendingUp, AlertCircle, Users, DollarSign, Calendar, Building2, Clock, FileBarChart, Download, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function ReportsHubPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const stats = LEVEL_STATS[level];
  const agingData = generateAgingData();
  const attendanceRecords = generateAttendanceRecords();
  const subsidyData = generateSubsidyData();
  const fundBreakdown = generateFundBreakdown();

  // Level-aware filtering
  const levelAging = level === 'maiwp' ? agingData : agingData.filter(r => r.educationLevel === level);
  const levelAttendance = level === 'maiwp' ? attendanceRecords : attendanceRecords.filter(r => r.educationLevel === level);
  const levelSubsidy = level === 'maiwp' ? subsidyData : subsidyData.filter(r => r.educationLevel === level);
  const levelStudents = level === 'maiwp' ? malaysianStudents : malaysianStudents.filter(s => s.educationLevel === level);
  const levelInstitutes = level === 'maiwp' ? malaysianInstitutes : malaysianInstitutes.filter(i => i.educationLevel === level);

  // Derive metrics
  const totalOutstandingAging = levelAging.reduce((sum, r) => sum + r.totalOutstanding, 0);
  const over90Days = levelAging.filter(r => r.days90plus > 0).length;
  const attendanceRate = levelAttendance.length > 0
    ? ((levelAttendance.filter(r => r.status === 'present' || r.status === 'late').length / levelAttendance.length) * 100).toFixed(1)
    : '0';
  const totalPenalties = levelAttendance.reduce((sum, r) => sum + r.penaltyRM, 0);
  const totalSubsidyAllocated = levelSubsidy.reduce((sum, r) => sum + r.allocated, 0);
  const totalSubsidyUtilized = levelSubsidy.reduce((sum, r) => sum + r.utilized, 0);
  const subsidyUtilRate = totalSubsidyAllocated > 0 ? Math.round((totalSubsidyUtilized / totalSubsidyAllocated) * 100) : 0;
  const totalCapacity = levelInstitutes.reduce((sum, i) => sum + i.capacity, 0);
  const totalEnrolled = levelInstitutes.reduce((sum, i) => sum + i.students, 0);
  const capacityUtilRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const levelStaff = level === 'maiwp' ? malaysianStaff : malaysianStaff.filter(s => s.educationLevel === level);
  const teachingStaffCount = levelStaff.filter(s => ['teacher', 'caregiver', 'lecturer'].includes(s.role) && s.status === 'active').length;
  const staffRatio = teachingStaffCount > 0 ? (totalEnrolled / teachingStaffCount).toFixed(1) : '0';

  const reportCards = [
    {
      title: 'Student Enrollment',
      description: 'Active, pending, withdrawn & transferred students by centre',
      href: '/admin/reports/enrollment',
      icon: Users,
      iconColor: 'text-blue-500',
      metrics: [
        { label: 'Total Students', value: levelStudents.length },
        { label: 'Active', value: levelStudents.filter(s => s.status === 'active').length },
        { label: 'Pending', value: levelStudents.filter(s => s.status === 'pending').length },
      ],
    },
    {
      title: 'Fee Collection',
      description: 'Invoiced, collected & outstanding by fund source',
      href: '/admin/reports/fee-collection',
      icon: DollarSign,
      iconColor: 'text-green-500',
      metrics: [
        { label: 'Collection Rate', value: `${stats.collectionRate}%` },
        { label: 'Collected', value: `RM ${stats.feeCollectedRM.toLocaleString('en-MY')}` },
        { label: 'Outstanding', value: `RM ${stats.outstandingRM.toLocaleString('en-MY')}` },
      ],
    },
    {
      title: 'Aging Report',
      description: 'Outstanding balances with aging buckets (30/60/90+ days)',
      href: '/admin/reports/aging',
      icon: Clock,
      iconColor: 'text-red-500',
      metrics: [
        { label: 'Total Outstanding', value: `RM ${totalOutstandingAging.toLocaleString('en-MY')}` },
        { label: 'Guardians', value: levelAging.length },
        { label: 'Over 90 Days', value: over90Days },
      ],
    },
    {
      title: 'Attendance & Penalty',
      description: 'Daily attendance trends, late pickups & penalty values',
      href: '/admin/reports/attendance',
      icon: Calendar,
      iconColor: 'text-purple-500',
      metrics: [
        { label: 'Attendance Rate', value: `${attendanceRate}%` },
        { label: 'Late Records', value: levelAttendance.filter(r => r.status === 'late').length },
        { label: 'Total Penalties', value: `RM ${totalPenalties.toLocaleString('en-MY')}` },
      ],
    },
    {
      title: 'Centre Capacity',
      description: 'Capacity vs actual enrollment per centre',
      href: '/admin/reports/capacity',
      icon: Building2,
      iconColor: 'text-orange-500',
      metrics: [
        { label: 'Total Centres', value: levelInstitutes.length },
        { label: 'Total Capacity', value: totalCapacity },
        { label: 'Utilisation', value: `${capacityUtilRate}%` },
      ],
    },
    {
      title: 'Subsidy Utilization',
      description: 'Subsidy allocation vs usage by centre & fund source',
      href: '/admin/reports/subsidy',
      icon: DollarSign,
      iconColor: 'text-teal-500',
      metrics: [
        { label: 'Allocated', value: `RM ${totalSubsidyAllocated.toLocaleString('en-MY')}` },
        { label: 'Utilized', value: `RM ${totalSubsidyUtilized.toLocaleString('en-MY')}` },
        { label: 'Utilization Rate', value: `${subsidyUtilRate}%` },
      ],
    },
    {
      title: 'Staff-to-Student Ratio',
      description: 'Compliance with staffing ratios per centre',
      href: '/admin/reports/staff-ratio',
      icon: UserCheck,
      iconColor: 'text-indigo-500',
      metrics: [
        { label: 'Teaching Staff', value: teachingStaffCount },
        { label: 'Total Students', value: totalEnrolled },
        { label: 'Overall Ratio', value: `1:${staffRatio}` },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Hub</h1>
          <p className="text-muted-foreground">
            Comprehensive reporting and analytics overview
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => alert('Export All Reports (PDF) — coming soon')}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => alert('Export All Reports (Excel) — coming soon')}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.collectionRate}%</div>
            <p className="text-xs text-muted-foreground">Fee payment success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">RM {stats.outstandingRM.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">Total unpaid fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents} / {stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {stats.totalInstitutions} centres</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((report) => (
          <Link key={report.title} href={report.href}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <report.icon className={`h-5 w-5 ${report.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription className="text-xs">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {report.metrics.map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <span className="text-sm font-semibold">{metric.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">Auto-generated</Badge>
                  <span className="text-xs text-blue-600 font-medium">View Report &rarr;</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
