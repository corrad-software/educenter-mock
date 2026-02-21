import type { EducationLevel } from '../types';

// ============================================================
// DASHBOARD STATS PER LEVEL
// ============================================================

export interface LevelStats {
  totalStudents: number;
  activeStudents: number;
  pendingStudents: number;
  totalInstitutions: number;
  feeCollectedRM: number;
  outstandingRM: number;
  attendanceRate: number;
  collectionRate: number;
}

export const LEVEL_STATS: Record<EducationLevel, LevelStats> = {
  maiwp: {
    totalStudents: 984,      // 268+215+189+312
    activeStudents: 947,     // 257+208+178+304
    pendingStudents: 37,     // 11+7+8+11
    totalInstitutions: 18,   // 8+5+3+2
    feeCollectedRM: 631700,  // sum of all levels
    outstandingRM: 87900,    // sum of all levels
    attendanceRate: 91.5,    // weighted average
    collectionRate: 87.8,
  },
  preschool: {
    // 8 tadika: TI-001(32) TI-002(44) TI-003(38) TI-004(30) TI-005(27) TI-006(35) TI-007(39) TI-L001(23) = 268
    totalStudents: 268,
    activeStudents: 257,
    pendingStudents: 11,
    totalInstitutions: 8,
    feeCollectedRM: 162800,
    outstandingRM: 13400,
    attendanceRate: 92.3,
    collectionRate: 90.1,
  },
  primary: {
    // 5 schools: SABK-001(45) SABK-002(52) SABK-003(48) SRAI-001(38) SRAI-002(32) = 215
    totalStudents: 215,
    activeStudents: 208,
    pendingStudents: 7,
    totalInstitutions: 5,
    feeCollectedRM: 86000,
    outstandingRM: 12500,
    attendanceRate: 94.1,
    collectionRate: 87.3,
  },
  secondary: {
    // 3 schools (real): SMA MAIWP KL(62) SMA MAIWP Labuan(48) SMISTA(79) = 189
    totalStudents: 189,
    activeStudents: 178,
    pendingStudents: 8,
    totalInstitutions: 3,
    feeCollectedRM: 94500,
    outstandingRM: 18200,
    attendanceRate: 91.7,
    collectionRate: 83.8,
  },
  university: {
    // 2 institutions (real): KPMAIWP(180) IKB(132) = 312
    totalStudents: 312,
    activeStudents: 304,
    pendingStudents: 11,
    totalInstitutions: 2,
    feeCollectedRM: 280800,
    outstandingRM: 44000,
    attendanceRate: 87.4,
    collectionRate: 86.5,
  },
};

// ============================================================
// STUDENT SCORES PER LEVEL
// ============================================================

export interface PreschoolStudent {
  id: string;
  name: string;
  age: number;
  session: 'morning' | 'afternoon';
  scores: Record<string, string>; // subjectCode -> band
}

export interface SchoolStudent {
  id: string;
  name: string;
  year?: number;   // primary
  form?: number;   // secondary
  class: string;
  scores: Record<string, { mark: number; grade: string; gpa?: number }>;
}

export interface UniversityStudent {
  id: string;
  name: string;
  programme: string;
  semester: string;
  creditHoursEnrolled: number;
  cgpa: number;
  modules: Array<{ code: string; grade: string; gpa: number; creditHours: number }>;
}

export const PRESCHOOL_STUDENTS: PreschoolStudent[] = [
  {
    id: 'pre-1', name: 'Insyirah Damia binti Zul', age: 5, session: 'morning',
    scores: { LIT: 'Achieving', NUM: 'Developing', ART: 'Exceeding', REL: 'Achieving', PE: 'Achieving', SEL: 'Developing' },
  },
  {
    id: 'pre-2', name: 'Adam Rayyan bin Halim', age: 4, session: 'afternoon',
    scores: { LIT: 'Emerging', NUM: 'Developing', ART: 'Developing', REL: 'Developing', PE: 'Achieving', SEL: 'Emerging' },
  },
  {
    id: 'pre-3', name: 'Nurul Ain binti Rashid', age: 6, session: 'morning',
    scores: { LIT: 'Exceeding', NUM: 'Achieving', ART: 'Exceeding', REL: 'Achieving', PE: 'Achieving', SEL: 'Achieving' },
  },
  {
    id: 'pre-4', name: 'Harith Iman bin Zaidi', age: 5, session: 'morning',
    scores: { LIT: 'Developing', NUM: 'Achieving', ART: 'Achieving', REL: 'Exceeding', PE: 'Developing', SEL: 'Developing' },
  },
  {
    id: 'pre-5', name: 'Sofea Irdina binti Azman', age: 4, session: 'afternoon',
    scores: { LIT: 'Developing', NUM: 'Emerging', ART: 'Developing', REL: 'Developing', PE: 'Developing', SEL: 'Achieving' },
  },
];

export const PRIMARY_STUDENTS: SchoolStudent[] = [
  {
    id: 'pri-1', name: 'Muhammad Afiq bin Rahman', year: 4, class: '4 Imtiyaz',
    scores: {
      BM: { mark: 88, grade: 'A' }, BI: { mark: 76, grade: 'B+' }, MT: { mark: 92, grade: 'A+' },
      SC: { mark: 84, grade: 'A' }, PI: { mark: 90, grade: 'A+' }, SE: { mark: 79, grade: 'B+' },
    },
  },
  {
    id: 'pri-2', name: 'Nurul Hanis binti Kamal', year: 5, class: '5 Cemerlang',
    scores: {
      BM: { mark: 95, grade: 'A+' }, BI: { mark: 82, grade: 'A' }, MT: { mark: 78, grade: 'B+' },
      SC: { mark: 88, grade: 'A' }, PI: { mark: 94, grade: 'A+' }, SE: { mark: 85, grade: 'A' },
    },
  },
  {
    id: 'pri-3', name: 'Aiman Haziq bin Nordin', year: 3, class: '3 Ikhlas',
    scores: {
      BM: { mark: 72, grade: 'B+' }, BI: { mark: 65, grade: 'B' }, MT: { mark: 58, grade: 'C+' },
      SC: { mark: 70, grade: 'B+' }, PI: { mark: 80, grade: 'A' }, SE: { mark: 68, grade: 'B' },
    },
  },
  {
    id: 'pri-4', name: 'Iffah Syahirah binti Daud', year: 6, class: '6 Bijaksana',
    scores: {
      BM: { mark: 91, grade: 'A+' }, BI: { mark: 87, grade: 'A' }, MT: { mark: 95, grade: 'A+' },
      SC: { mark: 89, grade: 'A' }, PI: { mark: 93, grade: 'A+' }, SE: { mark: 86, grade: 'A' },
    },
  },
  {
    id: 'pri-5', name: 'Zafran Aqil bin Sulaiman', year: 4, class: '4 Harapan',
    scores: {
      BM: { mark: 55, grade: 'C+' }, BI: { mark: 48, grade: 'C' }, MT: { mark: 62, grade: 'B' },
      SC: { mark: 58, grade: 'C+' }, PI: { mark: 75, grade: 'B+' }, SE: { mark: 52, grade: 'C+' },
    },
  },
];

export const SECONDARY_STUDENTS: SchoolStudent[] = [
  {
    id: 'sec-1', name: 'Nur Aina binti Zaki', form: 5, class: '5 Sains 1',
    scores: {
      BM: { mark: 82, grade: 'A', gpa: 3.67 }, BI: { mark: 75, grade: 'A-', gpa: 3.33 },
      MT: { mark: 68, grade: 'B+', gpa: 3.00 }, AM: { mark: 55, grade: 'C+', gpa: 2.00 },
      BIO: { mark: 71, grade: 'B+', gpa: 3.00 }, PI: { mark: 88, grade: 'A', gpa: 3.67 },
    },
  },
  {
    id: 'sec-2', name: 'Muhammad Danial bin Aziz', form: 4, class: '4 Sains 2',
    scores: {
      BM: { mark: 90, grade: 'A+', gpa: 4.00 }, BI: { mark: 84, grade: 'A', gpa: 3.67 },
      MT: { mark: 88, grade: 'A', gpa: 3.67 }, AM: { mark: 79, grade: 'B+', gpa: 3.00 },
      PHY: { mark: 74, grade: 'A-', gpa: 3.33 }, CHEM: { mark: 77, grade: 'B+', gpa: 3.00 },
    },
  },
  {
    id: 'sec-3', name: 'Aisyah Humaira binti Rosli', form: 3, class: '3 Bestari',
    scores: {
      BM: { mark: 78, grade: 'B+', gpa: 3.00 }, BI: { mark: 70, grade: 'B+', gpa: 3.00 },
      MT: { mark: 65, grade: 'B', gpa: 2.67 }, SC: { mark: 72, grade: 'A-', gpa: 3.33 },
      PI: { mark: 85, grade: 'A', gpa: 3.67 }, SEJ: { mark: 68, grade: 'B+', gpa: 3.00 },
    },
  },
  {
    id: 'sec-4', name: 'Irfan Hakimi bin Yusof', form: 5, class: '5 Perdagangan',
    scores: {
      BM: { mark: 74, grade: 'A-', gpa: 3.33 }, BI: { mark: 68, grade: 'B+', gpa: 3.00 },
      MT: { mark: 60, grade: 'B-', gpa: 2.33 }, EKO: { mark: 78, grade: 'B+', gpa: 3.00 },
      PI: { mark: 82, grade: 'A', gpa: 3.67 }, SEJ: { mark: 76, grade: 'B+', gpa: 3.00 },
    },
  },
  {
    id: 'sec-5', name: 'Farhana binti Mohd Noor', form: 2, class: '2 Mulia',
    scores: {
      BM: { mark: 88, grade: 'A', gpa: 3.67 }, BI: { mark: 79, grade: 'B+', gpa: 3.00 },
      MT: { mark: 91, grade: 'A+', gpa: 4.00 }, SC: { mark: 85, grade: 'A', gpa: 3.67 },
      PI: { mark: 92, grade: 'A+', gpa: 4.00 }, SEJ: { mark: 80, grade: 'A', gpa: 3.67 },
    },
  },
];

export const UNIVERSITY_STUDENTS: UniversityStudent[] = [
  {
    id: 'uni-1', name: 'Ahmad Syahmi bin Ismail',
    programme: 'Bachelor of Islamic Studies', semester: '2024/2025 - Semester 2',
    creditHoursEnrolled: 18, cgpa: 3.42,
    modules: [
      { code: 'QUR101', grade: 'A-', gpa: 3.67, creditHours: 3 },
      { code: 'ARA101', grade: 'B+', gpa: 3.33, creditHours: 3 },
      { code: 'ISL201', grade: 'A', gpa: 4.00, creditHours: 3 },
      { code: 'MGT301', grade: 'B+', gpa: 3.33, creditHours: 3 },
      { code: 'HIS101', grade: 'A-', gpa: 3.67, creditHours: 3 },
      { code: 'RES401', grade: 'B', gpa: 3.00, creditHours: 3 },
    ],
  },
  {
    id: 'uni-2', name: 'Nurul Hidayah binti Hamzah',
    programme: 'Bachelor of Islamic Finance', semester: '2024/2025 - Semester 2',
    creditHoursEnrolled: 15, cgpa: 3.78,
    modules: [
      { code: 'QUR101', grade: 'A', gpa: 4.00, creditHours: 3 },
      { code: 'FIN201', grade: 'A-', gpa: 3.67, creditHours: 3 },
      { code: 'ISL201', grade: 'A+', gpa: 4.00, creditHours: 3 },
      { code: 'MGT301', grade: 'A-', gpa: 3.67, creditHours: 3 },
      { code: 'RES401', grade: 'A', gpa: 4.00, creditHours: 3 },
    ],
  },
  {
    id: 'uni-3', name: 'Muhammad Fariz bin Kamarul',
    programme: 'Bachelor of Islamic Management', semester: '2024/2025 - Semester 2',
    creditHoursEnrolled: 18, cgpa: 2.56,
    modules: [
      { code: 'QUR101', grade: 'C+', gpa: 2.33, creditHours: 3 },
      { code: 'ARA101', grade: 'C', gpa: 2.00, creditHours: 3 },
      { code: 'MGT301', grade: 'B', gpa: 3.00, creditHours: 3 },
      { code: 'FIN201', grade: 'C+', gpa: 2.33, creditHours: 3 },
      { code: 'HIS101', grade: 'B-', gpa: 2.67, creditHours: 3 },
      { code: 'LAB201', grade: 'B+', gpa: 3.33, creditHours: 1 },
    ],
  },
  {
    id: 'uni-4', name: 'Syazana binti Mohd Fauzi',
    programme: 'Bachelor of Islamic Studies', semester: '2024/2025 - Semester 2',
    creditHoursEnrolled: 12, cgpa: 3.91,
    modules: [
      { code: 'ISL201', grade: 'A+', gpa: 4.00, creditHours: 3 },
      { code: 'QUR101', grade: 'A+', gpa: 4.00, creditHours: 3 },
      { code: 'HIS101', grade: 'A', gpa: 4.00, creditHours: 3 },
      { code: 'ARA101', grade: 'A-', gpa: 3.67, creditHours: 3 },
    ],
  },
  {
    id: 'uni-5', name: 'Hazwan Ariff bin Saiful',
    programme: 'Bachelor of Islamic Finance', semester: '2024/2025 - Semester 2',
    creditHoursEnrolled: 18, cgpa: 1.87,
    modules: [
      { code: 'QUR101', grade: 'D', gpa: 1.00, creditHours: 3 },
      { code: 'FIN201', grade: 'C', gpa: 2.00, creditHours: 3 },
      { code: 'ISL201', grade: 'C+', gpa: 2.33, creditHours: 3 },
      { code: 'MGT301', grade: 'D', gpa: 1.00, creditHours: 3 },
      { code: 'HIS101', grade: 'C', gpa: 2.00, creditHours: 3 },
      { code: 'RES401', grade: 'C+', gpa: 2.33, creditHours: 3 },
    ],
  },
];

// ============================================================
// RECENT ACTIVITIES PER LEVEL
// ============================================================

export const LEVEL_ACTIVITIES: Record<EducationLevel, Array<{ action: string; name: string; time: string; type: 'info' | 'success' | 'warning' }>> = {
  maiwp: [
    { action: 'New university faculty registered', name: 'Fakulti Pengajian Islam, UIAM', time: '1 hour ago', type: 'success' },
    { action: 'System-wide fee report generated', name: 'All 18 institutions', time: '3 hours ago', type: 'info' },
    { action: 'Outstanding fees alert', name: 'Secondary schools — RM18,200', time: '1 day ago', type: 'warning' },
    { action: 'New primary school added', name: 'SABK Bukit Jalil, Kuala Lumpur', time: '2 days ago', type: 'success' },
  ],
  preschool: [
    { action: 'Child enrolled', name: 'Zara Irdina binti Fadzil', time: '2 hours ago', type: 'success' },
    { action: 'Morning session attendance recorded', name: 'Centre Tadika Al-Iman KL', time: '3 hours ago', type: 'info' },
    { action: 'Monthly fee overdue', name: 'Adam Rayyan bin Halim', time: '1 day ago', type: 'warning' },
    { action: 'Development report generated', name: 'Nurul Ain binti Rashid', time: '2 days ago', type: 'info' },
  ],
  primary: [
    { action: 'New student registered', name: 'Muhammad Afiq bin Rahman', time: '1 hour ago', type: 'success' },
    { action: 'Term 2 results uploaded', name: 'SK Islam Batu Caves', time: '4 hours ago', type: 'info' },
    { action: 'Fee payment received', name: 'Nurul Hanis binti Kamal', time: '5 hours ago', type: 'success' },
    { action: 'Overdue fee reminder sent', name: '7 students', time: '1 day ago', type: 'warning' },
  ],
  secondary: [
    { action: 'SPM trial results uploaded', name: 'SMK Islam Kuala Lumpur', time: '2 hours ago', type: 'info' },
    { action: 'New student transfer', name: 'Irfan Hakimi bin Yusof', time: '6 hours ago', type: 'success' },
    { action: 'Overdue fee alert', name: '12 Form 5 students', time: '1 day ago', type: 'warning' },
    { action: 'Add Math remedial class scheduled', name: 'Form 4 & 5', time: '2 days ago', type: 'info' },
  ],
  university: [
    { action: 'Semester 2 registration closed', name: 'Faculty of Islamic Studies', time: '1 hour ago', type: 'info' },
    { action: 'Scholarship disbursement delayed', name: '22 students affected', time: '3 hours ago', type: 'warning' },
    { action: 'New student matriculated', name: 'Nurul Hidayah binti Hamzah', time: '1 day ago', type: 'success' },
    { action: 'CGPA probation notice sent', name: '15 students (CGPA < 2.00)', time: '2 days ago', type: 'warning' },
  ],
};
