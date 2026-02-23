'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { cocurricularActivities } from '@/lib/mock-data/cocurricular';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CoCurricularActivity, CoCurricularType } from '@/lib/types';

interface ActivityFormState {
  code: string;
  name: string;
  type: CoCurricularType;
  centreName: string;
  coach: string;
  schedule: string;
  maxParticipants: string;
  activeParticipants: string;
  status: CoCurricularActivity['status'];
}

const defaultForm: ActivityFormState = {
  code: '',
  name: '',
  type: 'club',
  centreName: '',
  coach: '',
  schedule: '',
  maxParticipants: '30',
  activeParticipants: '0',
  status: 'planned',
};

export default function CocurricularActivitiesPage() {
  const [activities, setActivities] = useState<CoCurricularActivity[]>(cocurricularActivities);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<CoCurricularActivity | null>(null);
  const [form, setForm] = useState<ActivityFormState>(defaultForm);

  const openAdd = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (activity: CoCurricularActivity) => {
    setSelected(activity);
    setForm({
      code: activity.code,
      name: activity.name,
      type: activity.type,
      centreName: activity.centreName,
      coach: activity.coach,
      schedule: activity.schedule,
      maxParticipants: String(activity.maxParticipants),
      activeParticipants: String(activity.activeParticipants),
      status: activity.status,
    });
    setIsEditOpen(true);
  };

  const createActivity = () => {
    if (!form.code || !form.name || !form.centreName) return;

    const newRecord: CoCurricularActivity = {
      id: `cca-${Date.now()}`,
      code: form.code,
      name: form.name,
      type: form.type,
      centreName: form.centreName,
      coach: form.coach,
      schedule: form.schedule,
      maxParticipants: Number(form.maxParticipants) || 0,
      activeParticipants: Number(form.activeParticipants) || 0,
      status: form.status,
    };

    setActivities((prev) => [newRecord, ...prev]);
    setIsAddOpen(false);
  };

  const updateActivity = () => {
    if (!selected) return;
    setActivities((prev) => prev.map((activity) => activity.id === selected.id
      ? {
        ...activity,
        code: form.code,
        name: form.name,
        type: form.type,
        centreName: form.centreName,
        coach: form.coach,
        schedule: form.schedule,
        maxParticipants: Number(form.maxParticipants) || 0,
        activeParticipants: Number(form.activeParticipants) || 0,
        status: form.status,
      }
      : activity));
    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteActivity = (activity: CoCurricularActivity) => {
    const confirmed = confirm(`Delete activity ${activity.name}?`);
    if (!confirmed) return;
    setActivities((prev) => prev.filter((item) => item.id !== activity.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Catalog</h1>
          <p className="text-muted-foreground">Configure and review co-curricular activity offerings by centre.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Activity</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>Manage activity setup, ownership, and participant capacity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="rounded-md border p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{activity.name} <span className="text-xs text-muted-foreground">({activity.code})</span></p>
                  <p className="text-sm text-muted-foreground">{activity.centreName} • Coach: {activity.coach}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                  <Badge className={activity.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>{activity.status}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(activity)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteActivity(activity)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="mt-2 text-sm">Schedule: {activity.schedule}</p>
              <p className="text-sm text-muted-foreground">Capacity: {activity.activeParticipants}/{activity.maxParticipants}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Add Activity</DialogTitle><DialogDescription>Create new co-curricular activity.</DialogDescription></DialogHeader>
          <ActivityForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={createActivity}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit Activity</DialogTitle><DialogDescription>Update activity details.</DialogDescription></DialogHeader>
          <ActivityForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateActivity}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ActivityForm({ form, setForm }: { form: ActivityFormState; setForm: (value: ActivityFormState) => void }) {
  const update = (field: keyof ActivityFormState, value: string) => {
    setForm({ ...form, [field]: value } as ActivityFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Code</Label><Input value={form.code} onChange={(e) => update('code', e.target.value)} /></div>
        <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(value) => update('type', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="uniformed">Uniformed</SelectItem>
              <SelectItem value="club">Club</SelectItem>
              <SelectItem value="religious">Religious</SelectItem>
              <SelectItem value="arts">Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Centre</Label><Input value={form.centreName} onChange={(e) => update('centreName', e.target.value)} /></div>
        <div className="space-y-2"><Label>Coach</Label><Input value={form.coach} onChange={(e) => update('coach', e.target.value)} /></div>
      </div>
      <div className="space-y-2"><Label>Schedule</Label><Input value={form.schedule} onChange={(e) => update('schedule', e.target.value)} /></div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2"><Label>Max Participants</Label><Input type="number" value={form.maxParticipants} onChange={(e) => update('maxParticipants', e.target.value)} /></div>
        <div className="space-y-2"><Label>Active Participants</Label><Input type="number" value={form.activeParticipants} onChange={(e) => update('activeParticipants', e.target.value)} /></div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(value) => update('status', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
