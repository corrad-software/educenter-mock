import type { Student, EducationLevel } from '../types';

export interface MAIWPStudent extends Student {
  educationLevel: EducationLevel;
}

// ─── Reusable centre head helpers ──────────────────────────────────────────
const head = (id: string, name: string, email: string) => ({
  id,
  name,
  email,
  ic: '750101-14-0001',
  role: 'centre_head' as const,
  createdAt: new Date('2020-01-01'),
});

const centre = (id: string, name: string, code: string, address: string, capacity: number, headObj: ReturnType<typeof head>) => ({
  id,
  name,
  code,
  address,
  capacity,
  headId: headObj.id,
  head: headObj,
});

const guardian = (id: string, name: string, email: string, ic: string, phone: string) => ({
  id,
  name,
  email,
  ic,
  role: 'parent' as const,
  phoneNumber: phone,
  createdAt: new Date('2023-01-01'),
});

// ─── Centre definitions ────────────────────────────────────────────────────
const CENTRES = {
  // Preschool
  'ti-001': centre('ti-001', 'Tadika Islam MAIWP Taman Tun Dr. Ismail', 'TI-MAIWP-001', 'No. 5 Jalan Datuk Sulaiman, TTDI, KL', 40, head('h-ti-001', 'Pn. Norazura binti Kassim', 'norazura@maiwp.gov.my')),
  'ti-002': centre('ti-002', 'Tadika Islam MAIWP Cheras', 'TI-MAIWP-002', 'No. 12 Jalan Pandan Mewah, Cheras, KL', 50, head('h-ti-002', 'Pn. Rozita binti Hamid', 'rozita@maiwp.gov.my')),
  'ti-003': centre('ti-003', 'Tadika Islam MAIWP Wangsa Maju', 'TI-MAIWP-003', 'No. 7 Jalan 2/27A, Wangsa Maju, KL', 45, head('h-ti-003', 'Pn. Hasanah binti Yusof', 'hasanah@maiwp.gov.my')),
  'ti-006': centre('ti-006', 'Tadika Islam MAIWP Bangsar', 'TI-MAIWP-006', 'Jalan Telawi 3, Bangsar, KL', 40, head('h-ti-006', 'Pn. Suraya binti Mohd', 'suraya@maiwp.gov.my')),
  // Primary
  'sabk-001': centre('sabk-001', 'SABK Darul Ulum', 'SABK-WP-001', 'Jalan Raja Laut, Brickfields, KL', 200, head('h-sabk-001', 'Ust. Mohd Nor bin Khalid', 'mohdnor@maiwp.gov.my')),
  'sabk-002': centre('sabk-002', 'SABK Al-Amin', 'SABK-WP-002', 'Jalan Masjid India, Chow Kit, KL', 220, head('h-sabk-002', 'Ust. Zulkifli bin Ahmad', 'zulkifli@maiwp.gov.my')),
  'sabk-003': centre('sabk-003', 'SABK Nurul Hidayah', 'SABK-WP-003', 'Jalan Cheras Batu 4½, Cheras, KL', 180, head('h-sabk-003', 'Ust. Faridah binti Hassan', 'faridah@maiwp.gov.my')),
  'srai-001': centre('srai-001', 'SRAI Al-Falah', 'SRAI-WP-001', 'Jalan Sentul Pasar, Sentul, KL', 150, head('h-srai-001', 'Ust. Azlan bin Othman', 'azlan@maiwp.gov.my')),
  // Secondary
  'sma-kl':   centre('sma-kl',   'SMA MAIWP Kuala Lumpur', 'SMA-MAIWP-KL',  'No. 2 Jalan Sri Permaisuri, Cheras, KL', 300, head('h-sma-kl',   'Ust. Siti Aishah binti Mahmud', 'aishah@maiwp.gov.my')),
  'sma-lbn':  centre('sma-lbn',  'SMA MAIWP Labuan',       'SMA-MAIWP-LBN', 'Jalan Bunga Tanjung, Bandar Labuan', 200, head('h-sma-lbn',  'Ust. Khairul Anwar bin Daud', 'khairul@maiwp.gov.my')),
  'smista':   centre('smista',   'SMISTA',                  'SMISTA-MAIWP',  'Jalan Budiman, Cheras, KL', 250, head('h-smista',   'Ust. Hafizuddin bin Ramli', 'hafizuddin@maiwp.gov.my')),
  // University
  'kpmaiwp':  centre('kpmaiwp',  'Kolej Profesional MAIWP', 'KPMAIWP',       'Lot 1363 Jalan Perkasa Maluri, KL', 600, head('h-kpmaiwp',  'Dr. Mohd Aizuddin bin Aziz', 'aizuddin@kpmaiwp.edu.my')),
  'ikb':      centre('ikb',      'Institut Kemahiran Baitulmal', 'IKB-MAIWP', 'Lot 1363, Jalan Perkasa, Taman Maluri, KL', 300, head('h-ikb', 'En. Rashdan bin Muiz', 'rashdan@ikb-maiwp.edu.my')),
};

// ─── Student data ──────────────────────────────────────────────────────────
export const malaysianStudents: MAIWPStudent[] = [

  // ════════════════════════════════════════════════════════
  // PRESCHOOL — ages 5–6, born 2018–2019
  // ════════════════════════════════════════════════════════
  {
    id: 'ps-001', studentCode: 'TI-2024-001', name: 'Muhammad Dani bin Azlan', ic: '190315-14-0011',
    dateOfBirth: new Date('2019-03-15'), guardianId: 'g-ps-001',
    guardian: guardian('g-ps-001', 'Azlan bin Othman', 'azlan.othman@gmail.com', '810315-14-0021', '+60123456781'),
    centreId: 'ti-001', centre: CENTRES['ti-001'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-08'), monthlyFee: 150, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-002', studentCode: 'TI-2024-002', name: 'Nur Aisyah binti Ruzaini', ic: '180620-14-0022',
    dateOfBirth: new Date('2018-06-20'), guardianId: 'g-ps-002',
    guardian: guardian('g-ps-002', 'Ruzaini bin Mamat', 'ruzaini@yahoo.com', '830620-14-0042', '+60123456782'),
    centreId: 'ti-001', centre: CENTRES['ti-001'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-10'), monthlyFee: 200, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-003', studentCode: 'TI-2024-003', name: 'Hana Sofea binti Khairul', ic: '190910-14-0044',
    dateOfBirth: new Date('2019-09-10'), guardianId: 'g-ps-003',
    guardian: guardian('g-ps-003', 'Khairul Nizam bin Abdullah', 'khairulnizam@gmail.com', '850910-14-0084', '+60123456783'),
    centreId: 'ti-002', centre: CENTRES['ti-002'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-01-12'), monthlyFee: 80, depositAmount: 50, educationLevel: 'preschool',
  },
  {
    id: 'ps-004', studentCode: 'TI-2024-004', name: 'Izzat Hakim bin Fadzli', ic: '180201-14-0033',
    dateOfBirth: new Date('2018-02-01'), guardianId: 'g-ps-004',
    guardian: guardian('g-ps-004', 'Fadzli bin Rashid', 'fadzli@hotmail.com', '870201-14-0063', '+60123456784'),
    centreId: 'ti-002', centre: CENTRES['ti-002'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-15'), monthlyFee: 150, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-005', studentCode: 'TI-2024-005', name: 'Alya Insyirah binti Hasrul', ic: '190712-14-0066',
    dateOfBirth: new Date('2019-07-12'), guardianId: 'g-ps-005',
    guardian: guardian('g-ps-005', 'Hasrul bin Wahab', 'hasrul@gmail.com', '840712-14-0126', '+60123456785'),
    centreId: 'ti-003', centre: CENTRES['ti-003'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-18'), monthlyFee: 200, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-006', studentCode: 'TI-2024-006', name: 'Irfan Syazwan bin Norzahra', ic: '180504-14-0055',
    dateOfBirth: new Date('2018-05-04'), guardianId: 'g-ps-006',
    guardian: guardian('g-ps-006', 'Norzahra binti Yusof', 'norzahra@gmail.com', '860504-14-0105', '+60123456786'),
    centreId: 'ti-003', centre: CENTRES['ti-003'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-20'), monthlyFee: 150, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-007', studentCode: 'TI-2024-007', name: 'Raihan Qistina binti Azhar', ic: '190118-14-0088',
    dateOfBirth: new Date('2019-01-18'), guardianId: 'g-ps-007',
    guardian: guardian('g-ps-007', 'Azhar bin Mohd Salleh', 'azhar.salleh@gmail.com', '830118-14-0168', '+60123456787'),
    centreId: 'ti-006', centre: CENTRES['ti-006'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-01-22'), monthlyFee: 300, depositAmount: 150, educationLevel: 'preschool',
  },
  {
    id: 'ps-008', studentCode: 'TI-2024-008', name: 'Danish Aqil bin Zulkifli', ic: '181123-14-0077',
    dateOfBirth: new Date('2018-11-23'), guardianId: 'g-ps-008',
    guardian: guardian('g-ps-008', 'Zulkifli bin Hassan', 'zulkifli.h@gmail.com', '821123-14-0147', '+60123456788'),
    centreId: 'ti-006', centre: CENTRES['ti-006'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-25'), monthlyFee: 200, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-009', studentCode: 'TI-2024-009', name: 'Saffiya Humaira binti Redza', ic: '190408-14-0099',
    dateOfBirth: new Date('2019-04-08'), guardianId: 'g-ps-009',
    guardian: guardian('g-ps-009', 'Redza bin Ismail', 'redza.ismail@gmail.com', '860408-14-0189', '+60123456789'),
    centreId: 'ti-002', centre: CENTRES['ti-002'],
    status: 'pending', subsidyCategory: 'B40', registrationDate: new Date('2024-02-01'), monthlyFee: 150, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-010', studentCode: 'TI-2024-010', name: 'Amirul Firdaus bin Zamri', ic: '180803-14-0111',
    dateOfBirth: new Date('2018-08-03'), guardianId: 'g-ps-010',
    guardian: guardian('g-ps-010', 'Zamri bin Kadir', 'zamri.kadir@yahoo.com', '840803-14-0021', '+60123456790'),
    centreId: 'ti-001', centre: CENTRES['ti-001'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-02-05'), monthlyFee: 80, depositAmount: 50, educationLevel: 'preschool',
  },
  {
    id: 'ps-011', studentCode: 'TI-2024-011', name: 'Nurul Izzah binti Kamaruddin', ic: '190916-14-0122',
    dateOfBirth: new Date('2019-09-16'), guardianId: 'g-ps-011',
    guardian: guardian('g-ps-011', 'Kamaruddin bin Saad', 'kamaruddin@gmail.com', '870916-14-0042', '+60123456791'),
    centreId: 'ti-003', centre: CENTRES['ti-003'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-02-10'), monthlyFee: 200, depositAmount: 100, educationLevel: 'preschool',
  },
  {
    id: 'ps-012', studentCode: 'TI-2024-012', name: 'Luqman Hakim bin Hafiz', ic: '180325-14-0133',
    dateOfBirth: new Date('2018-03-25'), guardianId: 'g-ps-012',
    guardian: guardian('g-ps-012', 'Hafiz bin Mansor', 'hafiz.mansor@gmail.com', '820325-14-0063', '+60123456792'),
    centreId: 'ti-006', centre: CENTRES['ti-006'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-02-12'), monthlyFee: 300, depositAmount: 150, educationLevel: 'preschool',
  },

  // ════════════════════════════════════════════════════════
  // PRIMARY — ages 7–12, born 2012–2017
  // ════════════════════════════════════════════════════════
  {
    id: 'pri-001', studentCode: 'SABK-2024-001', name: 'Muhammad Afiq bin Abdul Rahman', ic: '120501-14-1234',
    dateOfBirth: new Date('2012-05-01'), guardianId: 'g-pri-001',
    guardian: guardian('g-pri-001', 'Abdul Rahman bin Hassan', 'rahman@gmail.com', '810315-14-5678', '+60123456701'),
    centreId: 'sabk-001', centre: CENTRES['sabk-001'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-15'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },
  {
    id: 'pri-002', studentCode: 'SABK-2024-002', name: 'Nur Aina binti Mohd Zaki', ic: '130712-14-3456',
    dateOfBirth: new Date('2013-07-12'), guardianId: 'g-pri-002',
    guardian: guardian('g-pri-002', 'Mohd Zaki bin Ibrahim', 'zaki@yahoo.com', '820920-14-7890', '+60127654321'),
    centreId: 'sabk-001', centre: CENTRES['sabk-001'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-20'), monthlyFee: 120, depositAmount: 60, educationLevel: 'primary',
  },
  {
    id: 'pri-003', studentCode: 'SABK-2024-003', name: 'Ahmad Zulkifli bin Rashid', ic: '140322-14-5678',
    dateOfBirth: new Date('2014-03-22'), guardianId: 'g-pri-003',
    guardian: guardian('g-pri-003', 'Rashid bin Sulaiman', 'rashid.s@gmail.com', '790322-14-9012', '+60123456703'),
    centreId: 'sabk-002', centre: CENTRES['sabk-002'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-18'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },
  {
    id: 'pri-004', studentCode: 'SABK-2024-004', name: 'Siti Khadijah binti Norizan', ic: '121105-14-7890',
    dateOfBirth: new Date('2012-11-05'), guardianId: 'g-pri-004',
    guardian: guardian('g-pri-004', 'Norizan bin Ismail', 'norizan@gmail.com', '800805-14-2345', '+60123456704'),
    centreId: 'sabk-002', centre: CENTRES['sabk-002'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-01-22'), monthlyFee: 60, depositAmount: 30, educationLevel: 'primary',
  },
  {
    id: 'pri-005', studentCode: 'SABK-2024-005', name: 'Hazwan Izzat bin Aminuddin', ic: '130820-14-9012',
    dateOfBirth: new Date('2013-08-20'), guardianId: 'g-pri-005',
    guardian: guardian('g-pri-005', 'Aminuddin bin Taib', 'aminuddin@gmail.com', '830820-14-3456', '+60123456705'),
    centreId: 'sabk-003', centre: CENTRES['sabk-003'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-25'), monthlyFee: 120, depositAmount: 60, educationLevel: 'primary',
  },
  {
    id: 'pri-006', studentCode: 'SABK-2024-006', name: 'Fatimah Azzahra binti Shafiq', ic: '150630-14-2345',
    dateOfBirth: new Date('2015-06-30'), guardianId: 'g-pri-006',
    guardian: guardian('g-pri-006', 'Shafiq bin Bakar', 'shafiq@gmail.com', '850630-14-4567', '+60123456706'),
    centreId: 'sabk-003', centre: CENTRES['sabk-003'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-28'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },
  {
    id: 'pri-007', studentCode: 'SRAI-2024-001', name: 'Asyraf Danial bin Khairul', ic: '140415-14-4567',
    dateOfBirth: new Date('2014-04-15'), guardianId: 'g-pri-007',
    guardian: guardian('g-pri-007', 'Khairul bin Aziz', 'khairul.aziz@gmail.com', '830415-14-6789', '+60123456707'),
    centreId: 'srai-001', centre: CENTRES['srai-001'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-01-30'), monthlyFee: 150, depositAmount: 75, educationLevel: 'primary',
  },
  {
    id: 'pri-008', studentCode: 'SRAI-2024-002', name: 'Balqis Syifa binti Mohd Farid', ic: '130218-14-6789',
    dateOfBirth: new Date('2013-02-18'), guardianId: 'g-pri-008',
    guardian: guardian('g-pri-008', 'Mohd Farid bin Isa', 'farid.isa@yahoo.com', '820218-14-8901', '+60123456708'),
    centreId: 'srai-001', centre: CENTRES['srai-001'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-02-01'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },
  {
    id: 'pri-009', studentCode: 'SRAI-2024-003', name: 'Farhan Idris bin Hisyam', ic: '160907-14-8901',
    dateOfBirth: new Date('2016-09-07'), guardianId: 'g-pri-009',
    guardian: guardian('g-pri-009', 'Hisyam bin Abdul Ghani', 'hisyam@gmail.com', '870907-14-1234', '+60123456709'),
    centreId: 'srai-001', centre: CENTRES['srai-001'],
    status: 'pending', subsidyCategory: 'M40', registrationDate: new Date('2024-02-05'), monthlyFee: 120, depositAmount: 60, educationLevel: 'primary',
  },
  {
    id: 'pri-010', studentCode: 'SABK-2024-007', name: 'Zahira Nadhirah binti Azman', ic: '121214-14-1122',
    dateOfBirth: new Date('2012-12-14'), guardianId: 'g-pri-010',
    guardian: guardian('g-pri-010', 'Azman bin Mohd Ali', 'azman.ali@gmail.com', '801214-14-2244', '+60123456710'),
    centreId: 'sabk-001', centre: CENTRES['sabk-001'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-02-08'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },
  {
    id: 'pri-011', studentCode: 'SABK-2024-008', name: 'Naqiuddin bin Rosli', ic: '140710-14-3344',
    dateOfBirth: new Date('2014-07-10'), guardianId: 'g-pri-011',
    guardian: guardian('g-pri-011', 'Rosli bin Yaakob', 'rosli.y@yahoo.com', '830710-14-4466', '+60123456711'),
    centreId: 'sabk-002', centre: CENTRES['sabk-002'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-02-10'), monthlyFee: 60, depositAmount: 30, educationLevel: 'primary',
  },
  {
    id: 'pri-012', studentCode: 'SABK-2024-009', name: 'Amira Syuhada binti Ridhwan', ic: '150325-14-5566',
    dateOfBirth: new Date('2015-03-25'), guardianId: 'g-pri-012',
    guardian: guardian('g-pri-012', 'Ridhwan bin Omar', 'ridhwan@gmail.com', '840325-14-6688', '+60123456712'),
    centreId: 'sabk-003', centre: CENTRES['sabk-003'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-02-12'), monthlyFee: 120, depositAmount: 60, educationLevel: 'primary',
  },
  {
    id: 'pri-013', studentCode: 'SABK-2024-010', name: 'Azzam Ikhwan bin Zainuddin', ic: '131108-14-7788',
    dateOfBirth: new Date('2013-11-08'), guardianId: 'g-pri-013',
    guardian: guardian('g-pri-013', 'Zainuddin bin Musa', 'zainuddin@gmail.com', '821108-14-8800', '+60123456713'),
    centreId: 'sabk-002', centre: CENTRES['sabk-002'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-02-15'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },
  {
    id: 'pri-014', studentCode: 'SRAI-2024-004', name: 'Khairunnisa binti Hafizullah', ic: '160512-14-9900',
    dateOfBirth: new Date('2016-05-12'), guardianId: 'g-pri-014',
    guardian: guardian('g-pri-014', 'Hafizullah bin Abd Razak', 'hafizullah@gmail.com', '860512-14-1012', '+60123456714'),
    centreId: 'srai-001', centre: CENTRES['srai-001'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-02-18'), monthlyFee: 150, depositAmount: 75, educationLevel: 'primary',
  },
  {
    id: 'pri-015', studentCode: 'SABK-2024-011', name: 'Hafiq Faris bin Johari', ic: '120829-14-1100',
    dateOfBirth: new Date('2012-08-29'), guardianId: 'g-pri-015',
    guardian: guardian('g-pri-015', 'Johari bin Daud', 'johari.daud@gmail.com', '800829-14-2200', '+60123456715'),
    centreId: 'sabk-001', centre: CENTRES['sabk-001'],
    status: 'withdrawn', subsidyCategory: 'B40', registrationDate: new Date('2023-01-20'), monthlyFee: 100, depositAmount: 50, educationLevel: 'primary',
  },

  // ════════════════════════════════════════════════════════
  // SECONDARY — ages 13–17, born 2007–2011
  // ════════════════════════════════════════════════════════
  {
    id: 'sec-001', studentCode: 'SMA-2024-001', name: 'Muhammad Hariz bin Suhaimi', ic: '080415-14-2101',
    dateOfBirth: new Date('2008-04-15'), guardianId: 'g-sec-001',
    guardian: guardian('g-sec-001', 'Suhaimi bin Mohd Aris', 'suhaimi@gmail.com', '780415-14-3201', '+60123456801'),
    centreId: 'sma-kl', centre: CENTRES['sma-kl'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-10'), monthlyFee: 250, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-002', studentCode: 'SMA-2024-002', name: 'Nurul Athirah binti Samsuddin', ic: '091012-14-4202',
    dateOfBirth: new Date('2009-10-12'), guardianId: 'g-sec-002',
    guardian: guardian('g-sec-002', 'Samsuddin bin Nordin', 'samsuddin@yahoo.com', '791012-14-5302', '+60123456802'),
    centreId: 'sma-kl', centre: CENTRES['sma-kl'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-12'), monthlyFee: 280, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-003', studentCode: 'SMA-2024-003', name: 'Izzatul Husna binti Mustaqim', ic: '070622-14-6303',
    dateOfBirth: new Date('2007-06-22'), guardianId: 'g-sec-003',
    guardian: guardian('g-sec-003', 'Mustaqim bin Baharum', 'mustaqim@gmail.com', '770622-14-7403', '+60123456803'),
    centreId: 'sma-kl', centre: CENTRES['sma-kl'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-01-15'), monthlyFee: 180, depositAmount: 100, educationLevel: 'secondary',
  },
  {
    id: 'sec-004', studentCode: 'SMA-2024-004', name: 'Redha Irfan bin Zaharuddin', ic: '100205-14-8404',
    dateOfBirth: new Date('2010-02-05'), guardianId: 'g-sec-004',
    guardian: guardian('g-sec-004', 'Zaharuddin bin Ramlan', 'zaharuddin@gmail.com', '800205-14-9504', '+60123456804'),
    centreId: 'sma-kl', centre: CENTRES['sma-kl'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-18'), monthlyFee: 250, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-005', studentCode: 'SMA-2024-005', name: 'Qistina Rania binti Hanafiah', ic: '080829-14-1505',
    dateOfBirth: new Date('2008-08-29'), guardianId: 'g-sec-005',
    guardian: guardian('g-sec-005', 'Hanafiah bin Johari', 'hanafiah@gmail.com', '780829-14-2605', '+60123456805'),
    centreId: 'smista', centre: CENTRES['smista'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-01-20'), monthlyFee: 320, depositAmount: 200, educationLevel: 'secondary',
  },
  {
    id: 'sec-006', studentCode: 'SMA-2024-006', name: 'Hafizuddin bin Burhanuddin', ic: '091125-14-3606',
    dateOfBirth: new Date('2009-11-25'), guardianId: 'g-sec-006',
    guardian: guardian('g-sec-006', 'Burhanuddin bin Salleh', 'burhanuddin@gmail.com', '790125-14-4706', '+60123456806'),
    centreId: 'smista', centre: CENTRES['smista'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-22'), monthlyFee: 250, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-007', studentCode: 'SMA-2024-007', name: 'Nadia Adlina binti Syahrir', ic: '070316-14-5707',
    dateOfBirth: new Date('2007-03-16'), guardianId: 'g-sec-007',
    guardian: guardian('g-sec-007', 'Syahrir bin Yusof', 'syahrir@gmail.com', '770316-14-6807', '+60123456807'),
    centreId: 'smista', centre: CENTRES['smista'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-25'), monthlyFee: 280, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-008', studentCode: 'SMA-2024-008', name: 'Harith Azfar bin Kamarul', ic: '080718-14-7808',
    dateOfBirth: new Date('2008-07-18'), guardianId: 'g-sec-008',
    guardian: guardian('g-sec-008', 'Kamarul bin Rashid', 'kamarul@gmail.com', '780718-14-8908', '+60123456808'),
    centreId: 'smista', centre: CENTRES['smista'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-28'), monthlyFee: 250, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-009', studentCode: 'SMA-2024-009', name: 'Syazwani Batrisyia binti Iskandar', ic: '100413-14-9909',
    dateOfBirth: new Date('2010-04-13'), guardianId: 'g-sec-009',
    guardian: guardian('g-sec-009', 'Iskandar bin Lias', 'iskandar@gmail.com', '800413-14-1009', '+60123456809'),
    centreId: 'sma-lbn', centre: CENTRES['sma-lbn'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-30'), monthlyFee: 250, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-010', studentCode: 'SMA-2024-010', name: 'Fitri Aqmal bin Abdullah', ic: '091009-15-2010',
    dateOfBirth: new Date('2009-10-09'), guardianId: 'g-sec-010',
    guardian: guardian('g-sec-010', 'Abdullah bin Abidin', 'abdullahabidin@gmail.com', '791009-15-3010', '+60123456810'),
    centreId: 'sma-lbn', centre: CENTRES['sma-lbn'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-02-01'), monthlyFee: 220, depositAmount: 120, educationLevel: 'secondary',
  },
  {
    id: 'sec-011', studentCode: 'SMA-2024-011', name: 'Yasmin Husnul binti Roslan', ic: '080114-14-4111',
    dateOfBirth: new Date('2008-01-14'), guardianId: 'g-sec-011',
    guardian: guardian('g-sec-011', 'Roslan bin Osman', 'roslan@gmail.com', '780114-14-5211', '+60123456811'),
    centreId: 'sma-kl', centre: CENTRES['sma-kl'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-02-03'), monthlyFee: 180, depositAmount: 100, educationLevel: 'secondary',
  },
  {
    id: 'sec-012', studentCode: 'SMA-2024-012', name: 'Aiman Haziq bin Shamsul', ic: '070924-14-6312',
    dateOfBirth: new Date('2007-09-24'), guardianId: 'g-sec-012',
    guardian: guardian('g-sec-012', 'Shamsul bin Bahari', 'shamsul@gmail.com', '770924-14-7412', '+60123456812'),
    centreId: 'smista', centre: CENTRES['smista'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-02-05'), monthlyFee: 320, depositAmount: 200, educationLevel: 'secondary',
  },
  {
    id: 'sec-013', studentCode: 'SMA-2024-013', name: 'Zulaikha Iman binti Mazlan', ic: '100602-14-8513',
    dateOfBirth: new Date('2010-06-02'), guardianId: 'g-sec-013',
    guardian: guardian('g-sec-013', 'Mazlan bin Ghazali', 'mazlan@yahoo.com', '800602-14-9613', '+60123456813'),
    centreId: 'sma-lbn', centre: CENTRES['sma-lbn'],
    status: 'pending', subsidyCategory: 'B40', registrationDate: new Date('2024-02-08'), monthlyFee: 220, depositAmount: 120, educationLevel: 'secondary',
  },
  {
    id: 'sec-014', studentCode: 'SMA-2024-014', name: 'Mikhail Fathi bin Shukor', ic: '090313-14-1714',
    dateOfBirth: new Date('2009-03-13'), guardianId: 'g-sec-014',
    guardian: guardian('g-sec-014', 'Shukor bin Ahmad', 'shukor.a@gmail.com', '790313-14-2814', '+60123456814'),
    centreId: 'smista', centre: CENTRES['smista'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-02-10'), monthlyFee: 280, depositAmount: 150, educationLevel: 'secondary',
  },
  {
    id: 'sec-015', studentCode: 'SMA-2024-015', name: 'Nur Afrina binti Aminullah', ic: '080819-14-3915',
    dateOfBirth: new Date('2008-08-19'), guardianId: 'g-sec-015',
    guardian: guardian('g-sec-015', 'Aminullah bin Yunus', 'aminullah@gmail.com', '780819-14-4015', '+60123456815'),
    centreId: 'sma-kl', centre: CENTRES['sma-kl'],
    status: 'transferred', subsidyCategory: 'B40', registrationDate: new Date('2023-01-15'), monthlyFee: 250, depositAmount: 150, educationLevel: 'secondary',
  },

  // ════════════════════════════════════════════════════════
  // UNIVERSITY / HIGHER ED — ages 19–25, born 2000–2005
  // ════════════════════════════════════════════════════════
  {
    id: 'uni-001', studentCode: 'KPMAIWP-2024-001', name: 'Ahmad Muizuddin bin Rahim', ic: '020315-14-5001',
    dateOfBirth: new Date('2002-03-15'), guardianId: 'g-uni-001',
    guardian: guardian('g-uni-001', 'Rahim bin Jamaludin', 'rahim@gmail.com', '720315-14-6101', '+60123456901'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-05'), monthlyFee: 450, depositAmount: 300, educationLevel: 'university',
  },
  {
    id: 'uni-002', studentCode: 'KPMAIWP-2024-002', name: 'Nurul Ain binti Mahfudz', ic: '031120-14-7002',
    dateOfBirth: new Date('2003-11-20'), guardianId: 'g-uni-002',
    guardian: guardian('g-uni-002', 'Mahfudz bin Othman', 'mahfudz@gmail.com', '731120-14-8202', '+60123456902'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-01-08'), monthlyFee: 300, depositAmount: 200, educationLevel: 'university',
  },
  {
    id: 'uni-003', studentCode: 'KPMAIWP-2024-003', name: 'Hazwani binti Khairul Azhar', ic: '020728-14-9003',
    dateOfBirth: new Date('2002-07-28'), guardianId: 'g-uni-003',
    guardian: guardian('g-uni-003', 'Khairul Azhar bin Alias', 'khairul.azhar@gmail.com', '720728-14-1103', '+60123456903'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-10'), monthlyFee: 500, depositAmount: 350, educationLevel: 'university',
  },
  {
    id: 'uni-004', studentCode: 'KPMAIWP-2024-004', name: 'Amirul Asyraf bin Shafie', ic: '040214-14-2004',
    dateOfBirth: new Date('2004-02-14'), guardianId: 'g-uni-004',
    guardian: guardian('g-uni-004', 'Shafie bin Musa', 'shafie.musa@yahoo.com', '740214-14-3104', '+60123456904'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-12'), monthlyFee: 450, depositAmount: 300, educationLevel: 'university',
  },
  {
    id: 'uni-005', studentCode: 'KPMAIWP-2024-005', name: 'Nur Sabrina binti Zaini', ic: '031005-14-4005',
    dateOfBirth: new Date('2003-10-05'), guardianId: 'g-uni-005',
    guardian: guardian('g-uni-005', 'Zaini bin Nordin', 'zaini@gmail.com', '731005-14-5105', '+60123456905'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'active', subsidyCategory: 'T20', registrationDate: new Date('2024-01-15'), monthlyFee: 650, depositAmount: 400, educationLevel: 'university',
  },
  {
    id: 'uni-006', studentCode: 'IKB-2024-001', name: 'Syafiq Hakimi bin Rosdi', ic: '020512-14-6006',
    dateOfBirth: new Date('2002-05-12'), guardianId: 'g-uni-006',
    guardian: guardian('g-uni-006', 'Rosdi bin Ibrahim', 'rosdi@gmail.com', '720512-14-7206', '+60123456906'),
    centreId: 'ikb', centre: CENTRES['ikb'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-18'), monthlyFee: 350, depositAmount: 200, educationLevel: 'university',
  },
  {
    id: 'uni-007', studentCode: 'IKB-2024-002', name: 'Farahin Aqilah binti Zamzuri', ic: '030819-14-8007',
    dateOfBirth: new Date('2003-08-19'), guardianId: 'g-uni-007',
    guardian: guardian('g-uni-007', 'Zamzuri bin Marzuki', 'zamzuri@gmail.com', '730819-14-9307', '+60123456907'),
    centreId: 'ikb', centre: CENTRES['ikb'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-01-20'), monthlyFee: 250, depositAmount: 150, educationLevel: 'university',
  },
  {
    id: 'uni-008', studentCode: 'IKB-2024-003', name: 'Muhd Hakimie bin Sallehhuddin', ic: '041126-14-1008',
    dateOfBirth: new Date('2004-11-26'), guardianId: 'g-uni-008',
    guardian: guardian('g-uni-008', 'Sallehhuddin bin Ariff', 'salleh@gmail.com', '741126-14-2108', '+60123456908'),
    centreId: 'ikb', centre: CENTRES['ikb'],
    status: 'active', subsidyCategory: 'M40', registrationDate: new Date('2024-01-22'), monthlyFee: 400, depositAmount: 250, educationLevel: 'university',
  },
  {
    id: 'uni-009', studentCode: 'IKB-2024-004', name: 'Aina Mardhiyyah binti Zolkepli', ic: '020304-14-3009',
    dateOfBirth: new Date('2002-03-04'), guardianId: 'g-uni-009',
    guardian: guardian('g-uni-009', 'Zolkepli bin Bakar', 'zolkepli@yahoo.com', '720304-14-4209', '+60123456909'),
    centreId: 'ikb', centre: CENTRES['ikb'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-01-25'), monthlyFee: 350, depositAmount: 200, educationLevel: 'university',
  },
  {
    id: 'uni-010', studentCode: 'KPMAIWP-2024-006', name: 'Wafiq Azri bin Shahabuddin', ic: '030617-14-5010',
    dateOfBirth: new Date('2003-06-17'), guardianId: 'g-uni-010',
    guardian: guardian('g-uni-010', 'Shahabuddin bin Rajab', 'shahabuddin@gmail.com', '730617-14-6110', '+60123456910'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'pending', subsidyCategory: 'M40', registrationDate: new Date('2024-02-01'), monthlyFee: 500, depositAmount: 350, educationLevel: 'university',
  },
  {
    id: 'uni-011', studentCode: 'IKB-2024-005', name: 'Hidayah binti Norhamzah', ic: '041008-14-7011',
    dateOfBirth: new Date('2004-10-08'), guardianId: 'g-uni-011',
    guardian: guardian('g-uni-011', 'Norhamzah bin Wan Ismail', 'norhamzah@gmail.com', '741008-14-8211', '+60123456911'),
    centreId: 'ikb', centre: CENTRES['ikb'],
    status: 'active', subsidyCategory: 'B40', registrationDate: new Date('2024-02-05'), monthlyFee: 350, depositAmount: 200, educationLevel: 'university',
  },
  {
    id: 'uni-012', studentCode: 'KPMAIWP-2024-007', name: 'Fathul Bari bin Mohd Nawi', ic: '020122-14-9012',
    dateOfBirth: new Date('2002-01-22'), guardianId: 'g-uni-012',
    guardian: guardian('g-uni-012', 'Mohd Nawi bin Saad', 'mohdnawi@gmail.com', '720122-14-1212', '+60123456912'),
    centreId: 'kpmaiwp', centre: CENTRES['kpmaiwp'],
    status: 'active', subsidyCategory: 'Asnaf', registrationDate: new Date('2024-02-08'), monthlyFee: 300, depositAmount: 200, educationLevel: 'university',
  },
];
