'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, FileUp, MapPin, User, Users } from 'lucide-react';
import { malaysianStudents } from '@/lib/mock-data/malaysian-students';
import type { EducationLevel, SubsidyCategory } from '@/lib/types';

const REQUIRED_DOCS = [
  { key: 'birth_cert', label: 'Sijil Kelahiran' },
  { key: 'student_ic', label: 'IC Pelajar / MyKid' },
  { key: 'guardian_ic', label: 'IC Penjaga' },
  { key: 'address_proof', label: 'Bukti Alamat' },
] as const;

type RequiredDocKey = (typeof REQUIRED_DOCS)[number]['key'];

type SubmitResult = {
  applicationRef: string;
  status: string;
};

type WizardStep = 0 | 1 | 2 | 3;

const STEP_META = [
  { title: 'Maklumat Pelajar', icon: User },
  { title: 'Maklumat Penjaga & Penempatan', icon: MapPin },
  { title: 'Dokumen Sokongan', icon: FileUp },
  { title: 'Semakan Akhir', icon: Eye },
] as const;

export default function SelfServiceRegisterPage() {
  const [step, setStep] = useState<WizardStep>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
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

  const [requiredFiles, setRequiredFiles] = useState<Record<RequiredDocKey, File | null>>({
    birth_cert: null,
    student_ic: null,
    guardian_ic: null,
    address_proof: null,
  });
  const [otherFile, setOtherFile] = useState<File | null>(null);

  const centres = useMemo(() => {
    const filtered = malaysianStudents.filter((s) => form.educationLevel === 'maiwp' || s.educationLevel === form.educationLevel);
    return Array.from(new Map(filtered.map((s) => [s.centreId, { id: s.centreId, name: s.centre.name }])).values());
  }, [form.educationLevel]);

  const selectedCentre = centres.find((c) => c.id === form.centreId);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'educationLevel') {
        next.centreId = '';
      }
      return next;
    });
  };

  const validateStep = (targetStep: WizardStep) => {
    if (targetStep === 0) {
      return Boolean(form.studentName && form.ic && form.dateOfBirth && form.educationLevel);
    }
    if (targetStep === 1) {
      return Boolean(
        form.guardianName && form.guardianIc && form.guardianPhone && form.guardianEmail &&
        form.centreId && form.subsidyCategory
      );
    }
    if (targetStep === 2) {
      return REQUIRED_DOCS.every((doc) => requiredFiles[doc.key]);
    }
    return true;
  };

  const goNext = () => {
    setError('');
    if (!validateStep(step)) {
      setError('Sila lengkapkan maklumat wajib sebelum meneruskan ke langkah seterusnya.');
      return;
    }
    setStep((prev) => Math.min(3, prev + 1) as WizardStep);
  };

  const goBack = () => {
    setError('');
    setStep((prev) => Math.max(0, prev - 1) as WizardStep);
  };

  const handleRequiredFileChange = (key: RequiredDocKey, file: File | null) => {
    setRequiredFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.set('studentName', form.studentName);
      payload.set('ic', form.ic);
      payload.set('dateOfBirth', form.dateOfBirth);
      payload.set('guardianName', form.guardianName);
      payload.set('guardianPhone', form.guardianPhone);
      payload.set('guardianEmail', form.guardianEmail);
      payload.set('guardianIc', form.guardianIc);
      payload.set('centreId', form.centreId);
      payload.set('centreName', selectedCentre?.name ?? '');
      payload.set('educationLevel', form.educationLevel);
      payload.set('subsidyCategory', form.subsidyCategory);
      payload.set('notes', form.notes);

      for (const doc of REQUIRED_DOCS) {
        const file = requiredFiles[doc.key];
        if (!file) {
          setError(`Dokumen wajib tiada: ${doc.label}`);
          setSubmitting(false);
          return;
        }
        payload.append(doc.key, file);
      }

      if (otherFile) {
        payload.append('other', otherFile);
      }

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
      setStep(0);
      setRequiredFiles({ birth_cert: null, student_ic: null, guardian_ic: null, address_proof: null });
      setOtherFile(null);
      setForm({
        studentName: '',
        ic: '',
        dateOfBirth: '',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: '',
        guardianIc: '',
        centreId: '',
        educationLevel: 'primary',
        subsidyCategory: 'B40',
        notes: '',
      });
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
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1b44] via-[#16306a] to-[#0f1b44]" />
        <div className="absolute -top-28 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Image
                src="/images/logomw.png"
                alt="Logo MW"
                width={170}
                height={170}
                className="mb-4 h-12 w-auto"
                unoptimized
              />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Permohonan Pelajar Baharu</h1>
              <p className="mt-2 max-w-3xl text-white/80">
                Lengkapkan mengikut seksyen sehingga semakan akhir sebelum dihantar.
              </p>
            </div>
            <Link href="/register/status"><Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Semak Status</Button></Link>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-white/85">
              <span>Langkah {step + 1} daripada {STEP_META.length}</span>
              <span>{STEP_META[step].title}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                style={{ width: `${((step + 1) / STEP_META.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-3">
            {STEP_META.map((item, index) => {
              const Icon = item.icon;
              const active = step === index;
              const completed = step > index;
              return (
                <div
                  key={item.title}
                  className={`rounded-xl border px-4 py-3 transition ${
                    active
                      ? 'border-amber-300 bg-amber-50/95 text-amber-900'
                      : completed
                        ? 'border-emerald-300 bg-emerald-50/95 text-emerald-900'
                        : 'border-white/25 bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4" />
                    <span>{completed ? 'Selesai' : active ? 'Semasa' : 'Seterusnya'}</span>
                  </div>
                  <p className="mt-1 text-sm">{item.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>{STEP_META[step].title}</CardTitle>
            <CardDescription>
              {step === 0 && 'Isi maklumat asas pelajar.'}
              {step === 1 && 'Isi maklumat penjaga, pusat pilihan dan kategori subsidi.'}
              {step === 2 && 'Muat naik dokumen wajib (maksimum 10MB setiap fail).'}
              {step === 3 && 'Semak semula maklumat sebelum hantar.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nama Pelajar *</Label><Input value={form.studentName} onChange={(e) => updateForm('studentName', e.target.value)} /></div>
                <div className="space-y-2"><Label>IC Pelajar / MyKid *</Label><Input value={form.ic} onChange={(e) => updateForm('ic', e.target.value)} /></div>
                <div className="space-y-2"><Label>Tarikh Lahir *</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => updateForm('dateOfBirth', e.target.value)} /></div>
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
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nama Penjaga *</Label><Input value={form.guardianName} onChange={(e) => updateForm('guardianName', e.target.value)} /></div>
                <div className="space-y-2"><Label>IC Penjaga *</Label><Input value={form.guardianIc} onChange={(e) => updateForm('guardianIc', e.target.value)} /></div>
                <div className="space-y-2"><Label>No. Telefon *</Label><Input value={form.guardianPhone} onChange={(e) => updateForm('guardianPhone', e.target.value)} /></div>
                <div className="space-y-2"><Label>Emel *</Label><Input type="email" value={form.guardianEmail} onChange={(e) => updateForm('guardianEmail', e.target.value)} /></div>
                <div className="space-y-2"><Label>Pusat *</Label>
                  <Select value={form.centreId} onValueChange={(value) => updateForm('centreId', value)}>
                    <SelectTrigger><SelectValue placeholder="Pilih pusat" /></SelectTrigger>
                    <SelectContent>
                      {centres.map((centre) => (
                        <SelectItem key={centre.id} value={centre.id}>{centre.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="space-y-2 md:col-span-2"><Label>Catatan</Label><Input value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} /></div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REQUIRED_DOCS.map((doc) => (
                  <div key={doc.key} className="space-y-2">
                    <Label>{doc.label} *</Label>
                    <Input
                      type="file"
                      onChange={(e) => handleRequiredFileChange(doc.key, e.target.files?.[0] ?? null)}
                    />
                    {requiredFiles[doc.key] && (
                      <p className="text-xs text-emerald-700">{requiredFiles[doc.key]?.name}</p>
                    )}
                  </div>
                ))}
                <div className="space-y-2 md:col-span-2">
                  <Label>Dokumen Sokongan Lain (Pilihan)</Label>
                  <Input type="file" onChange={(e) => setOtherFile(e.target.files?.[0] ?? null)} />
                  {otherFile && <p className="text-xs text-slate-600">{otherFile.name}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />Pelajar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p><span className="text-slate-500">Nama:</span> <span className="font-medium">{form.studentName}</span></p>
                      <p><span className="text-slate-500">IC:</span> <span className="font-medium">{form.ic}</span></p>
                      <p><span className="text-slate-500">Tarikh Lahir:</span> <span className="font-medium">{form.dateOfBirth}</span></p>
                      <p><span className="text-slate-500">Tahap:</span> <span className="font-medium uppercase">{form.educationLevel}</span></p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Penjaga & Penempatan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p><span className="text-slate-500">Nama Penjaga:</span> <span className="font-medium">{form.guardianName}</span></p>
                      <p><span className="text-slate-500">IC Penjaga:</span> <span className="font-medium">{form.guardianIc}</span></p>
                      <p><span className="text-slate-500">Telefon:</span> <span className="font-medium">{form.guardianPhone}</span></p>
                      <p><span className="text-slate-500">Emel:</span> <span className="font-medium">{form.guardianEmail}</span></p>
                      <p><span className="text-slate-500">Pusat:</span> <span className="font-medium">{selectedCentre?.name || '-'}</span></p>
                      <p><span className="text-slate-500">Subsidi:</span> <span className="font-medium">{form.subsidyCategory}</span></p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2"><FileUp className="h-4 w-4" />Dokumen Dimuat Naik</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm md:grid-cols-2">
                    {REQUIRED_DOCS.map((doc) => (
                      <p key={doc.key}>
                        <span className="text-slate-500">{doc.label}:</span>{' '}
                        <span className="font-medium">{requiredFiles[doc.key]?.name || '-'}</span>
                      </p>
                    ))}
                    <p className="md:col-span-2">
                      <span className="text-slate-500">Lain-lain:</span>{' '}
                      <span className="font-medium">{otherFile?.name || '-'}</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-4">
              <Button variant="outline" onClick={goBack} disabled={step === 0 || submitting}>
                <ChevronLeft className="mr-2 h-4 w-4" />Kembali
              </Button>
              <div className="flex gap-3">
                {step < 3 ? (
                  <Button onClick={goNext} disabled={submitting}>
                    Seterusnya <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Menghantar...' : 'Hantar Pendaftaran'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
