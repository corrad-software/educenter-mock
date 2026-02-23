'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { healthIncidents } from '@/lib/mock-data/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { HealthIncidentRecord } from '@/lib/types';

interface IncidentFormState {
  studentName: string;
  centreName: string;
  severity: HealthIncidentRecord['severity'];
  incidentType: HealthIncidentRecord['incidentType'];
  notes: string;
  actionTaken: string;
}

const defaultForm: IncidentFormState = {
  studentName: '',
  centreName: '',
  severity: 'low',
  incidentType: 'other',
  notes: '',
  actionTaken: '',
};

export default function HealthIncidentsPage() {
  const [records, setRecords] = useState<HealthIncidentRecord[]>(healthIncidents);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<HealthIncidentRecord | null>(null);
  const [form, setForm] = useState<IncidentFormState>(defaultForm);

  const openAdd = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (record: HealthIncidentRecord) => {
    setSelected(record);
    setForm({
      studentName: record.studentName,
      centreName: record.centreName,
      severity: record.severity,
      incidentType: record.incidentType,
      notes: record.notes,
      actionTaken: record.actionTaken,
    });
    setIsEditOpen(true);
  };

  const createRecord = () => {
    if (!form.studentName || !form.centreName || !form.notes) return;

    const newRecord: HealthIncidentRecord = {
      id: `hinc-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      studentName: form.studentName,
      centreName: form.centreName,
      severity: form.severity,
      incidentType: form.incidentType,
      notes: form.notes,
      actionTaken: form.actionTaken,
      occurredAt: new Date(),
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
        centreName: form.centreName,
        severity: form.severity,
        incidentType: form.incidentType,
        notes: form.notes,
        actionTaken: form.actionTaken,
      }
      : record));

    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteRecord = (record: HealthIncidentRecord) => {
    const confirmed = confirm(`Delete incident for ${record.studentName}?`);
    if (!confirmed) return;
    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Incident Log</h1>
          <p className="text-muted-foreground">Incident registry for monitoring safety and medical follow-up actions.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Incident</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Register</CardTitle>
          <CardDescription>Severity, action taken, and timestamps.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.studentName}</TableCell>
                  <TableCell>{incident.centreName}</TableCell>
                  <TableCell className="capitalize">{incident.incidentType}</TableCell>
                  <TableCell>
                    <Badge className={incident.severity === 'high' ? 'bg-red-600' : incident.severity === 'medium' ? 'bg-amber-600' : 'bg-blue-600'}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.actionTaken}</TableCell>
                  <TableCell>{format(incident.occurredAt, 'dd MMM yyyy, hh:mm a')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(incident)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteRecord(incident)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Add Incident</DialogTitle><DialogDescription>Create a new health incident entry.</DialogDescription></DialogHeader>
          <IncidentForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={createRecord}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit Incident</DialogTitle><DialogDescription>Update incident details.</DialogDescription></DialogHeader>
          <IncidentForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateRecord}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IncidentForm({ form, setForm }: { form: IncidentFormState; setForm: (value: IncidentFormState) => void }) {
  const update = (field: keyof IncidentFormState, value: string) => {
    setForm({ ...form, [field]: value } as IncidentFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Student Name</Label><Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} /></div>
        <div className="space-y-2"><Label>Centre</Label><Input value={form.centreName} onChange={(e) => update('centreName', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Incident Type</Label>
          <Select value={form.incidentType} onValueChange={(value) => update('incidentType', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="injury">Injury</SelectItem>
              <SelectItem value="illness">Illness</SelectItem>
              <SelectItem value="allergy">Allergy</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Severity</Label>
          <Select value={form.severity} onValueChange={(value) => update('severity', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="min-h-20" /></div>
      <div className="space-y-2"><Label>Action Taken</Label><Textarea value={form.actionTaken} onChange={(e) => update('actionTaken', e.target.value)} className="min-h-20" /></div>
    </div>
  );
}
