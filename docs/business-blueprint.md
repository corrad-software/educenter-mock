# EduCentre (Student Management) Portal — Business Blueprint

> **Source:** Business Blueprint Document Checklist — MAIWP PPIBZW Project
> **Extracted for:** POC Development Reference

---

## Table of Contents

1. [Business Process Context](#1-business-process-context)
2. [Integration Objectives](#2-integration-objectives)
3. [Institutions Covered](#3-institutions-covered)
4. [Key Functional Domains](#4-key-functional-domains)
5. [Student Lifecycle Process](#5-student-lifecycle-process)
6. [Fee Management Process](#6-fee-management-process)
7. [Non-Financial Processes](#7-non-financial-processes)
8. [User Roles & Access Matrix](#8-user-roles--access-matrix)
9. [Approval Matrix](#9-approval-matrix)
10. [Master Data Requirements](#10-master-data-requirements)
11. [Reporting Requirements](#11-reporting-requirements)
12. [Output Requirements](#12-output-requirements)
13. [Interfaces & Integration](#13-interfaces--integration)
14. [Functional Enhancements](#14-functional-enhancements)
15. [Security & Authorisation](#15-security--authorisation)
16. [System Architecture](#16-system-architecture)
17. [SAGA & PPIBZW Compliance](#17-saga--ppibzw-compliance)
18. [Non-Functional Requirements](#18-non-functional-requirements)
19. [Data Conversion](#19-data-conversion)

---

## 1. Business Process Context

EduCentre is MAIWP's **centralized digital platform** for managing the entire student lifecycle and related financial transactions across all education institutions.

### What EduCentre Consolidates

| Module | Description |
|--------|-------------|
| Student Registration | Application, registration, re-enrolment, transfers, withdrawals, alumni |
| Attendance Management | Real-time Face ID and manual logging |
| Fee Billing | Automated tuition billing, subsidy offsets, penalty generation |
| Subsidy Administration | B40/M40/Asnaf eligibility, fund tagging |
| Academic Progress | Programme performance tracking |
| Guardian Communications | WhatsApp, email, portal access |
| Admission Application | Online application with IC/income validation |
| Health System | Student/trainee health records |
| SMS Book (Log Book) | Daily activity logging (especially Taska) |
| Discipline/Merit | Demerit/merit tracking |
| Management Policies | Student/trainee/resident policies |
| Complaints | Complaint management |
| Inspection/Monitoring | Procurement, school management |
| Co-curricular Activities | Activity tracking |
| Institutional Calendar | Academic calendar management |

### Key Principle

> All financial activities (invoice generation, payment receipting, reconciliation, subsidy offsetting, fund posting) **originate from and are controlled by the Accounting System**. EduCentre is the **operational and engagement layer** that collects data and triggers financial workflows.

---

## 2. Integration Objectives

1. **Unified data environment** linking students, guardians, education centres, and finance
2. **Automate billing, payment, and subsidy** processing through direct linkage to AR, Deposit, GL, AP modules
3. **Enhanced operational visibility** through dashboards for attendance, fee collection, subsidy utilization, and enrolment analytics
4. **Future scalability** for MAIWP's growing education portfolio (SAGA & PPIBZW compliance)
5. **Integrate with SMAZ & e-Kasih**

---

## 3. Institutions Covered

| # | Institution | Type | Notes |
|---|-----------|------|-------|
| a | **Tadika MAIWP** (77 centres) | Preschool | KL, Putrajaya, Labuan |
| b | **Taska MAIWP** (2 centres) | Nursery/Childcare | KL |
| c | **Pondok Moden Al-Abaqirah (PMA)** | Residential Religious | Annual fee-based |
| d | **Darul Ilmi** | Community Learning | Senior citizen study centres |
| e | **Darul Kifayah** | Welfare/Residential | Orphans, new reverts, asnaf |
| f | **Dar Assaadah** | Welfare/Residential | Women facing social issues |
| g | **SMA MAIWP** | Secondary School | Integrated Dini Curriculum (KBD) |
| h | **SMISTA** | Secondary School | Integrated Tahfiz Curriculum (KBT) |
| i | **KPMAIWP** | Professional College | Higher education |
| j | **IKB** | Skills Institute | Vocational/skills training |
| — | **Future Expansion** | Configurable | Colleges, vocational institutes, short-course centres |

> **Important:** The system must be **scalable and configurable** to onboard any new MAIWP education institution or programme type without major redesign.

---

## 4. Key Functional Domains

| Domain | Description |
|--------|-------------|
| **Student Lifecycle** | Application, registration, re-enrolment, transfers, withdrawals, alumni management |
| **Attendance Management** | Real-time Face ID and manual logging for attendance validation and penalty triggers |
| **Fee & Subsidy Management** | Automated tuition billing, subsidy offsets, and penalty generation |
| **Payment & Reconciliation** | Multi-channel payment integration (FPX, JomPAY, salary deduction) with Accounting System reconciliation |
| **Guardian & Communication** | Multi-channel alerts via WhatsApp, email, and portal access for invoices and attendance |
| **Analytics & Compliance** | Dashboards for collection, subsidy usage, and compliance with SAGA, PPIBZW, and internal audit |

---

## 5. Student Lifecycle Process

| Step | Activity | Description | System Integration |
|------|----------|-------------|-------------------|
| 1 | **Student Application** | Parents submit application via EduCentre. System validates IC, household income bracket, centre preference. | EduCentre <-> SMAZ/Finance |
| 2 | **Subsidy Eligibility Verification** | Auto-check B40/M40/Asnaf eligibility. Subsidy tier pre-assigned for registration, fee mapping, invoice calculation. | EduCentre <-> SMAZ/Finance |
| 3 | **Student Registration** | Formal registration. Demographics validated; subsidy tier applied; student code auto-generated. | EduCentre <-> Accounting |
| 4 | **Fee & Deposit Category Assignment** | Fee category mapped by programme (Tadika/Taska/PMA/etc). Deposit rules, subsidy adjustments, recurring fee schedules applied. | EduCentre <-> AR <-> Deposit |
| 5 | **Attendance Management** | Daily attendance via Face ID, QR, or manual log. Feeds penalty triggers, fee adjustments, welfare reporting. | EduCentre <-> Accounting |
| 6 | **Invoice Trigger & Generation** | EduCentre triggers "invoice creation event". Accounting System generates monthly/term invoices, applies subsidy offsets, posts to student AR. | EduCentre -> AR Module |
| 7 | **Parent Notification & Portal Access** | WhatsApp/email/MobileApps notification. Invoice, subsidy breakdown, due dates accessible via parent portal. | SMS/Email Gateway <-> EduCentre |
| 8 | **Payment Collection** | FPX, credit/debit card, payroll deduction, bank counter, cash at centre. Real-time payment gateway sync. | Payment Gateway <-> Accounting |
| 9 | **Receipt & Reconciliation** | Accounting System generates official receipt. EduCentre updates payment status; syncs with bank reconciliation. | AR <-> EduCentre <-> Bank API |
| 10 | **Transfer / Withdrawal** | Triggers auto-closure of outstanding invoices, deposit treatment (refund/forfeit/transfer), carry-forward of balances. | EduCentre <-> Accounting |
| 11 | **Reporting, SOA, & History** | Parents view/download SOA, invoice history, subsidy allocation, penalties, receipts, outstanding balances. Management dashboards. | EduCentre <-> AR <-> Reporting Engine |

### Student Code Format
```
EDU-[CentreCode]-[YYMM]-[Sequence]
```

---

## 6. Fee Management Process

### Fee Categories (Yuran Pengajian)

- Fee setup by **education type** and **fee categories** (citizen, non-citizen, asnaf, staff, non-staff)
- Programme types: Tadika / Taska / PMA / Darul Ilmi / DK / DS
- **Registration/annual fees** for Tadika/Taska/Darul Ilmi/DK/DS
- **Admission deposit** for Dar Assaadah
- **Auto fee calculation** based on enrolment date (prorated if mid-month)
- **Subsidy offset** and **penalty calculation** rules executed monthly
- Integration with Accounting System for **journal posting** and **fund tagging**

### Fee Code Format
```
FEE-[Centre]-[Type]-[Year]
```

### Fee Structure Master Data

| Field | Description | Owner |
|-------|-------------|-------|
| Fee Code | Unique code per fee type | Finance (AR) |
| Programme Type | Tadika, Taska, PMA, Darul Ilmi, etc. | Education Division |
| Monthly/Annual Rate | Tuition fee amount | Finance (AR) |
| Subsidy Eligible (Y/N) | Whether subsidy offset applies | Finance |
| Penalty Rule ID (FK) | Link to penalty setup | EduCentre |
| Fund Source | Zakat / Wakaf / Sumber Am | Finance |
| GL Code Mapping | Revenue and subsidy account mapping | Accounting System |
| Active Status | Period-controlled (start/end date) | Admin |

---

## 7. Non-Financial Processes

| Process | Description |
|---------|-------------|
| **Student Transfer** | Data continuity and financial balance handover between centres |
| **Withdrawal & Refunds** | Auto-stop billing, initiate refund workflow via Accounting System |
| **Subsidy Expiry** | System auto-alerts approaching subsidy renewal |
| **Penalty Triggers** | Late pickup based on attendance log timestamps |

---

## 8. User Roles & Access Matrix

| Role | Responsibilities |
|------|-----------------|
| **HQ Finance Officer (AR)** | Approve fee setup, validate subsidy postings, monitor collections |
| **Education Division Admin** | Manage centre list, oversee registration, review subsidy applications |
| **Centre Admin (Tadika/Taska/PMA/Darul Ilmi)** | Register students, update attendance, initiate withdrawal |
| **Finance Officer (AR)** | Verify fee structure, approve invoices, monitor receivables |
| **Subsidy Officer** | Manage subsidy eligibility, B40 verification, renewal approvals |
| **IT System Administrator** | Manage access control, configuration, API linkages |
| **Internal Auditor** | Read-only access to audit trail, transaction history, reports |
| **Parent/Guardian Portal User** | View/pay invoices, download SOA, receive reminders |

### Segregation of Duties (SoD)

> Preparer ≠ Approver ≠ Poster (posting is performed by IAS automatically)

---

## 9. Approval Matrix

### Thresholds & Roles

| Threshold (Net Financial Impact) | Primary Approver | Examples |
|----------------------------------|-----------------|----------|
| Up to **RM5,000** | Centre Head (Institution Head) | Late fee waiver; small credit note; minor subsidy adjustment |
| **RM5,001 – RM20,000** | Department Head (Education/Finance) / Jawatankuasa | Mid-semester subsidy top-up; multi-month adjustment |
| **RM20,001 and above** | Mesyuarat MAIWP | Bulk refunds; large cross-period adjustments |

### Routing Logic

1. **Preparer** (Centre Admin/Officer) submits request with justification and DDMS docs
2. **System** computes net impact and selects approver based on thresholds
3. **Approver** reviews — approve/reject/return with remarks; SLA timers trigger escalation
4. On **approval** — IAS posts the transaction (invoice/credit/refund journal)
5. **EduCentre** updates status & SOA
6. If **rejected** — remarks captured, returns to preparer, no posting
7. If **delegated** — temporary assignee approves within window

### Special Rules

- Zero-value administrative changes need **no approval**
- Policy-driven auto-prorations and configured penalties are **auto-posted** with rule IDs in audit trail
- **Cross-fund movements** (e.g., Zakat -> Sumber Am) require additional **Shariah Officer** approval

### Worked Examples

| Scenario | Net Impact | Route To | Outcome |
|----------|-----------|----------|---------|
| Late-fee waiver (single month) | RM120 | Centre Head | AR posts credit note; SOA updated |
| Subsidy top-up mid-semester | RM7,500 | Department Head / Jawatankuasa | Subsidy journal posted to fund |
| Bulk refund (overpayment) | RM24,300 | Mesyuarat MAIWP | AP/AR refund executed; GL updated |

---

## 10. Master Data Requirements

### 10.1 Student Master Data

| Field | Description | Source | Notes |
|-------|-------------|--------|-------|
| Student ID | System-generated unique ID | EduCentre | Format: `EDU-[CentreCode]-[YYMM]-[Sequence]` |
| Full Name | As per MyKid/MyKad | Parent input | Validated via MyKad check digit |
| Date of Birth / Age | Placement eligibility | Registration form | Auto-validation |
| Centre Code | Centre identifier | Central Admin | Must match master list |
| Program Type | Tadika, Taska, PMA, Darul Ilmi, IKB, KPMAIWP, UCMI | EduCentre | Drives fee rule selection |
| Enrollment Date / Status | Registration, transfer, withdrawal, alumni | EduCentre | Active status required for billing |
| Guardian ID (FK) | Parent profile link | EduCentre | Used for fee assignment and contact |
| Subsidy Code (FK) | B40, MAIWP full/partial aid | Finance Division | Determines automatic subsidy posting |
| Attendance Method | Face ID / Manual / Hybrid | Centre Admin | Defines attendance dependency for penalties |
| Withdrawal/Transfer Flag | Billing suspension status | EduCentre | Auto-suspend recurring invoices |

### 10.2 Guardian / Parent Master Data

| Field | Description | Source | Notes |
|-------|-------------|--------|-------|
| Guardian ID | System-generated unique ID | EduCentre | One guardian can link to multiple students |
| Full Name | As per IC | User input | Mandatory for verification |
| IC Number / Passport No. | National ID | User input | Used for eKYC and B40 verification |
| Contact Details | Phone, Email | EduCentre | Used by SMS/email gateway |
| Address | Registered home address | User input | Auto-filled for subsidy zone tagging |
| Income Bracket | B40 / M40 / T20 | Subsidy verification | Determines subsidy eligibility |
| Payment Preference | FPX, JomPAY, payroll deduction, prepaid wallet | Parent/Finance | Used for reconciliation mapping |
| Portal Access Role | View, pay, download SOA | EduCentre | Managed via RBAC |

### 10.3 Subsidy Master Data

| Field | Description | Source | Notes |
|-------|-------------|--------|-------|
| Subsidy Code | Unique identifier | Finance (Subsidy Unit) | Format: `SUB-[Type]-[Year]` |
| Subsidy Type | Full / Partial / Fixed amount | Finance | Determines offset calculation |
| Eligibility Criteria | Income bracket, employment, special category (Asnaf) | MAIWP Policy | Rule-based tagging |
| Amount / % Coverage | Auto-applied percentage or RM value | Finance | Linked to Fee Structure |
| Funding Source | Zakat, Wakaf, or Sumber Am | Finance | Auto-segregated for GL reporting |
| Subsidy Expiry Date | Triggers revalidation | EduCentre | Notifications 30 days before expiry |
| Approval Reference | Documented approval no. or letter ID | DDMS | Linked to DMS storage |

### 10.4 Attendance & Penalty Master Data

| Field | Description | Source | Notes |
|-------|-------------|--------|-------|
| Attendance ID | Unique code per day per centre | EduCentre | Auto-generated |
| Method Type | Face ID / Manual Input | Centre Admin | Defines capture source |
| In / Out Timestamp | Penalty rule validation | Face ID Device | Synced automatically |
| Penalty Rule ID | Predefined rule (e.g., RM5 after 6:30 PM) | Finance/Admin | Configurable by centre |
| Penalty Amount | Auto-invoice value triggered by violation | Accounting System | Posts as "Other Income" |
| Justification / Waiver | Optional approved waiver | Centre Admin | Subject to approval workflow |

### 10.5 Organisation & Centre Master Data

| Field | Description | Source | Notes |
|-------|-------------|--------|-------|
| Centre Code | Unique code per centre | Education Division | Key reference for all reports |
| Centre Name | Official MAIWP registered name | Education Division | Displayed in invoices & receipts |
| Location / Address | For mapping and reporting | Admin | Used for subsidy and audit tagging |
| Centre Type | Tadika, Taska, PMA, Darul Ilmi, etc. | Admin | Determines process flow |
| Active Flag | Open/active or closed/inactive | HQ Admin | Controls billing eligibility |

---

## 11. Reporting Requirements

### Operational Reports

| Report | Description | Frequency | Generated By |
|--------|-------------|-----------|-------------|
| Student Enrollment Report | Active, withdrawn, transferred by centre/category | Monthly | EduCentre |
| Attendance & Penalty Report | Late pickups, absentee rates, penalty values by centre | Monthly / PDF | EduCentre |
| Centre Capacity & Utilisation | Student capacity vs actual enrolment | Monthly | EduCentre |
| Staff-to-Student Ratio | Compliance with staffing ratios | Monthly / PDF | EduCentre / HR |
| Discipline & Incident Report | Disciplinary cases, merit/demerit, incident trends | Monthly | EduCentre |
| Student Health & Safety | Medical alerts, vaccinations, health screenings | Monthly / PDF | EduCentre / Warden |
| Programme Performance | Academic and non-academic outcomes | Termly / PDF | EduCentre / Academic Unit |
| Centre Operational Compliance | Inspections: procurement, safety, cleanliness, hostel, food | Quarterly / PDF | Compliance / Admin |
| Hostel Occupancy (DK/DS) | Room assignment, occupancy, availability, turnover | Monthly / Excel | EduCentre |
| Inventory & Supplies Usage | Consumption of centre supplies | Monthly | Admin / Procurement |
| Supplier & Service Performance | Vendor timeliness, quality, cost, contract compliance | Quarterly / Excel | Procurement / Admin |
| Welfare & Assistance Report | Welfare support for Asnaf, orphans, converts | Monthly / PDF | EduCentre / Welfare Unit |

### Financial Reports

| Report | Description | Frequency | Generated By |
|--------|-------------|-----------|-------------|
| Fee Collection Report | Fees invoiced, collected, outstanding by fund source | Daily/Monthly | Accounting System |
| Subsidy Utilization Report | Subsidy applied and remaining allocation per centre | Monthly / Excel | Finance |
| Aging Report | Outstanding balances per guardian/student/fund | Monthly | AR Module |
| SOA (Statement of Account) | Parent view of payments, subsidies, penalties | Real-time / Portal | Accounting System |
| Exception Report | Invoice/payment mismatch, duplicates, failed sync | Weekly / Dashboard | IT / Finance |
| Audit Trail Report | All edits, approvals, postings with timestamp and user | On-demand | Accounting System |

### Programme-Specific Reports

| Report | Description | Frequency |
|--------|-------------|-----------|
| Taska SMS Logbook Report | Daily child behaviour, health notes, attendance, activities | Daily/Weekly |
| PMA GPS Achievement Report | Term-based academic performance summary | Termly |
| Darul Ilmi Resident Performance | Discipline, routines, educational progress, welfare | Monthly/Termly |
| Dar Assaadah Merit & PAFA Progress | Merit points, disciplinary cases, Qur'an/Fardhu Ain mastery | Monthly/Quarterly |
| Darul Kifayah Merit & Discipline | Discipline, merit scoring, behavioural progress | Monthly/Quarterly |

---

## 12. Output Requirements

| Output | Format | Description |
|--------|--------|-------------|
| **Invoice (Tuition Fee)** | Auto-generated PDF with QR code | Issued monthly or upon registration; available via parent portal & email |
| **Receipt** | Auto-issued PDF by Accounting System | Generated instantly post-payment; sent via email and portal |
| **Reminder Notices** | WhatsApp, SMS, email | Configurable by aging thresholds (7/14/30 days) |
| **SOA (Parent Portal)** | Real-time statement | Exportable to PDF/Excel |
| **Subsidy Allocation Summary** | Summary table by fund & eligibility | Monthly report to Education & Finance Divisions |
| **Withdrawal/Transfer Certificates** | Auto-generated letter template | Issued upon student movement with payment status |
| **Dashboard Analytics** | Interactive BI dashboard | Embedded in ERP portal |
| **Daily/Monthly/Annual Reports** | PDF/Excel auto-generated | Consolidated student activities and operations |

---

## 13. Interfaces & Integration

### 13.1 Internal System Interfaces

| System | Purpose | Key Data Flows | Method |
|--------|---------|---------------|--------|
| **Accounting System (AR, GL, Budget)** | Financial transaction management | Student -> Invoice Trigger; Payment -> Receipt; GL Posting by Fund | REST API / Secure SFTP |
| **EduCentre Portal (Front-End)** | Student registration, attendance, parent communication | Registration, attendance, subsidy data -> Accounting | JSON / REST API |
| **HRMS** | Staff & payroll deduction for staff children | Employee ID, deduction details -> AR Module | API Sync |
| **Payroll Module** | Salary deduction and refund journal postings | Deduction journal -> AR & GL | API |
| **e-Hartanah / e-Sewaan** | Rental linkage for education premises | Property ID, usage metadata | API |
| **DDMS / DMS** | Digital document repository | Subsidy approvals, attendance reports, receipts | SFTP / Cloud Storage API |
| **Budgetary Control Module** | Budget allocation for subsidy, grants, operations | Budget line -> AR Posting Validation | API Linkage |

### 13.2 External System Interfaces

| System | Purpose | Key Data Flows | Method |
|--------|---------|---------------|--------|
| **FPX / Payment Gateway (Razer, JomPAY)** | Payment processing and settlement | Invoice reference, student ID, payment amount, timestamp | API / Webhook |
| **SMS / Email / WhatsApp / Mobile Apps** | Notification and reminders | Invoice, due date, penalty, receipt, subsidy alerts | SMTP / API |
| **CTOS / eKYC** (Future Phase) | Guardian income/identity verification | IC validation, income bracket tagging (B40/M40) | API |
| **MyGovCloud Hosting** | System hosting and compliance environment | Application deployment, security, backup | GCP / Cloud |

### Technical Requirements

- All integration logs captured in Integration Log Dashboard
- Failed syncs flagged automatically for IT Admin review
- All integrations must support **encryption (TLS/HTTPS)** and **API key authentication**
- Financial synchronization always initiated from Accounting System (one-directional control)

---

## 14. Functional Enhancements

| Enhancement | Description |
|-------------|-------------|
| **Unified Fee Rule Engine** | Central configuration module for fee and subsidy rules by programme, region, income group |
| **Smart Attendance Integration** | AI-based facial recognition sync for penalty/subsidy validation |
| **Real-Time FPX Callback** | Direct bank integration to mark payments as "settled" in AR instantly |
| **Automated Reconciliation Engine** | Auto-matches payment records, subsidies, and journal entries |
| **Parent Digital Wallet** (Future) | Prepaid wallet for recurring payments, linked to Deposit/Trust module |
| **Mobile Access App** | Android/iOS version for parents and teachers |
| **Multi-Centre View** | Centralized dashboard for all MAIWP institutions with unified reporting |
| **E-Document Workflow** | Approvals via digital forms with audit trail |
| **Data Retention & Archival** | Auto-archive inactive profiles; maintain 7-year audit logs |

---

## 15. Security & Authorisation

### Security Features

| Area | Implementation |
|------|---------------|
| **RBAC** | Distinct roles: Parent, Admin, Finance, Auditor with defined permissions |
| **2FA** | Mandatory for all internal users and approvers |
| **Data Encryption** | In transit: TLS 1.3; At rest: AES-256 |
| **API Token Security** | Signed JWT tokens and IP whitelisting |
| **System Audit Trail** | Immutable logs of all CRUD actions with timestamps and user IDs |
| **Single Sign-On (SSO)** | Central authentication for all MAIWP integrated systems |
| **Password Policy** | Per Government ICT Security Baseline (length, complexity, expiry) |
| **Data Privacy Controls** | Sensitive fields (IC, address, income) masked and restricted by role |
| **Transaction Locking** | Posted transactions locked post-approval |
| **Penetration Testing** | Annual testing per MAMPU ICT Compliance |

### Hosting, Backup & DR

| Control | Implementation |
|---------|---------------|
| **Hosting** | MyGovCloud or equivalent GxP-certified environment |
| **Backup** | Automated daily incremental; full weekly snapshot retained 30 days |
| **Disaster Recovery** | DR site replication every 6 hours; RTO <= 2 hours |
| **Monitoring** | 24/7 system monitoring, intrusion detection, event log alerts |
| **Archival** | Retain inactive data 7 years post-termination, then cold storage |

---

## 16. System Architecture

### Three-Tier Architecture

| Layer | Description | Key Components |
|-------|-------------|---------------|
| **Presentation Layer** (Front-End) | User interfaces for all users. Desktop and mobile accessible. | Parent/Guardian Portal, Centre Admin Dashboard, HQ Finance Console, BI Analytics Dashboard |
| **Application Layer** (Business Logic) | Core logic: registration, attendance, billing triggers, integration APIs | Workflow Engine, Notification Queue, Rule-Based Subsidy Engine, API Gateway, Audit Trail Service |
| **Data Layer** (Database & Integration) | Centralized repository with secure linkage to GL, AR, Budget | PostgreSQL/SQL Database, Integration Hub (API logs), DDMS Document Repository, Backup & Replication |

### Key Components

| Component | Functionality |
|-----------|-------------|
| Student Management Engine | Registration, transfers, withdrawals, status validation |
| Fee Configuration Module | Fee setup, subsidy rules, penalty definitions, billing cycles |
| Integration Gateway | Connects with Accounting System, FPX, HRMS, DDMS via secure APIs |
| Notification Engine | Multi-channel (WhatsApp, email, SMS) for reminders and receipts |
| Subsidy & Rule Engine | Automates subsidy calculation/offset with fund-based segregation |
| Audit & Compliance Layer | Logs all actions for internal/external audit traceability |
| Document Management Connector (DDMS) | Stores subsidy approvals, registration forms, payment proofs |
| Analytics & BI Layer | Dashboards on demographics, collection, subsidy utilization, balances |

---

## 17. SAGA & PPIBZW Compliance

### SAGA Functional Compliance

| Requirement | Implementation |
|-------------|---------------|
| **Revenue Classification** | Every transaction tagged with fund source (Zakat/Wakaf/Am) and program code before GL posting |
| **Chart of Accounts** | Syncs with Accounting System's master COA; fee structures reference standard accounts |
| **Accrual Accounting** | Invoices trigger revenue accruals and deferrals by service period |
| **End-to-End Traceability** | Every transaction logged: User ID, Timestamp, Before/After Value, DDMS document evidence |
| **Approval Hierarchy** | Configurable approval routing based on monetary thresholds |
| **Budget Linkage** | Subsidy and tuition projections tied to Budgetary Control Module |
| **Segregation of Duties** | Clear separation: registration, invoice approval, collection, reconciliation |
| **Document Control** | All supporting evidence stored in DDMS and linked to transactions |
| **Reconciliation** | Daily AR sub-ledger reconciliation; month-end GL closure aligned with SAGA cut-off |

### PPIBZW Compliance (Islamic Accounting)

| Requirement | Implementation |
|-------------|---------------|
| **Fund-Based Segregation** | Dana Zakat (subsidized/asnaf), Dana Wakaf (facilities/property), Sumber Am (general/fee-paying). GL postings fund-specific. |
| **Shariah-Compliant Income** | Only halal income sources — tuition, approved charges, legitimate penalties (not riba-based) |
| **Transparency** | Every subsidy logged with fund origin, amount, approval reference, offset journal |
| **Dual Financial View** | Both accrual (financial reporting) and cash basis (fund disbursement tracking) |
| **Shariah Approval Workflow** | Zakat/Wakaf transactions requiring board approval tagged for Shariah Committee review |
| **Fund Switching Control** | Cross-fund transfers require dual approval (Finance Director + Shariah Officer) |
| **Zakat vs Wakaf Disclosure** | Dashboard fund-level breakdowns: Revenue by Fund, Subsidy by Fund, Collection vs Allocation |
| **Bayyinah (Evidence)** | All digital artefacts linked to transaction ID in DDMS for accountability |
| **Ethical System Design** | No automated penalty contradicting Islamic principles; all penalties must be policy-approved and maslahah-based |

---

## 18. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Support 3,000+ concurrent users; page load <= 3 seconds |
| **Scalability** | Modular architecture to onboard new MAIWP institutions |
| **Availability** | 99.9% uptime; auto-failover and daily backup |
| **Data Security** | AES-256 at rest; TLS 1.3 in transit; 2FA login |
| **Usability** | Dual language (BM/EN); responsive mobile interface |
| **Auditability** | Immutable logs, DDMS document linkage, audit exports |
| **Maintainability** | Configuration-driven parameters; no hard-coding of rates or rules |
| **Compliance** | Fully aligned with SAGA and PPIBZW control matrices |
| **Data Synchronization** | Real-time updates to Accounting System within 5 seconds of trigger |
| **Batch Processing** | Nightly jobs for reconciliation, subsidy update, report refresh |
| **Mobile Compatibility** | Fully responsive design for mobile and tablet |

---

## 19. Data Conversion

### Legacy Sources to Migrate

| Source System | Data Type | Method | Responsible |
|-------------|-----------|--------|------------|
| ASIS (Legacy Preschool) | Student registration, attendance, fee history | Excel/CSV import | Education Division |
| Manual Excel Logs (Taska/Tadika) | Payment and attendance sheets | Cleansing and upload | Centre Admin / IT |
| Payroll System | Salary deduction, staff-child mapping | API linkage | HR / Finance |
| Manual Records / Forms | Subsidy approval, withdrawal forms | Digitization via DDMS | EduCentre Admin |
| Accounting System (AR Legacy) | Invoice, receipt, subsidy data | Cross-validation | Finance AR Team |
| SISDAR, SISDAF, others | Various MAIWP IT systems | TBD from MAIWP | BTM |

### Validation Rules

| Rule | Logic |
|------|-------|
| Duplicate Student ID | Reject if existing active student with same IC/centre |
| Invalid Centre Mapping | Reject if Centre Code not in master list |
| Missing Subsidy Code | Flag for manual review |
| Date of Birth / Age Rule | Auto-validate age range per programme |
| Attendance Integrity | Require at least one attendance per month for active billing |
| Financial Validation | Cross-check invoice/receipt history with AR balance before go-live |

### Conversion Workflow

1. **Extraction** — Export from legacy systems in standardized format
2. **Cleansing** — Duplicate removal, code normalization, naming standardization
3. **Validation** — Pre-upload data integrity rules
4. **Enrichment** — Assign centre codes, subsidy tags, fund sources
5. **Upload** — Batch import into EduCentre and AR module
6. **Reconciliation** — Post-import verification with GL and AR balances
7. **Archival** — Store pre-conversion snapshots in DDMS for audit trail

---

## Quick Reference: Code Formats

| Entity | Format | Example |
|--------|--------|---------|
| Student ID | `EDU-[CentreCode]-[YYMM]-[Seq]` | `EDU-TI001-2501-0042` |
| Fee Code | `FEE-[Centre]-[Type]-[Year]` | `FEE-TI001-TUITION-2025` |
| Subsidy Code | `SUB-[Type]-[Year]` | `SUB-B40-2025` |

---

## POC Development Priority Map

Based on the blueprint, here are the **mandatory (M)** domains mapped to our mock implementation:

| Priority | Domain | POC Status | Notes |
|----------|--------|------------|-------|
| P1 | Student Lifecycle (Registration, List, Transfer, Withdrawal) | Partially built | Students page, add/edit forms |
| P1 | Institute/Centre Management | Built | Institutes list with MAIWP data |
| P1 | Fee & Subsidy Management | Partially built | Fee setup page exists |
| P1 | Attendance Management | Partially built | Attendance page exists |
| P2 | Guardian Portal (Parent view) | Partially built | Parent role exists in login |
| P2 | Dashboard Analytics | Built | Admin dashboard with charts |
| P2 | Reporting (SOA, Collection, Enrollment) | Not started | |
| P3 | Payment & Reconciliation | Not started | Requires payment gateway mock |
| P3 | Approval Workflow | Not started | Requires workflow engine |
| P3 | Notification Engine | Not started | WhatsApp/email/SMS mock |
| P4 | DDMS Integration | Not started | Document management |
| P4 | SAGA/PPIBZW Fund Tagging | Not started | Fund-based GL segregation |
