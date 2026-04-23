export type OrderStatus = 'Prebook' | 'Expire' | 'Deposit Paid' | 'Pending' | 'Partially Paid' | 'Installment Paid' | 'Tax Paid' | 'Deed Transferred' | 'Cancelled' | 'Refunded';

export interface Order {
  id: string;
  buyerName: string;
  buyerInitials: string;
  buyerUsername: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerNationality: string;
  buyerNationalId: string;
  buyerGender: 'M' | 'F';
  buyerDob: string;
  buyerVerified: boolean;
  propertyId: string;
  propertyName: string;
  projectName: string;
  blockNumber: string;
  area: number;
  price: number;
  priceAfterDiscount: number;
  status: OrderStatus;
  amount: number;
  depositAmount: number;
  depositPaid: number;
  installmentAmount: number;
  installmentPaid: number;
  installmentRemaining: number;
  activeInstallment: string;
  bookingFee: number;
  totalPaid: number;
  paymentOption: string;
  camundaId: string;
  bookingDate: string;
  depositPaidAt: string;
  taxAmount: number;
  taxOverMillion: boolean;
  adminTaxExempt: string;
  discountValue: number;
  discountAppliedAt: string;
  discountType: string;
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    buyerName: 'Mohammed Ahmed',
    buyerInitials: 'MA',
    buyerUsername: '@mohammed_a',
    buyerPhone: '+966 55 987 6543',
    buyerEmail: 'mohammed@email.com',
    buyerNationality: 'Saudi',
    buyerNationalId: '1087654321',
    buyerGender: 'M',
    buyerDob: '1988-03-22',
    buyerVerified: true,
    propertyId: 'PRP-301',
    propertyName: 'Villa A1',
    projectName: 'Al Yasmeen Residences',
    blockNumber: 'B-12',
    area: 280,
    price: 1500000,
    priceAfterDiscount: 1450000,
    status: 'Prebook',
    amount: 1500000,
    depositAmount: 75000,
    depositPaid: 0,
    installmentAmount: 1375000,
    installmentPaid: 0,
    installmentRemaining: 1375000,
    activeInstallment: '0 / 6',
    bookingFee: 10000,
    totalPaid: 0,
    paymentOption: 'Bank Transfer',
    camundaId: 'cam-1a2b-3c4d',
    bookingDate: '2026-04-15',
    depositPaidAt: '-',
    taxAmount: 75000,
    taxOverMillion: true,
    adminTaxExempt: 'Normal',
    discountValue: 50000,
    discountAppliedAt: '2026-04-14',
    discountType: 'Amount',
  },
  {
    id: 'ORD-1002',
    buyerName: 'Sarah Al-Qahtani',
    buyerInitials: 'SA',
    buyerUsername: '@sarah_q',
    buyerPhone: '+966 50 123 4567',
    buyerEmail: 'sarah@example.com',
    buyerNationality: 'Saudi',
    buyerNationalId: '1098765432',
    buyerGender: 'F',
    buyerDob: '1992-08-15',
    buyerVerified: true,
    propertyId: 'PRP-405',
    propertyName: 'Apartment B4',
    projectName: 'Olaya Towers',
    blockNumber: 'A-03',
    area: 145,
    price: 850000,
    priceAfterDiscount: 800000,
    status: 'Deposit Paid',
    amount: 850000,
    depositAmount: 50000,
    depositPaid: 50000,
    installmentAmount: 750000,
    installmentPaid: 0,
    installmentRemaining: 750000,
    activeInstallment: '1 / 4',
    bookingFee: 5000,
    totalPaid: 50000,
    paymentOption: 'Bank Transfer',
    camundaId: 'cam-9f8a-4421',
    bookingDate: '2026-04-10',
    depositPaidAt: '2026-04-10 14:30',
    taxAmount: 42500,
    taxOverMillion: false,
    adminTaxExempt: 'Normal',
    discountValue: 50000,
    discountAppliedAt: '2026-04-10',
    discountType: 'Amount',
  },
  {
    id: 'ORD-1003',
    buyerName: 'Fahad Al-Dosari',
    buyerInitials: 'FA',
    buyerUsername: '@fahad_d',
    buyerPhone: '+966 54 222 3344',
    buyerEmail: 'fahad@email.com',
    buyerNationality: 'Saudi',
    buyerNationalId: '1076543210',
    buyerGender: 'M',
    buyerDob: '1985-11-02',
    buyerVerified: true,
    propertyId: 'PRP-512',
    propertyName: 'Townhouse C2',
    projectName: 'Riyadh Hills',
    blockNumber: 'C-07',
    area: 210,
    price: 2200000,
    priceAfterDiscount: 2200000,
    status: 'Installment Paid',
    amount: 2200000,
    depositAmount: 110000,
    depositPaid: 110000,
    installmentAmount: 2090000,
    installmentPaid: 2090000,
    installmentRemaining: 0,
    activeInstallment: '8 / 8',
    bookingFee: 15000,
    totalPaid: 2200000,
    paymentOption: 'SADAD',
    camundaId: 'cam-5e6f-7890',
    bookingDate: '2026-03-20',
    depositPaidAt: '2026-03-20 09:15',
    taxAmount: 110000,
    taxOverMillion: true,
    adminTaxExempt: 'Normal',
    discountValue: 0,
    discountAppliedAt: '-',
    discountType: '-',
  },
  {
    id: 'ORD-1004',
    buyerName: 'Noura Al-Shehri',
    buyerInitials: 'NA',
    buyerUsername: '@noura_s',
    buyerPhone: '+966 50 555 1234',
    buyerEmail: 'noura@email.com',
    buyerNationality: 'Saudi',
    buyerNationalId: '1065432109',
    buyerGender: 'F',
    buyerDob: '1990-06-18',
    buyerVerified: true,
    propertyId: 'PRP-220',
    propertyName: 'Villa D5',
    projectName: 'Al Yasmeen Residences',
    blockNumber: 'D-01',
    area: 320,
    price: 1800000,
    priceAfterDiscount: 1750000,
    status: 'Deed Transferred',
    amount: 1800000,
    depositAmount: 90000,
    depositPaid: 90000,
    installmentAmount: 1660000,
    installmentPaid: 1660000,
    installmentRemaining: 0,
    activeInstallment: '6 / 6',
    bookingFee: 12000,
    totalPaid: 1800000,
    paymentOption: 'Cash',
    camundaId: 'cam-ab12-cd34',
    bookingDate: '2026-01-05',
    depositPaidAt: '2026-01-05 11:45',
    taxAmount: 90000,
    taxOverMillion: true,
    adminTaxExempt: 'Skipped',
    discountValue: 50000,
    discountAppliedAt: '2026-01-04',
    discountType: 'Percentage',
  },
  {
    id: 'ORD-1005',
    buyerName: 'Khalid Al-Ghamdi',
    buyerInitials: 'KA',
    buyerUsername: '@khalid_g',
    buyerPhone: '+966 53 777 8899',
    buyerEmail: 'khalid@email.com',
    buyerNationality: 'Saudi',
    buyerNationalId: '1054321098',
    buyerGender: 'M',
    buyerDob: '1995-01-30',
    buyerVerified: false,
    propertyId: 'PRP-410',
    propertyName: 'Apartment A10',
    projectName: 'Olaya Towers',
    blockNumber: 'A-10',
    area: 120,
    price: 920000,
    priceAfterDiscount: 920000,
    status: 'Expire',
    amount: 920000,
    depositAmount: 46000,
    depositPaid: 0,
    installmentAmount: 874000,
    installmentPaid: 0,
    installmentRemaining: 874000,
    activeInstallment: '0 / 4',
    bookingFee: 5000,
    totalPaid: 0,
    paymentOption: 'Bank Transfer',
    camundaId: 'cam-ef56-gh78',
    bookingDate: '2026-04-12',
    depositPaidAt: '-',
    taxAmount: 46000,
    taxOverMillion: false,
    adminTaxExempt: 'Normal',
    discountValue: 0,
    discountAppliedAt: '-',
    discountType: '-',
  }
];
