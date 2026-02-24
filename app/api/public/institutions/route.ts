import { NextResponse } from 'next/server';

const SOURCE_URL = 'https://www.maiwp.gov.my/portal-main/institusi-pendidikan';

const FALLBACK_INSTITUTIONS = [
  { name: 'Tadika MAIWP', type: 'Prasekolah' },
  { name: 'Taska MAIWP', type: 'Asuhan / Kanak-kanak' },
  { name: 'Pondok Moden Al-Abaqirah (PMA)', type: 'Institusi Berasrama Agama' },
  { name: 'Darul Ilmi', type: 'Pembelajaran Komuniti' },
  { name: 'Darul Kifayah', type: 'Kebajikan / Berasrama' },
  { name: 'Dar Assaadah', type: 'Kebajikan / Berasrama' },
  { name: 'SMA MAIWP', type: 'Sekolah Menengah' },
  { name: 'SMISTA', type: 'Sekolah Menengah' },
  { name: 'KPMAIWP', type: 'Kolej Profesional' },
  { name: 'IKB', type: 'Institut Kemahiran' },
].sort((a, b) => a.name.localeCompare(b.name));

function likelyCloudflareBlocked(html: string): boolean {
  const text = html.toLowerCase();
  return text.includes('cloudflare') && text.includes('you have been blocked');
}

function parseInstitutionsFromHtml(html: string): { name: string; type: string }[] {
  const cleaned = html.replace(/\s+/g, ' ');
  const matches = cleaned.match(/(Tadika|Taska|Pondok Moden Al-Abaqirah|Darul Ilmi|Darul Kifayah|Dar Assaadah|SMA MAIWP|SMISTA|KPMAIWP|IKB)[^<]{0,120}/gi) ?? [];

  const items = Array.from(
    new Set(matches.map((m) => m.trim()))
  ).map((name) => ({ name, type: 'Institusi' }));

  return items;
}

export async function GET() {
  try {
    const response = await fetch(SOURCE_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EduCentre-POC/1.0)',
      },
    });

    const html = await response.text();
    if (!response.ok || likelyCloudflareBlocked(html)) {
      return NextResponse.json({
        source: 'fallback',
        note: 'Sumber langsung disekat oleh perlindungan pihak luar. Paparan menggunakan senarai fallback.',
        url: SOURCE_URL,
        institutions: FALLBACK_INSTITUTIONS,
      });
    }

    const parsed = parseInstitutionsFromHtml(html);
    if (parsed.length === 0) {
      return NextResponse.json({
        source: 'fallback',
        note: 'Format sumber langsung tidak dapat diproses. Paparan menggunakan senarai fallback.',
        url: SOURCE_URL,
        institutions: FALLBACK_INSTITUTIONS,
      });
    }

    return NextResponse.json({
      source: 'live',
      url: SOURCE_URL,
      institutions: parsed,
    });
  } catch {
    return NextResponse.json({
      source: 'fallback',
      note: 'Tidak dapat mencapai sumber langsung. Paparan menggunakan senarai fallback.',
      url: SOURCE_URL,
      institutions: FALLBACK_INSTITUTIONS,
    });
  }
}
