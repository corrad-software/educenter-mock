'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle2, FileUp } from 'lucide-react';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import type { EducationLevel, SubsidyCategory } from '@/lib/types';

const REQUIRED_DOCS = [
  { key: 'birth_cert', label: 'Sijil Kelahiran' },
  { key: 'student_ic', label: 'IC Pelajar / MyKid' },
  { key: 'guardian_ic', label: 'IC Penjaga' },
  { key: 'address_proof', label: 'Bukti Alamat' },
] as const;

type SubmitResult = {
  applicationRef: string;
  status: string;
};

export default function SelfServiceRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<SubmitResult | null>(null);

  const [form, setForm] = useState({
    studentName: '',
    ic: '',
    dateOfBirth: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianIc: '',
    centreId: '',
    educationLevel: 'primary' as EducationLevel,
    subsidyCategory: 'B40' as SubsidyCategory,
    notes: '',
  });

  const centres = useMemo(() => {
    const filtered = malaysianStudents.filter((s) => form.educationLevel === 'maiwp' || s.educationLevel === form.educationLevel);
    return Array.from(new Map(filtered.map((s) => [s.centreId, { id: s.centreId, name: s.centre.name }])).values());
  }, [form.educationLevel]);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData(event.currentTarget);
      payload.set('educationLevel', form.educationLevel);
      payload.set('subsidyCategory', form.subsidyCategory);

      const selectedCentre = centres.find((c) => c.id === form.centreId);
      payload.set('centreName', selectedCentre?.name ?? '');

      const response = await fetch('/api/register/applications', {
        method: 'POST',
        body: payload,
      });

      const json = await response.json() as { error?: string; applicationRef: string; status: string };
      if (!response.ok) {
        setError(json.error ?? 'Tidak dapat menghantar pendaftaran.');
        return;
      }

      setResult({ applicationRef: json.applicationRef, status: json.status });
      event.currentTarget.reset();
      setForm((prev) => ({ ...prev, studentName: '', ic: '', dateOfBirth: '', guardianName: '', guardianPhone: '', guardianEmail: '', guardianIc: '', centreId: '', notes: '' }));
    } catch {
      setError('Tidak dapat menghantar pendaftaran. Sila cuba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Pendaftaran Berjaya Dihantar</h1>
              <p className="text-muted-foreground">Sila simpan nombor rujukan anda untuk semakan status.</p>
              <div className="rounded-lg border bg-slate-50 p-4 inline-block text-left">
                <p><span className="text-muted-foreground">Rujukan:</span> <span className="font-bold font-mono">{result.applicationRef}</span></p>
                <p><span className="text-muted-foreground">Status:</span> <span className="font-semibold uppercase">{result.status.replace('_', ' ')}</span></p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-4">
                <Link href="/register/status"><Button>Semak Status Permohonan</Button></Link>
                <Button variant="outline" onClick={() => setResult(null)}>Hantar Permohonan Baharu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Image
              src="/images/logomw.png"
              alt="Logo MW"
              width={160}
              height={160}
              className="h-12 w-auto mb-3"
              unoptimized
            />
            <h1 className="text-3xl font-bold tracking-tight">Pendaftaran Pelajar Layan Diri</h1>
            <p className="text-muted-foreground">Hantar permohonan pelajar baharu dan muat naik dokumen sokongan yang diperlukan.</p>
          </div>
          <Link href="/register/status"><Button variant="outline">Semak Status</Button></Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maklumat Pelajar</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Pelajar *</Label><Input name="studentName" value={form.studentName} onChange={(e) => updateForm('studentName', e.target.value)} required /></div>
              <div className="space-y-2"><Label>IC Pelajar / MyKid *</Label><Input name="ic" value={form.ic} onChange={(e) => updateForm('ic', e.target.value)} required /></div>
              <div className="space-y-2"><Label>Tarikh Lahir *</Label><Input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={(e) => updateForm('dateOfBirth', e.target.value)} required /></div>
              <div className="space-y-2"><Label>Tahap Pendidikan *</Label>
                <Select value={form.educationLevel} onValueChange={(value) => updateForm('educationLevel', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preschool">Prasekolah</SelectItem>
                    <SelectItem value="primary">Rendah</SelectItem>
                    <SelectItem value="secondary">Menengah</SelectItem>
                    <SelectItem value="university">Universiti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maklumat Penjaga</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Penjaga *</Label><Input name="guardianName" value={form.guardianName} onChange={(e) => updateForm('guardianName', e.target.value)} required /></div>
              <div className="space-y-2"><Label>IC Penjaga *</Label><Input name="guardianIc" value={form.guardianIc} onChange={(e) => updateForm('guardianIc', e.target.value)} required /></div>
              <div className="space-y-2"><Label>No. Telefon *</Label><Input name="guardianPhone" value={form.guardianPhone} onChange={(e) => updateForm('guardianPhone', e.target.value)} required /></div>
              <div className="space-y-2"><Label>Emel *</Label><Input type="email" name="guardianEmail" value={form.guardianEmail} onChange={(e) => updateForm('guardianEmail', e.target.value)} required /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Penempatan & Subsidi</CardTitle>
              <CardDescription>Pilih pusat pilihan dan kategori subsidi.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Pusat *</Label>
                <Select value={form.centreId} onValueChange={(value) => updateForm('centreId', value)}>
                  <SelectTrigger><SelectValue placeholder="Pilih pusat" /></SelectTrigger>
                  <SelectContent>
                    {centres.map((centre) => (
                      <SelectItem key={centre.id} value={centre.id}>{centre.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="centreId" value={form.centreId} />
              </div>
              <div className="space-y-2"><Label>Kategori Subsidi *</Label>
                <Select value={form.subsidyCategory} onValueChange={(value) => updateForm('subsidyCategory', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B40">B40</SelectItem>
                    <SelectItem value="M40">M40</SelectItem>
                    <SelectItem value="T20">T20</SelectItem>
                    <SelectItem value="Asnaf">Asnaf</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Catatan</Label><Input name="notes" value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileUp className="h-4 w-4" />Dokumen Sokongan Wajib</CardTitle>
              <CardDescription>Semua jenis fail diterima, maksimum 10MB setiap fail.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REQUIRED_DOCS.map((doc) => (
                <div key={doc.key} className="space-y-2">
                  <Label>{doc.label} *</Label>
                  <Input type="file" name={doc.key} required />
                </div>
              ))}
              <div className="space-y-2 md:col-span-2">
                <Label>Dokumen Sokongan Lain (Pilihan)</Label>
                <Input type="file" name="other" />
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={submitting}>{submitting ? 'Menghantar...' : 'Hantar Pendaftaran'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
