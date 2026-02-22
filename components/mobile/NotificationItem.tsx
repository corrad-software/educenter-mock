'use client';

export interface MobileNotification {
  id: string;
  type: 'reminder' | 'confirmation' | 'announcement' | 'warning';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const BORDER_COLORS: Record<string, string> = {
  reminder: 'border-l-blue-500',
  confirmation: 'border-l-green-500',
  announcement: 'border-l-yellow-500',
  warning: 'border-l-orange-500',
};

export function NotificationItem({ notification }: { notification: MobileNotification }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${BORDER_COLORS[notification.type]} p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
            {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
    </div>
  );
}
