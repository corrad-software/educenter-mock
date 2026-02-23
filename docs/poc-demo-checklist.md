# EduCentre POC Demo Checklist

## 1) Demo Objective
- Show a workable POC for 5 critical areas:
- Student lifecycle
- Fee/subsidy/fund visibility
- Attendance-driven operations
- Approval + audit traceability
- Management reporting

## 2) Pre-Demo Setup (5 minutes)
- Run `npm run dev`
- Open `http://localhost:3000/login`
- Login as `MAIWP Super Admin`
- Use desktop viewport (for admin/backoffice pages)
- Keep these routes ready in tabs:
- `/admin`
- `/admin/students`
- `/admin/attendance`
- `/admin/fees`
- `/finance`
- `/audit`
- `/admin/reports`
- `/parent`

## 3) Demo Runbook (12-15 minutes)

### A. Student Lifecycle (3 minutes)
- Open `/admin/students`
- Show search/filter and student status mix (`active`, `pending`, `transferred`, `withdrawn`)
- Open a student detail page (`/admin/students/[id]`)
- Highlight transfer/withdrawal related UI
- Expected outcome:
- Audience sees full lifecycle handling from registration stage to alumni/withdrawal context

### B. Attendance to Action (2 minutes)
- Open `/admin/attendance`
- Show list and calendar views
- Explain late/absent visibility and operational follow-up
- Expected outcome:
- Audience sees attendance as operational control input, not just raw logs

### C. Fees + Subsidy + Fund (3 minutes)
- Open `/admin/fees` then `/parent`
- In admin: show fee/subsidy composition
- In parent: show invoice + SOA perspective
- Point out fund visibility where shown (Zakat/Wakaf/Sumber Am views in reports/summary areas)
- Expected outcome:
- Audience sees transparent fee calculation and subsidy context for both operations and guardians

### D. Approval + Audit (2 minutes)
- Open `/finance` (approval queue)
- Explain threshold-based approval concept (RM5k / RM20k tiers)
- Open `/audit`
- Show audit trail and approval history tabs
- Expected outcome:
- Audience sees governance and traceability controls clearly

### E. Reporting Pack (3-4 minutes)
- Open `/admin/reports` (hub)
- Then show priority reports:
- `/admin/reports/enrollment`
- `/admin/reports/fee-collection`
- `/admin/reports/aging`
- `/admin/reports/attendance`
- `/admin/reports/subsidy`
- `/admin/reports/staff-ratio`
- Expected outcome:
- Audience sees decision-ready reporting coverage aligned to management needs

## 4) Must-Say Narrative (keep this exact)
- "This POC validates operational flow and reporting coverage."
- "CRUD and workflow behavior are demonstrated in UI with realistic data."
- "Production integration (API/auth/reconciliation engine) is next phase after scope confirmation."

## 5) Common Questions and Best Responses
- Q: "Is this live-integrated with accounting and payment gateway?"
- A: "Not yet. This POC proves UX flow, controls, and reporting structure first."
- Q: "Can we onboard new institution types?"
- A: "Yes, structure is config-driven and supports level-specific navigation/modules."
- Q: "Do we have audit and approval visibility?"
- A: "Yes, UI-level workflow and audit traceability are demonstrated in Finance and Audit modules."

## 6) Demo Success Criteria
- End-to-end story is completed without route breaks
- 5 critical areas are clearly shown
- Reporting pages are navigated and understood
- Audience agrees on production priority scope (integration + security + data layer)
