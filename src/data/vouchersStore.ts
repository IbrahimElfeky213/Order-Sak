
export type VoucherType = 'Fixed Amount' | 'Percentage';
export type VoucherStatus = 'Used' | 'Unused' | 'Expired';

export interface VoucherHistory {
  timestamp: string;
  action: string;
  actionBy: string;
  notes?: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number; // SAR or %
  
  // Customer Info
  customerId: string;
  customerName: string;
  customerNationalId: string;
  customerUsername: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality: string;
  customerGender: 'M' | 'F';
  customerDob: string;
  customerVerified: boolean;
  
  // Property Info
  propertyId: string;
  propertyName: string;
  projectId: string;
  projectName: string;
  propertyType: string;
  propertyArea: number;
  propertyPrice: number;
  propertyStatus: 'Available' | 'Booked' | 'Sold';
  
  // Usage State
  isUsed: boolean;
  usageDate?: string;
  expiryDate: string;
  orderId?: string;
  orderStatus?: string;
  orderBookingDate?: string;
  orderTotalAmount?: number;
  orderPaymentOption?: string;
  
  // Meta
  createdAt: string;
  assignedAt: string;
  
  history: VoucherHistory[];
}

export const mockVouchers: Voucher[] = [
  {
    id: 'VOC-9001',
    code: 'SAK-WELCOME-2026',
    type: 'Fixed Amount',
    value: 50000,
    customerId: 'CST-3001',
    customerName: 'Mohammed Ahmed Al-Rashidi',
    customerNationalId: '1087654321',
    customerUsername: '@mohammed_a',
    customerEmail: 'mohammed@email.com',
    customerPhone: '+966 55 987 6543',
    customerNationality: 'Saudi',
    customerGender: 'M',
    customerDob: '1988-03-22',
    customerVerified: true,
    propertyId: 'PRP-101',
    propertyName: 'Villa A1',
    projectId: 'PRJ-001',
    projectName: 'Al Yasmeen Residences',
    propertyType: 'Villa',
    propertyArea: 350,
    propertyPrice: 1500000,
    propertyStatus: 'Sold',
    isUsed: true,
    usageDate: '2026-04-15 10:30',
    expiryDate: '2026-12-31 23:59',
    orderId: 'ORD-1001',
    orderStatus: 'Completed',
    orderBookingDate: '2026-04-15',
    orderTotalAmount: 1450000,
    orderPaymentOption: 'Bank Transfer',
    createdAt: '2026-01-01 09:00',
    assignedAt: '2026-04-10 14:00',
    history: [
      { timestamp: '2026-01-01 09:00', action: 'Voucher Created', actionBy: 'System' },
      { timestamp: '2026-04-10 14:00', action: 'Assigned to Customer', actionBy: 'Faisal O.' },
      { timestamp: '2026-04-15 10:30', action: 'Used in Order', actionBy: 'System', notes: 'Applied to ORD-1001' }
    ]
  },
  {
    id: 'VOC-9002',
    code: 'RAMADAN-GIFT-10',
    type: 'Percentage',
    value: 10,
    customerId: 'CST-3002',
    customerName: 'Sarah Norah Al-Qahtani',
    customerNationalId: '1098765432',
    customerUsername: '@sarah_q',
    customerEmail: 'sarah@example.com',
    customerPhone: '+966 50 123 4567',
    customerNationality: 'Saudi',
    customerGender: 'F',
    customerDob: '1992-08-15',
    customerVerified: true,
    propertyId: 'PRP-202',
    propertyName: 'Apartment B4',
    projectId: 'PRJ-002',
    projectName: 'Olaya Towers',
    propertyType: 'Apartment',
    propertyArea: 145,
    propertyPrice: 850000,
    propertyStatus: 'Available',
    isUsed: false,
    expiryDate: '2026-05-15 23:59',
    createdAt: '2026-03-01 11:00',
    assignedAt: '2026-04-18 09:00',
    history: [
      { timestamp: '2026-03-01 11:00', action: 'Voucher Created', actionBy: 'Admin (CMS)' },
      { timestamp: '2026-04-18 09:00', action: 'Assigned to Customer', actionBy: 'System' }
    ]
  },
  {
    id: 'VOC-9003',
    code: 'EXPIRED-PROMO-99',
    type: 'Fixed Amount',
    value: 25000,
    customerId: 'CST-3004',
    customerName: 'Fahad Sami Al-Dosari',
    customerNationalId: '1076543210',
    customerUsername: '@fahad_d',
    customerEmail: 'fahad@email.com',
    customerPhone: '+966 54 222 3344',
    customerNationality: 'Saudi',
    customerGender: 'M',
    customerDob: '1985-11-02',
    customerVerified: true,
    propertyId: 'PRP-303',
    propertyName: 'Townhouse C2',
    projectId: 'PRJ-003',
    projectName: 'Riyadh Hills',
    propertyType: 'Townhouse',
    propertyArea: 220,
    propertyPrice: 2200000,
    propertyStatus: 'Available',
    isUsed: false,
    expiryDate: '2026-04-01 12:00',
    createdAt: '2026-01-15 08:30',
    assignedAt: '2026-02-01 10:00',
    history: [
      { timestamp: '2026-01-15 08:30', action: 'Voucher Created', actionBy: 'System' },
      { timestamp: '2026-02-01 10:00', action: 'Assigned to Customer', actionBy: 'Faisal O.' },
      { timestamp: '2026-04-01 12:01', action: 'Expired', actionBy: 'System' }
    ]
  },
  {
    id: 'VOC-9004',
    code: 'ALPHONSO-X',
    type: 'Percentage',
    value: 2.5,
    customerId: 'CST-3001',
    customerName: 'Mohammed Ahmed Al-Rashidi',
    customerNationalId: '1087654321',
    customerUsername: '@mohammed_a',
    customerEmail: 'mohammed@email.com',
    customerPhone: '+966 55 987 6543',
    customerNationality: 'Saudi',
    customerGender: 'M',
    customerDob: '1988-03-22',
    customerVerified: true,
    propertyId: 'PRP-105',
    propertyName: 'All properties in project',
    projectId: 'PRJ-001',
    projectName: 'Al Yasmeen Residences',
    propertyType: 'Villa / Apartment',
    propertyArea: 400,
    propertyPrice: 1800000,
    propertyStatus: 'Available',
    isUsed: false,
    expiryDate: '2026-04-30 23:59',
    createdAt: '2026-04-01 10:00',
    assignedAt: '2026-04-22 15:00',
    history: [
      { timestamp: '2026-04-01 10:00', action: 'Voucher Created', actionBy: 'System' },
      { timestamp: '2026-04-22 15:00', action: 'Assigned to Customer', actionBy: 'Marketing' }
    ]
  }
];
