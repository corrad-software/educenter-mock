'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useEducationStore } from '@/lib/store/education-store';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';

export default function NewApplicationPage() {
  const { selectedLevel } = useEducationStore();
  const level = selectedLevel ?? 'primary';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    ic: '',
    dateOfBirth: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    centreId: '',
    subsidyCategory: '',
    notes: '',
  });

  // Get unique centres for the selected level
  const levelStudents = level === 'maiwp'
    ? malaysianStudents
    : malaysianStudents.filter(s => s.educationLevel === level);

  const centres = Array.from(
    new Map(levelStudents.map(s => [s.centreId, { id: s.centreId, name: s.centre.name }])).values()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600">Application Submitted!</h3>
              <p className="text-muted-foreground mt-2">
                The application for <strong>{formData.studentName}</strong> has been submitted successfully.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                It will be reviewed by the centre administrator.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <Link href="/admin/students/applications">
                <Button variant="outline">Back to Applications</Button>
              </Link>
              <Button onClick={() => { setSubmitted(false); setFormData({ studentName: '', ic: '', dateOfBirth: '', guardianName: '', guardianPhone: '', guardianEmail: '', centreId: '', subsidyCategory: '', notes: '' }); }}>
                New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/students/applications">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">New Application</h1>
          <p className="text-muted-foreground mt-1">Internal assisted entry form (self-service uses <span className="font-mono">/register</span>)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Muhammad Ali bin Ahmad"
                  value={formData.studentName}
                  onChange={e => updateField('studentName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IC Number *</label>
                <Input
                  required
                  placeholder="e.g. 120102-14-1234"
                  value={formData.ic}
                  onChange={e => updateField('ic', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth *</label>
                <Input
                  required
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={e => updateField('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Guardian Name *</label>
                <Input
                  required
                  placeholder="e.g. Ahmad bin Hassan"
                  value={formData.guardianName}
                  onChange={e => updateField('guardianName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <Input
                  required
                  placeholder="e.g. +60123456789"
                  value={formData.guardianPhone}
                  onChange={e => updateField('guardianPhone', e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Email Address *</label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. ahmad@email.com"
                  value={formData.guardianEmail}
                  onChange={e => updateField('guardianEmail', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Placement & Subsidy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Centre / Institution *</label>
                <Select value={formData.centreId} onValueChange={v => updateField('centreId', v)}>
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
                <Select value={formData.subsidyCategory} onValueChange={v => updateField('subsidyCategory', v)}>
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
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={e => updateField('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Link href="/admin/students/applications">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={!formData.studentName || !formData.ic || !formData.guardianName || !formData.centreId || !formData.subsidyCategory}>
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
}
