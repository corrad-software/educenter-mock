'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { institutionalCalendarEvents } from '@/lib/mock-data/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EducationLevel, InstitutionalCalendarEvent, InstitutionalEventType } from '@/lib/types';

const typeColors: Record<string, string> = {
  academic: 'bg-blue-100 text-blue-700 border-blue-200',
  exam: 'bg-red-100 text-red-700 border-red-200',
  holiday: 'bg-green-100 text-green-700 border-green-200',
  co_curricular: 'bg-amber-100 text-amber-700 border-amber-200',
  inspection: 'bg-violet-100 text-violet-700 border-violet-200',
};

interface CalendarFormState {
  title: string;
  type: InstitutionalEventType;
  level: EducationLevel;
  centreName: string;
  startDate: string;
  endDate: string;
  owner: string;
  status: InstitutionalCalendarEvent['status'];
}

const defaultForm: CalendarFormState = {
  title: '',
  type: 'academic',
  level: 'primary',
  centreName: '',
  startDate: '',
  endDate: '',
  owner: '',
  status: 'upcoming',
};

export default function InstitutionalCalendarPage() {
  const [events, setEvents] = useState<InstitutionalCalendarEvent[]>(institutionalCalendarEvents);
  const [levelFilter, setLevelFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<InstitutionalCalendarEvent | null>(null);
  const [form, setForm] = useState<CalendarFormState>(defaultForm);

  const filteredEvents = useMemo(() => events.filter((event) => {
    return levelFilter === 'all' || event.level === levelFilter;
  }), [events, levelFilter]);

  const openAdd = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (event: InstitutionalCalendarEvent) => {
    setSelected(event);
    setForm({
      title: event.title,
      type: event.type,
      level: event.level,
      centreName: event.centreName,
      startDate: event.startDate,
      endDate: event.endDate,
      owner: event.owner,
      status: event.status,
    });
    setIsEditOpen(true);
  };

  const createEvent = () => {
    if (!form.title || !form.centreName || !form.startDate || !form.endDate) return;

    const newEvent: InstitutionalCalendarEvent = {
      id: `evt-${Date.now()}`,
      title: form.title,
      type: form.type,
      level: form.level,
      centreName: form.centreName,
      startDate: form.startDate,
      endDate: form.endDate,
      owner: form.owner,
      status: form.status,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setIsAddOpen(false);
  };

  const updateEvent = () => {
    if (!selected) return;

    setEvents((prev) => prev.map((event) => event.id === selected.id
      ? {
        ...event,
        title: form.title,
        type: form.type,
        level: form.level,
        centreName: form.centreName,
        startDate: form.startDate,
        endDate: form.endDate,
        owner: form.owner,
        status: form.status,
      }
      : event));

    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteEvent = (event: InstitutionalCalendarEvent) => {
    const confirmed = confirm(`Delete event ${event.title}?`);
    if (!confirmed) return;
    setEvents((prev) => prev.filter((item) => item.id !== event.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutional Calendar</h1>
          <p className="text-muted-foreground">Academic, holiday, co-curricular, exam, and inspection events by level.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Event</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar Events</CardTitle>
          <CardDescription>Centralized event timeline for operations and communication alignment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full md:w-[220px]">
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger><SelectValue placeholder="Filter level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="maiwp">MAIWP</SelectItem>
                <SelectItem value="preschool">Preschool</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="rounded-md border p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.centreName} • {event.startDate} to {event.endDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${typeColors[event.type]} capitalize`}>{event.type.replace('_', ' ')}</Badge>
                    <Badge className={event.status === 'ongoing' ? 'bg-blue-600' : event.status === 'upcoming' ? 'bg-emerald-600' : 'bg-slate-600'}>{event.status}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(event)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteEvent(event)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Owner: {event.owner} • Level: {event.level}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Add Calendar Event</DialogTitle><DialogDescription>Create a calendar item for institution planning.</DialogDescription></DialogHeader>
          <CalendarForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={createEvent}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit Calendar Event</DialogTitle><DialogDescription>Update event details and status.</DialogDescription></DialogHeader>
          <CalendarForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateEvent}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CalendarForm({ form, setForm }: { form: CalendarFormState; setForm: (value: CalendarFormState) => void }) {
  const update = (field: keyof CalendarFormState, value: string) => {
    setForm({ ...form, [field]: value } as CalendarFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => update('title', e.target.value)} /></div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(value) => update('type', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="holiday">Holiday</SelectItem>
              <SelectItem value="co_curricular">Co-Curricular</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Level</Label>
          <Select value={form.level} onValueChange={(value) => update('level', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="maiwp">MAIWP</SelectItem>
              <SelectItem value="preschool">Preschool</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="university">University</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(value) => update('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Centre</Label><Input value={form.centreName} onChange={(e) => update('centreName', e.target.value)} /></div>
        <div className="space-y-2"><Label>Owner</Label><Input value={form.owner} onChange={(e) => update('owner', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} /></div>
        <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} /></div>
      </div>
    </div>
  );
}
