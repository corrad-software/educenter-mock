'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle2, Clock, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { complaintRecords } from '@/lib/mock-data/complaints';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ComplaintPriority, ComplaintRecord, ComplaintStatus } from '@/lib/types';

const statusStyles: Record<ComplaintStatus, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  investigating: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityStyles: Record<ComplaintPriority, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

interface ComplaintFormState {
  studentName: string;
  centreName: string;
  category: ComplaintRecord['category'];
  subject: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedTo: string;
  channel: ComplaintRecord['channel'];
  dueDate: string;
}

const defaultForm: ComplaintFormState = {
  studentName: '',
  centreName: '',
  category: 'other',
  subject: '',
  description: '',
  priority: 'medium',
  status: 'new',
  assignedTo: '',
  channel: 'portal',
  dueDate: format(new Date(), 'yyyy-MM-dd'),
};

export default function ComplaintsPage() {
  const [records, setRecords] = useState<ComplaintRecord[]>(complaintRecords);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<ComplaintRecord | null>(null);
  const [form, setForm] = useState<ComplaintFormState>(defaultForm);

  const filtered = useMemo(() => records.filter((record) => {
    const query = search.trim().toLowerCase();
    const matchesQuery = query.length === 0
      || record.referenceNo.toLowerCase().includes(query)
      || record.studentName.toLowerCase().includes(query)
      || record.subject.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [records, search, statusFilter]);

  const totals = {
    total: records.length,
    open: records.filter((c) => c.status === 'new' || c.status === 'investigating').length,
    overdue: records.filter((c) => c.status !== 'resolved' && c.status !== 'closed' && c.dueAt < new Date()).length,
    resolved: records.filter((c) => c.status === 'resolved' || c.status === 'closed').length,
  };

  const openAddDialog = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEditDialog = (record: ComplaintRecord) => {
    setSelected(record);
    setForm({
      studentName: record.studentName,
      centreName: record.centreName,
      category: record.category,
      subject: record.subject,
      description: record.description,
      priority: record.priority,
      status: record.status,
      assignedTo: record.assignedTo,
      channel: record.channel,
      dueDate: format(record.dueAt, 'yyyy-MM-dd'),
    });
    setIsEditOpen(true);
  };

  const createRecord = () => {
    if (!form.studentName || !form.subject || !form.assignedTo) return;

    const nextNumber = String(records.length + 1).padStart(4, '0');
    const now = new Date();
    const newRecord: ComplaintRecord = {
      id: `cmp-${Date.now()}`,
      referenceNo: `CMP-${now.getFullYear()}-${nextNumber}`,
      studentId: 'n/a',
      studentName: form.studentName,
      centreName: form.centreName || 'Not Assigned',
      category: form.category,
      subject: form.subject,
      description: form.description,
      submittedBy: 'UI Demo User',
      channel: form.channel,
      status: form.status,
      priority: form.priority,
      assignedTo: form.assignedTo,
      submittedAt: now,
      dueAt: new Date(`${form.dueDate}T17:00:00`),
      resolvedAt: form.status === 'resolved' || form.status === 'closed' ? now : undefined,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsAddOpen(false);
  };

  const updateRecord = () => {
    if (!selected) return;

    setRecords((prev) => prev.map((record) => {
      if (record.id !== selected.id) return record;
      const resolvedAt = form.status === 'resolved' || form.status === 'closed' ? (record.resolvedAt ?? new Date()) : undefined;
      return {
        ...record,
        studentName: form.studentName,
        centreName: form.centreName,
        category: form.category,
        subject: form.subject,
        description: form.description,
        priority: form.priority,
        status: form.status,
        assignedTo: form.assignedTo,
        channel: form.channel,
        dueAt: new Date(`${form.dueDate}T17:00:00`),
        resolvedAt,
      };
    }));

    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteRecord = (record: ComplaintRecord) => {
    const confirmed = confirm(`Delete complaint ${record.referenceNo}?`);
    if (!confirmed) return;
    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
          <p className="text-muted-foreground">Track, assign, and resolve parent and student complaints with SLA visibility.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/complaints/new">
            <Button variant="outline">New Page Form</Button>
          </Link>
          <Button className="gap-2" onClick={openAddDialog}>
            <Plus className="h-4 w-4" />
            Add Complaint
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Total</CardDescription><CardTitle>{totals.total}</CardTitle></CardHeader><CardContent><FileText className="h-4 w-4 text-muted-foreground" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Open Cases</CardDescription><CardTitle>{totals.open}</CardTitle></CardHeader><CardContent><Clock className="h-4 w-4 text-amber-600" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Overdue SLA</CardDescription><CardTitle>{totals.overdue}</CardTitle></CardHeader><CardContent><AlertTriangle className="h-4 w-4 text-red-600" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Resolved</CardDescription><CardTitle>{totals.resolved}</CardTitle></CardHeader><CardContent><CheckCircle2 className="h-4 w-4 text-green-600" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Register</CardTitle>
          <CardDescription>Filter by status and search by reference, student, or subject.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" placeholder="Search complaints..." />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]"><SelectValue placeholder="All status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.referenceNo}</TableCell>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell className="capitalize">{record.category}</TableCell>
                  <TableCell><Badge variant="outline" className={statusStyles[record.status]}>{record.status}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={priorityStyles[record.priority]}>{record.priority}</Badge></TableCell>
                  <TableCell>{format(record.dueAt, 'dd MMM yyyy')}</TableCell>
                  <TableCell>{record.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {complaintRecords.some((seed) => seed.id === record.id) ? (
                        <Link href={`/admin/complaints/${record.id}`}><Button size="sm" variant="outline">View</Button></Link>
                      ) : (
                        <Button size="sm" variant="outline" disabled>View</Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(record)}><Pencil className="h-4 w-4" /></Button>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Complaint</DialogTitle>
            <DialogDescription>Create a new complaint in demo mode.</DialogDescription>
          </DialogHeader>
          <ComplaintForm form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={createRecord}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Complaint</DialogTitle>
            <DialogDescription>Update complaint details and status.</DialogDescription>
          </DialogHeader>
          <ComplaintForm form={form} setForm={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={updateRecord}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ComplaintForm({ form, setForm }: { form: ComplaintFormState; setForm: (value: ComplaintFormState) => void }) {
  const update = (field: keyof ComplaintFormState, value: string) => {
    setForm({ ...form, [field]: value } as ComplaintFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Student Name</Label><Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} /></div>
        <div className="space-y-2"><Label>Centre Name</Label><Input value={form.centreName} onChange={(e) => update('centreName', e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Subject</Label><Input value={form.subject} onChange={(e) => update('subject', e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="min-h-24" /></div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(value) => update('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={form.priority} onValueChange={(value) => update('priority', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Channel</Label>
          <Select value={form.channel} onValueChange={(value) => update('channel', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="portal">Portal</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="walk_in">Walk In</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Assigned To</Label><Input value={form.assignedTo} onChange={(e) => update('assignedTo', e.target.value)} /></div>
        <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></div>
      </div>
    </div>
  );
}
