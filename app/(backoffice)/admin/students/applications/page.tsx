'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockApplications } from '@/lib/mock-data/student-lifecycle';
import { useEducationStore } from '@/lib/store/education-store';
import { format } from 'date-fns';
import { ClipboardList, Plus, FileCheck, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import type { StudentApplication } from '@/lib/types/student-lifecycle';

export default function ApplicationsPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);

  const levelApplications = level === 'maiwp'
    ? mockApplications
    : mockApplications.filter(a => a.educationLevel === level);

  const filtered = statusFilter === 'all'
    ? levelApplications
    : levelApplications.filter(a => a.status === statusFilter);

  const totalCount = levelApplications.length;
  const pendingCount = levelApplications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedCount = levelApplications.filter(a => a.status === 'approved' || a.status === 'enrolled').length;
  const rejectedCount = levelApplications.filter(a => a.status === 'rejected').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'submitted': return 'bg-blue-500';
      case 'under_review': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'enrolled': return 'bg-emerald-600';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const openDetail = (app: StudentApplication) => {
    setSelectedApp(app);
    setDetailDialog(true);
  };

  const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Applications</h1>
          <p className="text-muted-foreground mt-1">Manage student admission applications</p>
        </div>
        <Link href="/admin/students/applications/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <ClipboardList className="h-5 w-5 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <Clock className="h-5 w-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <XCircle className="h-5 w-5 text-red-500 mb-2" />
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map(f => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Application cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No applications found for the selected filter.
            </CardContent>
          </Card>
        ) : (
          filtered.map(app => (
            <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDetail(app)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{app.studentName}</p>
                    <p className="text-sm text-muted-foreground font-mono">{app.ic}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{app.centreName}</span>
                      <span>•</span>
                      <span>Applied: {format(app.appliedDate, 'dd MMM yyyy')}</span>
                    </div>
                    {app.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{app.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Application #{selectedApp?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{selectedApp.studentName}</h3>
                <Badge className={getStatusColor(selectedApp.status)}>
                  {selectedApp.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">IC Number</p>
                  <p className="font-medium font-mono">{selectedApp.ic}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{format(selectedApp.dateOfBirth, 'dd MMM yyyy')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guardian</p>
                  <p className="font-medium">{selectedApp.guardianName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedApp.guardianPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedApp.guardianEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Centre</p>
                  <p className="font-medium">{selectedApp.centreName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subsidy Category</p>
                  <Badge variant="outline">{selectedApp.subsidyCategory}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Applied Date</p>
                  <p className="font-medium">{format(selectedApp.appliedDate, 'dd MMM yyyy')}</p>
                </div>
              </div>

              {selectedApp.reviewedBy && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Reviewed by</p>
                  <p className="font-medium">{selectedApp.reviewedBy}</p>
                  {selectedApp.reviewedDate && (
                    <p className="text-xs text-muted-foreground">on {format(selectedApp.reviewedDate, 'dd MMM yyyy')}</p>
                  )}
                </div>
              )}

              {selectedApp.notes && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p>{selectedApp.notes}</p>
                </div>
              )}

              {(selectedApp.status === 'submitted' || selectedApp.status === 'under_review') && (
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 gap-2" variant="default" onClick={() => setDetailDialog(false)}>
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button className="flex-1 gap-2" variant="destructive" onClick={() => setDetailDialog(false)}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
