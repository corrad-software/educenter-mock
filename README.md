# EduCentre - MAIWP Student Management Portal (Mockup)

A comprehensive prototype of the Integrated Student Management Portal for MAIWP (Majlis Agama Islam Wilayah Persekutuan).

## Overview

This mockup demonstrates the key functional domains of the student management system, including:

- **Parent Portal**: Invoice viewing, payment processing, statement of accounts, and notifications
- **Centre Administration**: Student registration, attendance tracking, transfer/withdrawal management
- **Finance Console**: Fee setup, subsidy rules, approval workflows, AR monitoring, and aging reports
- **Audit & Compliance**: Audit logs, exception reports, approval history, and compliance monitoring
- **Integration Dashboard**: IAS sync, payment gateway, WhatsApp, and email integration logs

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd educentre-mock
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

### 1. Parent Portal (`/parent`)

- **Dashboard**: Student information, quick stats (outstanding balance, last payment, next due date)
- **Invoices Tab**: View all invoices with subsidy breakdown, payment status, and pay now action
- **Payment History Tab**: Complete record of all payments with reference numbers
- **Statement of Account Tab**: Comprehensive financial summary with transaction history
- **Notifications Tab**: Important updates, payment reminders, and centre announcements

### 2. Centre Admin (`/admin`)

- **Student Management**: Complete student list with search and filter capabilities
- **Registration**: New student registration form with IC validation and subsidy category selection
- **Attendance Tracking**: Daily attendance with Face ID/QR Code/Manual entry support
- **Attendance Analytics**: Breakdown by method, weekly trends, and absence alerts
- **Transfer & Withdrawal**: Request management with approval workflow

### 3. Finance Console (`/finance`)

- **Financial Dashboard**: Revenue, outstanding AR, collection rate, and subsidy utilization
- **Approval Queue**: Review and approve financial requests based on approval matrix
- **Fee Setup**: Configure fee categories by age group with deposit amounts
- **Subsidy Rules**: Manage B40/M40/Asnaf subsidy percentages and eligibility
- **AR Monitoring**: Track outstanding invoices with days overdue
- **Aging Report**: Outstanding receivables by age bracket (0-30, 31-60, 61-90, 90+ days)

### 4. Audit & Compliance (`/audit`)

- **Audit Trail**: Complete system activity log with before/after data capture
- **Exception Reports**: Automated detection of policy violations and anomalies
- **Approval History**: Complete record of all approval workflows
- **Compliance Dashboard**: SAGA & PPIBZW compliance monitoring
  - Segregation of Duties (SoD)
  - Data Retention policies
  - Access Control (RBAC, SSO, 2FA)
  - GL Period Control

### 5. Integration Dashboard (`/integration`)

- **Health Overview**: Real-time status of all integrations
- **Integration Logs**: Complete history with request/response details
- **Failed Integration Alerts**: Quick access to retry failed syncs
- **Configuration**: IAS, Payment Gateway, WhatsApp, and Email settings

## Key Functional Flows

### Student Registration Flow

1. Parent applies through portal or admin creates registration
2. System validates IC and assigns income bracket
3. Subsidy eligibility determined (B40/M40/Asnaf)
4. Student code generated automatically
5. Fee category assigned based on age group
6. Deposit amount calculated

### Invoice & Payment Flow

1. Monthly fee automatically billed at start of month
2. Subsidy offset applied based on category
3. Invoice triggered to IAS for AR posting
4. Parent receives notification (WhatsApp/Email/Portal)
5. Payment processed via FPX/JomPAY/Salary Deduction
6. Receipt generated and reconciled with IAS
7. Outstanding balance updated

### Attendance & Penalty Flow

1. Student check-in via Face ID/QR Code/Manual
2. Attendance recorded with timestamp
3. Absence triggers penalty calculation
4. Multiple absences generate alerts
5. Penalties added to next invoice

### Approval Workflow

Based on financial impact:
- ≤ RM 5,000: Centre Head
- RM 5,001 - RM 20,000: Department Head / Jawatankuasa
- ≥ RM 20,001: Mesyuarat MAIWP

## Mock Data

The prototype uses mock data defined in `/lib/mock-data/index.ts`:

- 2 sample students with different subsidy categories
- 3 invoices (paid, pending, overdue)
- Attendance records with various methods
- Subsidy rules (B40: 50%, M40: 30%, Asnaf: 70%)
- Fee categories by age group
- Approval requests in different states
- Audit logs with user actions
- Integration logs for IAS, payment gateway, WhatsApp, email

## Compliance Features

### SAGA & PPIBZW Compliance

- **Audit Trail**: All financial transactions logged with user ID, timestamp, before/after data
- **Segregation of Duties**: Preparer ≠ Approver ≠ Poster
- **Approval Matrix**: Amount-based approval requirements enforced
- **Data Retention**: Minimum 7-year retention for audit logs and financial records
- **Access Control**: RBAC with SSO and 2FA enforcement
- **Encryption**: TLS 1.3 (transit), AES-256 (at rest)
- **GL Period Lock**: Accounting period control to prevent backdated entries

## Project Structure

```
educentre-mock/
├── app/
│   ├── page.tsx                 # Home page with module overview
│   ├── parent/page.tsx          # Parent portal
│   ├── admin/page.tsx           # Centre administration
│   ├── finance/page.tsx         # Finance console
│   ├── audit/page.tsx           # Audit & compliance
│   ├── integration/page.tsx     # Integration dashboard
│   └── layout.tsx               # Root layout with header
├── components/
│   ├── portal/
│   │   └── header.tsx           # Navigation header
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── mock-data/
│       └── index.ts             # Mock data for demonstration
└── public/                      # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## External Invoice DB Connector

Invoice amount sourcing now supports two modes:

1. `api` mode (existing behavior)
2. `mysql_ssh` mode (direct MySQL over SSH tunnel)

Configuration is environment-driven via `.env.local` (see `.env.example`).

### Quick setup for MySQL-over-SSH

1. Set `EXTERNAL_INVOICE_MODE=mysql_ssh`
2. Fill SSH and MySQL env vars (`EXTERNAL_DB_*`)
3. Restart the app

Important:
- SSH key must be OpenSSH private key format for system `ssh`.
- PuTTY `.ppk` keys are not directly supported; convert to OpenSSH first.

### Using your own SQL query

If your invoice data lives in existing tables/views, you can provide a custom SQL:

1. Set `EXTERNAL_DB_CUSTOM_QUERY` in `.env.local`
2. Optionally use `$CUSTOMER_ID` placeholder and set `EXTERNAL_DB_CUSTOMER_ID`
3. Keep aliases compatible with the adapter mapping:
   - `InvoiceNo` or `invoiceNumber`
   - `Amt` or `amount`
   - optional `Balance`/`netAmount`, `InvoiceDate`/`updatedAt`

### Adding New Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

## Future Enhancements (Not in Mockup)

- Authentication & Authorization (NextAuth.js)
- Database integration (Prisma + PostgreSQL)
- API routes for CRUD operations
- Real-time updates (WebSocket/SSE)
- File upload for documents
- Report generation (PDF export)
- SMS notifications
- Multi-language support
- Mobile responsive optimization
- Advanced analytics dashboards

## Notes

This is a **UI mockup prototype** demonstrating the user interface and workflows. It does not include:

- Backend API
- Database
- Authentication system
- Payment gateway integration
- Real IAS connectivity
- WhatsApp/Email sending

For production deployment, these components need to be implemented with proper security, testing, and integration with MAIWP's existing systems.

## License

This mockup is created for MAIWP demonstration purposes.
