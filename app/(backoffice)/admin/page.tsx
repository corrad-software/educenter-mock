'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Building2, GraduationCap, Users, TrendingUp, DollarSign, Calendar, Sparkles, ArrowRight, Baby, BookOpen, School, Shield } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEducationStore } from '@/lib/store/education-store';
import { LEVEL_META, LEVEL_DASHBOARD, LEVEL_COLOR_CLASSES } from '@/lib/education-config';
import { LEVEL_STATS, LEVEL_ACTIVITIES } from '@/lib/mock-data/level-data';
import type { EducationLevel } from '@/lib/types';

// MAIWP level breakdown config
const MAIWP_LEVEL_BREAKDOWN = [
  {
    level: 'preschool' as EducationLevel,
    label: 'Pre-school / Tadika',
    institutionLabel: 'Centres',
    institutions: 8,
    students: 268,
    attendance: 92.3,
    icon: Baby,
    badgeLabel: 'TADIKA',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-emerald-600',
    iconColor: 'text-emerald-600',
  },
  {
    level: 'primary' as EducationLevel,
    label: 'Primary School',
    institutionLabel: 'Schools',
    institutions: 5,
    students: 215,
    attendance: 94.1,
    icon: BookOpen,
    badgeLabel: 'SR',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeBg: 'bg-blue-600',
    iconColor: 'text-blue-600',
  },
  {
    level: 'secondary' as EducationLevel,
    label: 'Secondary School',
    institutionLabel: 'Schools',
    institutions: 3,
    students: 189,
    attendance: 91.7,
    icon: School,
    badgeLabel: 'SM',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    badgeBg: 'bg-orange-600',
    iconColor: 'text-orange-600',
  },
  {
    level: 'university' as EducationLevel,
    label: 'University / Higher Ed',
    institutionLabel: 'Faculties',
    institutions: 2,
    students: 312,
    attendance: 87.4,
    icon: GraduationCap,
    badgeLabel: 'IPT',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badgeBg: 'bg-purple-600',
    iconColor: 'text-purple-600',
  },
];

export default function AdminPage() {
  const { selectedLevel, selectLevel } = useEducationStore();
  const router = useRouter();
  const level = selectedLevel ?? 'primary';
  const meta = LEVEL_META[level];
  const dashboard = LEVEL_DASHBOARD[level];
  const stats = LEVEL_STATS[level];
  const colors = LEVEL_COLOR_CLASSES[level];
  const activities = LEVEL_ACTIVITIES[level];

  // Attendance trend data - varies slightly by level
  const attendanceBase = Math.round(stats.attendanceRate);
  const attendanceData = [
    { month: 'Jan', rate: attendanceBase - 3 },
    { month: 'Feb', rate: attendanceBase - 5 },
    { month: 'Mar', rate: attendanceBase + 1 },
    { month: 'Apr', rate: attendanceBase - 2 },
    { month: 'May', rate: attendanceBase + 3 },
    { month: 'Jun', rate: attendanceBase },
  ];

  // Fee collection data
  const baseCollected = Math.round(stats.feeCollectedRM / 6);
  const baseOutstanding = Math.round(stats.outstandingRM / 6);
  const feeCollectionData = [
    { period: 'Jan', collected: Math.round(baseCollected * 0.88), outstanding: Math.round(baseOutstanding * 1.15) },
    { period: 'Feb', collected: Math.round(baseCollected * 0.94), outstanding: Math.round(baseOutstanding * 0.95) },
    { period: 'Mar', collected: Math.round(baseCollected * 1.05), outstanding: Math.round(baseOutstanding * 0.82) },
    { period: 'Apr', collected: Math.round(baseCollected * 0.97), outstanding: Math.round(baseOutstanding * 0.90) },
    { period: 'May', collected: Math.round(baseCollected * 1.10), outstanding: Math.round(baseOutstanding * 0.72) },
    { period: 'Jun', collected: baseCollected, outstanding: baseOutstanding },
  ];

  const categoryData = [
    { name: 'B40', value: Math.round(stats.totalStudents * 0.55), color: '#8b5cf6' },
    { name: 'M40', value: Math.round(stats.totalStudents * 0.30), color: '#f97316' },
    { name: 'T20', value: Math.round(stats.totalStudents * 0.15), color: '#3b82f6' },
  ];

  const aiInsightConfigs = [
    { title: 'Attendance Trend', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Fee Collection', icon: DollarSign, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Academic Performance', icon: GraduationCap, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const activityDotColors: Record<string, string> = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Badge className={`${colors.bg} text-white text-xs font-bold`}>{meta.badgeLabel}</Badge>
          </div>
          <p className="text-muted-foreground">{dashboard.adminTitle}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">AI-Powered Insights</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total {dashboard.studentLabel}</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all {dashboard.institutionLabel.toLowerCase()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active {dashboard.studentLabel}</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Registration</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingStudents}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active {dashboard.institutionLabel}</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInstitutions}</div>
            <p className="text-xs text-muted-foreground">Registered locations</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsightConfigs.map((cfg, index) => {
          const Icon = cfg.icon;
          return (
            <Card key={index} className={`${cfg.bgColor} border-gray-200`}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${cfg.color}`} />
                  <CardTitle className="text-sm font-medium">{cfg.title}</CardTitle>
                </div>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{dashboard.aiInsights[index]}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MAIWP Level Breakdown */}
      {level === 'maiwp' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold">Education Level Overview</h2>
            <Badge variant="outline" className="text-xs text-slate-600 border-slate-300">All Institutions</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MAIWP_LEVEL_BREAKDOWN.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.level} className={`${item.bgColor} ${item.borderColor} border`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${item.iconColor}`} />
                        <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                      </div>
                      <Badge className={`${item.badgeBg} text-white text-xs`}>{item.badgeLabel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.institutionLabel}</span>
                      <span className="font-bold">{item.institutions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-bold">{item.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Attendance</span>
                      <span className="font-bold">{item.attendance}%</span>
                    </div>
                    <button
                      onClick={() => { selectLevel(item.level, 'admin'); router.push('/admin'); }}
                      className={`mt-3 w-full flex items-center justify-center gap-1 py-1.5 px-3 rounded-md text-xs font-medium text-white ${item.badgeBg} hover:opacity-90 transition-opacity`}
                    >
                      View Portal <ArrowRight className="h-3 w-3" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Rate Trend</CardTitle>
                <CardDescription>Monthly attendance percentage</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Attendance Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Collection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{dashboard.feeLabel} Status</CardTitle>
                <CardDescription>Collection vs outstanding (RM)</CardDescription>
              </div>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" name="Collected" />
                <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subsidy Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{dashboard.studentLabel} Category Distribution</CardTitle>
                <CardDescription>By subsidy category</CardDescription>
              </div>
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full ${activityDotColors[activity.type]} mt-2 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/admin/students" className="block">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <p className="font-medium text-sm">{dashboard.studentLabel}</p>
              </div>
            </a>
            <a href="/admin/institutes" className="block">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <Building2 className="h-6 w-6 text-purple-500" />
                <p className="font-medium text-sm">{dashboard.institutionLabel}</p>
              </div>
            </a>
            {level !== 'maiwp' && (
              <a href="/admin/subjects" className="block">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                  <UserPlus className="h-6 w-6 text-green-500" />
                  <p className="font-medium text-sm">
                    {level === 'university' ? 'Modules' : level === 'preschool' ? 'Activities' : 'Subjects'}
                  </p>
                </div>
              </a>
            )}
            {level === 'maiwp' && (
              <a href="/admin/institutes" className="block">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                  <Shield className="h-6 w-6 text-slate-500" />
                  <p className="font-medium text-sm">Fee Monitoring</p>
                </div>
              </a>
            )}
            <a href="/admin/attendance" className="block">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <Calendar className="h-6 w-6 text-orange-500" />
                <p className="font-medium text-sm">Attendance</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
