'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAuditLogs, mockApprovalRequests } from '@/lib/mock-data';
import { format } from 'date-fns';
import { FileText, AlertTriangle, CheckCircle, Eye, Download, Search, Filter } from 'lucide-react';

export default function AuditPage() {
  const exceptionReports = [
    {
      id: 'EXC-001',
      type: 'Subsidy Override',
      description: 'Subsidy applied exceeds configured maximum',
      severity: 'high',
      entityType: 'Invoice',
      entityId: 'INV-2024-015',
      detectedDate: new Date('2024-01-22'),
      status: 'investigating',
    },
    {
      id: 'EXC-002',
      type: 'Fee Adjustment',
      description: 'Manual fee adjustment without approval',
      severity: 'critical',
      entityType: 'Student',
      entityId: 'EDU-2024-008',
      detectedDate: new Date('2024-01-21'),
      status: 'resolved',
    },
    {
      id: 'EXC-003',
      type: 'Payment Mismatch',
      description: 'Payment amount differs from invoice amount',
      severity: 'medium',
      entityType: 'Payment',
      entityId: 'PAY-2024-032',
      detectedDate: new Date('2024-01-20'),
      status: 'pending',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500';
      case 'investigating':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit & Compliance</h1>
        <p className="text-muted-foreground">
          Monitor system activities, exception reports, and approval history
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audit Logs</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exceptions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approvals Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">2 pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">97.5%</div>
            <p className="text-xs text-muted-foreground">Above threshold</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="exceptions">Exception Reports</TabsTrigger>
          <TabsTrigger value="approvals">Approval History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>Complete system activity log with user actions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-8 w-64" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="approve">Approve</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.user.name}</div>
                          <div className="text-xs text-gray-500">{log.user.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell className="font-mono text-sm">{log.entityId}</TableCell>
                      <TableCell className="text-sm text-gray-600">{log.ipAddress}</TableCell>
                      <TableCell className="max-w-xs">
                        {log.beforeData && log.afterData && (
                          <div className="text-xs space-y-1">
                            {Object.keys(log.afterData).map((key) => (
                              <div key={key}>
                                <span className="text-gray-500">{key}:</span>{' '}
                                <span className="text-red-600 line-through">
                                  {String(log.beforeData?.[key] ?? '')}
                                </span>{' '}
                                →{' '}
                                <span className="text-green-600">
                                  {String(log.afterData?.[key] ?? '')}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Audit Requirements
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>All actions logged with user ID and timestamp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Before and after data captured for all changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>IP address tracking for security monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Minimum 7-year retention period (SAGA & PPIBZW compliance)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exception Reports</CardTitle>
                  <CardDescription>Automated detection of policy violations and anomalies</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exceptionReports.map((exception) => (
                  <div
                    key={exception.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <AlertTriangle className={`h-5 w-5 mt-1 ${
                          exception.severity === 'critical' ? 'text-red-500' :
                          exception.severity === 'high' ? 'text-orange-500' :
                          exception.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{exception.id}</span>
                            <Badge className={getSeverityColor(exception.severity)}>
                              {exception.severity.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(exception.status)}>
                              {exception.status.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-medium mb-1">{exception.type}</h4>
                          <p className="text-sm text-gray-600 mb-2">{exception.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              Entity: {exception.entityType} - {exception.entityId}
                            </span>
                            <span>•</span>
                            <span>Detected: {format(exception.detectedDate, 'dd/MM/yyyy HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Investigate</Button>
                        <Button size="sm" variant="ghost">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-red-50 border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Critical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">1</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Immediate action required
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">High Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">1</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Review within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Medium Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">1</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Review within 7 days
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
              <CardDescription>Complete record of all approval workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Approval Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Comments</TableHead>
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
                      <TableCell>
                        <div>
                          <div className="font-medium">{req.requester.name}</div>
                          <div className="text-xs text-gray-500">{req.requester.role}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {req.approver ? (
                          <div>
                            <div className="font-medium">{req.approver.name}</div>
                            <div className="text-xs text-gray-500">{req.approver.role}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        RM {req.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{format(req.requestDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        {req.approvalDate
                          ? format(req.approvalDate, 'dd/MM/yyyy')
                          : '-'}
                      </TableCell>
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
                      <TableCell className="max-w-xs truncate">
                        {req.comments || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>SAGA & PPIBZW compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Segregation of Duties (SoD)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Preparer ≠ Approver</span>
                          <Badge className="bg-green-500">COMPLIANT</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Approver ≠ Poster</span>
                          <Badge className="bg-green-500">COMPLIANT</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Dual Authorization</span>
                          <Badge className="bg-green-500">COMPLIANT</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Data Retention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Audit Logs</span>
                          <span className="font-semibold">7+ years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Financial Records</span>
                          <span className="font-semibold">7+ years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Student Records</span>
                          <span className="font-semibold">Permanent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-500" />
                        Access Control
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>RBAC Enabled</span>
                          <Badge className="bg-green-500">ACTIVE</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>SSO Integration</span>
                          <Badge className="bg-green-500">ACTIVE</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>2FA Enforcement</span>
                          <Badge className="bg-green-500">ACTIVE</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        GL Period Control
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Period</span>
                          <span className="font-semibold">Jan 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Period Status</span>
                          <Badge className="bg-green-500">OPEN</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Closed</span>
                          <span className="font-semibold">Dec 2023</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-4">Compliance Checklist</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">All financial transactions audited</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Approval workflow enforced based on amount thresholds</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">TLS 1.3 encryption for data in transit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">AES-256 encryption for data at rest</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Regular backup and disaster recovery procedures</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
