'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { generateSubsidyData } from '@/lib/mock-data/report-data';
import { malaysianInstitutes } from '@/lib/mock-data/malaysian-institutes';
import { useEducationStore } from '@/lib/store/education-store';
import { DollarSign, TrendingUp, Users, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ITEMS_PER_PAGE = 15;
const FUND_COLORS: Record<string, string> = {
  Zakat: '#3b82f6',
  Wakaf: '#8b5cf6',
  'Sumber Am': '#f59e0b',
};

export default function SubsidyReportPage() {
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFund, setSelectedFund] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const allSubsidy = generateSubsidyData();

  const levelSubsidy = level === 'maiwp'
    ? allSubsidy
    : allSubsidy.filter(r => r.educationLevel === level);

  const levelInstitutes = level === 'maiwp'
    ? malaysianInstitutes
    : malaysianInstitutes.filter(i => i.educationLevel === level);

  // Stats
  const totalAllocated = levelSubsidy.reduce((sum, r) => sum + r.allocated, 0);
  const totalUtilized = levelSubsidy.reduce((sum, r) => sum + r.utilized, 0);
  const totalRemaining = totalAllocated - totalUtilized;
  const overallRate = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0;
  const totalEligible = levelSubsidy.reduce((sum, r) => sum + r.eligibleStudents, 0);

  // Filter
  const filteredRecords = levelSubsidy.filter(record => {
    const matchesCentre = selectedCentre === 'all' || record.centreCode === selectedCentre;
    const matchesType = selectedType === 'all' || record.subsidyType === selectedType;
    const matchesFund = selectedFund === 'all' || record.fundSource === selectedFund;
    return matchesCentre && matchesType && matchesFund;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (type: string, value: string) => {
    if (type === 'centre') setSelectedCentre(value);
    if (type === 'type') setSelectedType(value);
    if (type === 'fund') setSelectedFund(value);
    setCurrentPage(1);
  };

  // Chart: allocation vs utilization by centre (aggregate per centre)
  const centreMap = new Map<string, { code: string; allocated: number; utilized: number }>();
  levelSubsidy.forEach(r => {
    const entry = centreMap.get(r.centreCode) ?? { code: r.centreCode, allocated: 0, utilized: 0 };
    entry.allocated += r.allocated;
    entry.utilized += r.utilized;
    centreMap.set(r.centreCode, entry);
  });
  const barData = Array.from(centreMap.values());

  // Pie chart: by fund source
  const fundMap = new Map<string, number>();
  levelSubsidy.forEach(r => {
    fundMap.set(r.fundSource, (fundMap.get(r.fundSource) ?? 0) + r.utilized);
  });
  const pieData = Array.from(fundMap.entries()).map(([name, value]) => ({ name, value }));

  const getUtilBadge = (rate: number) => {
    if (rate >= 90) return 'bg-green-100 text-green-700 border-green-300';
    if (rate >= 70) return 'bg-blue-100 text-blue-700 border-blue-300';
    if (rate >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subsidy Utilization Report</h1>
          <p className="text-muted-foreground">
            Subsidy allocation vs usage by centre & fund source
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
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {totalAllocated.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">{totalEligible} eligible students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilized</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">RM {totalUtilized.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">Disbursed to centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">RM {totalRemaining.toLocaleString('en-MY')}</div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{overallRate}%</div>
            <p className="text-xs text-muted-foreground">Overall utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Allocation vs Utilization by Centre</CardTitle>
            <CardDescription>Subsidy allocation compared to actual utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="code" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(value) => `RM ${Number(value).toLocaleString('en-MY')}`} />
                <Legend />
                <Bar dataKey="allocated" fill="#93c5fd" name="Allocated" />
                <Bar dataKey="utilized" fill="#22c55e" name="Utilized" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Fund Source</CardTitle>
            <CardDescription>Utilization by fund</CardDescription>
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
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={FUND_COLORS[entry.name] ?? '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `RM ${Number(value).toLocaleString('en-MY')}`} />
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
              <CardTitle>Subsidy Details</CardTitle>
              <CardDescription>Per-centre subsidy allocation and utilization</CardDescription>
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
                value={selectedType}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="B40">B40</option>
                <option value="M40">M40</option>
                <option value="Asnaf">Asnaf</option>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre</TableHead>
                <TableHead>Subsidy Type</TableHead>
                <TableHead>Fund Source</TableHead>
                <TableHead className="text-right">Eligible</TableHead>
                <TableHead className="text-right">Allocated (RM)</TableHead>
                <TableHead className="text-right">Utilized (RM)</TableHead>
                <TableHead className="text-right">Remaining (RM)</TableHead>
                <TableHead className="text-right">Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No subsidy records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{record.centreName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{record.centreCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                        {record.subsidyType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{record.fundSource}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{record.eligibleStudents}</TableCell>
                    <TableCell className="text-right">RM {record.allocated.toLocaleString('en-MY')}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      RM {record.utilized.toLocaleString('en-MY')}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      RM {record.remaining.toLocaleString('en-MY')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={getUtilBadge(record.utilizationRate)}>
                        {record.utilizationRate}%
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
