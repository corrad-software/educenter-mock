import { promises as fs } from 'fs';
import { spawn, type ChildProcess } from 'child_process';
import net from 'net';
import mysql from 'mysql2/promise';

interface MysqlSshPaymentConfig {
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
  customerId?: string;
}

interface PaymentUpdateInput {
  invoiceNumber: string;
  totalPayment: number;
  receiptNo: string;
}

function getMysqlSshPaymentConfig(): MysqlSshPaymentConfig | null {
  const sshHost = process.env.EXTERNAL_DB_SSH_HOST;
  const sshUser = process.env.EXTERNAL_DB_SSH_USER;
  const sshKeyPath = process.env.EXTERNAL_DB_SSH_KEY_PATH;
  const mysqlHost = process.env.EXTERNAL_DB_MYSQL_HOST;
  const mysqlUser = process.env.EXTERNAL_DB_MYSQL_USER;

  if (!sshHost || !sshUser || !sshKeyPath || !mysqlHost || !mysqlUser) {
    return null;
  }

  return {
    sshHost,
    sshPort: Number(process.env.EXTERNAL_DB_SSH_PORT ?? 22),
    sshUser,
    sshKeyPath,
    sshPassphrase: process.env.EXTERNAL_DB_SSH_KEY_PASSPHRASE,
    mysqlHost,
    mysqlPort: Number(process.env.EXTERNAL_DB_MYSQL_PORT ?? 3306),
    mysqlUser,
    mysqlPassword: process.env.EXTERNAL_DB_MYSQL_PASSWORD,
    mysqlDatabase: process.env.EXTERNAL_DB_MYSQL_DATABASE,
    customerId: process.env.EXTERNAL_DB_CUSTOMER_ID,
  };
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

function startSshTunnel(cfg: MysqlSshPaymentConfig, localPort: number): ChildProcess {
  const args = [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ExitOnForwardFailure=yes',
    '-i', cfg.sshKeyPath,
    '-N',
    '-L', `${localPort}:${cfg.mysqlHost}:${cfg.mysqlPort}`,
    '-p', String(cfg.sshPort),
    `${cfg.sshUser}@${cfg.sshHost}`,
  ];

  return spawn('ssh', args, { stdio: 'pipe' });
}

export async function updateExternalInvoicePayment(input: PaymentUpdateInput): Promise<{ affectedRows: number; studentRows: number }> {
  const mode = process.env.EXTERNAL_INVOICE_MODE ?? 'api';
  if (mode !== 'mysql_ssh') {
    throw new Error('External payment update is only available when EXTERNAL_INVOICE_MODE=mysql_ssh.');
  }

  if (!input.invoiceNumber?.trim()) {
    throw new Error('invoiceNumber is required.');
  }
  if (!Number.isFinite(input.totalPayment) || input.totalPayment <= 0) {
    throw new Error('totalPayment must be a positive number.');
  }
  if (!input.receiptNo?.trim()) {
    throw new Error('receiptNo is required.');
  }

  const cfg = getMysqlSshPaymentConfig();
  if (!cfg) {
    throw new Error('Missing EXTERNAL_DB SSH/MySQL configuration.');
  }

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

    const sql = `
      UPDATE cust_invoice_master cim
      INNER JOIN cust_invoice_details cid ON cim.cim_cust_invoice_id = cid.cim_cust_invoice_id
      SET
        cim.cim_bal_amt = cim.cim_bal_amt - ?,
        cim.cim_paid_amt = cim.cim_paid_amt + ?,
        cid.cid_paid_amt = cid.cid_paid_amt + ?,
        cid.cid_bal_amt = cid.cid_bal_amt - ?,
        cid.cid_extended_field = JSON_SET(
          COALESCE(cid.cid_extended_field, JSON_OBJECT()),
          '$.knockoffReferenceNo',
          CONCAT_WS(
            ',',
            NULLIF(JSON_UNQUOTE(JSON_EXTRACT(cid.cid_extended_field, '$.knockoffReferenceNo')), ''),
            ?
          )
        )
      WHERE cim.cim_invoice_no = ?
      ${cfg.customerId ? 'AND cim.cim_cust_id = ?' : ''}
    `;

    const params: Array<string | number> = [
      input.totalPayment,
      input.totalPayment,
      input.totalPayment,
      input.totalPayment,
      input.receiptNo,
      input.invoiceNumber,
    ];
    if (cfg.customerId) {
      params.push(cfg.customerId);
    }

    await connection.beginTransaction();

    const [result] = await connection.execute<mysql.ResultSetHeader>(sql, params);
    const affectedRows = result.affectedRows ?? 0;

    let targetStudentId = cfg.customerId;
    if (!targetStudentId) {
      const [studentRows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT cim_cust_id AS studentId FROM cust_invoice_master WHERE cim_invoice_no = ? LIMIT 1',
        [input.invoiceNumber]
      );
      targetStudentId = studentRows[0]?.studentId ? String(studentRows[0].studentId) : undefined;
    }

    let studentRows = 0;
    if (targetStudentId) {
      const [studentUpdate] = await connection.execute<mysql.ResultSetHeader>(
        `
          UPDATE fims_usr.student std
          SET std_outstanding_amt = getStudOutstandingAmt(std_student_id)
          WHERE std.std_student_id = ?
        `,
        [targetStudentId]
      );
      studentRows = studentUpdate.affectedRows ?? 0;
    }

    await connection.commit();
    return { affectedRows, studentRows };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
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
        console.warn('[invoice-payment] SSH tunnel stderr:', stderr);
      }
    }
  }
}
