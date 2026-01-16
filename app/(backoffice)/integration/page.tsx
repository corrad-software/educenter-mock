'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockIntegrationLogs } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Activity, CheckCircle, XCircle, Clock, RefreshCw, Search, Download, Zap } from 'lucide-react';

export default function IntegrationPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'retry':
        return <RefreshCw className="h-5 w-5 text-orange-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'retry':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'IAS_SYNC':
        return 'bg-blue-500';
      case 'PAYMENT_GATEWAY':
        return 'bg-purple-500';
      case 'WHATSAPP':
        return 'bg-green-500';
      case 'EMAIL':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const integrationStats = {
    iasSync: { total: 156, success: 152, failed: 4, successRate: 97.4 },
    paymentGateway: { total: 89, success: 85, failed: 4, successRate: 95.5 },
    whatsapp: { total: 234, success: 232, failed: 2, successRate: 99.1 },
    email: { total: 187, success: 185, failed: 2, successRate: 98.9 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integration Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor system integrations, API calls, and webhook status
        </p>
      </div>

      {/* Integration Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IAS Sync</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {integrationStats.iasSync.successRate}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {integrationStats.iasSync.success}/{integrationStats.iasSync.total} successful
            </p>
            <div className="mt-2">
              <Badge className="bg-blue-500">ACTIVE</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Gateway</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {integrationStats.paymentGateway.successRate}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {integrationStats.paymentGateway.success}/{integrationStats.paymentGateway.total} successful
            </p>
            <div className="mt-2">
              <Badge className="bg-purple-500">ACTIVE</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {integrationStats.whatsapp.successRate}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {integrationStats.whatsapp.success}/{integrationStats.whatsapp.total} successful
            </p>
            <div className="mt-2">
              <Badge className="bg-green-500">ACTIVE</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {integrationStats.email.successRate}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {integrationStats.email.success}/{integrationStats.email.total} successful
            </p>
            <div className="mt-2">
              <Badge className="bg-orange-500">ACTIVE</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Failed Integrations Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-700">Failed Integrations</CardTitle>
          </div>
          <CardDescription className="text-red-600">
            2 integrations require attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Payment Gateway Timeout</p>
                  <p className="text-xs text-gray-600">
                    Invoice: inv-2 | Retry count: 2 | Last attempt: 5 mins ago
                  </p>
                </div>
                <Button size="sm" variant="outline">Retry Now</Button>
              </div>
            </div>
            <div className="p-3 bg-white rounded border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">IAS Sync Failed</p>
                  <p className="text-xs text-gray-600">
                    Connection refused | Retry count: 1 | Last attempt: 15 mins ago
                  </p>
                </div>
                <Button size="sm" variant="outline">Retry Now</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Integration Logs</CardTitle>
              <CardDescription>Complete history of all system integrations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-8 w-64" />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IAS_SYNC">IAS Sync</SelectItem>
                  <SelectItem value="PAYMENT_GATEWAY">Payment Gateway</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="retry">Retry</SelectItem>
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
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Summary</TableHead>
                <TableHead>Response/Error</TableHead>
                <TableHead>Retry Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockIntegrationLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(log.type)}>
                      {log.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <Badge className={getStatusColor(log.status)}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm space-y-1">
                      {log.request && (
                        <div className="font-mono text-xs bg-gray-50 p-2 rounded">
                          {Object.entries(log.request).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-500">{key}:</span>{' '}
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {log.status === 'success' && log.response && (
                      <div className="font-mono text-xs bg-green-50 p-2 rounded text-green-700">
                        {Object.entries(log.response).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500">{key}:</span>{' '}
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {log.status === 'failed' && log.errorMessage && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        {log.errorMessage}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.retryCount > 0 ? (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {log.retryCount} retries
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">View</Button>
                      {log.status === 'failed' && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <RefreshCw className="h-3 w-3" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Integration Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>IAS Integration</CardTitle>
            <CardDescription>Integrated Accounting System sync configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Endpoint:</span>
                <span className="font-mono text-xs">https://ias.maiwp.my/api/v1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sync Frequency:</span>
                <span className="font-semibold">Real-time</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Sync:</span>
                <span>2 minutes ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-500">CONNECTED</Badge>
              </div>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Test Connection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway</CardTitle>
            <CardDescription>FPX & JomPAY integration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gateway Provider:</span>
                <span className="font-semibold">FPX / JomPAY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Webhook URL:</span>
                <span className="font-mono text-xs">https://educentre.my/webhook</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retry Policy:</span>
                <span className="font-semibold">3 attempts, 5min interval</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-500">ACTIVE</Badge>
              </div>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Test Webhook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration</CardTitle>
            <CardDescription>Automated notifications via WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-semibold">WhatsApp Business API</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Message Types:</span>
                <span className="font-semibold">Invoices, Reminders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Rate:</span>
                <span className="font-semibold text-green-600">99.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-500">ACTIVE</Badge>
              </div>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <Zap className="h-3 w-3" />
                  Send Test Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Integration</CardTitle>
            <CardDescription>SMTP email notification system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">SMTP Server:</span>
                <span className="font-mono text-xs">smtp.maiwp.my:587</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">From Address:</span>
                <span className="font-mono text-xs">noreply@educentre.my</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Rate:</span>
                <span className="font-semibold text-green-600">98.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className="bg-green-500">ACTIVE</Badge>
              </div>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full gap-2">
                  <Zap className="h-3 w-3" />
                  Send Test Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
