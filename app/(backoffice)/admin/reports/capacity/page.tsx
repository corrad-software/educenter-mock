'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { Building2, Download, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useEducationStore } from '@/lib/store/education-store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function CapacityReportPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  const totalCapacity = levelInstitutes.reduce((sum, i) => sum + i.capacity, 0);
  const totalEnrolled = levelInstitutes.reduce((sum, i) => sum + i.students, 0);
  const totalAvailable = totalCapacity - totalEnrolled;
  const overallUtilisation = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : '0';

  const nearFullCentres = levelInstitutes.filter(i => (i.students / i.capacity) >= 0.90).length;

  const getUtilisationColor = (rate: number) => {
    if (rate >= 95) return { badge: 'bg-red-100 text-red-700 border-red-300', bar: '#ef4444' };
    if (rate >= 80) return { badge: 'bg-yellow-100 text-yellow-700 border-yellow-300', bar: '#f59e0b' };
    if (rate >= 60) return { badge: 'bg-blue-100 text-blue-700 border-blue-300', bar: '#3b82f6' };
    return { badge: 'bg-green-100 text-green-700 border-green-300', bar: '#22c55e' };
  };

  const getUtilisationLabel = (rate: number) => {
    if (rate >= 95) return 'Over Capacity';
    if (rate >= 80) return 'Near Full';
    if (rate >= 60) return 'Optimal';
    return 'Under';
  };

  // Chart data
  const chartData = levelInstitutes.map(i => {
    const util = Math.round((i.students / i.capacity) * 100);
    return {
      name: i.code,
      capacity: i.capacity,
      enrolled: i.students,
      available: i.capacity - i.students,
      utilisation: util,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centre Capacity & Utilisation</h1>
          <p className="text-muted-foreground">
            Capacity vs actual enrollment per centre
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
            <CardTitle className="text-sm font-medium">Total Centres</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{levelInstitutes.length}</div>
            <p className="text-xs text-muted-foreground">Active centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}</div>
            <p className="text-xs text-muted-foreground">Maximum intake</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrolled}</div>
            <p className="text-xs text-muted-foreground">{totalAvailable} spots available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Utilisation</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallUtilisation}%</div>
            <p className="text-xs text-muted-foreground">
              {nearFullCentres > 0 && (
                <span className="text-red-600">{nearFullCentres} near full</span>
              )}
              {nearFullCentres === 0 && 'All within capacity'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity vs Enrollment by Centre</CardTitle>
          <CardDescription>Gray = total capacity, colored = enrolled students</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  Number(value),
                  name === 'capacity' ? 'Capacity' : 'Enrolled',
                ]}
              />
              <Legend />
              <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
              <Bar dataKey="enrolled" name="Enrolled">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getUtilisationColor(entry.utilisation).bar} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Centre Details</CardTitle>
          <CardDescription>Detailed capacity breakdown per centre</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Centre Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead className="text-right">Enrolled</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Utilisation</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levelInstitutes.map((institute) => {
                const util = Math.round((institute.students / institute.capacity) * 100);
                const colors = getUtilisationColor(util);
                return (
                  <TableRow key={institute.id} className={util >= 95 ? 'bg-red-50' : ''}>
                    <TableCell className="font-mono text-sm">{institute.code}</TableCell>
                    <TableCell className="font-medium">{institute.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{institute.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{institute.capacity}</TableCell>
                    <TableCell className="text-right font-semibold">{institute.students}</TableCell>
                    <TableCell className="text-right">{institute.capacity - institute.students}</TableCell>
                    <TableCell className="text-right font-semibold">{util}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={colors.badge}>
                        {getUtilisationLabel(util)}
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
