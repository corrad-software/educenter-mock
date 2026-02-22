'use client';

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 border-green-300',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  overdue: 'bg-red-100 text-red-700 border-red-300',
  partially_paid: 'bg-blue-100 text-blue-700 border-blue-300',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
  active: 'bg-green-100 text-green-700 border-green-300',
  completed: 'bg-green-100 text-green-700 border-green-300',
};

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  partially_paid: 'Partial',
  cancelled: 'Cancelled',
  active: 'Active',
  completed: 'Completed',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600 border-gray-300';
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${style}`}>
      {label}
    </span>
  );
}
