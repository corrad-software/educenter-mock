import type { EducationLevel, StaffStatus, StaffRole } from '../types';

export interface MAIWPStaff {
  id: string;
  employeeCode: string;
  name: string;
  ic: string;
  email: string;
  phone: string;
  role: StaffRole;
  qualification: string;
  centreId: string;
  centreName: string;
  centreCode: string;
  educationLevel: EducationLevel;
  status: StaffStatus;
  joinDate: string;
  monthlySalary: number;
  hasChildEnrolled: boolean;
  subjectsTaught?: string[];
}

export const malaysianStaff: MAIWPStaff[] = [

  // ════════════════════════════════════════════════════════
  // PRESCHOOL — Tadika MAIWP centres
  // ════════════════════════════════════════════════════════

  {
    id: 'stf-ps-001', employeeCode: 'EMP-TI001-001',
    name: 'Pn. Norliza binti Ahmad', ic: '850412-14-5234',
    email: 'norliza@maiwp.gov.my', phone: '+60123001001',
    role: 'caregiver', qualification: 'Diploma Pendidikan Awal Kanak-Kanak',
    centreId: 'ti-001', centreName: 'Tadika Islam MAIWP Taman Tun Dr. Ismail', centreCode: 'TI-MAIWP-001',
    educationLevel: 'preschool', status: 'active', joinDate: '2019-01-15', monthlySalary: 2800,
    hasChildEnrolled: true, subjectsTaught: ['Literacy', 'Numeracy'],
  },
  {
    id: 'stf-ps-002', employeeCode: 'EMP-TI001-002',
    name: 'Pn. Hasimah binti Salleh', ic: '880725-14-6128',
    email: 'hasimah@maiwp.gov.my', phone: '+60123001002',
    role: 'caregiver', qualification: 'Sijil Kemahiran Malaysia (SKM) Pengasuhan',
    centreId: 'ti-001', centreName: 'Tadika Islam MAIWP Taman Tun Dr. Ismail', centreCode: 'TI-MAIWP-001',
    educationLevel: 'preschool', status: 'active', joinDate: '2020-07-01', monthlySalary: 2500,
    hasChildEnrolled: false, subjectsTaught: ['Islamic Education', 'Social-Emotional'],
  },
  {
    id: 'stf-ps-003', employeeCode: 'EMP-TI002-001',
    name: 'Pn. Sarina binti Mohd Yusof', ic: '900318-14-7342',
    email: 'sarina@maiwp.gov.my', phone: '+60123001003',
    role: 'caregiver', qualification: 'Diploma Pendidikan Awal Kanak-Kanak',
    centreId: 'ti-002', centreName: 'Tadika Islam MAIWP Cheras', centreCode: 'TI-MAIWP-002',
    educationLevel: 'preschool', status: 'active', joinDate: '2018-03-10', monthlySalary: 2800,
    hasChildEnrolled: true, subjectsTaught: ['Literacy', 'Arts & Craft'],
  },
  {
    id: 'stf-ps-004', employeeCode: 'EMP-TI002-002',
    name: 'Pn. Rohana binti Kadir', ic: '870614-14-4567',
    email: 'rohana@maiwp.gov.my', phone: '+60123001004',
    role: 'caregiver', qualification: 'Sijil Kemahiran Malaysia (SKM) Pengasuhan',
    centreId: 'ti-002', centreName: 'Tadika Islam MAIWP Cheras', centreCode: 'TI-MAIWP-002',
    educationLevel: 'preschool', status: 'on_leave', joinDate: '2021-01-05', monthlySalary: 2500,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-ps-005', employeeCode: 'EMP-TI003-001',
    name: 'Pn. Faridah binti Osman', ic: '830922-14-3891',
    email: 'faridah.o@maiwp.gov.my', phone: '+60123001005',
    role: 'caregiver', qualification: 'Diploma Pendidikan Islam',
    centreId: 'ti-003', centreName: 'Tadika Islam MAIWP Wangsa Maju', centreCode: 'TI-MAIWP-003',
    educationLevel: 'preschool', status: 'active', joinDate: '2017-08-20', monthlySalary: 3000,
    hasChildEnrolled: false, subjectsTaught: ['Islamic Education', 'Physical Education'],
  },
  {
    id: 'stf-ps-006', employeeCode: 'EMP-TI001-003',
    name: 'Cik Aina binti Razali', ic: '960115-14-8901',
    email: 'aina@maiwp.gov.my', phone: '+60123001006',
    role: 'assistant', qualification: 'SPM',
    centreId: 'ti-001', centreName: 'Tadika Islam MAIWP Taman Tun Dr. Ismail', centreCode: 'TI-MAIWP-001',
    educationLevel: 'preschool', status: 'active', joinDate: '2023-02-01', monthlySalary: 1800,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-ps-007', employeeCode: 'EMP-TI002-003',
    name: 'Cik Nurul Ain binti Latif', ic: '970820-14-2345',
    email: 'nurulain@maiwp.gov.my', phone: '+60123001007',
    role: 'assistant', qualification: 'Diploma Pengurusan',
    centreId: 'ti-002', centreName: 'Tadika Islam MAIWP Cheras', centreCode: 'TI-MAIWP-002',
    educationLevel: 'preschool', status: 'active', joinDate: '2022-06-15', monthlySalary: 1900,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-ps-008', employeeCode: 'EMP-TI006-001',
    name: 'Pn. Zainab binti Ibrahim', ic: '820504-14-6789',
    email: 'zainab@maiwp.gov.my', phone: '+60123001008',
    role: 'admin_staff', qualification: 'Diploma Pentadbiran Perniagaan',
    centreId: 'ti-006', centreName: 'Tadika Islam MAIWP Bangsar', centreCode: 'TI-MAIWP-006',
    educationLevel: 'preschool', status: 'active', joinDate: '2020-01-10', monthlySalary: 2400,
    hasChildEnrolled: true,
  },

  // ════════════════════════════════════════════════════════
  // PRIMARY — SABK & SRAI schools
  // ════════════════════════════════════════════════════════

  {
    id: 'stf-pri-001', employeeCode: 'EMP-SABK001-001',
    name: 'Ust. Mohd Hafiz bin Kamarudin', ic: '800315-14-1234',
    email: 'hafiz@sabk-wp.edu.my', phone: '+60123002001',
    role: 'teacher', qualification: 'Sarjana Muda Pendidikan Islam (UPSI)',
    centreId: 'sabk-001', centreName: 'SABK Darul Ulum', centreCode: 'SABK-WP-001',
    educationLevel: 'primary', status: 'active', joinDate: '2015-01-10', monthlySalary: 4200,
    hasChildEnrolled: true, subjectsTaught: ['Pendidikan Islam', 'Bahasa Melayu'],
  },
  {
    id: 'stf-pri-002', employeeCode: 'EMP-SABK001-002',
    name: 'Ustzh. Nurul Huda binti Ismail', ic: '850720-14-5678',
    email: 'nurulhuda@sabk-wp.edu.my', phone: '+60123002002',
    role: 'teacher', qualification: 'Sarjana Muda Sains (Matematik) (UKM)',
    centreId: 'sabk-001', centreName: 'SABK Darul Ulum', centreCode: 'SABK-WP-001',
    educationLevel: 'primary', status: 'active', joinDate: '2017-07-01', monthlySalary: 3800,
    hasChildEnrolled: false, subjectsTaught: ['Mathematics', 'Science'],
  },
  {
    id: 'stf-pri-003', employeeCode: 'EMP-SABK002-001',
    name: 'Ust. Ahmad Rizal bin Nordin', ic: '780912-14-9012',
    email: 'rizal@sabk-wp.edu.my', phone: '+60123002003',
    role: 'teacher', qualification: 'Sarjana Pendidikan (UM)',
    centreId: 'sabk-002', centreName: 'SABK Al-Amin', centreCode: 'SABK-WP-002',
    educationLevel: 'primary', status: 'active', joinDate: '2012-01-05', monthlySalary: 4800,
    hasChildEnrolled: true, subjectsTaught: ['English Language', 'Sejarah'],
  },
  {
    id: 'stf-pri-004', employeeCode: 'EMP-SABK003-001',
    name: 'Ustzh. Wan Salma binti Wan Ali', ic: '860225-14-3456',
    email: 'wansalma@sabk-wp.edu.my', phone: '+60123002004',
    role: 'teacher', qualification: 'Sarjana Muda Pendidikan (KUIS)',
    centreId: 'sabk-003', centreName: 'SABK Nurul Hidayah', centreCode: 'SABK-WP-003',
    educationLevel: 'primary', status: 'active', joinDate: '2019-07-15', monthlySalary: 3600,
    hasChildEnrolled: false, subjectsTaught: ['Bahasa Melayu', 'Pendidikan Islam'],
  },
  {
    id: 'stf-pri-005', employeeCode: 'EMP-SABK001-003',
    name: 'En. Khairul Nizam bin Ramli', ic: '930410-14-7890',
    email: 'khairul@sabk-wp.edu.my', phone: '+60123002005',
    role: 'assistant', qualification: 'Diploma Pendidikan',
    centreId: 'sabk-001', centreName: 'SABK Darul Ulum', centreCode: 'SABK-WP-001',
    educationLevel: 'primary', status: 'active', joinDate: '2022-01-10', monthlySalary: 2200,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-pri-006', employeeCode: 'EMP-SRAI001-001',
    name: 'Cik Mariam binti Zakaria', ic: '950818-14-2345',
    email: 'mariam@srai-wp.edu.my', phone: '+60123002006',
    role: 'assistant', qualification: 'Diploma Pengurusan Pejabat',
    centreId: 'srai-001', centreName: 'SRAI Al-Falah', centreCode: 'SRAI-WP-001',
    educationLevel: 'primary', status: 'contract', joinDate: '2023-06-01', monthlySalary: 2000,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-pri-007', employeeCode: 'EMP-SABK002-002',
    name: 'Pn. Roslina binti Hassan', ic: '810630-14-6789',
    email: 'roslina@sabk-wp.edu.my', phone: '+60123002007',
    role: 'admin_staff', qualification: 'Diploma Pentadbiran Awam',
    centreId: 'sabk-002', centreName: 'SABK Al-Amin', centreCode: 'SABK-WP-002',
    educationLevel: 'primary', status: 'active', joinDate: '2016-03-20', monthlySalary: 2800,
    hasChildEnrolled: true,
  },

  // ════════════════════════════════════════════════════════
  // SECONDARY — SMA & SMISTA
  // ════════════════════════════════════════════════════════

  {
    id: 'stf-sec-001', employeeCode: 'EMP-SMAKL-001',
    name: 'Ust. Zainal Abidin bin Mokhtar', ic: '770520-14-1122',
    email: 'zainal@sma-maiwp.edu.my', phone: '+60123003001',
    role: 'teacher', qualification: 'Sarjana Pendidikan Islam (IIUM)',
    centreId: 'sma-kl', centreName: 'SMA MAIWP Kuala Lumpur', centreCode: 'SMA-MAIWP-KL',
    educationLevel: 'secondary', status: 'active', joinDate: '2010-01-05', monthlySalary: 5200,
    hasChildEnrolled: true, subjectsTaught: ['Pendidikan Islam', 'Sejarah'],
  },
  {
    id: 'stf-sec-002', employeeCode: 'EMP-SMAKL-002',
    name: 'Pn. Azizah binti Abdul Rahman', ic: '830215-14-3344',
    email: 'azizah@sma-maiwp.edu.my', phone: '+60123003002',
    role: 'teacher', qualification: 'Sarjana Muda Sains (Fizik) (UTM)',
    centreId: 'sma-kl', centreName: 'SMA MAIWP Kuala Lumpur', centreCode: 'SMA-MAIWP-KL',
    educationLevel: 'secondary', status: 'active', joinDate: '2014-07-01', monthlySalary: 4600,
    hasChildEnrolled: false, subjectsTaught: ['Physics', 'Additional Mathematics'],
  },
  {
    id: 'stf-sec-003', employeeCode: 'EMP-SMISTA-001',
    name: 'Ust. Iskandar bin Yusuf', ic: '790810-14-5566',
    email: 'iskandar@smista.edu.my', phone: '+60123003003',
    role: 'teacher', qualification: 'Sarjana Pengajian Quran (USIM)',
    centreId: 'smista', centreName: 'SMISTA', centreCode: 'SMISTA-MAIWP',
    educationLevel: 'secondary', status: 'active', joinDate: '2013-01-10', monthlySalary: 4800,
    hasChildEnrolled: false, subjectsTaught: ['Quran Studies', 'Arabic Language'],
  },
  {
    id: 'stf-sec-004', employeeCode: 'EMP-SMAKL-003',
    name: 'En. Firdaus bin Hamzah', ic: '940305-14-7788',
    email: 'firdaus@sma-maiwp.edu.my', phone: '+60123003004',
    role: 'assistant', qualification: 'Diploma Pendidikan',
    centreId: 'sma-kl', centreName: 'SMA MAIWP Kuala Lumpur', centreCode: 'SMA-MAIWP-KL',
    educationLevel: 'secondary', status: 'active', joinDate: '2021-07-15', monthlySalary: 2400,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-sec-005', employeeCode: 'EMP-SMALBN-001',
    name: 'Pn. Haslinda binti Taib', ic: '840118-14-9900',
    email: 'haslinda@sma-maiwp.edu.my', phone: '+60123003005',
    role: 'admin_staff', qualification: 'Diploma Pentadbiran Perniagaan',
    centreId: 'sma-lbn', centreName: 'SMA MAIWP Labuan', centreCode: 'SMA-MAIWP-LBN',
    educationLevel: 'secondary', status: 'active', joinDate: '2018-01-05', monthlySalary: 2600,
    hasChildEnrolled: false,
  },

  // ════════════════════════════════════════════════════════
  // UNIVERSITY — KPMAIWP & IKB
  // ════════════════════════════════════════════════════════

  {
    id: 'stf-uni-001', employeeCode: 'EMP-KPMAIWP-001',
    name: 'Dr. Ahmad Fadhil bin Zainal', ic: '750620-14-1234',
    email: 'fadhil@kpmaiwp.edu.my', phone: '+60123004001',
    role: 'lecturer', qualification: 'PhD Islamic Finance (Edinburgh)',
    centreId: 'kpmaiwp', centreName: 'Kolej Profesional MAIWP', centreCode: 'KPMAIWP',
    educationLevel: 'university', status: 'active', joinDate: '2008-09-01', monthlySalary: 7500,
    hasChildEnrolled: false, subjectsTaught: ['Islamic Finance', 'Business Management'],
  },
  {
    id: 'stf-uni-002', employeeCode: 'EMP-KPMAIWP-002',
    name: 'Pn. Siti Rohana binti Hashim', ic: '810430-14-5678',
    email: 'rohana.h@kpmaiwp.edu.my', phone: '+60123004002',
    role: 'lecturer', qualification: 'Sarjana Pengajian Islam (UM)',
    centreId: 'kpmaiwp', centreName: 'Kolej Profesional MAIWP', centreCode: 'KPMAIWP',
    educationLevel: 'university', status: 'active', joinDate: '2015-01-10', monthlySalary: 5800,
    hasChildEnrolled: true, subjectsTaught: ['Arabic Language', 'Islamic Studies'],
  },
  {
    id: 'stf-uni-003', employeeCode: 'EMP-IKB-001',
    name: 'En. Shahrul Nizam bin Azmi', ic: '780915-14-9012',
    email: 'shahrul@ikb-maiwp.edu.my', phone: '+60123004003',
    role: 'lecturer', qualification: 'Sarjana Kejuruteraan Mekanikal (UiTM)',
    centreId: 'ikb', centreName: 'Institut Kemahiran Baitulmal', centreCode: 'IKB-MAIWP',
    educationLevel: 'university', status: 'active', joinDate: '2016-07-01', monthlySalary: 5500,
    hasChildEnrolled: false, subjectsTaught: ['Computer Applications', 'Statistics'],
  },
  {
    id: 'stf-uni-004', employeeCode: 'EMP-KPMAIWP-003',
    name: 'Cik Adibah binti Sulaiman', ic: '950222-14-3456',
    email: 'adibah@kpmaiwp.edu.my', phone: '+60123004004',
    role: 'assistant', qualification: 'Sarjana Muda Pengurusan (UiTM)',
    centreId: 'kpmaiwp', centreName: 'Kolej Profesional MAIWP', centreCode: 'KPMAIWP',
    educationLevel: 'university', status: 'active', joinDate: '2022-09-01', monthlySalary: 2800,
    hasChildEnrolled: false,
  },
  {
    id: 'stf-uni-005', employeeCode: 'EMP-IKB-002',
    name: 'En. Razif bin Othman', ic: '880710-14-7890',
    email: 'razif@ikb-maiwp.edu.my', phone: '+60123004005',
    role: 'admin_staff', qualification: 'Diploma Teknologi Maklumat',
    centreId: 'ikb', centreName: 'Institut Kemahiran Baitulmal', centreCode: 'IKB-MAIWP',
    educationLevel: 'university', status: 'active', joinDate: '2019-01-15', monthlySalary: 2600,
    hasChildEnrolled: false,
  },
];
