import { NextResponse } from 'next/server';
import { mockInvoices } from '@/lib/mock-data';
import { getInvoiceAmountsWithFallback } from '@/lib/server/invoice-amount/factory';

export async function GET() {
  const invoiceNumbers = Array.from(new Set(mockInvoices.map((invoice) => invoice.invoiceNumber)));
  const { amountSource, records } = await getInvoiceAmountsWithFallback(invoiceNumbers);
  const amountMap = new Map(records.map((item) => [item.invoiceNumber, item]));

  const invoices = mockInvoices.map((invoice) => {
    const override = amountMap.get(invoice.invoiceNumber);
    const amount = override?.amount ?? invoice.amount;
    const subsidyAmount = override?.subsidyAmount ?? invoice.subsidyAmount;
    const penaltyAmount = override?.penaltyAmount ?? invoice.penaltyAmount;
    const netAmount = override?.netAmount ?? amount - subsidyAmount + penaltyAmount;

    return {
      invoiceNumber: invoice.invoiceNumber,
      amount,
      subsidyAmount,
      penaltyAmount,
      netAmount,
      updatedAt: override?.updatedAt ?? new Date().toISOString(),
    };
  });

  const existingInvoiceNumbers = new Set(invoices.map((item) => item.invoiceNumber));
  const externalOnlyInvoices = records
    .filter((item) => !existingInvoiceNumbers.has(item.invoiceNumber))
    .map((item) => ({
      invoiceNumber: item.invoiceNumber,
      amount: item.amount,
      subsidyAmount: item.subsidyAmount ?? 0,
      penaltyAmount: item.penaltyAmount ?? 0,
      netAmount: item.netAmount ?? item.amount,
      updatedAt: item.updatedAt ?? new Date().toISOString(),
    }));

  const primaryExternalRecord = records.find((item) => item.customerName || item.customerId);

  return NextResponse.json({
    meta: {
      amountSource,
      lastFetchedAt: new Date().toISOString(),
      externalProfile: primaryExternalRecord
        ? {
            customerId: primaryExternalRecord.customerId ?? null,
            customerName: primaryExternalRecord.customerName ?? null,
            customerType: primaryExternalRecord.customerType ?? null,
          }
        : null,
    },
    invoices: [...invoices, ...externalOnlyInvoices],
  });
}
