// Student Lifecycle Management Types

import type { EducationLevel, SubsidyCategory } from './index';

// ============================================================
// STATUS TYPES
// ============================================================

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'enrolled';

export type TransferStatus = 'requested' | 'approved' | 'completed' | 'cancelled';

export type WithdrawalStatus = 'requested' | 'approved' | 'completed' | 'cancelled';

export type TimelineEventType =
  | 'application'
  | 'registration'
  | 'status_change'
  | 'transfer'
  | 'withdrawal'
  | 'reenrollment'
  | 'fee_change'
  | 'note';

// ============================================================
// INTERFACES
// ============================================================

export interface StudentApplication {
  id: string;
  studentName: string;
  ic: string;
  dateOfBirth: Date;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  centreId: string;
  centreName: string;
  educationLevel: EducationLevel;
  subsidyCategory: SubsidyCategory;
  status: ApplicationStatus;
  appliedDate: Date;
  reviewedDate?: Date;
  reviewedBy?: string;
  notes?: string;
}

export interface TransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  fromCentreId: string;
  fromCentreName: string;
  toCentreId: string;
  toCentreName: string;
  reason: string;
  status: TransferStatus;
  requestedDate: Date;
  completedDate?: Date;
  processedBy?: string;
  educationLevel: EducationLevel;
}

export interface WithdrawalRequest {
  id: string;
  studentId: string;
  studentName: string;
  centreId: string;
  centreName: string;
  reason: string;
  lastDay: Date;
  status: WithdrawalStatus;
  requestedDate: Date;
  completedDate?: Date;
  processedBy?: string;
  refundAmount?: number;
  educationLevel: EducationLevel;
}

export interface TimelineEvent {
  id: string;
  studentId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: Date;
  performedBy?: string;
  metadata?: Record<string, unknown>;
}
