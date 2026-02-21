'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockTransferRequests } from '@/lib/mock-data/student-lifecycle';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { useEducationStore } from '@/lib/store/education-store';
import { format } from 'date-fns';
import { ArrowRightLeft, Plus, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function TransfersPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const [newTransferDialog, setNewTransferDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [toCentreId, setToCentreId] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const levelTransfers = level === 'maiwp'
    ? mockTransferRequests
    : mockTransferRequests.filter(t => t.educationLevel === level);

  const levelStudents = level === 'maiwp'
    ? malaysianStudents
    : malaysianStudents.filter(s => s.educationLevel === level);

  const activeStudents = levelStudents.filter(s => s.status === 'active');

  const centres = Array.from(
    new Map(levelStudents.map(s => [s.centreId, { id: s.centreId, name: s.centre.name }])).values()
  );

  const totalCount = levelTransfers.length;
  const pendingCount = levelTransfers.filter(t => t.status === 'requested' || t.status === 'approved').length;
  const completedCount = levelTransfers.filter(t => t.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedStudent = activeStudents.find(s => s.id === selectedStudentId);

  const handleSubmitTransfer = () => {
    setSubmitted(true);
    setTimeout(() => {
      setNewTransferDialog(false);
      setSubmitted(false);
      setSelectedStudentId('');
      setToCentreId('');
      setReason('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage student transfer requests between centres</p>
        </div>
        <Button className="gap-2" onClick={() => setNewTransferDialog(true)}>
          <Plus className="h-4 w-4" />
          New Transfer
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <ArrowRightLeft className="h-5 w-5 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total Transfers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <Clock className="h-5 w-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Transfer cards */}
      <div className="space-y-3">
        {levelTransfers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No transfer requests found.
            </CardContent>
          </Card>
        ) : (
          levelTransfers.map(transfer => (
            <Card key={transfer.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{transfer.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested: {format(transfer.requestedDate, 'dd MMM yyyy')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(transfer.status)}>
                    {transfer.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="font-medium">{transfer.fromCentreName}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-muted-foreground">To</p>
                    <p className="font-medium">{transfer.toCentreName}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-medium">Reason:</span> {transfer.reason}
                </p>

                {transfer.processedBy && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Processed by: {transfer.processedBy}
                    {transfer.completedDate && ` on ${format(transfer.completedDate, 'dd MMM yyyy')}`}
                  </p>
                )}

                {transfer.status === 'requested' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="gap-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Transfer Dialog */}
      <Dialog open={newTransferDialog} onOpenChange={setNewTransferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Transfer Request</DialogTitle>
            <DialogDescription>
              Request a student transfer to another centre
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Student *</label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeStudents.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.studentCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStudent && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="text-xs text-muted-foreground">Current Centre</p>
                  <p className="font-medium">{selectedStudent.centre.name}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Transfer To *</label>
                <Select value={toCentreId} onValueChange={setToCentreId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {centres
                      .filter(c => c.id !== selectedStudent?.centreId)
                      .map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason *</label>
                <Input
                  placeholder="Reason for transfer"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setNewTransferDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitTransfer}
                  className="flex-1"
                  disabled={!selectedStudentId || !toCentreId || !reason}
                >
                  Submit Request
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Transfer Request Submitted!</h3>
                <p className="text-sm text-gray-600 mt-1">The transfer request has been submitted for review.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
