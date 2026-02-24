'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type LookupResult = {
  applicationRef: string;
  studentName: string;
  centreName: string;
  status: string;
  appliedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  remarks?: string;
};

export default function RegistrationStatusPage() {
  const [applicationRef, setApplicationRef] = useState('');
  const [guardianIc, setGuardianIc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);

  const handleLookup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/register/status-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationRef, guardianIc }),
      });

      const json = await response.json() as LookupResult & { error?: string };
      if (!response.ok) {
        setError(json.error ?? 'Tiada permohonan yang sepadan ditemui.');
        return;
      }

      setResult(json);
    } catch {
      setError('Tidak dapat menyemak status permohonan sekarang.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl space-y-6">
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
            <h1 className="text-3xl font-bold tracking-tight">Semakan Status Pendaftaran</h1>
            <p className="text-muted-foreground">Masukkan nombor rujukan permohonan dan IC penjaga anda.</p>
          </div>
          <Link href="/register"><Button variant="outline">Pendaftaran Baharu</Button></Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Carian Status</CardTitle>
            <CardDescription>Hanya rujukan dan IC penjaga yang sepadan boleh melihat status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-2">
                <Label>Rujukan Permohonan</Label>
                <Input value={applicationRef} onChange={(e) => setApplicationRef(e.target.value)} placeholder="APP-2026-00001" required />
              </div>
              <div className="space-y-2">
                <Label>IC Penjaga</Label>
                <Input value={guardianIc} onChange={(e) => setGuardianIc(e.target.value)} placeholder="800505-10-5678" required />
              </div>
              {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              <Button type="submit" disabled={loading}>{loading ? 'Menyemak...' : 'Semak Status'}</Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Maklumat Permohonan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><span className="text-muted-foreground">Rujukan:</span> <span className="font-mono font-semibold">{result.applicationRef}</span></p>
              <p><span className="text-muted-foreground">Pelajar:</span> <span className="font-semibold">{result.studentName}</span></p>
              <p><span className="text-muted-foreground">Pusat:</span> <span className="font-semibold">{result.centreName}</span></p>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge>{result.status.replace('_', ' ').toUpperCase()}</Badge>
              </div>
              <p><span className="text-muted-foreground">Tarikh Mohon:</span> {format(new Date(result.appliedDate), 'dd MMM yyyy')}</p>
              {result.reviewedDate && <p><span className="text-muted-foreground">Tarikh Semakan:</span> {format(new Date(result.reviewedDate), 'dd MMM yyyy')}</p>}
              {result.reviewedBy && <p><span className="text-muted-foreground">Disemak Oleh:</span> {result.reviewedBy}</p>}
              {result.remarks && <p><span className="text-muted-foreground">Catatan:</span> {result.remarks}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
