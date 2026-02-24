export type InvoiceAmountSource = 'external' | 'local_fallback';

export interface InvoiceAmountRecord {
  invoiceNumber: string;
  amount: number;
  subsidyAmount?: number;
  penaltyAmount?: number;
  netAmount?: number;
  updatedAt?: string;
  customerId?: string;
  customerName?: string;
  customerType?: string;
}

export interface InvoiceAmountProvider {
  getAmountByInvoiceNumber(invoiceNumber: string): Promise<InvoiceAmountRecord | null>;
  getBatchAmounts(invoiceNumbers: string[]): Promise<InvoiceAmountRecord[]>;
}
