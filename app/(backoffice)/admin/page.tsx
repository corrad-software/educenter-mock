'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStudents } from '@/lib/mock-data';
import { UserPlus, Building2, GraduationCap, Users, TrendingUp, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
  const institutes = 5;
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const pendingStudents = mockStudents.filter(s => s.status === 'pending').length;

  // Attendance data for line chart
  const attendanceData = [
    { month: 'Jan', rate: 92 },
    { month: 'Feb', rate: 88 },
    { month: 'Mar', rate: 94 },
    { month: 'Apr', rate: 91 },
    { month: 'May', rate: 95 },
    { month: 'Jun', rate: 93 },
  ];

  // Fee collection data for bar chart
  const feeCollectionData = [
    { month: 'Jan', collected: 45000, outstanding: 12000 },
    { month: 'Feb', collected: 48000, outstanding: 9000 },
    { month: 'Mar', collected: 52000, outstanding: 7500 },
    { month: 'Apr', collected: 49000, outstanding: 8200 },
    { month: 'May', collected: 54000, outstanding: 6000 },
    { month: 'Jun', collected: 51000, outstanding: 7800 },
  ];

  // Student distribution by category
  const categoryData = [
    { name: 'B40', value: mockStudents.filter(s => s.subsidyCategory === 'B40').length, color: '#8b5cf6' },
    { name: 'M40', value: mockStudents.filter(s => s.subsidyCategory === 'M40').length, color: '#f97316' },
    { name: 'T20', value: mockStudents.filter(s => s.subsidyCategory === 'T20').length, color: '#3b82f6' },
  ];

  // AI Insights
  const aiInsights = [
    {
      title: 'Attendance Trend',
      insight: 'Attendance has improved by 3% this month. May shows the highest rate at 95%.',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Fee Collection',
      insight: 'Outstanding fees decreased by 23% from January. Continue monitoring April cohort.',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Student Distribution',
      insight: 'B40 category represents 60% of total students. Subsidy allocation is optimal.',
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Centre Administration Overview</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">AI-Powered Insights</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
            <p className="text-xs text-muted-foreground">Across all centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Registration</CardTitle>
            <UserPlus className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingStudents}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Centres</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutes}</div>
            <p className="text-xs text-muted-foreground">PATI locations</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className={`${insight.bgColor} border-gray-200`}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${insight.color}`} />
                  <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                </div>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{insight.insight}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
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
                <YAxis domain={[80, 100]} />
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

        {/* Fee Collection Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fee Collection Status</CardTitle>
                <CardDescription>Monthly collection vs outstanding (RM)</CardDescription>
              </div>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" name="Collected" />
                <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Category Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Category Distribution</CardTitle>
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
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student registered</p>
                  <p className="text-xs text-muted-foreground">Ahmad bin Abdullah - PATI-WP-01</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Student transferred</p>
                  <p className="text-xs text-muted-foreground">Nurul Aina - PATI-WP-01 to PATI-PJ-01</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pending approval</p>
                  <p className="text-xs text-muted-foreground">3 students awaiting registration approval</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Student withdrawal</p>
                  <p className="text-xs text-muted-foreground">Siti Fatimah - PATI-LB-01</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">High attendance alert</p>
                  <p className="text-xs text-muted-foreground">PATI-WP-01 achieved 98% attendance rate</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
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
                <p className="font-medium text-sm">Student List</p>
              </div>
            </a>
            <a href="/admin/institutes" className="block">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <Building2 className="h-6 w-6 text-purple-500" />
                <p className="font-medium text-sm">Institutes</p>
              </div>
            </a>
            <a href="/admin/registration" className="block">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-center">
                <UserPlus className="h-6 w-6 text-green-500" />
                <p className="font-medium text-sm">Registration</p>
              </div>
            </a>
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
