import { promises as fs } from 'fs';
import path from 'path';
import type { InvoiceAmountProvider, InvoiceAmountRecord } from '@/lib/types/invoice-amount-provider';

interface LocalPocAmountState {
  invoiceAmounts?: InvoiceAmountRecord[];
}

export class LocalPocAmountProvider implements InvoiceAmountProvider {
  private filePath = path.join(process.cwd(), 'data', 'poc-parent-state.json');

  private async readState(): Promise<LocalPocAmountState> {
    try {
      const content = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(content) as LocalPocAmountState;
    } catch {
      return { invoiceAmounts: [] };
    }
  }

  async getAmountByInvoiceNumber(invoiceNumber: string): Promise<InvoiceAmountRecord | null> {
    const state = await this.readState();
    return state.invoiceAmounts?.find((item) => item.invoiceNumber === invoiceNumber) ?? null;
  }

  async getBatchAmounts(invoiceNumbers: string[]): Promise<InvoiceAmountRecord[]> {
    const state = await this.readState();
    const wanted = new Set(invoiceNumbers);
    return (state.invoiceAmounts ?? []).filter((item) => wanted.has(item.invoiceNumber));
  }
}

