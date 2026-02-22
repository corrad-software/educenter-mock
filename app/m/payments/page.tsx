'use client';

import { useState, useMemo } from 'react';
import { mockInvoices } from '@/lib/mock-data';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { StatusBadge } from '@/components/mobile/StatusBadge';
import { format } from 'date-fns';
import { CreditCard, ArrowLeft, Receipt, ChevronRight, Download } from 'lucide-react';
import { PdfDocument } from '@/components/mobile/PdfDocument';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  method: string;
  reference: string;
  receiptNumber: string;
  date: Date;
  status: 'completed';
  studentName: string;
  centreName: string;
}

// Generate mock payment records from paid invoices
function generatePayments(studentId: string): PaymentRecord[] {
  const child = guardianChildren.find(c => c.id === studentId);
  const paidInvoices = mockInvoices.filter(
    inv => inv.studentId === studentId && (inv.status === 'paid' || (inv.status === 'partially_paid' && inv.paidAmount > 0))
  );

  return paidInvoices.map((inv, idx) => ({
    id: `pay-${inv.id}`,
    invoiceNumber: inv.invoiceNumber,
    description: inv.description,
    amount: inv.paidAmount,
    method: idx % 2 === 0 ? 'FPX Online Banking' : 'JomPAY',
    reference: `REF-${inv.id.toUpperCase()}-${(idx + 1).toString().padStart(3, '0')}`,
    receiptNumber: `RCP-${inv.id.toUpperCase()}-${(idx + 1).toString().padStart(3, '0')}`,
    date: inv.dueDate,
    status: 'completed' as const,
    studentName: child?.name ?? 'Student',
    centreName: child?.centre.name ?? '',
  }));
}

export default function MobilePaymentsPage() {
  const { selectedChildId } = useParentMobileStore();
  const child = guardianChildren.find(c => c.id === selectedChildId);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  const payments = useMemo(
    () => generatePayments(selectedChildId).sort((a, b) => b.date.getTime() - a.date.getTime()),
    [selectedChildId]
  );

  // Receipt detail view
  if (selectedPayment) {
    return (
      <div className="px-4 py-4 space-y-4">
        <button
          onClick={() => setSelectedPayment(null)}
          className="flex items-center gap-1 text-sm text-gray-500 active:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to History
        </button>

        <div className="text-center py-3">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <Receipt className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Payment Receipt</h2>
          <p className="text-xs text-gray-500 mt-1">{selectedPayment.invoiceNumber}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Receipt No.</span>
            <span className="font-mono font-medium">{selectedPayment.receiptNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span>{format(selectedPayment.date, 'dd MMM yyyy, HH:mm')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reference</span>
            <span className="font-mono text-xs">{selectedPayment.reference}</span>
          </div>
          <hr />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Student</span>
            <span className="font-medium">{selectedPayment.studentName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Centre</span>
            <span>{selectedPayment.centreName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Invoice</span>
            <span>{selectedPayment.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Description</span>
            <span className="text-right max-w-[60%]">{selectedPayment.description}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Method</span>
            <span>{selectedPayment.method}</span>
          </div>
          <hr />
          <div className="flex justify-between text-base">
            <span className="font-semibold">Amount Paid</span>
            <span className="font-bold text-green-600">RM {selectedPayment.amount.toFixed(2)}</span>
          </div>
          <StatusBadge status="paid" />
        </div>

        <button
          onClick={() => setShowPdf(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Preview &amp; Download PDF
        </button>

        <button
          onClick={() => { setSelectedPayment(null); setShowPdf(false); }}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-green-700"
        >
          Done
        </button>

        {showPdf && (
          <PdfDocument
            title="Payment Receipt"
            subtitle={selectedPayment.receiptNumber}
            onClose={() => setShowPdf(false)}
            rows={[
              { label: 'Receipt No.', value: selectedPayment.receiptNumber },
              { label: 'Date', value: format(selectedPayment.date, 'dd MMM yyyy, HH:mm') },
              { label: 'Reference', value: selectedPayment.reference },
              { label: '---', value: '' },
              { label: 'Student', value: selectedPayment.studentName },
              { label: 'Centre', value: selectedPayment.centreName },
              { label: 'Invoice', value: selectedPayment.invoiceNumber },
              { label: 'Description', value: selectedPayment.description },
              { label: '---', value: '' },
              { label: 'Payment Method', value: selectedPayment.method },
              { label: 'Status', value: 'COMPLETED', color: 'green' },
              { label: '---', value: '' },
              { label: 'Amount Paid', value: `RM ${selectedPayment.amount.toFixed(2)}`, bold: true, color: 'green' },
            ]}
          />
        )}
      </div>
    );
  }

  // Payment list view
  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Payment History</h1>
        <p className="text-xs text-gray-500">{child?.name ?? 'Student'} — {payments.length} payment{payments.length !== 1 ? 's' : ''}</p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CreditCard className="h-10 w-10 mx-auto mb-2" />
          <p className="text-sm">No payments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((pay) => (
            <button
              key={pay.id}
              onClick={() => setSelectedPayment(pay)}
              className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">RM {pay.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{pay.invoiceNumber}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={pay.status} />
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{pay.method.split(' ')[0]}</span>
                  <span className="font-mono text-[10px]">{pay.reference}</span>
                </div>
                <span>{format(pay.date, 'dd MMM yyyy')}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
