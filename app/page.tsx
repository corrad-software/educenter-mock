'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2, GraduationCap, Users, BookOpen, Award, Shield,
  ChevronRight, Menu, X, Star, MapPin, Phone, Mail,
  Heart, Globe, Clock, ArrowRight, School, Baby, Briefcase,
  BookOpenCheck, Landmark, Quote
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface InstitutionItem { name: string; type: string }
interface InstitutionsResponse {
  source: 'live' | 'fallback';
  note?: string;
  url: string;
  institutions: InstitutionItem[];
}

/* ------------------------------------------------------------------ */
/*  Utility – Animated Counter                                         */
/* ------------------------------------------------------------------ */
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/*  Utility – Scroll‑Reveal wrapper                                    */
/* ------------------------------------------------------------------ */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Institution type → icon mapping                                    */
/* ------------------------------------------------------------------ */
function institutionIcon(type: string) {
  if (/prasekolah|kanak/i.test(type)) return <Baby className="h-5 w-5" />;
  if (/kemahiran|profesional/i.test(type)) return <Briefcase className="h-5 w-5" />;
  if (/menengah/i.test(type)) return <School className="h-5 w-5" />;
  if (/komuniti/i.test(type)) return <Globe className="h-5 w-5" />;
  if (/agama|berasrama|kebajikan/i.test(type)) return <Landmark className="h-5 w-5" />;
  return <Building2 className="h-5 w-5" />;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Institusi', href: '#institutions' },
  { label: 'Program', href: '#programs' },
  { label: 'Kenapa Kami', href: '#why-us' },
  { label: 'Hubungi', href: '#contact' },
];

const STATS = [
  { icon: <Users className="h-6 w-6" />, value: 5200, suffix: '+', label: 'Pelajar Berdaftar' },
  { icon: <Building2 className="h-6 w-6" />, value: 10, suffix: '', label: 'Institusi Pendidikan' },
  { icon: <Award className="h-6 w-6" />, value: 25, suffix: '+', label: 'Tahun Kecemerlangan' },
  { icon: <BookOpen className="h-6 w-6" />, value: 40, suffix: '+', label: 'Program Ditawarkan' },
];

const PROGRAMS = [
  { icon: <BookOpenCheck className="h-8 w-8" />, title: 'Pengajian Islam', desc: 'Kurikulum komprehensif merangkumi Al-Quran, Hadis, Fiqh dan Akidah dengan pendekatan moden.' },
  { icon: <Briefcase className="h-8 w-8" />, title: 'Kemahiran Profesional', desc: 'Program vokasional dan teknikal untuk melengkapkan pelajar dengan kemahiran pasaran kerja.' },
  { icon: <Baby className="h-8 w-8" />, title: 'Pendidikan Awal Kanak-kanak', desc: 'Persekitaran pembelajaran yang menyeronokkan dan selamat untuk membina asas pendidikan anak.' },
  { icon: <School className="h-8 w-8" />, title: 'Sekolah Menengah', desc: 'Pendidikan menengah berkualiti menggabungkan kurikulum kebangsaan dengan pengajian Islam.' },
  { icon: <Globe className="h-8 w-8" />, title: 'Pembelajaran Komuniti', desc: 'Program jangka pendek dan kursus masyarakat untuk pembangunan sepanjang hayat.' },
  { icon: <GraduationCap className="h-8 w-8" />, title: 'Kebajikan & Berasrama', desc: 'Perkhidmatan asrama dan sokongan kebajikan untuk pelajar yang memerlukan bantuan.' },
];

const WHY_US = [
  { icon: <GraduationCap className="h-7 w-7" />, title: 'Tenaga Pengajar Berkelayakan', desc: 'Guru-guru terlatih dan berpengalaman dalam bidang masing-masing.' },
  { icon: <Heart className="h-7 w-7" />, title: 'Pendidikan Holistik', desc: 'Pembangunan menyeluruh merangkumi akademik, sahsiah, dan kerohanian.' },
  { icon: <Shield className="h-7 w-7" />, title: 'Fasiliti Moden', desc: 'Kemudahan pembelajaran terkini termasuk makmal, perpustakaan, dan bilik sukan.' },
  { icon: <Star className="h-7 w-7" />, title: 'Yuran Berpatutan', desc: 'Pelan pembayaran fleksibel dan bantuan kewangan untuk keluarga yang layak.' },
];

const TESTIMONIALS = [
  { name: 'Ahmad Irfan', role: 'Pelajar SMA MAIWP', img: '/images/ahmad.jpg', quote: 'Pengalaman belajar di SMA MAIWP sangat bermakna. Guru-guru sentiasa memberi sokongan dan motivasi untuk kami mencapai kecemerlangan.' },
  { name: 'Aisyah Zahra', role: 'Ibu Bapa, Tadika MAIWP', img: '/images/aisyah.jpg', quote: 'Anak saya suka pergi ke tadika setiap hari. Persekitaran yang selamat dan guru yang penyayang menjadikan ia pilihan terbaik.' },
  { name: 'Shahrul Nizam', role: 'Alumni IKB', img: '/images/shahrul.jpg', quote: 'Kemahiran yang saya peroleh di IKB membolehkan saya terus bekerja selepas tamat pengajian. Terima kasih MAIWP!' },
];

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export default function HomePage() {
  const [data, setData] = useState<InstitutionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* scroll listener for sticky nav */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* fetch institutions */
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch('/api/public/institutions', { cache: 'no-store' });
        const payload = (await res.json()) as InstitutionsResponse;
        if (!canceled) setData(payload);
      } catch {
        if (!canceled) setData(null);
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => { canceled = true; };
  }, []);

  /* rotate testimonials */
  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);

  /* smooth scroll helper */
  const scrollTo = useCallback((href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <main className="min-h-screen bg-white font-[var(--font-geist-sans)] overflow-x-hidden">

      {/* ============================================================ */}
      {/*  NAVBAR                                                       */}
      {/* ============================================================ */}
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(15,27,68,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,.15)' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/images/logomw.png" alt="EduCentre" width={44} height={44} className="h-10 w-auto" unoptimized />
            <div className="leading-tight">
              <span className="font-bold text-white text-lg tracking-tight">EduCentre</span>
              <span className="block text-[11px] text-sky-300 font-medium tracking-wide">by MAIWP</span>
            </div>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <Link
              href="/register"
              className="ml-3 px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] transition-all"
            >
              Mohon Sekarang
            </Link>
          </div>

          {/* mobile toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f1b44]/98 backdrop-blur-xl border-t border-white/10 px-6 pb-6 space-y-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {l.label}
              </button>
            ))}
            <Link
              href="/register"
              className="block text-center mt-3 px-5 py-3 font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white"
            >
              Mohon Sekarang
            </Link>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* bg image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-campus.png"
            alt="Campus"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1b44]/90 via-[#0f1b44]/75 to-sky-900/60" />
          {/* decorative circles */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:pt-40 md:pb-28 w-full">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sky-300 text-sm font-medium mb-6">
                <GraduationCap className="h-4 w-4" />
                Institusi Pendidikan MAIWP
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
                Membentuk Generasi
                <span className="block bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                  Berilmu & Berakhlak
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
                EduCentre menghubungkan anda dengan rangkaian institusi pendidikan MAIWP —
                dari prasekolah hingga pengajian tinggi — untuk membina masa depan ummah yang cemerlang.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] transition-all"
                >
                  Daftar Pelajar Baharu
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => scrollTo('#institutions')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  Lihat Institusi
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/50">
                <Link href="/register/status" className="hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/20">
                  Semak Status Permohonan
                </Link>
                <Link href="/login" className="hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/20">
                  Log Masuk Kakitangan
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS BAR                                                    */}
      {/* ============================================================ */}
      <section id="about" className="relative -mt-16 z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 mb-3">
                  {s.icon}
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#0f1b44]">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-slate-500 mt-1 font-medium">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  INSTITUTIONS                                                 */}
      {/* ============================================================ */}
      <section id="institutions" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-4">
                Rangkaian Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f1b44] tracking-tight">
                Institusi Pendidikan MAIWP
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Dari taska dan tadika hinggalah ke sekolah menengah dan institut kemahiran,
                MAIWP menawarkan pelbagai peluang pendidikan untuk semua peringkat umur.
              </p>
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {(data?.institutions ?? []).map((item, i) => (
                <Reveal key={item.name} delay={i * 60}>
                  <div className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 flex items-center justify-center">
                        {institutionIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#0f1b44] leading-snug group-hover:text-sky-700 transition-colors">
                          {item.name}
                        </h3>
                        <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PROGRAMS                                                     */}
      {/* ============================================================ */}
      <section id="programs" className="py-24 bg-[#0f1b44] relative overflow-hidden">
        {/* decorative bg */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-sky-300 text-sm font-semibold mb-4">
                Peluang Pendidikan
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Program Yang Ditawarkan
              </h2>
              <p className="mt-4 text-white/50 leading-relaxed">
                Pelbagai program pendidikan direka untuk memenuhi keperluan setiap individu
                pada setiap peringkat perkembangan.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-400/20 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY CHOOSE US                                                */}
      {/* ============================================================ */}
      <section id="why-us" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/classroom.png"
                  alt="Suasana Pembelajaran"
                  width={640}
                  height={480}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1b44]/40 to-transparent" />
                {/* floating card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0f1b44] text-sm">Kecemerlangan Terbukti</p>
                      <p className="text-xs text-slate-500">25+ tahun dalam pendidikan Islam</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Content side */}
            <div>
              <Reveal>
                <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
                  Kelebihan Kami
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0f1b44] tracking-tight">
                  Kenapa Pilih Institusi MAIWP?
                </h2>
                <p className="mt-4 text-slate-500 leading-relaxed">
                  Kami komited untuk menyediakan pendidikan berkualiti yang menggabungkan
                  ilmu duniawi dan ukhrawi dalam persekitaran yang kondusif.
                </p>
              </Reveal>

              <div className="mt-10 space-y-6">
                {WHY_US.map((w, i) => (
                  <Reveal key={w.title} delay={i * 100}>
                    <div className="flex gap-5 group">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all">
                        {w.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0f1b44] text-lg">{w.title}</h3>
                        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{w.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-4">
                Testimoni
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f1b44] tracking-tight">
                Apa Kata Mereka
              </h2>
              <p className="mt-4 text-slate-500">
                Dengar sendiri pengalaman pelajar dan ibu bapa yang telah mempercayai institusi MAIWP.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative max-w-3xl mx-auto">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className="transition-all duration-700"
                  style={{
                    opacity: activeTestimonial === i ? 1 : 0,
                    position: activeTestimonial === i ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: activeTestimonial === i ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
                    pointerEvents: activeTestimonial === i ? 'auto' : 'none',
                  }}
                >
                  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 text-center">
                    <Quote className="h-10 w-10 text-sky-200 mx-auto mb-6" />
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                      <Image
                        src={t.img}
                        alt={t.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full object-cover border-2 border-sky-100"
                        unoptimized
                      />
                      <div className="text-left">
                        <p className="font-semibold text-[#0f1b44]">{t.name}</p>
                        <p className="text-sm text-slate-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* dots */}
              <div className="flex justify-center gap-2 mt-8">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className="transition-all duration-300"
                    style={{
                      width: activeTestimonial === i ? 32 : 10,
                      height: 10,
                      borderRadius: 999,
                      background: activeTestimonial === i ? '#0ea5e9' : '#e2e8f0',
                    }}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BANNER                                                   */}
      {/* ============================================================ */}
      <section className="py-20 bg-gradient-to-r from-[#0f1b44] via-sky-900 to-[#0f1b44] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Sedia Membina Masa Depan
              <span className="block bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                Bersama Kami?
              </span>
            </h2>
            <p className="mt-5 text-white/60 text-lg max-w-2xl mx-auto">
              Pendaftaran kini dibuka untuk sesi berikutnya. Jangan lepaskan peluang untuk menyertai keluarga besar institusi pendidikan MAIWP.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-xl shadow-amber-500/25 hover:shadow-amber-500/45 hover:scale-105 transition-all text-lg"
              >
                Mohon Sekarang
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register/status"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/20 transition-all text-lg"
              >
                Semak Status
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer id="contact" className="bg-[#0a1230] text-white/70 pt-20 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
            {/* Col 1 – Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image src="/images/logomw.png" alt="EduCentre" width={40} height={40} className="h-9 w-auto" unoptimized />
                <div className="leading-tight">
                  <span className="font-bold text-white text-lg">EduCentre</span>
                  <span className="block text-xs text-sky-400 font-medium">by MAIWP</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Portal pengurusan pendidikan bersepadu bagi rangkaian institusi pendidikan
                Majlis Agama Islam Wilayah Persekutuan.
              </p>
            </div>

            {/* Col 2 – Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Pautan Pantas</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollTo('#about')} className="hover:text-white transition-colors">Tentang Kami</button></li>
                <li><button onClick={() => scrollTo('#institutions')} className="hover:text-white transition-colors">Institusi</button></li>
                <li><button onClick={() => scrollTo('#programs')} className="hover:text-white transition-colors">Program</button></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Pendaftaran</Link></li>
              </ul>
            </div>

            {/* Col 3 – Portal */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Portal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Log Masuk Kakitangan</Link></li>
                <li><Link href="/register/status" className="hover:text-white transition-colors">Semak Status Permohonan</Link></li>
                <li><a href="https://www.maiwp.gov.my" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portal MAIWP</a></li>
              </ul>
            </div>

            {/* Col 4 – Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-sky-400 flex-shrink-0" />
                  <span>Menara MAIWP, Jalan Tun Ismail, 50480 Kuala Lumpur</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-sky-400 flex-shrink-0" />
                  <span>+603-2691 4000</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-sky-400 flex-shrink-0" />
                  <span>edu@maiwp.gov.my</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-sky-400 flex-shrink-0" />
                  <span>Ahad – Khamis, 8:00 – 17:00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>© {new Date().getFullYear()} Majlis Agama Islam Wilayah Persekutuan. Hak cipta terpelihara.</span>
            <div className="flex items-center gap-1">
              <span>Dibina dengan</span>
              <Heart className="h-3 w-3 text-red-400 fill-red-400 mx-0.5" />
              <span>oleh EduCentre</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
