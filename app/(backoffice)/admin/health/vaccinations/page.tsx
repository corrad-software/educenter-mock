'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { vaccinationRecords } from '@/lib/mock-data/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { VaccinationRecord } from '@/lib/types';

interface VaccinationFormState {
  studentName: string;
  vaccine: string;
  dose: string;
  dueDate: string;
  status: VaccinationRecord['status'];
}

const defaultForm: VaccinationFormState = {
  studentName: '',
  vaccine: '',
  dose: '',
  dueDate: '',
  status: 'due_soon',
};

export default function HealthVaccinationsPage() {
  const [records, setRecords] = useState<VaccinationRecord[]>(vaccinationRecords);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<VaccinationRecord | null>(null);
  const [form, setForm] = useState<VaccinationFormState>(defaultForm);

  const openAdd = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (record: VaccinationRecord) => {
    setSelected(record);
    setForm({
      studentName: record.studentName,
      vaccine: record.vaccine,
      dose: record.dose,
      dueDate: record.dueDate,
      status: record.status,
    });
    setIsEditOpen(true);
  };

  const createRecord = () => {
    if (!form.studentName || !form.vaccine || !form.dose || !form.dueDate) return;

    const newRecord: VaccinationRecord = {
      id: `vac-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      studentName: form.studentName,
      vaccine: form.vaccine,
      dose: form.dose,
      dueDate: form.dueDate,
      status: form.status,
      lastUpdatedAt: new Date(),
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
        vaccine: form.vaccine,
        dose: form.dose,
        dueDate: form.dueDate,
        status: form.status,
        lastUpdatedAt: new Date(),
      }
      : record));

    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteRecord = (record: VaccinationRecord) => {
    const confirmed = confirm(`Delete vaccination record for ${record.studentName}?`);
    if (!confirmed) return;
    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vaccination Tracker</h1>
          <p className="text-muted-foreground">Track due, overdue, and up-to-date vaccination statuses.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Vaccination</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vaccination Register</CardTitle>
          <CardDescription>Dose schedules and compliance status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Vaccine</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.studentName}</TableCell>
                  <TableCell>{record.vaccine}</TableCell>
                  <TableCell>{record.dose}</TableCell>
                  <TableCell>{record.dueDate}</TableCell>
                  <TableCell>
                    <Badge className={record.status === 'up_to_date' ? 'bg-green-600' : record.status === 'due_soon' ? 'bg-amber-600' : 'bg-red-600'}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(record)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteRecord(record)}><Trash2 className="h-4 w-4" /></Button>
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
          <DialogHeader><DialogTitle>Add Vaccination Record</DialogTitle><DialogDescription>Create a vaccination schedule entry.</DialogDescription></DialogHeader>
          <VaccinationForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={createRecord}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Edit Vaccination Record</DialogTitle><DialogDescription>Update vaccination details and status.</DialogDescription></DialogHeader>
          <VaccinationForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateRecord}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VaccinationForm({ form, setForm }: { form: VaccinationFormState; setForm: (value: VaccinationFormState) => void }) {
  const update = (field: keyof VaccinationFormState, value: string) => {
    setForm({ ...form, [field]: value } as VaccinationFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="space-y-2"><Label>Student Name</Label><Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Vaccine</Label><Input value={form.vaccine} onChange={(e) => update('vaccine', e.target.value)} /></div>
        <div className="space-y-2"><Label>Dose</Label><Input value={form.dose} onChange={(e) => update('dose', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(value) => update('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="up_to_date">Up To Date</SelectItem>
              <SelectItem value="due_soon">Due Soon</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
