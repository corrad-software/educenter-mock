'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianStaff } from '@/lib/mock-data/malaysian-staff';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';
import { UserCheck, Users, GraduationCap, ShieldCheck, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import type { EducationLevel } from '@/lib/types';

const TEACHING_ROLES = ['teacher', 'caregiver', 'lecturer'];

const COMPLIANCE_THRESHOLDS: Record<EducationLevel, number> = {
  maiwp: 20,
  preschool: 10,
  primary: 25,
  secondary: 30,
  university: 35,
};

export default function StaffRatioReportPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'maiwp';

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  const levelStaff = level === 'maiwp'
    ? malaysianStaff
    : malaysianStaff.filter(s => s.educationLevel === level);

  const teachingStaff = levelStaff.filter(s => TEACHING_ROLES.includes(s.role) && s.status === 'active');
  const totalStudents = levelInstitutes.reduce((sum, i) => sum + i.students, 0);
  const overallRatio = teachingStaff.length > 0 ? (totalStudents / teachingStaff.length).toFixed(1) : '0';

  // Per-centre breakdown
  const centreData = levelInstitutes.map(inst => {
    const centreTeachers = teachingStaff.filter(s => s.centreId === inst.id).length;
    const threshold = COMPLIANCE_THRESHOLDS[inst.educationLevel as EducationLevel] ?? 20;
    const ratio = centreTeachers > 0 ? inst.students / centreTeachers : 0;
    const isCompliant = ratio > 0 && ratio <= threshold;

    return {
      id: inst.id,
      code: inst.code,
      name: inst.name,
      educationLevel: inst.educationLevel,
      teachingStaff: centreTeachers,
      students: inst.students,
      ratio: Number(ratio.toFixed(1)),
      threshold,
      isCompliant,
    };
  });

  const compliantCount = centreData.filter(c => c.isCompliant).length;

  const getComplianceColor = (ratio: number, threshold: number) => {
    if (ratio === 0) return { badge: 'bg-gray-100 text-gray-700 border-gray-300', bar: '#9ca3af', label: 'No Staff' };
    if (ratio <= threshold * 0.8) return { badge: 'bg-green-100 text-green-700 border-green-300', bar: '#22c55e', label: 'Compliant' };
    if (ratio <= threshold) return { badge: 'bg-yellow-100 text-yellow-700 border-yellow-300', bar: '#f59e0b', label: 'Near Limit' };
    return { badge: 'bg-red-100 text-red-700 border-red-300', bar: '#ef4444', label: 'Over Limit' };
  };

  // Chart data
  const chartData = centreData.map(c => ({
    name: c.code,
    ratio: c.ratio,
    threshold: c.threshold,
  }));

  // Average threshold for reference line
  const avgThreshold = level === 'maiwp'
    ? 20
    : COMPLIANCE_THRESHOLDS[level];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff-to-Student Ratio</h1>
          <p className="text-muted-foreground">
            Compliance with staffing ratios per centre
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
            <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachingStaff.length}</div>
            <p className="text-xs text-muted-foreground">Active teachers, caregivers & lecturers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {levelInstitutes.length} centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Ratio</CardTitle>
            <UserCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 : {overallRatio}</div>
            <p className="text-xs text-muted-foreground">Staff to students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Centres</CardTitle>
            <ShieldCheck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliantCount} / {centreData.length}</div>
            <p className="text-xs text-muted-foreground">
              {centreData.length > 0
                ? `${Math.round((compliantCount / centreData.length) * 100)}% compliance`
                : 'No centres'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Staff-to-Student Ratio by Centre</CardTitle>
          <CardDescription>Students per teaching staff member. Red line = compliance threshold ({avgThreshold})</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  name === 'ratio' ? `1:${value}` : value,
                  name === 'ratio' ? 'Ratio' : 'Threshold',
                ]}
              />
              <Legend />
              <ReferenceLine x={avgThreshold} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Threshold (1:${avgThreshold})`, fill: '#ef4444', fontSize: 12 }} />
              <Bar dataKey="ratio" name="Ratio (students per staff)">
                {chartData.map((entry, index) => {
                  const c = centreData[index];
                  const color = getComplianceColor(c.ratio, c.threshold);
                  return <Cell key={index} fill={color.bar} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Details</CardTitle>
          <CardDescription>Detailed staffing ratio breakdown per centre</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Centre Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Teaching Staff</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Ratio</TableHead>
                <TableHead className="text-right">Threshold</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centreData.map((centre) => {
                const colors = getComplianceColor(centre.ratio, centre.threshold);
                return (
                  <TableRow key={centre.id} className={centre.ratio > centre.threshold && centre.ratio > 0 ? 'bg-red-50' : ''}>
                    <TableCell className="font-mono text-sm">{centre.code}</TableCell>
                    <TableCell className="font-medium">{centre.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{centre.educationLevel}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{centre.teachingStaff}</TableCell>
                    <TableCell className="text-right">{centre.students}</TableCell>
                    <TableCell className="text-right font-semibold">1:{centre.ratio}</TableCell>
                    <TableCell className="text-right">1:{centre.threshold}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={colors.badge}>
                        {colors.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
