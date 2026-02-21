// Core types for EduCentre system

// ============================================================
// EDUCATION LEVEL SYSTEM
// ============================================================

export type EducationLevel = 'maiwp' | 'preschool' | 'primary' | 'secondary' | 'university';

export type PortalRole = 'admin' | 'parent' | 'teacher';

export type BandScore = 'Emerging' | 'Developing' | 'Achieving' | 'Exceeding';

export type SessionType = 'morning' | 'afternoon';

export interface SubjectRecord {
  code: string;
  name: string;
  nameMs?: string;
  isCore: boolean;
  creditHours?: number;
}

export interface ScoreEntry {
  studentId: string;
  subjectCode: string;
  term: string;
  rawScore?: number;
  grade?: string;
  band?: BandScore;
  gpa?: number;
  creditHours?: number;
}

export interface ScheduleSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  room?: string;
  teacherName?: string;
}

export interface DaySession {
  session: SessionType;
  startTime: string;
  endTime: string;
  activities: string[];
}

export interface CourseModule {
  code: string;
  name: string;
  creditHours: number;
  lectureHoursPerWeek: number;
  tutorialHoursPerWeek: number;
  labHoursPerWeek: number;
  semester: string;
}

// ============================================================

export type UserRole = 'parent' | 'centre_admin' | 'centre_head' | 'department_head' | 'finance_admin' | 'auditor' | 'teacher';

export type StudentStatus = 'active' | 'pending' | 'transferred' | 'withdrawn' | 'alumni';

export type SubsidyCategory = 'B40' | 'M40' | 'T20' | 'Asnaf' | 'None';

export type InvoiceStatus = 'pending' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export type PaymentMethod = 'FPX' | 'JomPAY' | 'Salary Deduction' | 'Cash' | 'Cheque';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  ic: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
}

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  ic: string;
  dateOfBirth: Date;
  guardianId: string;
  guardian: User;
  centreId: string;
  centre: Centre;
  status: StudentStatus;
  subsidyCategory: SubsidyCategory;
  registrationDate: Date;
  monthlyFee: number;
  depositAmount: number;
}

export interface Centre {
  id: string;
  name: string;
  code: string;
  address: string;
  capacity: number;
  headId: string;
  head: User;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  student: Student;
  amount: number;
  subsidyAmount: number;
  netAmount: number;
  penaltyAmount: number;
  dueDate: Date;
  status: InvoiceStatus;
  issueDate: Date;
  paidAmount: number;
  description: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice: Invoice;
  amount: number;
  method: PaymentMethod;
  paymentDate: Date;
  referenceNumber: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Attendance {
  id: string;
  studentId: string;
  student: Student;
  date: Date;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  method: 'Face ID' | 'QR Code' | 'Manual';
  recordedBy: string;
}

export interface SubsidyRule {
  id: string;
  category: SubsidyCategory;
  percentage: number;
  maxAmount: number;
  minIncome: number;
  maxIncome: number;
  isActive: boolean;
}

export interface FeeCategory {
  id: string;
  name: string;
  centreId: string;
  monthlyFee: number;
  depositAmount: number;
  ageGroupMin: number;
  ageGroupMax: number;
  isActive: boolean;
}

export interface ApprovalRequest {
  id: string;
  type: 'fee_adjustment' | 'subsidy_override' | 'refund' | 'write_off' | 'transfer';
  requesterId: string;
  requester: User;
  approverId?: string;
  approver?: User;
  status: ApprovalStatus;
  amount: number;
  description: string;
  requestDate: Date;
  approvalDate?: Date;
  comments?: string;
  studentId?: string;
  invoiceId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  entity: string;
  entityId: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
}

export interface IntegrationLog {
  id: string;
  type: 'IAS_SYNC' | 'PAYMENT_GATEWAY' | 'WHATSAPP' | 'EMAIL';
  status: 'success' | 'failed' | 'pending' | 'retry';
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
  errorMessage?: string;
  retryCount: number;
  timestamp: Date;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  outstandingAmount: number;
  collectionRate: number;
  subsidyUtilization: number;
  attendanceRate: number;
  pendingApprovals: number;
}

// ============================================================
// TEACHER PORTAL TYPES
// ============================================================

export type LogbookEntryType = 'General' | 'Health' | 'Behaviour' | 'Achievement' | 'Incident';

export type MoodIndicator = 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Energetic';

export type DisciplineType = 'merit' | 'demerit';

export type DisciplineCategory = 'Academic' | 'Behaviour' | 'Punctuality' | 'Uniform' | 'Participation' | 'Leadership' | 'Cleanliness';

export * from './student-lifecycle';
