import type { InvoiceAmountRecord, InvoiceAmountSource } from '@/lib/types/invoice-amount-provider';
import { ExternalDbAmountProvider, type MysqlSshConfig } from './providers/external-db';
import { LocalPocAmountProvider } from './providers/local-poc';

const EXTERNAL_MODE_ENV = 'EXTERNAL_INVOICE_MODE';
const EXTERNAL_API_ENV = 'EXTERNAL_INVOICE_API_URL';
const EXTERNAL_TOKEN_ENV = 'EXTERNAL_INVOICE_API_TOKEN';

function getMysqlSshConfig(): MysqlSshConfig | null {
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
    invoiceTable: process.env.EXTERNAL_DB_INVOICE_TABLE ?? 'invoices',
    invoiceNumberColumn: process.env.EXTERNAL_DB_COL_INVOICE_NUMBER ?? 'invoice_number',
    amountColumn: process.env.EXTERNAL_DB_COL_AMOUNT ?? 'amount',
    subsidyColumn: process.env.EXTERNAL_DB_COL_SUBSIDY ?? 'subsidy_amount',
    penaltyColumn: process.env.EXTERNAL_DB_COL_PENALTY ?? 'penalty_amount',
    netColumn: process.env.EXTERNAL_DB_COL_NET ?? 'net_amount',
    updatedAtColumn: process.env.EXTERNAL_DB_COL_UPDATED_AT ?? 'updated_at',
    customQuery: process.env.EXTERNAL_DB_CUSTOM_QUERY,
    customerId: process.env.EXTERNAL_DB_CUSTOMER_ID,
  };
}

export async function getInvoiceAmountsWithFallback(invoiceNumbers: string[]): Promise<{
  amountSource: InvoiceAmountSource;
  records: InvoiceAmountRecord[];
}> {
  const localProvider = new LocalPocAmountProvider();
  const mode = process.env[EXTERNAL_MODE_ENV] ?? 'api';
  const externalUrl = process.env[EXTERNAL_API_ENV];
  const mysqlSshConfig = getMysqlSshConfig();

  if (mode === 'mysql_ssh' && !mysqlSshConfig) {
    return {
      amountSource: 'local_fallback',
      records: await localProvider.getBatchAmounts(invoiceNumbers),
    };
  }

  if (mode !== 'mysql_ssh' && !externalUrl) {
    return {
      amountSource: 'local_fallback',
      records: await localProvider.getBatchAmounts(invoiceNumbers),
    };
  }

  try {
    const externalProvider = mode === 'mysql_ssh'
      ? new ExternalDbAmountProvider({ mysqlSsh: mysqlSshConfig as MysqlSshConfig })
      : new ExternalDbAmountProvider({ baseUrl: externalUrl as string, token: process.env[EXTERNAL_TOKEN_ENV] });
    const records = await externalProvider.getBatchAmounts(invoiceNumbers);
    return { amountSource: 'external', records };
  } catch (error) {
    console.error('[invoice-amount] External provider failed, using local fallback.', error);
    return {
      amountSource: 'local_fallback',
      records: await localProvider.getBatchAmounts(invoiceNumbers),
    };
  }
}
