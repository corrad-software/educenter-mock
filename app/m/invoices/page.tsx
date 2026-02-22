'use client';

import { useState, useMemo } from 'react';
import { mockInvoices } from '@/lib/mock-data';
import type { Invoice } from '@/lib/types';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { StatusBadge } from '@/components/mobile/StatusBadge';
import { format } from 'date-fns';
import Link from 'next/link';
import { FileText, ArrowLeft, Eye, Download } from 'lucide-react';
import { PdfDocument } from '@/components/mobile/PdfDocument';

export default function MobileInvoicesPage() {
  const { selectedChildId } = useParentMobileStore();
  const child = guardianChildren.find(c => c.id === selectedChildId);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  const invoices = useMemo(
    () => mockInvoices
      .filter(inv => inv.studentId === selectedChildId)
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime()),
    [selectedChildId]
  );

  // Bill detail view
  if (viewingInvoice) {
    const inv = viewingInvoice;
    const outstanding = inv.netAmount - inv.paidAmount;
    const canPay = inv.status !== 'paid' && inv.status !== 'cancelled';

    return (
      <div className="px-4 py-4 space-y-4">
        <button
          onClick={() => setViewingInvoice(null)}
          className="flex items-center gap-1 text-sm text-gray-500 active:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </button>

        <div className="text-center py-3">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Invoice Detail</h2>
          <p className="text-xs text-gray-500 mt-1">{inv.invoiceNumber}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Invoice No.</span>
            <span className="font-mono font-medium">{inv.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Description</span>
            <span className="text-right max-w-[60%]">{inv.description}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={inv.status} />
          </div>
          <hr />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Student</span>
            <span className="font-medium">{child?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Centre</span>
            <span>{child?.centre.name}</span>
          </div>
          <hr />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Issue Date</span>
            <span>{format(inv.issueDate, 'dd MMM yyyy')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Due Date</span>
            <span>{format(inv.dueDate, 'dd MMM yyyy')}</span>
          </div>
          <hr />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gross Amount</span>
            <span>RM {inv.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subsidy ({inv.student?.subsidyCategory ?? '—'})</span>
            <span className="text-green-600">- RM {inv.subsidyAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Net Amount</span>
            <span>RM {inv.netAmount.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Paid</span>
            <span className="text-green-600">RM {inv.paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-semibold">Outstanding</span>
            <span className={`font-bold ${outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
              RM {outstanding.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowPdf(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Preview &amp; Download PDF
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setViewingInvoice(null)}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm active:bg-gray-200"
          >
            Back
          </button>
          {canPay && (
            <Link
              href={`/m/pay?invoiceId=${inv.id}`}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-green-700 text-center"
            >
              Pay RM {outstanding.toFixed(2)}
            </Link>
          )}
        </div>

        {showPdf && (
          <PdfDocument
            title="Invoice"
            subtitle={inv.invoiceNumber}
            onClose={() => setShowPdf(false)}
            rows={[
              { label: 'Invoice No.', value: inv.invoiceNumber },
              { label: 'Description', value: inv.description },
              { label: 'Status', value: inv.status.replace('_', ' ').toUpperCase() },
              { label: '---', value: '' },
              { label: 'Student', value: child?.name ?? '' },
              { label: 'Centre', value: child?.centre.name ?? '' },
              { label: '---', value: '' },
              { label: 'Issue Date', value: format(inv.issueDate, 'dd MMM yyyy') },
              { label: 'Due Date', value: format(inv.dueDate, 'dd MMM yyyy') },
              { label: '---', value: '' },
              { label: 'Gross Amount', value: `RM ${inv.amount.toFixed(2)}` },
              { label: `Subsidy (${inv.student?.subsidyCategory ?? '—'})`, value: `- RM ${inv.subsidyAmount.toFixed(2)}`, color: 'green' },
              { label: 'Net Amount', value: `RM ${inv.netAmount.toFixed(2)}`, bold: true },
              { label: '---', value: '' },
              { label: 'Paid', value: `RM ${inv.paidAmount.toFixed(2)}`, color: 'green' },
              { label: 'Outstanding', value: `RM ${outstanding.toFixed(2)}`, bold: true, color: outstanding > 0 ? 'red' : 'green' },
            ]}
          />
        )}
      </div>
    );
  }

  // Invoice list view
  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Invoices</h1>
        <p className="text-xs text-gray-500">{child?.name ?? 'Student'} — {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileText className="h-10 w-10 mx-auto mb-2" />
          <p className="text-sm">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => {
            const outstanding = inv.netAmount - inv.paidAmount;
            const canPay = inv.status !== 'paid' && inv.status !== 'cancelled';

            return (
              <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inv.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{inv.description}</p>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-400">Gross</p>
                    <p className="font-medium text-gray-700">RM {inv.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Subsidy</p>
                    <p className="font-medium text-green-600">-RM {inv.subsidyAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Net</p>
                    <p className="font-medium text-gray-900">RM {inv.netAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Due: {format(inv.dueDate, 'dd MMM yyyy')}
                  {inv.paidAmount > 0 && inv.status !== 'paid' && (
                    <span className="ml-2 text-blue-600">Paid: RM {inv.paidAmount.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingInvoice(inv)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold py-2 rounded-lg active:bg-gray-200 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Bill
                  </button>
                  {canPay && (
                    <Link
                      href={`/m/pay?invoiceId=${inv.id}`}
                      className="flex-1 flex items-center justify-center bg-green-600 text-white text-xs font-semibold py-2 rounded-lg active:bg-green-700 transition-colors"
                    >
                      Pay RM {outstanding.toFixed(2)}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
