import type { InvoiceAmountProvider, InvoiceAmountRecord } from '@/lib/types/invoice-amount-provider';
import { promises as fs } from 'fs';
import mysql from 'mysql2/promise';
import { spawn, type ChildProcess } from 'child_process';
import net from 'net';

interface ExternalAmountBatchResponse {
  data?: InvoiceAmountRecord[];
  records?: InvoiceAmountRecord[];
}

interface MysqlSshConfig {
  sshHost: string;
  sshPort: number;
  sshUser: string;
  sshKeyPath: string;
  sshPassphrase?: string;
  mysqlHost: string;
  mysqlPort: number;
  mysqlUser: string;
  mysqlPassword?: string;
  mysqlDatabase?: string;
  invoiceTable: string;
  invoiceNumberColumn: string;
  amountColumn: string;
  subsidyColumn: string;
  penaltyColumn: string;
  netColumn: string;
  updatedAtColumn: string;
  customQuery?: string;
  customerId?: string;
}

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Unable to allocate local tunnel port'));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
  });
}

async function waitForPort(port: number, timeoutMs = 15000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = net.createConnection({ host: '127.0.0.1', port }, () => {
          socket.end();
          resolve();
        });
        socket.on('error', reject);
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error('SSH tunnel did not become ready in time');
}

function startSshTunnel(cfg: MysqlSshConfig, localPort: number): ChildProcess {
  const args = [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ExitOnForwardFailure=yes',
    '-i', cfg.sshKeyPath,
    '-N',
    '-L', `${localPort}:${cfg.mysqlHost}:${cfg.mysqlPort}`,
    '-p', String(cfg.sshPort),
    `${cfg.sshUser}@${cfg.sshHost}`,
  ];

  return spawn('ssh', args, {
    stdio: 'pipe',
  });
}

export class ExternalDbAmountProvider implements InvoiceAmountProvider {
  private readonly mode: 'api' | 'mysql_ssh';
  private readonly baseUrl?: string;
  private readonly token?: string;
  private readonly mysqlSsh?: MysqlSshConfig;

  constructor(options: { baseUrl: string; token?: string } | { mysqlSsh: MysqlSshConfig }) {
    if ('baseUrl' in options) {
      this.mode = 'api';
      this.baseUrl = options.baseUrl.replace(/\/$/, '');
      this.token = options.token;
      return;
    }

    this.mode = 'mysql_ssh';
    this.mysqlSsh = options.mysqlSsh;
  }

  private async fetchFromApi(invoiceNumbers: string[]): Promise<InvoiceAmountRecord[]> {
    if (!this.baseUrl) return [];
    const response = await fetch(`${this.baseUrl}/invoice-amounts/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify({ invoiceNumbers }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`External DB request failed: ${response.status}`);
    }

    const payload = (await response.json()) as ExternalAmountBatchResponse | InvoiceAmountRecord[];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.records)) return payload.records;
    return [];
  }

  private async fetchFromMysqlOverSsh(invoiceNumbers: string[]): Promise<InvoiceAmountRecord[]> {
    if (!this.mysqlSsh) return [];

    const cfg = this.mysqlSsh;
    const privateKey = await fs.readFile(cfg.sshKeyPath, 'utf8');
    if (privateKey.includes('PuTTY-User-Key-File')) {
      throw new Error('PuTTY .ppk key is not supported directly. Convert it to OpenSSH private key first.');
    }

    if (cfg.sshPassphrase) {
      throw new Error('Passphrase-protected SSH keys are not supported in this connector mode.');
    }

    const localPort = await getFreePort();
    const sshProcess = startSshTunnel(cfg, localPort);
    const stderrChunks: string[] = [];

    sshProcess.stderr?.on('data', (chunk) => {
      stderrChunks.push(String(chunk));
    });

    await waitForPort(localPort, 20000);

    let connection: mysql.Connection | undefined;
    try {
      connection = await mysql.createConnection({
        host: '127.0.0.1',
        port: localPort,
        user: cfg.mysqlUser,
        password: cfg.mysqlPassword,
        database: cfg.mysqlDatabase,
        connectTimeout: 15000,
      });

      let rows: mysql.RowDataPacket[] = [];
      if (cfg.customQuery) {
        const sql = cfg.customQuery.replace(/\$CUSTOMER_ID/g, mysql.escape(cfg.customerId ?? ''));
        const [raw] = await connection.query<mysql.RowDataPacket[]>(sql);
        rows = raw;
      } else {
        const inClause = invoiceNumbers.map(() => '?').join(', ');
        const sql = `
          SELECT
            ${cfg.invoiceNumberColumn} AS invoiceNumber,
            ${cfg.amountColumn} AS amount,
            ${cfg.subsidyColumn} AS subsidyAmount,
            ${cfg.penaltyColumn} AS penaltyAmount,
            ${cfg.netColumn} AS netAmount,
            ${cfg.updatedAtColumn} AS updatedAt
          FROM ${cfg.invoiceTable}
          WHERE ${cfg.invoiceNumberColumn} IN (${inClause})
        `;
        const [raw] = await connection.query<mysql.RowDataPacket[]>(sql, invoiceNumbers);
        rows = raw;
      }

      const mapped = rows.map((row) => ({
        invoiceNumber: String(row.invoiceNumber ?? row.InvoiceNo ?? ''),
        amount: Number(row.amount ?? row.Amt ?? 0),
        subsidyAmount: row.subsidyAmount !== null && row.subsidyAmount !== undefined ? Number(row.subsidyAmount) : undefined,
        penaltyAmount: row.penaltyAmount !== null && row.penaltyAmount !== undefined ? Number(row.penaltyAmount) : undefined,
        netAmount: row.netAmount !== null && row.netAmount !== undefined
          ? Number(row.netAmount)
          : (row.Balance !== null && row.Balance !== undefined ? Number(row.Balance) : undefined),
        updatedAt: row.updatedAt
          ? new Date(row.updatedAt as string).toISOString()
          : (row.InvoiceDate ? new Date(row.InvoiceDate as string).toISOString() : undefined),
        customerId: row.customerId ? String(row.customerId) : (row.CustomerId ? String(row.CustomerId) : undefined),
        customerName: row.customerName ? String(row.customerName) : (row.CustomerName ? String(row.CustomerName) : undefined),
        customerType: row.customerType ? String(row.customerType) : (row.CustomerType ? String(row.CustomerType) : undefined),
      }))
        .filter((record) => record.invoiceNumber);

      if (cfg.customQuery) {
        return mapped;
      }

      return mapped.filter((record) => invoiceNumbers.length === 0 || invoiceNumbers.includes(record.invoiceNumber));
    } finally {
      if (connection) {
        await connection.end();
      }
      if (!sshProcess.killed) {
        sshProcess.kill('SIGTERM');
      }
      if (stderrChunks.length > 0) {
        const stderr = stderrChunks.join('').trim();
        if (stderr) {
          console.warn('[invoice-amount] SSH tunnel stderr:', stderr);
        }
      }
    }
  }

  private async fetchBatch(invoiceNumbers: string[]): Promise<InvoiceAmountRecord[]> {
    if (this.mode === 'api') {
      return this.fetchFromApi(invoiceNumbers);
    }
    return this.fetchFromMysqlOverSsh(invoiceNumbers);
  }

  async getAmountByInvoiceNumber(invoiceNumber: string): Promise<InvoiceAmountRecord | null> {
    const records = await this.fetchBatch([invoiceNumber]);
    return records.find((item) => item.invoiceNumber === invoiceNumber) ?? null;
  }

  async getBatchAmounts(invoiceNumbers: string[]): Promise<InvoiceAmountRecord[]> {
    if (this.mode === 'api' && invoiceNumbers.length === 0) return [];
    return this.fetchBatch(invoiceNumbers);
  }
}

export type { MysqlSshConfig };
