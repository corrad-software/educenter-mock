export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'student' | 'institute';
  description: string;
  count: number; // Number of items in this category
  createdAt: Date;
}

// Student Categories
export const studentCategories: Category[] = [
  {
    id: '1',
    name: 'Primary Level',
    slug: 'primary-level',
    type: 'student',
    description: 'Students in primary level (Year 1-6)',
    count: 45,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Secondary Level',
    slug: 'secondary-level',
    type: 'student',
    description: 'Students in secondary level (Form 1-5)',
    count: 32,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Tahfiz Program',
    slug: 'tahfiz-program',
    type: 'student',
    description: 'Students enrolled in Quran memorization program',
    count: 28,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Special Needs',
    slug: 'special-needs',
    type: 'student',
    description: 'Students requiring special educational support',
    count: 8,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Scholarship',
    slug: 'scholarship',
    type: 'student',
    description: 'Students on scholarship programs',
    count: 15,
    createdAt: new Date('2024-01-01'),
  },
];

// Institute Categories
export const instituteCategories: Category[] = [
  {
    id: '11',
    name: 'SABK (Sekolah Agama Bantuan Kerajaan)',
    slug: 'sabk',
    type: 'institute',
    description: 'Government-aided religious schools',
    count: 15,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '12',
    name: 'SRAI (Sekolah Rendah Agama Integrasi)',
    slug: 'srai',
    type: 'institute',
    description: 'Integrated Islamic primary schools',
    count: 8,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '13',
    name: 'Tahfiz Center',
    slug: 'tahfiz-center',
    type: 'institute',
    description: 'Quran memorization centers',
    count: 5,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '14',
    name: 'Pondok / Pesantren',
    slug: 'pondok-pesantren',
    type: 'institute',
    description: 'Traditional Islamic boarding schools',
    count: 3,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '15',
    name: 'KEMAS Center',
    slug: 'kemas-center',
    type: 'institute',
    description: 'Community Development Department centers',
    count: 4,
    createdAt: new Date('2024-01-01'),
  },
];

// Helper functions
export function getStudentCategories(): Category[] {
  return studentCategories;
}

export function getInstituteCategories(): Category[] {
  return instituteCategories;
}

export function getCategoryById(id: string): Category | undefined {
  return [...studentCategories, ...instituteCategories].find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return [...studentCategories, ...instituteCategories].find(c => c.slug === slug);
}
