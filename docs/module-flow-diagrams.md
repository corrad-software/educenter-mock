# EduCentre Functional Flow Diagrams (D2)

Use these in Markdown viewers/tools that support D2 rendering.

## 1) High-Level Module Map
```d2
direction: right
login: "Login / Role Selection"
admin: "Admin Backoffice"
parent: "Parent Portal"
lifecycle: "Student Lifecycle"
attendance: "Attendance"
fees: "Fees & Subsidy"
approvals: "Approvals"
audit: "Audit"
reports: "Reports"
institute: "Institute / Staff / Scoring"
ops: "Complaints / Health / Co-curricular / Calendar"

login -> admin
login -> parent
admin -> lifecycle
admin -> attendance
admin -> fees
admin -> approvals
admin -> audit
admin -> reports
admin -> institute
admin -> ops
parent -> fees
parent -> attendance
fees -> approvals
approvals -> audit
attendance -> reports
fees -> reports
institute -> reports
ops -> reports
```

## 2) Student Lifecycle Module
```d2
submitted: "Application Submitted"
review: "Application Review"
registration: "Student Registration"
closed: "Application Closed"
profile: "Student Profile Created"
assign: "Assign Centre + Fee Category + Subsidy Category"
active: "Student Active"
move: "Movement Request?"
transfer: "Transfer Workflow"
withdraw: "Withdrawal Workflow"
continue: "Continue Active Enrollment"
balance: "Update New Centre + Balance Handling"
alumni_record: "Stop Billing + Alumni Record"
alumni: "Alumni / Inactive"

submitted -> review
review -> registration: Approved
review -> closed: Rejected
registration -> profile
profile -> assign
assign -> active
active -> move
move -> transfer: Transfer
move -> withdraw: Withdraw
move -> continue: No
transfer -> balance
withdraw -> alumni_record
balance -> continue
alumni_record -> alumni
```

## 3) Attendance Module
```d2
capture: "Daily Attendance Capture"
status: "Present / Late / Absent"
views: "Attendance Calendar + List View"
metrics: "Attendance Summary Metrics"
threshold: "Threshold Breach?"
followup: "Operational Follow-up"
normal: "Normal Monitoring"
notify: "Parent / Admin Notification Context"
monthly: "Monthly Reporting"

capture -> status
status -> views
views -> metrics
metrics -> threshold
threshold -> followup: Yes
threshold -> normal: No
followup -> notify
normal -> monthly
notify -> monthly
```

## 4) Fees & Subsidy Module
```d2
setup: "Fee Setup by Category"
assign: "Student Fee Assignment"
subsidy: "Apply Subsidy Category"
compute: "Net Payable Computation"
invoice: "Invoice List / SOA View"
pay_status: "Payment Status"
receipt: "Receipt Available"
outstanding: "Outstanding Tracking"
history: "Payment History"
reports: "Fee Collection / Aging Reports"

setup -> assign
assign -> subsidy
subsidy -> compute
compute -> invoice
invoice -> pay_status
pay_status -> receipt: Paid
pay_status -> outstanding: Pending
receipt -> history
outstanding -> history
history -> reports
```

## 5) Approval & Audit Module
```d2
request: "Financial / Operational Request"
eval: "Amount / Rule Evaluation"
queue: "Approver Queue"
decision: "Decision"
approved: "Status Updated"
rejected: "Returned with Remarks"
trail: "Audit Trail Entry"
dashboard: "Audit Dashboard + History"

request -> eval
eval -> queue
queue -> decision
decision -> approved: Approve
decision -> rejected: Reject
approved -> trail
rejected -> trail
trail -> dashboard
```

## 6) Institute Management Module
```d2
profile: "Institute Profile"
capacity: "Capacity + Utilization Metrics"
students: "Student List by Institute"
filters: "Search / Filter / Pagination"
actions: "Student Action: View / Transfer / Remove"
ai: "AI Institute Assessment"
output: "Strengths / Risks / Recommended Actions"

profile -> capacity
capacity -> students
students -> filters
filters -> actions
capacity -> ai
ai -> output
```

## 7) Staff Management Module
```d2
list: "Staff Master List"
filter: "Role + Status Filtering"
detail: "Staff Detail Profile"
employment: "Employment + Qualification + Assignment"
payroll: "Payroll Deduction Eligibility"
crud: "Add / Edit / Delete Staff"
ai_staff: "AI Staff Assessment"
ai_individual: "AI Individual Staff Assessment"

list -> filter
filter -> detail
detail -> employment
detail -> payroll
list -> crud
list -> ai_staff
detail -> ai_individual
```

## 8) Scoring / Academic Module
```d2
select: "Select Education Level"
level_type: "Level Type"
preschool: "Band Distribution + Child Band Report"
school: "Grade Distribution + Student Subject Scores"
uni: "CGPA + Module Performance"
ai: "AI Scoring Assessment"
output: "Strengths / Risks / Recommended Actions"

select -> level_type
level_type -> preschool: Preschool
level_type -> school: Primary/Secondary
level_type -> uni: University
preschool -> ai
school -> ai
uni -> ai
ai -> output
```

## 9) Complaints Module
```d2
created: "Complaint Created"
sla: "Reference + SLA Assigned"
new: "Status: New"
investigating: "Investigating"
resolution: "Resolution?"
resolved: "Resolved"
closed: "Closed"
manage: "Edit / Reassign / Delete"

created -> sla
sla -> new
new -> investigating
investigating -> resolution
resolution -> resolved: Resolved
resolution -> investigating: Not Yet
resolved -> closed
new -> manage
investigating -> manage
resolved -> manage
```

## 10) Health Module
```d2
profile: "Health Profile CRUD"
details: "Allergies / Conditions / Emergency Contact"
incident: "Incident Log CRUD"
vaccine: "Vaccination Tracker CRUD"
severity: "Severity Monitoring"
due: "Due / Overdue Monitoring"
dashboard: "Health Dashboard Summary"

profile -> details
details -> incident
details -> vaccine
incident -> severity
vaccine -> due
severity -> dashboard
due -> dashboard
```

## 11) Co-curricular Module
```d2
catalog: "Activity Catalog CRUD"
schedule: "Schedule + Capacity"
participation: "Participation CRUD"
metrics: "Attendance Rate + Merit Points"
outcomes: "Outcomes / Ranking View"
narrative: "Program Performance Narrative"

catalog -> schedule
schedule -> participation
participation -> metrics
metrics -> outcomes
outcomes -> narrative
```

## 12) Institutional Calendar Module
```d2
create: "Create Calendar Event"
meta: "Type + Level + Date Range"
list: "Calendar List + Filters"
edit: "Edit / Delete Event"
monitor: "Upcoming / Ongoing / Completed Monitoring"

create -> meta
meta -> list
list -> edit
list -> monitor
```

## 13) Reporting Module
```d2
hub: "Report Hub"
enrollment: "Enrollment Report"
fee: "Fee Collection Report"
aging: "Aging Report"
attendance: "Attendance Report"
subsidy: "Subsidy Report"
staff: "Staff Ratio Report"
review: "Management Review"

hub -> enrollment
hub -> fee
hub -> aging
hub -> attendance
hub -> subsidy
hub -> staff
enrollment -> review
fee -> review
aging -> review
attendance -> review
subsidy -> review
staff -> review
```
