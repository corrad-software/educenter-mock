'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ClipboardList, Plus, Clock, CheckCircle, XCircle, Eye, Folder, Download } from 'lucide-react';
import { useEducationStore } from '@/lib/store/education-store';
import { format } from 'date-fns';
import type { RegistrationApplicationExtended } from '@/lib/types/registration-edms';

interface ApplicationsResponse {
  applications: RegistrationApplicationExtended[];
}

export default function ApplicationsPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apps, setApps] = useState<RegistrationApplicationExtended[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<RegistrationApplicationExtended | null>(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [reviewRemark, setReviewRemark] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);

  const loadApps = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/applications', { cache: 'no-store' });
      const json = await res.json() as ApplicationsResponse & { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Failed to load applications.');
        return;
      }
      setApps(json.applications);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadApps();
  }, []);

  const levelApplications = useMemo(() => (
    level === 'maiwp' ? apps : apps.filter((a) => a.educationLevel === level)
  ), [apps, level]);

  const filtered = useMemo(() => (
    statusFilter === 'all' ? levelApplications : levelApplications.filter((a) => a.status === statusFilter)
  ), [levelApplications, statusFilter]);

  const totalCount = levelApplications.length;
  const pendingCount = levelApplications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedCount = levelApplications.filter((a) => a.status === 'approved' || a.status === 'enrolled').length;
  const rejectedCount = levelApplications.filter((a) => a.status === 'rejected').length;

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

  const openDetail = (app: RegistrationApplicationExtended) => {
    setSelectedApp(app);
    setReviewRemark('');
    setDetailDialog(true);
  };

  const runReview = async (action: 'approve' | 'reject') => {
    if (!selectedApp) return;
    if (action === 'reject' && !reviewRemark.trim()) {
      setError('Rejection remark is required.');
      return;
    }

    setReviewBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, remarks: reviewRemark, reviewerName: 'Centre Admin' }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Failed to update application review.');
        return;
      }
      await loadApps();
      setDetailDialog(false);
    } catch {
      setError('Failed to update application review.');
    } finally {
      setReviewBusy(false);
    }
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
          <p className="text-muted-foreground mt-1">Manage self-service and internal student admission applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/edms">
            <Button variant="outline" className="gap-2">
              <Folder className="h-4 w-4" />
              EDMS
            </Button>
          </Link>
          <Link href="/admin/students/applications/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-3 px-4"><ClipboardList className="h-5 w-5 text-blue-500 mb-2" /><p className="text-2xl font-bold">{totalCount}</p><p className="text-xs text-muted-foreground">Total Applications</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4"><Clock className="h-5 w-5 text-yellow-500 mb-2" /><p className="text-2xl font-bold text-yellow-600">{pendingCount}</p><p className="text-xs text-muted-foreground">Pending Review</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4"><CheckCircle className="h-5 w-5 text-green-500 mb-2" /><p className="text-2xl font-bold text-green-600">{approvedCount}</p><p className="text-xs text-muted-foreground">Approved</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 px-4"><XCircle className="h-5 w-5 text-red-500 mb-2" /><p className="text-2xl font-bold text-red-600">{rejectedCount}</p><p className="text-xs text-muted-foreground">Rejected</p></CardContent></Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <Button key={f.value} variant={statusFilter === f.value ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(f.value)}>{f.label}</Button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Loading applications...</CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No applications found for the selected filter.</CardContent></Card>
        ) : (
          filtered.map((app) => (
            <Card key={app.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold">{app.studentName}</p>
                    <p className="text-sm text-muted-foreground font-mono">{app.ic}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{app.centreName}</span>
                      <span>•</span>
                      <span>Applied: {format(new Date(app.appliedDate), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant="outline">{app.applicationRef}</Badge>
                      <Badge variant="outline">{app.source}</Badge>
                      {app.documentSummary && (
                        <Badge variant={app.documentSummary.hasAllRequired ? 'default' : 'secondary'}>
                          Docs {app.documentSummary.uploadedRequiredCount}/{app.documentSummary.requiredCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(app.status)}>{app.status.replace('_', ' ').toUpperCase()}</Badge>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => openDetail(app)}>
                      <Eye className="h-3.5 w-3.5" />
                      Open
                    </Button>
                    <Link href={`/admin/edms?applicationRef=${encodeURIComponent(app.applicationRef)}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Folder className="h-3.5 w-3.5" />
                        Open Docs
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={detailDialog} onOpenChange={setDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>{selectedApp?.applicationRef}</DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{selectedApp.studentName}</h3>
                <Badge className={getStatusColor(selectedApp.status)}>{selectedApp.status.replace('_', ' ').toUpperCase()}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">IC Number</p><p className="font-medium font-mono">{selectedApp.ic}</p></div>
                <div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="font-medium">{format(new Date(selectedApp.dateOfBirth), 'dd MMM yyyy')}</p></div>
                <div><p className="text-xs text-muted-foreground">Guardian</p><p className="font-medium">{selectedApp.guardianName}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{selectedApp.guardianPhone}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{selectedApp.guardianEmail}</p></div>
                <div><p className="text-xs text-muted-foreground">Centre</p><p className="font-medium">{selectedApp.centreName}</p></div>
                <div><p className="text-xs text-muted-foreground">Subsidy Category</p><Badge variant="outline">{selectedApp.subsidyCategory}</Badge></div>
                <div><p className="text-xs text-muted-foreground">Applied Date</p><p className="font-medium">{format(new Date(selectedApp.appliedDate), 'dd MMM yyyy')}</p></div>
              </div>

              <div className="rounded-lg border p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">EDMS Attachments</p>
                  <Link href={`/admin/edms?applicationRef=${encodeURIComponent(selectedApp.applicationRef)}`}>
                    <Button variant="outline" size="sm">Open EDMS</Button>
                  </Link>
                </div>
                {(selectedApp.documents ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No centralized attachments found.</p>
                ) : (
                  <div className="space-y-2">
                    {(selectedApp.documents ?? []).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-md border p-2 bg-white">
                        <div>
                          <p className="text-sm font-medium">{doc.docType}</p>
                          <p className="text-xs text-muted-foreground">{doc.originalName} · {(doc.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{doc.status}</Badge>
                          <a href={`/api/admin/edms/documents/${doc.id}/download`} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="gap-1"><Download className="h-3.5 w-3.5" />View/Download</Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedApp.notes && (
                <div className="p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p>{selectedApp.notes}</p>
                </div>
              )}

              {(selectedApp.status === 'submitted' || selectedApp.status === 'under_review') && selectedApp.source !== 'mock' && (
                <div className="space-y-2 border-t pt-3">
                  <Input
                    placeholder="Review remarks (required for reject)"
                    value={reviewRemark}
                    onChange={(e) => setReviewRemark(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" variant="default" disabled={reviewBusy} onClick={() => void runReview('approve')}>
                      <CheckCircle className="h-4 w-4" />Approve
                    </Button>
                    <Button className="flex-1 gap-2" variant="destructive" disabled={reviewBusy} onClick={() => void runReview('reject')}>
                      <XCircle className="h-4 w-4" />Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
