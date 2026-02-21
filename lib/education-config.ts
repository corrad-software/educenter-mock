import type { EducationLevel, SubjectRecord } from './types';

// ============================================================
// COLOR CLASSES — explicit full strings to avoid Tailwind purge
// ============================================================

export const LEVEL_COLOR_CLASSES: Record<EducationLevel, {
  bg: string;
  bgHover: string;
  text: string;
  border: string;
  lightBg: string;
  dot: string;
}> = {
  maiwp: {
    bg: 'bg-slate-700',
    bgHover: 'hover:bg-slate-800',
    text: 'text-slate-700',
    border: 'border-slate-300',
    lightBg: 'bg-slate-50',
    dot: 'bg-slate-700',
  },
  preschool: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    lightBg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
  primary: {
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-200',
    lightBg: 'bg-blue-50',
    dot: 'bg-blue-500',
  },
  secondary: {
    bg: 'bg-violet-500',
    bgHover: 'hover:bg-violet-600',
    text: 'text-violet-600',
    border: 'border-violet-200',
    lightBg: 'bg-violet-50',
    dot: 'bg-violet-500',
  },
  university: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    text: 'text-amber-600',
    border: 'border-amber-200',
    lightBg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
};

// ============================================================
// LEVEL META — for login cards and badges
// ============================================================

export interface LevelMeta {
  id: EducationLevel;
  label: string;
  labelMs: string;
  ageRange: string;
  description: string;
  iconName: string;
  badgeLabel: string;
  feeModel: 'monthly' | 'semester' | 'credit_hour';
  feeModelLabel: string;
  parentDemoLabel: string;
}

export const LEVEL_META: Record<EducationLevel, LevelMeta> = {
  maiwp: {
    id: 'maiwp',
    label: 'MAIWP – System Administration',
    labelMs: 'Majlis Agama Islam Wilayah Persekutuan',
    ageRange: 'All Levels',
    description: 'Central administration for all Islamic education institutions under MAIWP',
    iconName: 'Shield',
    badgeLabel: 'MAIWP',
    feeModel: 'monthly',
    feeModelLabel: 'Fee Overview',
    parentDemoLabel: 'Admin View',
  },
  preschool: {
    id: 'preschool',
    label: 'Pre-school / Tadika',
    labelMs: 'Prasekolah / Tadika',
    ageRange: 'Ages 4–6',
    description: 'Play-based Islamic early education with holistic development focus',
    iconName: 'BookOpen',
    badgeLabel: 'TADIKA',
    feeModel: 'monthly',
    feeModelLabel: 'Monthly Fee',
    parentDemoLabel: 'Parent View',
  },
  primary: {
    id: 'primary',
    label: 'Primary School',
    labelMs: 'Sekolah Rendah',
    ageRange: 'Ages 7–12',
    description: 'KSSR curriculum with Islamic integration, Years 1–6',
    iconName: 'School',
    badgeLabel: 'SR',
    feeModel: 'monthly',
    feeModelLabel: 'Monthly Fee',
    parentDemoLabel: 'Parent View',
  },
  secondary: {
    id: 'secondary',
    label: 'Secondary School',
    labelMs: 'Sekolah Menengah',
    ageRange: 'Ages 13–17',
    description: 'SPM-track with core and elective subjects, Forms 1–5',
    iconName: 'GraduationCap',
    badgeLabel: 'SM',
    feeModel: 'monthly',
    feeModelLabel: 'Monthly Fee',
    parentDemoLabel: 'Parent View',
  },
  university: {
    id: 'university',
    label: 'University / Higher Ed',
    labelMs: 'Institusi Pengajian Tinggi',
    ageRange: 'Ages 18+',
    description: 'Credit-hour based programmes with CGPA grading system',
    iconName: 'Building',
    badgeLabel: 'IPT',
    feeModel: 'credit_hour',
    feeModelLabel: 'Semester Fee',
    parentDemoLabel: 'Student View',
  },
};

// ============================================================
// SUBJECTS
// ============================================================

export const LEVEL_SUBJECTS: Record<EducationLevel, SubjectRecord[]> = {
  maiwp: [], // MAIWP manages all levels — no level-specific subjects
  preschool: [
    { code: 'LIT', name: 'Literacy', nameMs: 'Literasi', isCore: true },
    { code: 'NUM', name: 'Numeracy', nameMs: 'Numerasi', isCore: true },
    { code: 'ART', name: 'Arts & Craft', nameMs: 'Seni Kreatif', isCore: true },
    { code: 'REL', name: 'Islamic Education', nameMs: 'Pendidikan Islam', isCore: true },
    { code: 'PE', name: 'Physical Education', nameMs: 'Pendidikan Jasmani', isCore: true },
    { code: 'SEL', name: 'Social-Emotional', nameMs: 'Sosio-Emosi', isCore: true },
  ],
  primary: [
    { code: 'BM', name: 'Bahasa Melayu', isCore: true },
    { code: 'BI', name: 'English Language', isCore: true },
    { code: 'MT', name: 'Mathematics', nameMs: 'Matematik', isCore: true },
    { code: 'SC', name: 'Science', nameMs: 'Sains', isCore: true },
    { code: 'PI', name: 'Pendidikan Islam', isCore: true },
    { code: 'SE', name: 'Sejarah (History)', isCore: true },
    { code: 'RBT', name: 'Reka Bentuk & Teknologi', isCore: false },
    { code: 'PJ', name: 'Pendidikan Jasmani', isCore: true },
    { code: 'SN', name: 'Seni Visual', isCore: false },
    { code: 'MZ', name: 'Muzik', isCore: false },
  ],
  secondary: [
    { code: 'BM', name: 'Bahasa Melayu', isCore: true },
    { code: 'BI', name: 'English Language', isCore: true },
    { code: 'MT', name: 'Mathematics', isCore: true },
    { code: 'AM', name: 'Additional Mathematics', isCore: false },
    { code: 'SC', name: 'Science', isCore: true },
    { code: 'BIO', name: 'Biology', isCore: false },
    { code: 'CHEM', name: 'Chemistry', isCore: false },
    { code: 'PHY', name: 'Physics', isCore: false },
    { code: 'PI', name: 'Pendidikan Islam', isCore: true },
    { code: 'SEJ', name: 'Sejarah', isCore: true },
    { code: 'GEO', name: 'Geography', isCore: false },
    { code: 'EKO', name: 'Economics', isCore: false },
  ],
  university: [
    { code: 'QUR101', name: 'Quran & Sunnah Studies I', isCore: true, creditHours: 3 },
    { code: 'ARA101', name: 'Arabic Language I', isCore: true, creditHours: 3 },
    { code: 'ISL201', name: 'Islamic Jurisprudence', isCore: true, creditHours: 3 },
    { code: 'MGT301', name: 'Islamic Management', isCore: false, creditHours: 3 },
    { code: 'FIN201', name: 'Islamic Finance', isCore: false, creditHours: 3 },
    { code: 'HIS101', name: 'Islamic Civilization', isCore: true, creditHours: 3 },
    { code: 'RES401', name: 'Research Methodology', isCore: true, creditHours: 3 },
    { code: 'LAB201', name: 'Laboratory Practice', isCore: false, creditHours: 1 },
  ],
};

// ============================================================
// SCORING SYSTEMS
// ============================================================

export interface ScoringScale {
  value: string;
  label: string;
  minMark?: number;
  maxMark?: number;
  gpaPoints?: number;
  colorClass: string;
}

export interface ScoringSystem {
  type: 'band' | 'grade' | 'gpa';
  label: string;
  scale: ScoringScale[];
}

export const LEVEL_SCORING: Record<EducationLevel, ScoringSystem> = {
  maiwp: { type: 'grade', label: 'N/A', scale: [] }, // MAIWP has no scoring system
  preschool: {
    type: 'band',
    label: 'Development Band',
    scale: [
      { value: 'Exceeding', label: 'Exceeding (4)', colorClass: 'text-emerald-700 bg-emerald-50' },
      { value: 'Achieving', label: 'Achieving (3)', colorClass: 'text-blue-700 bg-blue-50' },
      { value: 'Developing', label: 'Developing (2)', colorClass: 'text-yellow-700 bg-yellow-50' },
      { value: 'Emerging', label: 'Emerging (1)', colorClass: 'text-red-700 bg-red-50' },
    ],
  },
  primary: {
    type: 'grade',
    label: 'KSSR Grade',
    scale: [
      { value: 'A+', label: 'A+', minMark: 90, maxMark: 100, colorClass: 'text-emerald-700 bg-emerald-50' },
      { value: 'A', label: 'A', minMark: 80, maxMark: 89, colorClass: 'text-green-700 bg-green-50' },
      { value: 'B+', label: 'B+', minMark: 70, maxMark: 79, colorClass: 'text-blue-700 bg-blue-50' },
      { value: 'B', label: 'B', minMark: 60, maxMark: 69, colorClass: 'text-blue-500 bg-blue-50' },
      { value: 'C+', label: 'C+', minMark: 50, maxMark: 59, colorClass: 'text-yellow-600 bg-yellow-50' },
      { value: 'C', label: 'C', minMark: 40, maxMark: 49, colorClass: 'text-orange-600 bg-orange-50' },
      { value: 'D', label: 'D', minMark: 30, maxMark: 39, colorClass: 'text-red-600 bg-red-50' },
      { value: 'E', label: 'E', minMark: 20, maxMark: 29, colorClass: 'text-red-700 bg-red-100' },
      { value: 'F', label: 'F', minMark: 0, maxMark: 19, colorClass: 'text-gray-600 bg-gray-50' },
    ],
  },
  secondary: {
    type: 'gpa',
    label: 'SPM / GPA Grade',
    scale: [
      { value: 'A+', label: 'A+', gpaPoints: 4.00, minMark: 90, colorClass: 'text-emerald-700 bg-emerald-50' },
      { value: 'A', label: 'A', gpaPoints: 3.67, minMark: 80, colorClass: 'text-green-700 bg-green-50' },
      { value: 'A-', label: 'A-', gpaPoints: 3.33, minMark: 75, colorClass: 'text-green-600 bg-green-50' },
      { value: 'B+', label: 'B+', gpaPoints: 3.00, minMark: 70, colorClass: 'text-blue-700 bg-blue-50' },
      { value: 'B', label: 'B', gpaPoints: 2.67, minMark: 65, colorClass: 'text-blue-500 bg-blue-50' },
      { value: 'B-', label: 'B-', gpaPoints: 2.33, minMark: 60, colorClass: 'text-yellow-600 bg-yellow-50' },
      { value: 'C+', label: 'C+', gpaPoints: 2.00, minMark: 55, colorClass: 'text-orange-600 bg-orange-50' },
      { value: 'C', label: 'C', gpaPoints: 1.67, minMark: 50, colorClass: 'text-orange-700 bg-orange-100' },
      { value: 'D', label: 'D', gpaPoints: 1.00, minMark: 45, colorClass: 'text-red-600 bg-red-50' },
      { value: 'F', label: 'F', gpaPoints: 0.00, minMark: 0, colorClass: 'text-gray-600 bg-gray-50' },
    ],
  },
  university: {
    type: 'gpa',
    label: 'CGPA',
    scale: [
      { value: 'A+', label: 'A+', gpaPoints: 4.00, minMark: 90, colorClass: 'text-emerald-700 bg-emerald-50' },
      { value: 'A', label: 'A', gpaPoints: 4.00, minMark: 85, colorClass: 'text-green-700 bg-green-50' },
      { value: 'A-', label: 'A-', gpaPoints: 3.67, minMark: 80, colorClass: 'text-green-600 bg-green-50' },
      { value: 'B+', label: 'B+', gpaPoints: 3.33, minMark: 75, colorClass: 'text-blue-700 bg-blue-50' },
      { value: 'B', label: 'B', gpaPoints: 3.00, minMark: 70, colorClass: 'text-blue-500 bg-blue-50' },
      { value: 'B-', label: 'B-', gpaPoints: 2.67, minMark: 65, colorClass: 'text-yellow-600 bg-yellow-50' },
      { value: 'C+', label: 'C+', gpaPoints: 2.33, minMark: 60, colorClass: 'text-orange-600 bg-orange-50' },
      { value: 'C', label: 'C', gpaPoints: 2.00, minMark: 55, colorClass: 'text-orange-700 bg-orange-100' },
      { value: 'D', label: 'D', gpaPoints: 1.00, minMark: 45, colorClass: 'text-red-600 bg-red-50' },
      { value: 'F', label: 'F', gpaPoints: 0.00, minMark: 0, colorClass: 'text-gray-600 bg-gray-50' },
    ],
  },
};

// ============================================================
// SCHEDULE CONFIG
// ============================================================

export interface ScheduleConfig {
  type: 'session' | 'period' | 'lecture';
  label: string;
  periodsPerDay?: number;
  periodDurationMin?: number;
  sessions?: Array<'morning' | 'afternoon'>;
  sessionDurationHours?: number;
}

export const LEVEL_SCHEDULE: Record<EducationLevel, ScheduleConfig> = {
  maiwp: { type: 'period', label: 'N/A' }, // MAIWP has no schedule
  preschool: {
    type: 'session',
    label: 'Session Schedule',
    sessions: ['morning', 'afternoon'],
    sessionDurationHours: 4,
  },
  primary: {
    type: 'period',
    label: 'Period Timetable',
    periodsPerDay: 10,
    periodDurationMin: 35,
  },
  secondary: {
    type: 'period',
    label: 'Period Timetable',
    periodsPerDay: 10,
    periodDurationMin: 35,
  },
  university: {
    type: 'lecture',
    label: 'Semester Timetable',
  },
};

// ============================================================
// NAV ITEMS
// ============================================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  children?: NavItem[];
}

export const LEVEL_NAV_ITEMS: Record<EducationLevel, NavItem[]> = {
  maiwp: [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', iconName: 'Home' },
    {
      id: 'institutions', label: 'Institutions', href: '/admin/institutes', iconName: 'Building2',
      children: [
        { id: 'institutions-all', label: 'All Institutions', href: '/admin/institutes', iconName: 'Building2' },
        { id: 'institutions-add', label: 'Add New', href: '/admin/institutes/add', iconName: 'UserPlus' },
      ],
    },
    {
      id: 'students', label: 'Students', href: '/admin/students', iconName: 'Users',
      children: [
        { id: 'students-all', label: 'All Students', href: '/admin/students', iconName: 'Users' },
        { id: 'students-add', label: 'Add New', href: '/admin/students/add', iconName: 'UserPlus' },
        { id: 'students-applications', label: 'Applications', href: '/admin/students/applications', iconName: 'ClipboardList' },
        { id: 'students-transfers', label: 'Transfers', href: '/admin/students/transfers', iconName: 'ArrowRightLeft' },
        { id: 'students-alumni', label: 'Alumni', href: '/admin/students/alumni', iconName: 'GraduationCap' },
      ],
    },
    { id: 'attendance', label: 'Attendance', href: '/admin/attendance', iconName: 'Calendar' },
    {
      id: 'fees', label: 'Fees', href: '/admin/fees', iconName: 'DollarSign',
      children: [
        { id: 'fees-monitor', label: 'Fee Monitoring', href: '/admin/fees', iconName: 'DollarSign' },
        { id: 'fees-setup', label: 'Fee Setup', href: '/admin/fee-setup', iconName: 'Settings' },
      ],
    },
    {
      id: 'reports', label: 'Reports', href: '/admin/reports', iconName: 'FileBarChart',
      children: [
        { id: 'reports-hub', label: 'Reports Hub', href: '/admin/reports', iconName: 'LayoutDashboard' },
        { id: 'reports-enrollment', label: 'Enrollment', href: '/admin/reports/enrollment', iconName: 'Users' },
        { id: 'reports-fees', label: 'Fee Collection', href: '/admin/reports/fee-collection', iconName: 'DollarSign' },
        { id: 'reports-aging', label: 'Aging Report', href: '/admin/reports/aging', iconName: 'Clock' },
        { id: 'reports-attendance', label: 'Attendance', href: '/admin/reports/attendance', iconName: 'Calendar' },
        { id: 'reports-capacity', label: 'Capacity', href: '/admin/reports/capacity', iconName: 'Building2' },
        { id: 'reports-subsidy', label: 'Subsidy', href: '/admin/reports/subsidy', iconName: 'DollarSign' },
      ],
    },
  ],
  preschool: [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', iconName: 'Home' },
    {
      id: 'students', label: 'Children', href: '/admin/students', iconName: 'Baby',
      children: [
        { id: 'students-all', label: 'All Children', href: '/admin/students', iconName: 'Users' },
        { id: 'students-add', label: 'Enrol Child', href: '/admin/students/add', iconName: 'UserPlus' },
        { id: 'students-applications', label: 'Applications', href: '/admin/students/applications', iconName: 'ClipboardList' },
        { id: 'students-transfers', label: 'Transfers', href: '/admin/students/transfers', iconName: 'ArrowRightLeft' },
        { id: 'students-alumni', label: 'Alumni', href: '/admin/students/alumni', iconName: 'GraduationCap' },
      ],
    },
    {
      id: 'institutes', label: 'Centres', href: '/admin/institutes', iconName: 'Building2',
      children: [
        { id: 'institutes-all', label: 'All Centres', href: '/admin/institutes', iconName: 'Building2' },
        { id: 'institutes-add', label: 'Add Centre', href: '/admin/institutes/add', iconName: 'UserPlus' },
      ],
    },
    { id: 'attendance', label: 'Attendance', href: '/admin/attendance', iconName: 'CalendarCheck' },
    { id: 'schedule', label: 'Session Schedule', href: '/admin/schedule', iconName: 'Clock' },
    { id: 'subjects', label: 'Activities', href: '/admin/subjects', iconName: 'Palette' },
    { id: 'scoring', label: 'Development Band', href: '/admin/scoring', iconName: 'Star' },
    {
      id: 'fees', label: 'Fees', href: '/admin/fees', iconName: 'DollarSign',
      children: [
        { id: 'fees-monitor', label: 'Fee Monitoring', href: '/admin/fees', iconName: 'DollarSign' },
        { id: 'fees-setup', label: 'Fee Setup', href: '/admin/fee-setup', iconName: 'Settings' },
      ],
    },
    {
      id: 'reports', label: 'Reports', href: '/admin/reports', iconName: 'FileBarChart',
      children: [
        { id: 'reports-hub', label: 'Reports Hub', href: '/admin/reports', iconName: 'LayoutDashboard' },
        { id: 'reports-enrollment', label: 'Enrollment', href: '/admin/reports/enrollment', iconName: 'Users' },
        { id: 'reports-fees', label: 'Fee Collection', href: '/admin/reports/fee-collection', iconName: 'DollarSign' },
        { id: 'reports-aging', label: 'Aging Report', href: '/admin/reports/aging', iconName: 'Clock' },
        { id: 'reports-attendance', label: 'Attendance', href: '/admin/reports/attendance', iconName: 'Calendar' },
        { id: 'reports-capacity', label: 'Capacity', href: '/admin/reports/capacity', iconName: 'Building2' },
        { id: 'reports-subsidy', label: 'Subsidy', href: '/admin/reports/subsidy', iconName: 'DollarSign' },
      ],
    },
  ],
  primary: [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', iconName: 'Home' },
    {
      id: 'students', label: 'Students', href: '/admin/students', iconName: 'GraduationCap',
      children: [
        { id: 'students-all', label: 'All Students', href: '/admin/students', iconName: 'Users' },
        { id: 'students-add', label: 'Add New', href: '/admin/students/add', iconName: 'UserPlus' },
        { id: 'students-cat', label: 'Categories', href: '/admin/students/categories', iconName: 'Folder' },
        { id: 'students-applications', label: 'Applications', href: '/admin/students/applications', iconName: 'ClipboardList' },
        { id: 'students-transfers', label: 'Transfers', href: '/admin/students/transfers', iconName: 'ArrowRightLeft' },
        { id: 'students-alumni', label: 'Alumni', href: '/admin/students/alumni', iconName: 'GraduationCap' },
      ],
    },
    {
      id: 'institutes', label: 'Schools', href: '/admin/institutes', iconName: 'Building2',
      children: [
        { id: 'institutes-all', label: 'All Schools', href: '/admin/institutes', iconName: 'Building2' },
        { id: 'institutes-add', label: 'Add New', href: '/admin/institutes/add', iconName: 'UserPlus' },
        { id: 'institutes-cat', label: 'Categories', href: '/admin/institutes/categories', iconName: 'Folder' },
      ],
    },
    { id: 'attendance', label: 'Attendance', href: '/admin/attendance', iconName: 'Calendar' },
    { id: 'schedule', label: 'Period Timetable', href: '/admin/schedule', iconName: 'CalendarDays' },
    { id: 'subjects', label: 'Subjects (KSSR)', href: '/admin/subjects', iconName: 'BookOpen' },
    { id: 'scoring', label: 'Grades & Results', href: '/admin/scoring', iconName: 'BarChart2' },
    {
      id: 'fees', label: 'Fees', href: '/admin/fees', iconName: 'DollarSign',
      children: [
        { id: 'fees-monitor', label: 'Fee Monitoring', href: '/admin/fees', iconName: 'DollarSign' },
        { id: 'fees-setup', label: 'Fee Setup', href: '/admin/fee-setup', iconName: 'Settings' },
      ],
    },
    {
      id: 'reports', label: 'Reports', href: '/admin/reports', iconName: 'FileBarChart',
      children: [
        { id: 'reports-hub', label: 'Reports Hub', href: '/admin/reports', iconName: 'LayoutDashboard' },
        { id: 'reports-enrollment', label: 'Enrollment', href: '/admin/reports/enrollment', iconName: 'Users' },
        { id: 'reports-fees', label: 'Fee Collection', href: '/admin/reports/fee-collection', iconName: 'DollarSign' },
        { id: 'reports-aging', label: 'Aging Report', href: '/admin/reports/aging', iconName: 'Clock' },
        { id: 'reports-attendance', label: 'Attendance', href: '/admin/reports/attendance', iconName: 'Calendar' },
        { id: 'reports-capacity', label: 'Capacity', href: '/admin/reports/capacity', iconName: 'Building2' },
        { id: 'reports-subsidy', label: 'Subsidy', href: '/admin/reports/subsidy', iconName: 'DollarSign' },
      ],
    },
  ],
  secondary: [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', iconName: 'Home' },
    {
      id: 'students', label: 'Students', href: '/admin/students', iconName: 'GraduationCap',
      children: [
        { id: 'students-all', label: 'All Students', href: '/admin/students', iconName: 'Users' },
        { id: 'students-add', label: 'Add New', href: '/admin/students/add', iconName: 'UserPlus' },
        { id: 'students-cat', label: 'Categories', href: '/admin/students/categories', iconName: 'Folder' },
        { id: 'students-applications', label: 'Applications', href: '/admin/students/applications', iconName: 'ClipboardList' },
        { id: 'students-transfers', label: 'Transfers', href: '/admin/students/transfers', iconName: 'ArrowRightLeft' },
        { id: 'students-alumni', label: 'Alumni', href: '/admin/students/alumni', iconName: 'GraduationCap' },
      ],
    },
    {
      id: 'institutes', label: 'Schools', href: '/admin/institutes', iconName: 'Building2',
      children: [
        { id: 'institutes-all', label: 'All Schools', href: '/admin/institutes', iconName: 'Building2' },
        { id: 'institutes-add', label: 'Add New', href: '/admin/institutes/add', iconName: 'UserPlus' },
        { id: 'institutes-cat', label: 'Categories', href: '/admin/institutes/categories', iconName: 'Folder' },
      ],
    },
    { id: 'attendance', label: 'Attendance', href: '/admin/attendance', iconName: 'Calendar' },
    { id: 'schedule', label: 'Period Timetable', href: '/admin/schedule', iconName: 'CalendarDays' },
    { id: 'subjects', label: 'Subjects (SPM)', href: '/admin/subjects', iconName: 'BookOpen' },
    { id: 'scoring', label: 'GPA & Grades', href: '/admin/scoring', iconName: 'TrendingUp' },
    {
      id: 'fees', label: 'Fees', href: '/admin/fees', iconName: 'DollarSign',
      children: [
        { id: 'fees-monitor', label: 'Fee Monitoring', href: '/admin/fees', iconName: 'DollarSign' },
        { id: 'fees-setup', label: 'Fee Setup', href: '/admin/fee-setup', iconName: 'Settings' },
      ],
    },
    {
      id: 'reports', label: 'Reports', href: '/admin/reports', iconName: 'FileBarChart',
      children: [
        { id: 'reports-hub', label: 'Reports Hub', href: '/admin/reports', iconName: 'LayoutDashboard' },
        { id: 'reports-enrollment', label: 'Enrollment', href: '/admin/reports/enrollment', iconName: 'Users' },
        { id: 'reports-fees', label: 'Fee Collection', href: '/admin/reports/fee-collection', iconName: 'DollarSign' },
        { id: 'reports-aging', label: 'Aging Report', href: '/admin/reports/aging', iconName: 'Clock' },
        { id: 'reports-attendance', label: 'Attendance', href: '/admin/reports/attendance', iconName: 'Calendar' },
        { id: 'reports-capacity', label: 'Capacity', href: '/admin/reports/capacity', iconName: 'Building2' },
        { id: 'reports-subsidy', label: 'Subsidy', href: '/admin/reports/subsidy', iconName: 'DollarSign' },
      ],
    },
  ],
  university: [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', iconName: 'Home' },
    {
      id: 'students', label: 'Students', href: '/admin/students', iconName: 'Users',
      children: [
        { id: 'students-all', label: 'All Students', href: '/admin/students', iconName: 'Users' },
        { id: 'students-add', label: 'Register', href: '/admin/students/add', iconName: 'UserPlus' },
        { id: 'students-applications', label: 'Applications', href: '/admin/students/applications', iconName: 'ClipboardList' },
        { id: 'students-transfers', label: 'Transfers', href: '/admin/students/transfers', iconName: 'ArrowRightLeft' },
        { id: 'students-alumni', label: 'Alumni', href: '/admin/students/alumni', iconName: 'GraduationCap' },
      ],
    },
    {
      id: 'institutes', label: 'Faculties', href: '/admin/institutes', iconName: 'Building2',
      children: [
        { id: 'institutes-all', label: 'All Faculties', href: '/admin/institutes', iconName: 'Building2' },
        { id: 'institutes-add', label: 'Add Faculty', href: '/admin/institutes/add', iconName: 'UserPlus' },
      ],
    },
    { id: 'attendance', label: 'Attendance', href: '/admin/attendance', iconName: 'Calendar' },
    { id: 'schedule', label: 'Semester Timetable', href: '/admin/schedule', iconName: 'CalendarDays' },
    { id: 'subjects', label: 'Modules / Courses', href: '/admin/subjects', iconName: 'BookOpen' },
    { id: 'scoring', label: 'CGPA & Transcripts', href: '/admin/scoring', iconName: 'Award' },
    {
      id: 'fees', label: 'Fees', href: '/admin/fees', iconName: 'DollarSign',
      children: [
        { id: 'fees-monitor', label: 'Fee Monitoring', href: '/admin/fees', iconName: 'DollarSign' },
        { id: 'fees-setup', label: 'Semester Fee Setup', href: '/admin/fee-setup', iconName: 'Settings' },
      ],
    },
    {
      id: 'reports', label: 'Reports', href: '/admin/reports', iconName: 'FileBarChart',
      children: [
        { id: 'reports-hub', label: 'Reports Hub', href: '/admin/reports', iconName: 'LayoutDashboard' },
        { id: 'reports-enrollment', label: 'Enrollment', href: '/admin/reports/enrollment', iconName: 'Users' },
        { id: 'reports-fees', label: 'Fee Collection', href: '/admin/reports/fee-collection', iconName: 'DollarSign' },
        { id: 'reports-aging', label: 'Aging Report', href: '/admin/reports/aging', iconName: 'Clock' },
        { id: 'reports-attendance', label: 'Attendance', href: '/admin/reports/attendance', iconName: 'Calendar' },
        { id: 'reports-capacity', label: 'Capacity', href: '/admin/reports/capacity', iconName: 'Building2' },
        { id: 'reports-subsidy', label: 'Subsidy', href: '/admin/reports/subsidy', iconName: 'DollarSign' },
      ],
    },
  ],
};

// ============================================================
// DASHBOARD CONFIG
// ============================================================

export interface DashboardConfig {
  institutionLabel: string;
  studentLabel: string;
  feeLabel: string;
  scheduleLabel: string;
  scoringLabel: string;
  adminTitle: string;
  aiInsights: [string, string, string];
}

export const LEVEL_DASHBOARD: Record<EducationLevel, DashboardConfig> = {
  maiwp: {
    institutionLabel: 'Institutions',
    studentLabel: 'Students',
    feeLabel: 'Total Collection',
    scheduleLabel: 'System Coverage',
    scoringLabel: 'Cross-Level Overview',
    adminTitle: 'MAIWP System Administration Overview',
    aiInsights: [
      'University enrolment grew 8% this semester — highest growth across all levels. Pre-school capacity is at 94%.',
      'System-wide fee collection rate is 86.9%. Secondary schools have the highest outstanding balance at RM18,200.',
      'Overall attendance at 91.4%. University level requires attention at 87.4% — below the 90% benchmark.',
    ],
  },
  preschool: {
    institutionLabel: 'Centres',
    studentLabel: 'Children',
    feeLabel: 'Monthly Collection',
    scheduleLabel: 'Session Coverage',
    scoringLabel: 'Development Bands',
    adminTitle: 'Centre Administration Overview',
    aiInsights: [
      'Morning session attendance is 5% higher than afternoon. Consider shifting popular activities to morning slots.',
      'Literacy band scores improved by 12% this term. Social-Emotional development still requires targeted support.',
      'B40 subsidy utilization at 89%. 3 families may qualify for Asnaf full-subsidy upgrade.',
    ],
  },
  primary: {
    institutionLabel: 'Schools',
    studentLabel: 'Students',
    feeLabel: 'Monthly Collection',
    scheduleLabel: 'Timetable Coverage',
    scoringLabel: 'Grade Distribution',
    adminTitle: 'School Administration Overview',
    aiInsights: [
      'Mathematics average improved from C+ to B across all Year 4 classes this term.',
      'Outstanding fees decreased by 18% from last month. Continue monitoring Year 6 cohort.',
      'Attendance highest on Monday (96%) and lowest on Friday (88%). Investigate Friday patterns.',
    ],
  },
  secondary: {
    institutionLabel: 'Schools',
    studentLabel: 'Students',
    feeLabel: 'Monthly Collection',
    scheduleLabel: 'Timetable Coverage',
    scoringLabel: 'GPA Distribution',
    adminTitle: 'School Administration Overview',
    aiInsights: [
      'Form 5 GPA average is 3.12 — on track for strong SPM results. Focus support on C-range students.',
      'Additional Mathematics elective has highest failure rate (23%). Extra tutoring sessions recommended.',
      'Fee collection rate improved to 91% this month. 8 students still have overdue invoices.',
    ],
  },
  university: {
    institutionLabel: 'Faculties',
    studentLabel: 'Students',
    feeLabel: 'Semester Revenue',
    scheduleLabel: 'Lecture Hours',
    scoringLabel: 'CGPA Distribution',
    adminTitle: 'Faculty Administration Overview',
    aiInsights: [
      'Semester 2 CGPA median is 3.24. 15% of students are on academic probation (CGPA < 2.00).',
      'Credit hour enrollment is 94% of capacity. Lab slots for QUR301 are oversubscribed.',
      'Semester fee collection at 78%. Scholarship disbursement delay affecting 22 students.',
    ],
  },
};
