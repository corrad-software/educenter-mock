'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ExternalLink, UserPlus } from 'lucide-react';

interface InstitutionItem {
  name: string;
  type: string;
}

interface InstitutionsResponse {
  source: 'live' | 'fallback';
  note?: string;
  url: string;
  institutions: InstitutionItem[];
}

export default function HomePage() {
  const [data, setData] = useState<InstitutionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const loadInstitutions = async () => {
      try {
        const response = await fetch('/api/public/institutions', { cache: 'no-store' });
        const payload = await response.json() as InstitutionsResponse;
        if (!canceled) {
          setData(payload);
        }
      } catch {
        if (!canceled) {
          setData(null);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    void loadInstitutions();
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b bg-linear-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Image
            src="/images/logomw.png"
            alt="Logo MW"
            width={180}
            height={180}
            className="h-14 w-auto mb-4"
            unoptimized
          />
          <Badge variant="outline" className="mb-4">EduCentre by MAIWP</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 max-w-3xl">
            Portal Pendaftaran Pelajar Layan Diri
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Hantar permohonan pelajar baharu, muat naik dokumen sokongan di satu tempat, dan semak status permohonan menggunakan nombor rujukan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Daftar Pelajar Baharu
              </Button>
            </Link>
            <Link href="/register/status">
              <Button variant="outline">Semak Status Permohonan</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Log Masuk Kakitangan</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Institusi Pendidikan MAIWP</h2>
            <p className="text-sm text-slate-500">Data diambil dari portal MAIWP dengan perlindungan fallback untuk kestabilan demo.</p>
          </div>
          <a href="https://www.maiwp.gov.my/portal-main/institusi-pendidikan" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2">
              Halaman Sumber
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Memuatkan data institusi...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant={data?.source === 'live' ? 'default' : 'secondary'}>
                Sumber: {data?.source === 'live' ? 'Data Langsung' : 'Fallback'}
              </Badge>
              {data?.note && <span className="text-slate-500">{data.note}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(data?.institutions ?? []).map((item) => (
                <Card key={item.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-start gap-2">
                      <Building2 className="h-4 w-4 mt-0.5 text-blue-600" />
                      <span>{item.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{item.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
