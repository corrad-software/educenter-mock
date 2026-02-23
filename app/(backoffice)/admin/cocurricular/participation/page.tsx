'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { cocurricularParticipation } from '@/lib/mock-data/cocurricular';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CoCurricularParticipation } from '@/lib/types';

interface ParticipationFormState {
  studentName: string;
  activityName: string;
  attendanceRate: string;
  meritPoints: string;
  achievement: string;
  status: CoCurricularParticipation['status'];
}

const defaultForm: ParticipationFormState = {
  studentName: '',
  activityName: '',
  attendanceRate: '0',
  meritPoints: '0',
  achievement: '',
  status: 'active',
};

export default function CocurricularParticipationPage() {
  const [records, setRecords] = useState<CoCurricularParticipation[]>(cocurricularParticipation);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<CoCurricularParticipation | null>(null);
  const [form, setForm] = useState<ParticipationFormState>(defaultForm);

  const openAdd = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (record: CoCurricularParticipation) => {
    setSelected(record);
    setForm({
      studentName: record.studentName,
      activityName: record.activityName,
      attendanceRate: String(record.attendanceRate),
      meritPoints: String(record.meritPoints),
      achievement: record.achievement ?? '',
      status: record.status,
    });
    setIsEditOpen(true);
  };

  const createRecord = () => {
    if (!form.studentName || !form.activityName) return;

    const newRecord: CoCurricularParticipation = {
      id: `ccp-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      studentName: form.studentName,
      activityId: 'custom',
      activityName: form.activityName,
      attendanceRate: Number(form.attendanceRate) || 0,
      meritPoints: Number(form.meritPoints) || 0,
      achievement: form.achievement || undefined,
      status: form.status,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsAddOpen(false);
  };

  const updateRecord = () => {
    if (!selected) return;

    setRecords((prev) => prev.map((record) => record.id === selected.id
      ? {
        ...record,
        studentName: form.studentName,
        activityName: form.activityName,
        attendanceRate: Number(form.attendanceRate) || 0,
        meritPoints: Number(form.meritPoints) || 0,
        achievement: form.achievement || undefined,
        status: form.status,
      }
      : record));

    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteRecord = (record: CoCurricularParticipation) => {
    const confirmed = confirm(`Delete participation record for ${record.studentName}?`);
    if (!confirmed) return;
    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participation Tracker</h1>
          <p className="text-muted-foreground">Track attendance and merit points by student and activity.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Record</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Participation</CardTitle>
          <CardDescription>Participation status with engagement metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
                <TableHead className="text-right">Merit</TableHead>
                <TableHead>Achievement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.studentName}</TableCell>
                  <TableCell>{entry.activityName}</TableCell>
                  <TableCell className="text-right">{entry.attendanceRate}%</TableCell>
                  <TableCell className="text-right">{entry.meritPoints}</TableCell>
                  <TableCell>{entry.achievement ?? '-'}</TableCell>
                  <TableCell>
                    <Badge className={entry.status === 'active' ? 'bg-green-600' : entry.status === 'completed' ? 'bg-blue-600' : 'bg-amber-600'}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(entry)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteRecord(entry)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Add Participation Record</DialogTitle><DialogDescription>Create a new participation entry.</DialogDescription></DialogHeader>
          <ParticipationForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={createRecord}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Edit Participation</DialogTitle><DialogDescription>Update student participation details.</DialogDescription></DialogHeader>
          <ParticipationForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateRecord}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ParticipationForm({ form, setForm }: { form: ParticipationFormState; setForm: (value: ParticipationFormState) => void }) {
  const update = (field: keyof ParticipationFormState, value: string) => {
    setForm({ ...form, [field]: value } as ParticipationFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Student Name</Label><Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} /></div>
        <div className="space-y-2"><Label>Activity Name</Label><Input value={form.activityName} onChange={(e) => update('activityName', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2"><Label>Attendance %</Label><Input type="number" value={form.attendanceRate} onChange={(e) => update('attendanceRate', e.target.value)} /></div>
        <div className="space-y-2"><Label>Merit Points</Label><Input type="number" value={form.meritPoints} onChange={(e) => update('meritPoints', e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(value) => update('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Achievement</Label><Input value={form.achievement} onChange={(e) => update('achievement', e.target.value)} placeholder="Optional" /></div>
    </div>
  );
}
