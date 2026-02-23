'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, HeartPulse, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { healthIncidents, healthProfiles, vaccinationRecords } from '@/lib/mock-data/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { StudentHealthProfile } from '@/lib/types';

interface ProfileFormState {
  studentName: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  emergencyContact: string;
  lastScreeningDate: string;
}

const defaultForm: ProfileFormState = {
  studentName: '',
  bloodType: '',
  allergies: '',
  chronicConditions: '',
  emergencyContact: '',
  lastScreeningDate: '',
};

export default function HealthOverviewPage() {
  const [profiles, setProfiles] = useState<StudentHealthProfile[]>(healthProfiles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<StudentHealthProfile | null>(null);
  const [form, setForm] = useState<ProfileFormState>(defaultForm);

  const highIncidents = healthIncidents.filter((item) => item.severity === 'high').length;
  const overdueVaccines = vaccinationRecords.filter((item) => item.status === 'overdue').length;

  const openAdd = () => {
    setForm(defaultForm);
    setIsAddOpen(true);
  };

  const openEdit = (profile: StudentHealthProfile) => {
    setSelected(profile);
    setForm({
      studentName: profile.studentName,
      bloodType: profile.bloodType,
      allergies: profile.allergies.join(', '),
      chronicConditions: profile.chronicConditions.join(', '),
      emergencyContact: profile.emergencyContact,
      lastScreeningDate: profile.lastScreeningDate,
    });
    setIsEditOpen(true);
  };

  const createProfile = () => {
    if (!form.studentName || !form.bloodType) return;

    const newProfile: StudentHealthProfile = {
      studentId: `hp-${Date.now()}`,
      studentName: form.studentName,
      bloodType: form.bloodType,
      allergies: splitCsv(form.allergies),
      chronicConditions: splitCsv(form.chronicConditions),
      emergencyContact: form.emergencyContact,
      lastScreeningDate: form.lastScreeningDate,
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setIsAddOpen(false);
  };

  const updateProfile = () => {
    if (!selected) return;

    setProfiles((prev) => prev.map((profile) => profile.studentId === selected.studentId
      ? {
        ...profile,
        studentName: form.studentName,
        bloodType: form.bloodType,
        allergies: splitCsv(form.allergies),
        chronicConditions: splitCsv(form.chronicConditions),
        emergencyContact: form.emergencyContact,
        lastScreeningDate: form.lastScreeningDate,
      }
      : profile));

    setIsEditOpen(false);
    setSelected(null);
  };

  const deleteProfile = (profile: StudentHealthProfile) => {
    const confirmed = confirm(`Delete health profile for ${profile.studentName}?`);
    if (!confirmed) return;
    setProfiles((prev) => prev.filter((item) => item.studentId !== profile.studentId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Health Overview</h1>
          <p className="text-muted-foreground">Health profiles, incident records, and vaccination tracking.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/health/incidents"><Button variant="outline">Incidents</Button></Link>
          <Link href="/admin/health/vaccinations"><Button variant="outline">Vaccinations</Button></Link>
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Profile</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardDescription>Profiles</CardDescription><CardTitle>{profiles.length}</CardTitle></CardHeader><CardContent><HeartPulse className="h-4 w-4 text-blue-600" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>High Severity Incidents</CardDescription><CardTitle>{highIncidents}</CardTitle></CardHeader><CardContent><AlertTriangle className="h-4 w-4 text-red-600" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Overdue Vaccinations</CardDescription><CardTitle>{overdueVaccines}</CardTitle></CardHeader><CardContent><ShieldCheck className="h-4 w-4 text-amber-600" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Profiles</CardTitle>
          <CardDescription>Manage profile data and open student health records.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {profiles.map((profile) => (
            <div key={profile.studentId} className="rounded-md border p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{profile.studentName}</p>
                <p className="text-sm text-muted-foreground">Blood group {profile.bloodType} • Last screening {profile.lastScreeningDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Allergies: {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}</p>
                {healthProfiles.some((seed) => seed.studentId === profile.studentId) ? (
                  <Link href={`/admin/health/students/${profile.studentId}`}><Button size="sm" variant="outline">View</Button></Link>
                ) : (
                  <Button size="sm" variant="outline" disabled>View</Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => openEdit(profile)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteProfile(profile)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Add Health Profile</DialogTitle><DialogDescription>Create a student health profile.</DialogDescription></DialogHeader>
          <ProfileForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={createProfile}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Edit Health Profile</DialogTitle><DialogDescription>Update profile details.</DialogDescription></DialogHeader>
          <ProfileForm form={form} setForm={setForm} />
          <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={updateProfile}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function splitCsv(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function ProfileForm({ form, setForm }: { form: ProfileFormState; setForm: (value: ProfileFormState) => void }) {
  const update = (field: keyof ProfileFormState, value: string) => {
    setForm({ ...form, [field]: value } as ProfileFormState);
  };

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Student Name</Label><Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} /></div>
        <div className="space-y-2"><Label>Blood Type</Label><Input value={form.bloodType} onChange={(e) => update('bloodType', e.target.value)} placeholder="A+, O+, etc." /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Allergies (comma separated)</Label><Input value={form.allergies} onChange={(e) => update('allergies', e.target.value)} /></div>
        <div className="space-y-2"><Label>Chronic Conditions (comma separated)</Label><Input value={form.chronicConditions} onChange={(e) => update('chronicConditions', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Emergency Contact</Label><Input value={form.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} /></div>
        <div className="space-y-2"><Label>Last Screening Date</Label><Input type="date" value={form.lastScreeningDate} onChange={(e) => update('lastScreeningDate', e.target.value)} /></div>
      </div>
    </div>
  );
}
