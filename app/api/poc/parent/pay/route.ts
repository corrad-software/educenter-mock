import { NextResponse } from 'next/server';
import { updateExternalInvoicePayment } from '@/lib/server/invoice-payment/external-mysql-ssh';

interface PayRequestBody {
  invoiceNumber?: string;
  totalPayment?: number;
  receiptNo?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PayRequestBody;
    const invoiceNumber = String(body.invoiceNumber ?? '').trim();
    const totalPayment = Number(body.totalPayment);
    const receiptNo = String(body.receiptNo ?? '').trim();

    if (!invoiceNumber) {
      return NextResponse.json({ error: 'invoiceNumber is required.' }, { status: 400 });
    }
    if (!Number.isFinite(totalPayment) || totalPayment <= 0) {
      return NextResponse.json({ error: 'totalPayment must be a positive number.' }, { status: 400 });
    }
    if (!receiptNo) {
      return NextResponse.json({ error: 'receiptNo is required.' }, { status: 400 });
    }

    const result = await updateExternalInvoicePayment({
      invoiceNumber,
      totalPayment,
      receiptNo,
    });

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'No invoice rows were updated. Check invoice number and customer mapping.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      affectedRows: result.affectedRows,
      invoiceNumber,
      totalPayment,
      receiptNo,
    });
  } catch (error) {
    console.error('[poc-parent-pay] Failed to update external invoice payment.', error);
    const message = error instanceof Error ? error.message : 'Payment update failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
