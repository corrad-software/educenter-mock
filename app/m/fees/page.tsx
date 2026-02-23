'use client';

import { useState, useMemo } from 'react';
import { mockInvoices } from '@/lib/mock-data';
import type { Invoice } from '@/lib/types';
import { useParentMobileStore, guardianChildren } from '@/lib/store/parent-mobile-store';
import { StatusBadge } from '@/components/mobile/StatusBadge';
import { format } from 'date-fns';
import Link from 'next/link';
import { FileText, CreditCard, Eye, Download, ArrowLeft, Receipt, ChevronRight, CheckCircle2 } from 'lucide-react';
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

export default function MobileFeesPage() {
  const { selectedChildId } = useParentMobileStore();
  const child = guardianChildren.find(c => c.id === selectedChildId);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  const invoices = useMemo(
    () => mockInvoices
      .filter(inv => inv.studentId === selectedChildId)
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime()),
    [selectedChildId]
  );

  const payments = useMemo(
    () => generatePayments(selectedChildId).sort((a, b) => b.date.getTime() - a.date.getTime()),
    [selectedChildId]
  );

  // Invoice detail view
  if (viewingInvoice) {
    const inv = viewingInvoice;
    const outstanding = inv.netAmount - inv.paidAmount;
    const canPay = inv.status !== 'paid' && inv.status !== 'cancelled';

    return (
      <div className="flex flex-col h-full bg-white absolute inset-0 z-50 animate-in slide-in-from-right-full duration-300">
        <div className="sticky top-0 z-10 glass px-4 py-3 flex items-center justify-between">
          <button onClick={() => setViewingInvoice(null)} className="flex items-center justify-center p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <span className="text-[15px] font-bold">Invoice Details</span>
          <div className="w-9" /> {/* spacer */}
        </div>

        <div className="flex-1 overflow-y-auto hidden-scrollbar pb-32">
          <div className="px-5 py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-4 ring-1 ring-blue-100 shadow-sm border border-white">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-[13px] font-bold text-slate-400 tracking-widest uppercase mb-1">Invoice Amount</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">RM {inv.netAmount.toFixed(2)}</h2>
            <StatusBadge status={inv.status} />
          </div>

          <div className="px-5">
            <div className="bg-slate-50 rounded-3xl p-5 space-y-4 border border-slate-100/80">
              <h3 className="text-[12px] uppercase tracking-widest font-extrabold text-slate-400 mb-2">Invoice Info</h3>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Invoice No.</span><span className="text-[14px] font-mono font-bold">{inv.invoiceNumber}</span></div>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Issue Date</span><span className="text-[14px] font-bold">{format(inv.issueDate, 'dd MMM yyyy')}</span></div>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Due Date</span><span className="text-[14px] font-bold text-red-600">{format(inv.dueDate, 'dd MMM yyyy')}</span></div>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Student</span><span className="text-[14px] font-bold max-w-[50%] text-right">{child?.name}</span></div>

              <div className="h-px bg-slate-200 border-none my-1" />

              <h3 className="text-[12px] uppercase tracking-widest font-extrabold text-slate-400 mb-2">Summary</h3>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Gross Amount</span><span className="text-[14px] font-bold">RM {inv.amount.toFixed(2)}</span></div>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Subsidy</span><span className="text-[14px] font-bold text-green-600">-RM {inv.subsidyAmount.toFixed(2)}</span></div>

              <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-slate-500 font-bold">Total Paid</span>
                  <span className="text-[14px] font-bold text-green-600">RM {inv.paidAmount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-100 w-full mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-slate-900 font-black">Outstanding</span>
                  <span className={`text-[16px] font-black tracking-tight ${outstanding > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                    RM {outstanding.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={() => setShowPdf(true)} className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-blue-600 font-bold text-[15px] rounded-2xl bg-blue-50 active:bg-blue-100 transition-colors">
              <Download className="h-5 w-5" /> Download Full PDF
            </button>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] glass-bottom border-t border-gray-200 z-20">
          <div className="flex gap-3">
            <button onClick={() => setViewingInvoice(null)} className="flex-1 bg-gray-100 text-slate-700 py-3.5 rounded-2xl font-black text-[15px] active:bg-gray-200 transition-colors">Back</button>
            {canPay && (
              <Link href={`/m/pay?invoiceId=${inv.id}`} className="flex-[2] bg-blue-600 text-white py-3.5 rounded-2xl font-black text-[15px] active:scale-[0.98] transition-all text-center flex items-center justify-center shadow-lg shadow-blue-600/20">
                Pay RM {outstanding.toFixed(2)}
              </Link>
            )}
          </div>
        </div>

        {showPdf && <PdfDocument title="Invoice" subtitle={inv.invoiceNumber} onClose={() => setShowPdf(false)} rows={[]} />}
      </div>
    );
  }

  // Receipt detail view
  if (selectedPayment) {
    return (
      <div className="flex flex-col h-full bg-white absolute inset-0 z-50 animate-in slide-in-from-right-full duration-300">
        <div className="sticky top-0 z-10 glass px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSelectedPayment(null)} className="flex items-center justify-center p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <span className="text-[15px] font-bold">Payment Receipt</span>
          <div className="w-9" />
        </div>

        <div className="flex-1 overflow-y-auto hidden-scrollbar pb-32">
          <div className="px-5 py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center mb-4 ring-1 ring-green-100 shadow-sm border border-white">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <span className="text-[13px] font-bold text-slate-400 tracking-widest uppercase mb-1">Payment Successful</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">RM {selectedPayment.amount.toFixed(2)}</h2>
            <p className="text-[14px] text-slate-500 font-medium mb-3">{format(selectedPayment.date, 'dd MMM yyyy, h:mm a')}</p>
          </div>

          <div className="px-5">
            <div className="bg-slate-50 rounded-3xl p-5 space-y-4 border border-slate-100/80">
              <h3 className="text-[12px] uppercase tracking-widest font-extrabold text-slate-400 mb-2">Transaction Info</h3>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Receipt No.</span><span className="text-[14px] font-mono font-bold">{selectedPayment.receiptNumber}</span></div>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Reference</span><span className="text-[14px] font-mono text-slate-600">{selectedPayment.reference}</span></div>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Payment Method</span><span className="text-[14px] font-bold">{selectedPayment.method}</span></div>

              <div className="h-px bg-slate-200 border-none my-1" />

              <h3 className="text-[12px] uppercase tracking-widest font-extrabold text-slate-400 mb-2">Payment For</h3>
              <div className="flex justify-between items-baseline"><span className="text-[14px] text-slate-500 font-medium">Invoice No.</span><span className="text-[14px] font-mono font-bold">{selectedPayment.invoiceNumber}</span></div>
              <div className="flex justify-between items-start"><span className="text-[14px] text-slate-500 font-medium">Description</span><span className="text-[14px] font-medium text-right max-w-[50%]">{selectedPayment.description}</span></div>
            </div>

            <button onClick={() => setShowPdf(true)} className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-green-600 font-bold text-[15px] rounded-2xl bg-green-50/50 active:bg-green-100 transition-colors border border-green-100/50">
              <Download className="h-5 w-5" /> Download Digital Receipt
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] glass-bottom border-t border-gray-200 z-20">
          <button onClick={() => { setSelectedPayment(null); setShowPdf(false); }} className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-[15px] active:scale-[0.98] transition-all">
            Done
          </button>
        </div>

        {showPdf && <PdfDocument title="Payment Receipt" subtitle={selectedPayment.receiptNumber} onClose={() => setShowPdf(false)} rows={[]} />}
      </div>
    );
  }

  // Main fees view with tab toggle
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-md pt-5 pb-3 px-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border-b border-gray-200/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-none mb-1">Fees & Payments</h1>
        <p className="text-[14px] text-slate-500 font-medium">{child?.name ?? 'Student'}</p>

        {/* Tab Toggle */}
        <div className="flex bg-gray-200/80 rounded-xl p-1 mt-4">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold transition-all duration-200 ${activeTab === 'invoices' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Invoices
            {invoices.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 ${activeTab === 'invoices' ? 'text-slate-800' : 'text-slate-400'}`}>
                {invoices.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2 rounded-[8px] text-[13px] font-bold transition-all duration-200 ${activeTab === 'payments' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            History
            {payments.length > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 ${activeTab === 'payments' ? 'text-slate-800' : 'text-slate-400'}`}>
                {payments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {invoices.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-[15px] font-bold text-slate-700">No invoices found</p>
                <p className="text-[13px] text-slate-500 mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4 pb-8">
                {invoices.map((inv, idx) => {
                  const outstanding = inv.netAmount - inv.paidAmount;
                  const canPay = inv.status !== 'paid' && inv.status !== 'cancelled';
                  const isFirst = idx === 0;

                  return (
                    <div key={inv.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
                      {isFirst && canPay && (
                        <div className="absolute top-0 right-0 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black tracking-widest uppercase rounded-bl-xl z-10 border-b border-l border-red-100">
                          Due Soon
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3 pr-16">
                          <div>
                            <p className="text-[15px] font-bold text-slate-900">{inv.description}</p>
                            <p className="text-[12px] font-mono text-slate-500 mt-0.5">{inv.invoiceNumber}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <StatusBadge status={inv.status} />
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[12px] text-slate-500 font-medium">Due {format(inv.dueDate, 'dd MMM')}</span>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100/60">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[13px] text-slate-500 font-medium">Net Amount</span>
                            <span className="text-[14px] font-bold text-slate-900">RM {inv.netAmount.toFixed(2)}</span>
                          </div>
                          {inv.paidAmount > 0 && (
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[13px] text-slate-500 font-medium">Paid</span>
                              <span className="text-[13px] font-bold text-green-600">-RM {inv.paidAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="h-px w-full bg-slate-200 my-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-slate-500 font-bold">Outstanding</span>
                            <span className={`text-[16px] font-black ${outstanding > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                              RM {outstanding.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <button onClick={() => setViewingInvoice(inv)} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-slate-700 text-[13px] font-bold h-11 rounded-[14px] active:bg-gray-200 transition-colors no-tap-highlight">
                            <Eye className="h-4 w-4" /> Details
                          </button>
                          {canPay && (
                            <Link href={`/m/pay?invoiceId=${inv.id}`} className="flex-[1.5] flex items-center justify-center bg-blue-600 text-white text-[13px] font-bold h-11 rounded-[14px] active:bg-blue-700 transition-colors no-tap-highlight shadow-sm shadow-blue-600/20">
                              Pay RM {outstanding.toFixed(2)}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {payments.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-[15px] font-bold text-slate-700">No payment history</p>
                <p className="text-[13px] text-slate-500 mt-1">Payments made will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 pb-8">
                {payments.map((pay) => (
                  <button
                    key={pay.id}
                    onClick={() => setSelectedPayment(pay)}
                    className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4 active:scale-[0.98] transition-all no-tap-highlight"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 ring-1 ring-green-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-[15px] font-bold text-slate-900 leading-none mb-1">RM {pay.amount.toFixed(2)}</p>
                            <p className="text-[12px] text-slate-500">{pay.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 mt-2" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-medium pt-3 border-t border-slate-50">
                        <span className="text-slate-400">{format(pay.date, 'dd MMM yyyy, HH:mm')}</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{pay.method}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
