import type { EducationLevel } from '../types';
import { malaysianStudents } from './malaysian-students';
import { malaysianInstitutes } from './malaysian-institutes';

// ============================================================
// SEEDED RANDOM — deterministic results for consistent mock data
// ============================================================

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ============================================================
// ATTENDANCE RECORDS
// ============================================================

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  centreCode: string;
  centreName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'excused';
  lateMinutes: number;
  penaltyRM: number;
  educationLevel: EducationLevel;
}

export function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const rand = seededRandom(42);
  const today = new Date();

  malaysianStudents.forEach((student, si) => {
    for (let d = 29; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);

      // Skip weekends
      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      const r = rand();
      let status: AttendanceRecord['status'];
      let lateMinutes = 0;
      let penaltyRM = 0;
      let checkIn: string | null = null;
      let checkOut: string | null = null;

      if (r < 0.88) {
        status = 'present';
        const hour = 7 + Math.floor(rand() * 1);
        const min = Math.floor(rand() * 30);
        checkIn = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        const outHour = 14 + Math.floor(rand() * 3);
        const outMin = Math.floor(rand() * 60);
        checkOut = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
      } else if (r < 0.94) {
        status = 'late';
        lateMinutes = 5 + Math.floor(rand() * 55);
        if (lateMinutes <= 15) penaltyRM = 5;
        else if (lateMinutes <= 30) penaltyRM = 10;
        else penaltyRM = 15;
        const hour = 8 + Math.floor(rand() * 2);
        const min = Math.floor(rand() * 60);
        checkIn = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        const outHour = 14 + Math.floor(rand() * 3);
        const outMin = Math.floor(rand() * 60);
        checkOut = `${String(outHour).padStart(2, '0')}:${String(outMin).padStart(2, '0')}`;
      } else if (r < 0.97) {
        status = 'absent';
      } else {
        status = 'excused';
      }

      records.push({
        id: `att-${student.id}-${d}`,
        studentId: student.id,
        studentName: student.name,
        centreCode: student.centre.code,
        centreName: student.centre.name,
        date: date.toISOString().split('T')[0],
        checkIn,
        checkOut,
        status,
        lateMinutes,
        penaltyRM,
        educationLevel: student.educationLevel,
      });
    }
  });

  return records;
}

// ============================================================
// AGING DATA
// ============================================================

export interface AgingRecord {
  id: string;
  guardianId: string;
  guardianName: string;
  guardianPhone: string;
  studentId: string;
  studentName: string;
  centreCode: string;
  centreName: string;
  totalOutstanding: number;
  current: number;
  days30: number;
  days60: number;
  days90plus: number;
  lastPaymentDate: string;
  educationLevel: EducationLevel;
}

export function generateAgingData(): AgingRecord[] {
  const records: AgingRecord[] = [];
  const rand = seededRandom(123);

  malaysianStudents.forEach((student) => {
    // ~40% of students have some outstanding
    if (rand() > 0.40) return;

    const fee = student.monthlyFee;
    const months = 1 + Math.floor(rand() * 4); // 1-4 months outstanding
    const totalOutstanding = fee * months;

    let current = 0;
    let days30 = 0;
    let days60 = 0;
    let days90plus = 0;

    if (months >= 1) current = fee;
    if (months >= 2) days30 = fee;
    if (months >= 3) days60 = fee;
    if (months >= 4) days90plus = fee * (months - 3);

    const daysAgo = 15 + Math.floor(rand() * 90);
    const lastDate = new Date();
    lastDate.setDate(lastDate.getDate() - daysAgo);

    records.push({
      id: `aging-${student.id}`,
      guardianId: student.guardianId,
      guardianName: student.guardian.name,
      guardianPhone: student.guardian.phoneNumber ?? '-',
      studentId: student.id,
      studentName: student.name,
      centreCode: student.centre.code,
      centreName: student.centre.name,
      totalOutstanding,
      current,
      days30,
      days60,
      days90plus,
      lastPaymentDate: lastDate.toISOString().split('T')[0],
      educationLevel: student.educationLevel,
    });
  });

  return records;
}

// ============================================================
// SUBSIDY DATA
// ============================================================

export interface SubsidyRecord {
  id: string;
  centreCode: string;
  centreName: string;
  subsidyType: string;
  fundSource: 'Zakat' | 'Wakaf' | 'Sumber Am';
  eligibleStudents: number;
  allocated: number;
  utilized: number;
  remaining: number;
  utilizationRate: number;
  educationLevel: EducationLevel;
}

export function generateSubsidyData(): SubsidyRecord[] {
  const records: SubsidyRecord[] = [];
  const rand = seededRandom(456);

  const fundSources: Array<'Zakat' | 'Wakaf' | 'Sumber Am'> = ['Zakat', 'Wakaf', 'Sumber Am'];
  const subsidyTypes = ['B40', 'M40', 'Asnaf'];

  const fundMap: Record<string, 'Zakat' | 'Wakaf' | 'Sumber Am'> = {
    B40: 'Zakat',
    M40: 'Sumber Am',
    Asnaf: 'Wakaf',
  };

  malaysianInstitutes.forEach((institute) => {
    const studentsInCentre = malaysianStudents.filter(s => s.centre.code === institute.code);

    subsidyTypes.forEach((type) => {
      const eligible = studentsInCentre.filter(s => s.subsidyCategory === type).length;
      if (eligible === 0) return;

      const avgFee = studentsInCentre.length > 0
        ? studentsInCentre.reduce((sum, s) => sum + s.monthlyFee, 0) / studentsInCentre.length
        : 200;

      const coverageRate = type === 'B40' ? 0.80 : type === 'Asnaf' ? 1.00 : 0.50;
      const allocated = Math.round(eligible * avgFee * coverageRate * 3); // 3 months
      const utilizationRate = 0.65 + rand() * 0.30; // 65-95%
      const utilized = Math.round(allocated * utilizationRate);
      const remaining = allocated - utilized;

      records.push({
        id: `sub-${institute.code}-${type}`,
        centreCode: institute.code,
        centreName: institute.name,
        subsidyType: type,
        fundSource: fundMap[type],
        eligibleStudents: eligible,
        allocated,
        utilized,
        remaining,
        utilizationRate: Math.round(utilizationRate * 100),
        educationLevel: institute.educationLevel,
      });
    });
  });

  return records;
}

// ============================================================
// FEE COLLECTION WITH FUND SOURCE
// ============================================================

export interface FeeCollectionRecord {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  centreCode: string;
  centreName: string;
  monthYear: string;
  amount: number;
  fundSource: 'Zakat' | 'Wakaf' | 'Sumber Am';
  status: 'paid' | 'pending';
  dueDate: string;
  paidDate: string | null;
  subsidyCategory: string;
  educationLevel: EducationLevel;
}

export function generateFeeCollectionRecords(): FeeCollectionRecord[] {
  const records: FeeCollectionRecord[] = [];
  const rand = seededRandom(789);

  const fundMap: Record<string, 'Zakat' | 'Wakaf' | 'Sumber Am'> = {
    B40: 'Zakat',
    M40: 'Sumber Am',
    T20: 'Sumber Am',
    Asnaf: 'Wakaf',
    None: 'Sumber Am',
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  malaysianStudents.forEach((student) => {
    for (let i = 2; i >= 0; i--) {
      const month = currentMonth - i;
      const year = month < 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = month < 0 ? 12 + month : month;

      const dueDate = new Date(year, adjustedMonth, 5);
      const isPaid = i > 0 || rand() > 0.3;
      const paidDate = isPaid
        ? new Date(year, adjustedMonth, 1 + Math.floor(rand() * 10))
        : null;

      records.push({
        id: `fee-${student.id}-${year}-${adjustedMonth}`,
        studentId: student.id,
        studentCode: student.studentCode,
        studentName: student.name,
        centreCode: student.centre.code,
        centreName: student.centre.name,
        monthYear: new Date(year, adjustedMonth, 1).toLocaleDateString('en-MY', {
          month: 'long',
          year: 'numeric',
        }),
        amount: student.monthlyFee,
        fundSource: fundMap[student.subsidyCategory] ?? 'Sumber Am',
        status: isPaid ? 'paid' : 'pending',
        dueDate: dueDate.toISOString().split('T')[0],
        paidDate: paidDate ? paidDate.toISOString().split('T')[0] : null,
        subsidyCategory: student.subsidyCategory,
        educationLevel: student.educationLevel,
      });
    }
  });

  return records;
}

// ============================================================
// FUND BREAKDOWN SUMMARY
// ============================================================

export interface FundBreakdown {
  fundSource: 'Zakat' | 'Wakaf' | 'Sumber Am';
  invoiced: number;
  collected: number;
  outstanding: number;
  collectionRate: number;
}

export function generateFundBreakdown(): FundBreakdown[] {
  const records = generateFeeCollectionRecords();
  const funds: Array<'Zakat' | 'Wakaf' | 'Sumber Am'> = ['Zakat', 'Wakaf', 'Sumber Am'];

  return funds.map((fund) => {
    const fundRecords = records.filter(r => r.fundSource === fund);
    const invoiced = fundRecords.reduce((sum, r) => sum + r.amount, 0);
    const collected = fundRecords
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);
    const outstanding = invoiced - collected;
    const collectionRate = invoiced > 0 ? Math.round((collected / invoiced) * 100) : 0;

    return { fundSource: fund, invoiced, collected, outstanding, collectionRate };
  });
}
