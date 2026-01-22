export interface FeeStructure {
  id: string;
  instituteId: string;
  instituteName: string;
  instituteCode: string;
  monthlyFee: number;
  depositAmount: number;
  registrationFee: number;
  // Subsidy percentages
  subsidies: {
    B40: number;  // percentage discount
    M40: number;
    T20: number;
    Asnaf: number;
  };
  effectiveDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const feeStructures: FeeStructure[] = [
  {
    id: '1',
    instituteId: '1',
    instituteName: 'Sekolah Agama Bantuan Kerajaan Darul Ulum',
    instituteCode: 'SABK-WP-001',
    monthlyFee: 350,
    depositAmount: 100,
    registrationFee: 50,
    subsidies: {
      B40: 50,  // 50% discount
      M40: 30,  // 30% discount
      T20: 0,   // No discount
      Asnaf: 100, // 100% discount (free)
    },
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: '2',
    instituteId: '2',
    instituteName: 'Sekolah Agama Bantuan Kerajaan Al-Amin',
    instituteCode: 'SABK-WP-002',
    monthlyFee: 400,
    depositAmount: 120,
    registrationFee: 60,
    subsidies: {
      B40: 50,
      M40: 30,
      T20: 0,
      Asnaf: 100,
    },
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: '3',
    instituteId: '3',
    instituteName: 'Sekolah Agama Bantuan Kerajaan Nurul Hidayah',
    instituteCode: 'SABK-WP-003',
    monthlyFee: 320,
    depositAmount: 100,
    registrationFee: 50,
    subsidies: {
      B40: 50,
      M40: 30,
      T20: 0,
      Asnaf: 100,
    },
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: '4',
    instituteId: '4',
    instituteName: 'Sekolah Rendah Agama Integrasi Al-Falah',
    instituteCode: 'SRAI-WP-001',
    monthlyFee: 300,
    depositAmount: 100,
    registrationFee: 50,
    subsidies: {
      B40: 50,
      M40: 30,
      T20: 0,
      Asnaf: 100,
    },
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: '5',
    instituteId: '5',
    instituteName: 'Sekolah Rendah Agama Integrasi Darul Ihsan',
    instituteCode: 'SRAI-PJ-001',
    monthlyFee: 380,
    depositAmount: 100,
    registrationFee: 50,
    subsidies: {
      B40: 50,
      M40: 30,
      T20: 0,
      Asnaf: 100,
    },
    effectiveDate: new Date('2024-01-01'),
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
  },
];

// Helper function to calculate final fee after subsidy
export function calculateFinalFee(
  monthlyFee: number,
  subsidyCategory: 'B40' | 'M40' | 'T20' | 'Asnaf' | 'None',
  feeStructure: FeeStructure
): number {
  if (subsidyCategory === 'None') return monthlyFee;

  const subsidyPercentage = feeStructure.subsidies[subsidyCategory] || 0;
  const discount = (monthlyFee * subsidyPercentage) / 100;
  return monthlyFee - discount;
}

// Helper function to get fee structure by institute
export function getFeeStructureByInstitute(instituteId: string): FeeStructure | undefined {
  return feeStructures.find(fs => fs.instituteId === instituteId && fs.isActive);
}
