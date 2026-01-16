'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSubsidyRules, mockFeeCategories, mockApprovalRequests, mockInvoices, mockDashboardStats } from '@/lib/mock-data';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Settings } from 'lucide-react';

export default function FinancePage() {
  const stats = mockDashboardStats;

  const agingData = [
    { range: 'Current (0-30 days)', amount: 8500, count: 15 },
    { range: '31-60 days', amount: 4200, count: 8 },
    { range: '61-90 days', amount: 2100, count: 4 },
    { range: '90+ days', amount: 800, count: 2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Console</h1>
        <p className="text-muted-foreground">
          Manage fees, subsidies, approvals, and AR monitoring
        </p>
      </div>

      {/* Financial Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              RM {stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding AR</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              RM {stats.outstandingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {mockInvoices.filter(inv => inv.status !== 'paid').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.collectionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 85%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subsidy Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              RM {stats.subsidyUtilization.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approvals">Approval Queue</TabsTrigger>
          <TabsTrigger value="fees">Fee Setup</TabsTrigger>
          <TabsTrigger value="subsidies">Subsidy Rules</TabsTrigger>
          <TabsTrigger value="ar">AR Monitoring</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Approval Workflow</CardTitle>
                  <CardDescription>Review and approve financial requests</CardDescription>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  {stats.pendingApprovals} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Student/Invoice</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockApprovalRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {req.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{req.requester.name}</TableCell>
                      <TableCell className="text-sm">
                        {req.studentId && <div>Student: {req.studentId}</div>}
                        {req.invoiceId && <div className="text-gray-500">{req.invoiceId}</div>}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                      <TableCell className="text-right font-semibold">
                        RM {req.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{format(req.requestDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {req.status === 'pending' && (
                          <Badge className="bg-yellow-500">PENDING</Badge>
                        )}
                        {req.status === 'approved' && (
                          <Badge className="bg-green-500">APPROVED</Badge>
                        )}
                        {req.status === 'rejected' && (
                          <Badge className="bg-red-500">REJECTED</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {req.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="ghost" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost">View</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm mb-2">Approval Matrix</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>≤ RM 5,000:</span>
                    <span className="font-medium">Centre Head</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RM 5,001 - RM 20,000:</span>
                    <span className="font-medium">Department Head / Jawatankuasa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>≥ RM 20,001:</span>
                    <span className="font-medium">Mesyuarat MAIWP</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fee Categories</CardTitle>
                  <CardDescription>Configure fee structures by age group</CardDescription>
                </div>
                <Button className="gap-2">
                  <Settings className="h-4 w-4" />
                  Add Fee Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Age Group</TableHead>
                    <TableHead className="text-right">Monthly Fee</TableHead>
                    <TableHead className="text-right">Deposit</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeeCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        {category.ageGroupMin} - {category.ageGroupMax} years
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        RM {category.monthlyFee.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        RM {category.depositAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>Pusat Jagaan Wangsa Maju</TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <Badge className="bg-green-500">ACTIVE</Badge>
                        ) : (
                          <Badge className="bg-gray-500">INACTIVE</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="ghost">
                            {category.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsidies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subsidy Configuration</CardTitle>
                  <CardDescription>Manage subsidy rules and eligibility</CardDescription>
                </div>
                <Button className="gap-2">
                  <Settings className="h-4 w-4" />
                  Add Subsidy Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Income Range</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead className="text-right">Max Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubsidyRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="text-base">
                          {rule.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        RM {rule.minIncome.toLocaleString()} - RM {rule.maxIncome.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {rule.percentage}%
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        RM {rule.maxAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {rule.isActive ? (
                          <Badge className="bg-green-500">ACTIVE</Badge>
                        ) : (
                          <Badge className="bg-gray-500">INACTIVE</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="ghost">
                            {rule.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">B40 Subsidy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">50%</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Max RM 500 per month
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Household income ≤ RM 4,850
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">M40 Subsidy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">30%</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Max RM 300 per month
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Household income RM 4,851 - RM 10,970
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Asnaf Subsidy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">70%</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Max RM 700 per month
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Special assistance category
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounts Receivable Monitoring</CardTitle>
              <CardDescription>Track outstanding invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">Total Invoiced</p>
                    <p className="text-2xl font-bold text-green-600">RM 68,000</p>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Collected</p>
                    <p className="text-2xl font-bold text-blue-600">RM 52,400</p>
                    <p className="text-xs text-gray-500 mt-1">77.1% collection rate</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-red-600">RM 15,600</p>
                    <p className="text-xs text-gray-500 mt-1">22.9% outstanding</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Outstanding</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.filter(inv => inv.status !== 'paid').map((invoice) => {
                      const daysOverdue = invoice.status === 'overdue'
                        ? Math.floor((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))
                        : 0;

                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.student.name}</TableCell>
                          <TableCell>{format(invoice.issueDate, 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{format(invoice.dueDate, 'dd/MM/yyyy')}</TableCell>
                          <TableCell className="text-right">
                            RM {invoice.netAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            RM {invoice.paidAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-600">
                            RM {(invoice.netAmount - invoice.paidAmount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {daysOverdue > 0 ? (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                {daysOverdue} days
                              </Badge>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              invoice.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                            }>
                              {invoice.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aging Report</CardTitle>
              <CardDescription>Outstanding receivables by age bracket</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {agingData.map((bucket, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        idx === 0 ? 'bg-green-50 border-green-200' :
                        idx === 1 ? 'bg-yellow-50 border-yellow-200' :
                        idx === 2 ? 'bg-orange-50 border-orange-200' :
                        'bg-red-50 border-red-200'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-700">{bucket.range}</p>
                      <p className={`text-2xl font-bold mt-1 ${
                        idx === 0 ? 'text-green-600' :
                        idx === 1 ? 'text-yellow-600' :
                        idx === 2 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        RM {bucket.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{bucket.count} invoices</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-4">Aging Breakdown</h4>
                  <div className="space-y-3">
                    {agingData.map((bucket, idx) => {
                      const totalOutstanding = agingData.reduce((sum, b) => sum + b.amount, 0);
                      const percentage = (bucket.amount / totalOutstanding * 100).toFixed(1);

                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{bucket.range}</span>
                            <span className="font-semibold">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                idx === 0 ? 'bg-green-500' :
                                idx === 1 ? 'bg-yellow-500' :
                                idx === 2 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-2">Collection Actions</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Automated reminders sent for 31-60 day invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span>Manual follow-up required for 61-90 day invoices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>Escalation to management for 90+ day invoices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
