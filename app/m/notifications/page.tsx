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
    <div className="px-4 py-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
        <p className="text-xs text-gray-500">
          {unread > 0 ? `${unread} unread notification${unread !== 1 ? 's' : ''}` : 'All caught up'}
        </p>
      </div>

      {NOTIFICATIONS.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Bell className="h-10 w-10 mx-auto mb-2" />
          <p className="text-sm">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {NOTIFICATIONS.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}
    </div>
  );
}
