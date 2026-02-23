'use client';

import { Bell, Info, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export interface MobileNotification {
  id: string;
  type: 'reminder' | 'confirmation' | 'announcement' | 'warning';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const NOTIFICATION_STYLES: Record<string, { icon: any, color: string, bg: string, ring: string }> = {
  reminder: { icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
  confirmation: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-100' },
  announcement: { icon: Info, color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-100' },
  warning: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-100' },
};

export function NotificationItem({ notification }: { notification: MobileNotification }) {
  const style = NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES.announcement;
  const Icon = style.icon;

  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-4 relative overflow-hidden transition-all active:bg-slate-50 ${!notification.read ? 'ring-1 ring-blue-500/20' : ''}`}>
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
      )}
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${style.bg} ${style.color} ring-1 ring-inset ${style.ring}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-[15px] font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
            {notification.title}
          </p>
          <p className="text-[13px] text-slate-500 mt-1 leading-snug pr-4">
            {notification.message}
          </p>
          <p className="text-[11px] font-bold text-slate-400 mt-2.5 uppercase tracking-widest">
            {notification.date}
          </p>
        </div>
      </div>
    </div>
  );
}
