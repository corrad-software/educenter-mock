'use client';

interface FeeSummaryCardProps {
  label: string;
  value: string;
  subtitle?: string;
  accent?: 'red' | 'green' | 'blue' | 'default';
}

const ACCENT_STYLES: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  red:     { bg: 'bg-red-50 border-red-100',     text: 'text-red-600',   label: 'text-red-400',   icon: 'bg-red-100' },
  green:   { bg: 'bg-green-50 border-green-100',  text: 'text-green-600', label: 'text-green-500', icon: 'bg-green-100' },
  blue:    { bg: 'bg-blue-50 border-blue-100',    text: 'text-blue-600',  label: 'text-blue-400',  icon: 'bg-blue-100' },
  default: { bg: 'bg-white border-gray-200',      text: 'text-gray-900',  label: 'text-gray-500',  icon: 'bg-gray-100' },
};

export function FeeSummaryCard({ label, value, subtitle, accent = 'default' }: FeeSummaryCardProps) {
  const style = ACCENT_STYLES[accent] ?? ACCENT_STYLES.default;

  return (
    <div className={`rounded-xl border p-3 flex-1 min-w-0 ${style.bg}`}>
      <p className={`text-[11px] font-medium truncate ${style.label}`}>{label}</p>
      <p className={`text-lg font-bold ${style.text}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-gray-500 truncate">{subtitle}</p>}
    </div>
  );
}
