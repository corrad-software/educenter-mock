'use client';

import { NotificationItem, type MobileNotification } from '@/components/mobile/NotificationItem';
import { Bell } from 'lucide-react';

const NOTIFICATIONS: MobileNotification[] = [
  {
    id: 'n1',
    type: 'reminder',
    title: 'Payment Reminder',
    message: 'Your April 2024 fee of RM 400.00 is due on 30 April. Please make payment to avoid late charges.',
    date: '20 April 2024, 09:00 AM',
    read: false,
  },
  {
    id: 'n2',
    type: 'confirmation',
    title: 'Payment Received',
    message: 'We have received your payment of RM 300.00 for invoice INV-2024-S03 (March 2024). Thank you!',
    date: '15 March 2024, 02:30 PM',
    read: true,
  },
  {
    id: 'n3',
    type: 'warning',
    title: 'Partial Payment Received',
    message: 'Partial payment of RM 200.00 received for invoice INV-2024-003. Outstanding balance: RM 200.00.',
    date: '10 March 2024, 11:15 AM',
    read: true,
  },
  {
    id: 'n4',
    type: 'announcement',
    title: 'Centre Announcement',
    message: 'School holiday from 25 March to 2 April 2024. Classes will resume on 3 April 2024.',
    date: '5 March 2024, 08:00 AM',
    read: true,
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Fee Schedule Update',
    message: 'The 2024/2025 fee schedule has been updated. Please check the invoice section for details.',
    date: '1 March 2024, 10:00 AM',
    read: true,
  },
];

export default function MobileNotificationsPage() {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md pt-5 pb-3 px-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-b border-gray-200/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-none mb-1">Notifications</h1>
        <p className="text-[14px] text-slate-500 font-medium">
          {unread > 0 ? `${unread} unread` : 'All caught up'}
        </p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 pb-8">
        {NOTIFICATIONS.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-[15px] font-bold text-slate-700">No notifications</p>
            <p className="text-[13px] text-slate-500 mt-1">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {NOTIFICATIONS.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
