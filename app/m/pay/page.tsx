'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockInvoices } from '@/lib/mock-data';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { StatusBadge } from '@/components/mobile/StatusBadge';
import { ArrowLeft, CheckCircle, CreditCard, Download } from 'lucide-react';
import { PdfDocument } from '@/components/mobile/PdfDocument';
import Link from 'next/link';
import { format } from 'date-fns';

const PAYMENT_METHODS = [
  { id: 'fpx', label: 'FPX Online Banking' },
  { id: 'jompay', label: 'JomPAY' },
  { id: 'credit', label: 'Credit Card' },
  { id: 'debit', label: 'Debit Card' },
];

export default function MobilePayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedChildId } = useParentMobileStore();
  const invoiceId = searchParams.get('invoiceId');

  const invoice = mockInvoices.find(inv => inv.id === invoiceId && inv.studentId === selectedChildId);
  const child = guardianChildren.find(c => c.id === selectedChildId);
  const outstanding = invoice ? invoice.netAmount - invoice.paidAmount : 0;

  const [paymentType, setPaymentType] = useState<'full' | 'half' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('fpx');
  const [receipt, setReceipt] = useState<{ number: string; ref: string; amount: number; date: Date; method: string } | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  const payAmount = useMemo(() => {
    if (paymentType === 'full') return outstanding;
    if (paymentType === 'half') return Math.round(outstanding * 0.5 * 100) / 100;
    return parseFloat(customAmount) || 0;
  }, [paymentType, outstanding, customAmount]);

  const handlePay = () => {
    if (payAmount <= 0 || payAmount > outstanding) return;
    const receiptNum = `RCP-${Date.now().toString(36).toUpperCase()}`;
    const ref = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const methodLabel = PAYMENT_METHODS.find(m => m.id === method)?.label ?? method;
    setReceipt({ number: receiptNum, ref, amount: payAmount, date: new Date(), method: methodLabel });
  };

  // No invoice found
  if (!invoice) {
    return (
      <div className="px-4 py-4">
        <Link href="/m/invoices" className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Link>
        <p className="text-center text-gray-400 py-12">Invoice not found</p>
      </div>
    );
  }

  // Receipt view
  if (receipt) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="text-center py-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Payment Successful</h2>
          <p className="text-sm text-gray-500 mt-1">Your payment has been processed</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Receipt No.</span>
            <span className="font-mono font-medium">{receipt.number}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span>{format(receipt.date, 'dd MMM yyyy, HH:mm')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reference</span>
            <span className="font-mono text-xs">{receipt.ref}</span>
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
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Invoice</span>
            <span>{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Method</span>
            <span>{receipt.method}</span>
          </div>
          <hr />
          <div className="flex justify-between text-base">
            <span className="font-semibold">Amount Paid</span>
            <span className="font-bold text-green-600">RM {receipt.amount.toFixed(2)}</span>
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
          onClick={() => router.push('/m/invoices')}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-green-700"
        >
          Done
        </button>

        {showPdf && (
          <PdfDocument
            title="Payment Receipt"
            subtitle={receipt.number}
            onClose={() => setShowPdf(false)}
            rows={[
              { label: 'Receipt No.', value: receipt.number },
              { label: 'Date', value: format(receipt.date, 'dd MMM yyyy, HH:mm') },
              { label: 'Reference', value: receipt.ref },
              { label: '---', value: '' },
              { label: 'Student', value: child?.name ?? '' },
              { label: 'Centre', value: child?.centre.name ?? '' },
              { label: 'Invoice', value: invoice.invoiceNumber },
              { label: 'Description', value: invoice.description },
              { label: '---', value: '' },
              { label: 'Payment Method', value: receipt.method },
              { label: 'Status', value: 'PAID', color: 'green' },
              { label: '---', value: '' },
              { label: 'Amount Paid', value: `RM ${receipt.amount.toFixed(2)}`, bold: true, color: 'green' },
            ]}
          />
        )}
      </div>
    );
  }

  // Payment form
  return (
    <div className="px-4 py-4 space-y-4">
      <Link href="/m/invoices" className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft className="h-4 w-4" /> Back to Invoices
      </Link>

      <div>
        <h1 className="text-lg font-bold text-gray-900">Make Payment</h1>
        <p className="text-xs text-gray-500">{invoice.invoiceNumber} — {invoice.description}</p>
      </div>

      {/* Invoice Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div>
            <p className="text-gray-400">Net Amount</p>
            <p className="text-sm font-bold">RM {invoice.netAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Paid</p>
            <p className="text-sm font-bold text-green-600">RM {invoice.paidAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Outstanding</p>
            <p className="text-sm font-bold text-red-600">RM {outstanding.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payment Type */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Payment Amount</p>
        <div className="grid grid-cols-3 gap-2">
          {(['full', 'half', 'custom'] as const).map((type) => {
            const labels = { full: 'Full', half: '50%', custom: 'Custom' };
            return (
              <button
                key={type}
                onClick={() => setPaymentType(type)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  paymentType === type
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 active:bg-gray-50'
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>
        {paymentType === 'custom' && (
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            min="1"
            max={outstanding}
          />
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Payment Method</p>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-colors text-left ${
                method === m.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 active:bg-gray-50'
              }`}
            >
              <CreditCard className={`h-4 w-4 ${method === m.id ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={method === m.id ? 'font-medium text-green-700' : 'text-gray-700'}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Amount to Pay</span>
          <span className="text-xl font-bold text-gray-900">RM {payAmount.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePay}
          disabled={payAmount <= 0 || payAmount > outstanding}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Process Payment
        </button>
      </div>
    </div>
  );
}
