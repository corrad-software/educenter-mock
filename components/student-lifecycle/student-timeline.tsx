'use client';

import { mockTimelineEvents } from '@/lib/mock-data/student-lifecycle';
import { format } from 'date-fns';
import { FileCheck, UserPlus, ArrowRightLeft, UserMinus, RefreshCw, DollarSign, MessageSquare, Activity } from 'lucide-react';
import type { TimelineEventType } from '@/lib/types/student-lifecycle';

const EVENT_CONFIG: Record<TimelineEventType, { icon: React.ElementType; color: string; bgColor: string }> = {
  application: { icon: FileCheck, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  registration: { icon: UserPlus, color: 'text-green-600', bgColor: 'bg-green-100' },
  status_change: { icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  transfer: { icon: ArrowRightLeft, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  withdrawal: { icon: UserMinus, color: 'text-red-600', bgColor: 'bg-red-100' },
  reenrollment: { icon: RefreshCw, color: 'text-teal-600', bgColor: 'bg-teal-100' },
  fee_change: { icon: DollarSign, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  note: { icon: MessageSquare, color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

interface StudentTimelineProps {
  studentId: string;
}

export function StudentTimeline({ studentId }: StudentTimelineProps) {
  const events = mockTimelineEvents
    .filter(e => e.studentId === studentId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No timeline events recorded for this student.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-4">
        {events.map((event) => {
          const config = EVENT_CONFIG[event.type];
          const Icon = config.icon;

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {format(event.date, 'dd MMM yyyy')}
                  </span>
                </div>
                {event.performedBy && (
                  <p className="text-xs text-muted-foreground mt-1">
                    By: {event.performedBy}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
