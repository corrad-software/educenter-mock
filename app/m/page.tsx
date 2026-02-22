'use client';

import { useMemo } from 'react';
import { mockInvoices } from '@/lib/mock-data';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { FeeSummaryCard } from '@/components/mobile/FeeSummaryCard';
import { StatusBadge } from '@/components/mobile/StatusBadge';
import { TeacherDashboard } from '@/components/mobile/TeacherDashboard';
import { MapPin, DollarSign, FileText, CreditCard, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Payment Reminder', message: 'April fee is due in 5 days', date: '20 Apr 2024', type: 'warning' as const },
  { id: 'n2', title: 'Payment Received', message: 'RM 300.00 received for March invoice', date: '15 Mar 2024', type: 'success' as const },
];

const NOTIF_STYLES = {
  warning: { bg: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  success: { bg: 'bg-green-50 border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  info:    { bg: 'bg-blue-50 border-blue-100',   iconBg: 'bg-blue-100',  iconColor: 'text-blue-600' },
};

const CHILD_CARD_COLORS: Record<string, { gradient: string; badge: string }> = {
  '1': { gradient: 'from-blue-500 to-blue-600',   badge: 'bg-blue-400/30 text-blue-100' },
  '3': { gradient: 'from-purple-500 to-purple-600', badge: 'bg-purple-400/30 text-purple-100' },
  '4': { gradient: 'from-amber-500 to-amber-600',  badge: 'bg-amber-400/30 text-amber-100' },
};
const DEFAULT_CARD_COLOR = { gradient: 'from-gray-500 to-gray-600', badge: 'bg-gray-400/30 text-gray-100' };

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
    <div className="px-4 py-4 space-y-4">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
        <h1 className="text-lg font-bold">Assalamualaikum, {guardian?.name?.split(' ')[0] ?? 'Parent'}</h1>
        <p className="text-sm text-green-100">{guardianChildren.length} children enrolled</p>
      </div>

      {/* Student Info Card — color-coded by child */}
      <div className={`bg-gradient-to-br ${cardColor.gradient} rounded-xl p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold">{child.name}</h2>
            <p className="text-[11px] text-white/70 font-mono">{child.studentCode}</p>
          </div>
          <StatusBadge status={child.status} />
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-white/80">
          <MapPin className="h-3 w-3" />
          <span>{child.centre.name}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-3.5 w-3.5 text-white/70" />
            <span className="font-semibold">RM {child.monthlyFee.toLocaleString()}</span>
            <span className="text-xs text-white/60">/mo</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cardColor.badge}`}>
            {subsidyLabel[child.subsidyCategory] ?? child.subsidyCategory}
          </span>
        </div>
      </div>

      {/* Fee Overview — 2 colored cards */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Fee Overview</p>
        <div className="grid grid-cols-2 gap-2">
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

      {/* Quick Actions — colorful cards */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/m/invoices"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 flex items-center gap-3 active:from-blue-100 active:to-indigo-100 transition-colors"
          >
            <div className="p-2 rounded-lg bg-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Invoices</p>
              <p className="text-[10px] text-blue-600">{unpaidCount > 0 ? `${unpaidCount} pending` : 'All paid'}</p>
            </div>
          </Link>
          {firstUnpaidInvoice ? (
            <Link
              href={`/m/pay?invoiceId=${firstUnpaidInvoice.id}`}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-4 flex items-center gap-3 active:from-green-100 active:to-emerald-100 transition-colors"
            >
              <div className="p-2 rounded-lg bg-green-100">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900">Pay Now</p>
                <p className="text-[10px] text-green-600">RM {totalOutstanding.toLocaleString('en-MY', { minimumFractionDigits: 2 })} due</p>
              </div>
            </Link>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4 flex items-center gap-3 opacity-50">
              <div className="p-2 rounded-lg bg-gray-200">
                <CreditCard className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Pay Now</p>
                <p className="text-[10px] text-gray-400">No dues</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Notifications — color-coded */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Recent</p>
          <Link href="/m/notifications" className="text-xs text-green-600 font-medium">View All</Link>
        </div>
        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.map((n) => {
            const style = NOTIF_STYLES[n.type] ?? NOTIF_STYLES.info;
            const NotifIcon = n.type === 'warning' ? AlertCircle : n.type === 'success' ? CheckCircle2 : Bell;
            return (
              <div key={n.id} className={`rounded-lg border px-4 py-3 flex items-start gap-3 ${style.bg}`}>
                <div className={`p-1.5 rounded-lg mt-0.5 ${style.iconBg}`}>
                  <NotifIcon className={`h-3.5 w-3.5 ${style.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
