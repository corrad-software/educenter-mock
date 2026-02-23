# EduCentre POC Slide Deck (5 Slides)

## Slide 1: POC Scope and Goal
### Title
EduCentre POC: Operational Workflow and Reporting Validation

### Content
- Project context: MAIWP education operations POC
- Objective: prove workable user flow for critical modules
- Current phase focus:
- Student lifecycle
- Attendance operations
- Fee/subsidy visibility
- Approval + audit traceability
- Management reporting

### Speaker Notes
- "This POC is to validate business flow and reporting structure before production integration."
- "We focus on high-impact workflows needed by operations and management decisions."

---

## Slide 2: What We Built (Workable Level)
### Title
Implemented POC Capabilities

### Content
- Multi-portal navigation:
- Admin backoffice
- Parent view
- Finance and audit consoles
- UI CRUD for key modules:
- Complaints
- Co-curricular
- Institutional calendar
- Health profiles/incidents/vaccinations
- Report pages for core management KPIs

### Speaker Notes
- "This is not just static screens; key modules now support add/edit/delete demo behavior."
- "Data is mock-driven but structured to reflect real operations."

---

## Slide 3: End-to-End Demo Story
### Title
Demo Walkthrough (12-15 Minutes)

### Content
1. Student lifecycle (`/admin/students`, detail page)
2. Attendance operations (`/admin/attendance`)
3. Fee + subsidy + parent SOA (`/admin/fees`, `/parent`)
4. Approval + audit (`/finance`, `/audit`)
5. Reporting pack (`/admin/reports` + key report pages)

### Speaker Notes
- "We show the operational chain from student records to financial and compliance visibility."
- "This sequence mirrors how HQ and centre teams actually consume the system."

---

## Slide 4: Management-Ready Reports (Priority)
### Title
Critical Reports for Decision Making

### Content
- Enrollment Report
- Fee Collection Report
- Aging Report
- Attendance Report
- Subsidy by Fund Report
- Staff-to-Student Ratio Report

### Speaker Notes
- "These are the minimum report set required for operational and governance review."
- "POC demonstrates structure, filters, and visual outputs; backend export automation is next phase."

---

## Slide 5: Next Phase and Ask
### Title
Decision Required: Production Priorities

### Content
- POC status: UX flow and report coverage validated
- Next implementation priorities:
- API and database layer
- Auth/RBAC/2FA hardening
- Accounting/payment/DDMS integration
- Approval workflow engine + persistence
- Ask from stakeholders:
- Confirm scope lock for production phase
- Approve integration/security workstream

### Speaker Notes
- "Today’s output is meant to de-risk design and process fit."
- "After sign-off, we move directly into secure integration and persistent workflow execution."

---

## Optional Appendix Slide (if asked)
### Title
POC Constraints (Transparent)

### Content
- Demo environment uses mock data
- CRUD is UI-state (not persistent across refresh)
- Integration endpoints are represented but not live-connected
- Security controls are represented in UI, not fully enforced backend

### Speaker Notes
- "These constraints are intentional for POC speed; production plan is already sequenced."
