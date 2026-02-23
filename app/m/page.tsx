'use client';

import { useMemo } from 'react';
import { mockInvoices } from '@/lib/mock-data';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { FeeSummaryCard } from '@/components/mobile/FeeSummaryCard';
import { StatusBadge } from '@/components/mobile/StatusBadge';
import { TeacherDashboard } from '@/components/mobile/TeacherDashboard';
import { MapPin, DollarSign, FileText, CreditCard, Bell, AlertCircle, CheckCircle2, ClipboardCheck, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

const CHILD_PHOTOS: Record<string, string> = {
  '1': '/images/irfan.jpg',
  '3': '/images/aisyah.jpg',
  '4': '/images/ahmad.jpg',
};

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Payment Reminder', message: 'April fee is due in 5 days', date: '20 Apr 2024', type: 'warning' as const },
  { id: 'n2', title: 'Payment Received', message: 'RM 300.00 received for March invoice', date: '15 Mar 2024', type: 'success' as const },
];

const NOTIF_STYLES = {
  warning: { bg: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  success: { bg: 'bg-green-50 border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  info: { bg: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
};

const CHILD_CARD_COLORS: Record<string, { gradient: string; badge: string; text: string }> = {
  '1': { gradient: 'from-[#0A84FF] to-[#0055B3]', badge: 'bg-white/20 text-blue-50', text: 'text-blue-100' },
  '3': { gradient: 'from-[#BF5AF2] to-[#7A1EAB]', badge: 'bg-white/20 text-purple-50', text: 'text-purple-100' },
  '4': { gradient: 'from-[#FF9F0A] to-[#C93400]', badge: 'bg-white/20 text-orange-50', text: 'text-orange-100' },
};
const DEFAULT_CARD_COLOR = { gradient: 'from-gray-600 to-slate-800', badge: 'bg-white/20 text-gray-100', text: 'text-gray-300' };

export default function MobileDashboard() {
  const { activeRole } = useParentMobileStore();

  if (activeRole === 'teacher') {
    return <TeacherDashboard />;
  }

  return <ParentDashboard />;
}

function ParentDashboard() {
  const { selectedChildId, guardian } = useParentMobileStore();
  const child = guardianChildren.find(c => c.id === selectedChildId) ?? guardianChildren[0];

  const childInvoices = useMemo(
    () => mockInvoices.filter(inv => inv.studentId === selectedChildId),
    [selectedChildId]
  );

  const totalOutstanding = childInvoices
    .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
    .reduce((sum, inv) => sum + (inv.netAmount - inv.paidAmount), 0);

  const unpaidCount = childInvoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').length;

  const nextDueInvoice = [...childInvoices]
    .filter(inv => inv.status === 'pending' || inv.status === 'partially_paid')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  const firstUnpaidInvoice = childInvoices.find(
    inv => inv.status !== 'paid' && inv.status !== 'cancelled'
  );

  const subsidyLabel: Record<string, string> = {
    B40: 'B40 (50%)',
    M40: 'M40 (30%)',
    T20: 'T20',
    Asnaf: 'Asnaf (70%)',
    None: 'None',
  };

  if (!child) return null;

  const cardColor = CHILD_CARD_COLORS[child.id] ?? DEFAULT_CARD_COLOR;

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Student Info Card — color-coded by child */}
      <div className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-br ${cardColor.gradient} rounded-3xl p-5 text-white relative overflow-hidden transition-all duration-300`}>
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-4 ring-white/20 shadow-sm relative bg-white/10 backdrop-blur-sm flex items-center justify-center">
            {CHILD_PHOTOS[child.id] ? (
              <Image src={CHILD_PHOTOS[child.id]} alt={child.name} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold">{child.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[17px] font-bold tracking-tight leading-tight mb-0.5 max-w-[180px] truncate">{child.name}</h2>
                <p className={`text-[12px] ${cardColor.text} font-mono tracking-wider`}>{child.studentCode}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/95 font-semibold bg-black/10 self-start inline-flex px-2 py-1 rounded-lg backdrop-blur-md">
              <MapPin className="h-3 w-3 opacity-90" />
              <span>{child.centre.name}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${cardColor.text}`}>Monthly Fee</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-bold text-lg leading-none">RM {child.monthlyFee.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${cardColor.text}`}>Subsidy</span>
            <span className={`mt-1 text-[11px] px-2 py-0.5 rounded-md font-bold ${cardColor.badge}`}>
              {subsidyLabel[child.subsidyCategory] ?? child.subsidyCategory}
            </span>
          </div>
        </div>
      </div>

      {/* Fee Overview — 2 colored cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">Financial Overview</h3>
          <Link href="/m/fees" className="text-[11px] font-bold text-blue-600 uppercase tracking-widest active:opacity-60">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FeeSummaryCard
            label="Outstanding"
            value={`RM ${totalOutstanding.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`}
            subtitle={`${unpaidCount} invoice${unpaidCount !== 1 ? 's' : ''}`}
            accent={totalOutstanding > 0 ? 'red' : 'green'}
          />
          <FeeSummaryCard
            label="Next Due"
            value={nextDueInvoice ? format(nextDueInvoice.dueDate, 'dd MMM') : '—'}
            subtitle={nextDueInvoice ? `RM ${(nextDueInvoice.netAmount - nextDueInvoice.paidAmount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}` : 'All clear'}
            accent={nextDueInvoice ? 'blue' : 'green'}
          />
        </div>
      </div>

      {/* Quick Actions — 2x2 colorful grid */}
      <div>
        <h3 className="text-[13px] font-bold text-slate-800 tracking-tight mb-3 px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/m/attendance-parent"
            className="bg-white rounded-[20px] shadow-sm border border-gray-100/80 p-4 pt-5 flex flex-col items-start gap-4 active:scale-[0.98] active:bg-slate-50 transition-all no-tap-highlight"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 ring-1 ring-purple-100 shadow-sm">
              <ClipboardCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800 leading-none mb-1">Attendance</p>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">View records</p>
            </div>
          </Link>
          <Link
            href="/m/results"
            className="bg-white rounded-[20px] shadow-sm border border-gray-100/80 p-4 pt-5 flex flex-col items-start gap-4 active:scale-[0.98] active:bg-slate-50 transition-all no-tap-highlight"
          >
            <div className="p-2.5 rounded-xl bg-orange-50 ring-1 ring-orange-100 shadow-sm">
              <Award className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800 leading-none mb-1">Results</p>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">Exam scores</p>
            </div>
          </Link>
          <Link
            href="/m/fees"
            className="bg-white rounded-[20px] shadow-sm border border-gray-100/80 p-4 pt-5 flex flex-col items-start gap-4 active:scale-[0.98] active:bg-slate-50 transition-all no-tap-highlight"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 ring-1 ring-blue-100 shadow-sm">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-800 leading-none mb-1">Fees</p>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">{unpaidCount > 0 ? `${unpaidCount} pending` : 'All paid'}</p>
            </div>
          </Link>
          {firstUnpaidInvoice ? (
            <Link
              href={`/m/pay?invoiceId=${firstUnpaidInvoice.id}`}
              className="bg-white rounded-[20px] shadow-sm border border-gray-100/80 p-4 pt-5 flex flex-col items-start gap-4 active:scale-[0.98] active:bg-slate-50 transition-all no-tap-highlight"
            >
              <div className="p-2.5 rounded-xl bg-green-50 ring-1 ring-green-100 shadow-sm">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-800 leading-none mb-1">Pay Now</p>
                <p className="text-[11px] text-green-600 font-bold tracking-wide">RM {totalOutstanding.toLocaleString('en-MY', { minimumFractionDigits: 2 })} due</p>
              </div>
            </Link>
          ) : (
            <div className="bg-slate-50/50 rounded-[20px] shadow-sm border border-gray-100 p-4 pt-5 flex flex-col items-start gap-4 opacity-70">
              <div className="p-2.5 rounded-xl bg-gray-200/50 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-500 leading-none mb-1">Pay Now</p>
                <p className="text-[11px] text-gray-400 font-medium tracking-wide">No dues</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Notifications — color-coded */}
      <div className="pb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">Recent Updates</h3>
          <Link href="/m/notifications" className="text-[11px] font-bold text-green-600 uppercase tracking-widest active:opacity-60">View All</Link>
        </div>
        <div className="space-y-3">
          {MOCK_NOTIFICATIONS.map((n) => {
            const style = NOTIF_STYLES[n.type] ?? NOTIF_STYLES.info;
            const NotifIcon = n.type === 'warning' ? AlertCircle : n.type === 'success' ? CheckCircle2 : Bell;
            return (
              <div key={n.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3.5">
                <div className={`p-2 rounded-full mt-0.5 ${style.iconBg} ring-4 ring-white`}>
                  <NotifIcon className={`h-4 w-4 ${style.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-[14px] font-bold text-slate-800 leading-tight">{n.title}</p>
                    <span className="text-[10px] font-medium text-slate-400 flex-shrink-0 pt-0.5">{n.date}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 mt-1 leading-snug pr-2">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
