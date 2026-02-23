'use client';

interface FeeSummaryCardProps {
  label: string;
  value: string;
  subtitle?: string;
  accent?: 'red' | 'green' | 'blue' | 'default';
}

const ACCENT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  red: { bg: 'bg-white border-red-100 shadow-sm shadow-red-100/50', text: 'text-red-600', label: 'text-red-400' },
  green: { bg: 'bg-white border-green-100 shadow-sm shadow-green-100/50', text: 'text-green-600', label: 'text-green-500' },
  blue: { bg: 'bg-white border-blue-100 shadow-sm shadow-blue-100/50', text: 'text-blue-600', label: 'text-blue-400' },
  default: { bg: 'bg-white border-gray-100 shadow-sm', text: 'text-gray-900', label: 'text-gray-500' },
};

export function FeeSummaryCard({ label, value, subtitle, accent = 'default' }: FeeSummaryCardProps) {
  const style = ACCENT_STYLES[accent] ?? ACCENT_STYLES.default;

  return (
    <div className={`rounded-[20px] border p-4 pt-4 flex-1 min-w-0 flex flex-col justify-center ${style.bg}`}>
      <p className={`text-[10px] uppercase tracking-widest font-bold truncate mb-1 ${style.label}`}>{label}</p>
      <p className={`text-[18px] tracking-tight font-extrabold ${style.text}`}>{value}</p>
      {subtitle && <p className="text-[11px] text-slate-500 font-medium mt-1.5 truncate">{subtitle}</p>}
    </div>
  );
}
