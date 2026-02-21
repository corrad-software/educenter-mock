'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockWithdrawalRequests } from '@/lib/mock-data/student-lifecycle';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import { useEducationStore } from '@/lib/store/education-store';
import { format } from 'date-fns';
import { UserMinus, GraduationCap, Plus, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export default function AlumniPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const [activeTab, setActiveTab] = useState<'withdrawals' | 'alumni'>('withdrawals');
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [reenrollDialog, setReenrollDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');
  const [lastDay, setLastDay] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [reenrollCentreId, setReenrollCentreId] = useState('');
  const [reenrollSubsidy, setReenrollSubsidy] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const levelWithdrawals = level === 'maiwp'
    ? mockWithdrawalRequests
    : mockWithdrawalRequests.filter(w => w.educationLevel === level);

  const levelStudents = level === 'maiwp'
    ? malaysianStudents
    : malaysianStudents.filter(s => s.educationLevel === level);

  const activeStudents = levelStudents.filter(s => s.status === 'active');
  const alumniStudents = levelStudents.filter(s => s.status === 'withdrawn' || s.status === 'alumni');

  const centres = Array.from(
    new Map(levelStudents.map(s => [s.centreId, { id: s.centreId, name: s.centre.name }])).values()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleWithdraw = () => {
    setSubmitted(true);
    setTimeout(() => {
      setWithdrawDialog(false);
      setSubmitted(false);
      setSelectedStudentId('');
      setWithdrawReason('');
      setLastDay('');
      setRefundAmount('');
    }, 2000);
  };

  const handleReenroll = () => {
    setSubmitted(true);
    setTimeout(() => {
      setReenrollDialog(false);
      setSubmitted(false);
      setSelectedStudentId('');
      setReenrollCentreId('');
      setReenrollSubsidy('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Alumni & Withdrawals</h1>
          <p className="text-muted-foreground mt-1">Manage student withdrawals and alumni re-enrollment</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'withdrawals'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserMinus className="h-4 w-4 inline mr-1.5" />
          Withdrawals
        </button>
        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'alumni'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <GraduationCap className="h-4 w-4 inline mr-1.5" />
          Alumni / Re-enroll
        </button>
      </div>

      {/* Withdrawals tab */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => setWithdrawDialog(true)}>
              <Plus className="h-4 w-4" />
              New Withdrawal
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <UserMinus className="h-5 w-5 text-red-500 mb-2" />
                <p className="text-2xl font-bold">{levelWithdrawals.length}</p>
                <p className="text-xs text-muted-foreground">Total Withdrawals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <Clock className="h-5 w-5 text-yellow-500 mb-2" />
                <p className="text-2xl font-bold text-yellow-600">
                  {levelWithdrawals.filter(w => w.status === 'requested').length}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <CheckCircle className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {levelWithdrawals.filter(w => w.status === 'completed').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal cards */}
          <div className="space-y-3">
            {levelWithdrawals.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No withdrawal requests found.
                </CardContent>
              </Card>
            ) : (
              levelWithdrawals.map(wd => (
                <Card key={wd.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{wd.studentName}</p>
                        <p className="text-sm text-muted-foreground">{wd.centreName}</p>
                      </div>
                      <Badge className={getStatusColor(wd.status)}>
                        {wd.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Last Day</p>
                        <p className="font-medium">{format(wd.lastDay, 'dd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Requested</p>
                        <p className="font-medium">{format(wd.requestedDate, 'dd MMM yyyy')}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium">Reason:</span> {wd.reason}
                    </p>

                    {wd.refundAmount !== undefined && wd.refundAmount > 0 && (
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Refund:</span>{' '}
                        <span className="font-semibold text-teal-600">
                          RM {wd.refundAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </span>
                      </p>
                    )}

                    {wd.processedBy && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Processed by: {wd.processedBy}
                        {wd.completedDate && ` on ${format(wd.completedDate, 'dd MMM yyyy')}`}
                      </p>
                    )}

                    {wd.status === 'requested' && (
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
        </div>
      )}

      {/* Alumni tab */}
      {activeTab === 'alumni' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {alumniStudents.length} alumni / withdrawn students
            </p>
          </div>

          <div className="space-y-3">
            {alumniStudents.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No alumni records found. Students who have been withdrawn will appear here.
                </CardContent>
              </Card>
            ) : (
              alumniStudents.map(student => (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm font-mono text-muted-foreground">{student.studentCode}</p>
                        <p className="text-sm text-muted-foreground mt-1">{student.centre.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {student.subsidyCategory}
                          </Badge>
                          <Badge className={student.status === 'withdrawn' ? 'bg-red-500' : 'bg-gray-500'}>
                            {student.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          setReenrollDialog(true);
                        }}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Re-enroll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* New Withdrawal Dialog */}
      <Dialog open={withdrawDialog} onOpenChange={setWithdrawDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Withdrawal Request</DialogTitle>
            <DialogDescription>Submit a student withdrawal request</DialogDescription>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason *</label>
                <Input
                  placeholder="Reason for withdrawal"
                  value={withdrawReason}
                  onChange={e => setWithdrawReason(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Day *</label>
                  <Input
                    type="date"
                    value={lastDay}
                    onChange={e => setLastDay(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Refund Amount (RM)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={refundAmount}
                    onChange={e => setRefundAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setWithdrawDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  className="flex-1"
                  disabled={!selectedStudentId || !withdrawReason || !lastDay}
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
                <h3 className="text-lg font-semibold text-green-600">Request Submitted!</h3>
                <p className="text-sm text-gray-600 mt-1">The withdrawal request has been submitted.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Re-enrollment Dialog */}
      <Dialog open={reenrollDialog} onOpenChange={setReenrollDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Re-enroll Student</DialogTitle>
            <DialogDescription>Re-enroll a former student into a centre</DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <div className="space-y-4">
              {selectedStudentId && (
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="font-medium">
                    {alumniStudents.find(s => s.id === selectedStudentId)?.name ?? selectedStudentId}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Centre *</label>
                <Select value={reenrollCentreId} onValueChange={setReenrollCentreId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {centres.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subsidy Category *</label>
                <Select value={reenrollSubsidy} onValueChange={setReenrollSubsidy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B40">B40</SelectItem>
                    <SelectItem value="M40">M40</SelectItem>
                    <SelectItem value="T20">T20</SelectItem>
                    <SelectItem value="Asnaf">Asnaf</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setReenrollDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleReenroll}
                  className="flex-1"
                  disabled={!reenrollCentreId || !reenrollSubsidy}
                >
                  Re-enroll
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
                <h3 className="text-lg font-semibold text-green-600">Re-enrollment Successful!</h3>
                <p className="text-sm text-gray-600 mt-1">The student has been re-enrolled.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
