export type OrderStatus =
  | 'Prebook' | 'Expire' | 'Deposit Paid' | 'Pending'
  | 'Partially Paid' | 'Installment Paid' | 'Tax Paid'
  | 'Deed Transferred' | 'Cancelled' | 'Refunded';

export interface Transaction {
  id: string;
  amount: number;
  paymentType: 'Deposit' | 'Installment' | 'Booking Fee' | 'Tax' | 'Refund';
  type: 'Credit' | 'Debit';
  method: 'Bank Transfer' | 'Cash' | 'SADAD' | 'Credit Card';
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
  reference?: string;
}

export interface Bill {
  id: string;
  sadadNumber: string;
  amount: number;
  status: 'Bill Paid' | 'Pending' | 'Expired' | 'Cancelled';
  createdAt: string;
  expiryDate: string;
  invoiceId: string;
}

export interface Installment {
  n: number;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface ActionLog {
  time: string;
  action: string;
  by: string;
  desc: string;
}

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
  transactions: Transaction[];
  bills: Bill[];
  installments: Installment[];
  documents: Document[];
  actionLogs: ActionLog[];
}

const now = () => new Date().toISOString().slice(0, 16).replace('T', ' ');

export const buildMockOrders = (): Order[] => [
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
    transactions: [],
    bills: [
      { id: 'BILL-001', sadadNumber: 'SADAD-200001', amount: 75000, status: 'Pending', createdAt: '2026-04-15 09:00', expiryDate: '2026-05-15 23:59', invoiceId: 'INV-3301' }
    ],
    installments: [
      { n: 1, amount: 229166, dueDate: '2026-05-15', paidDate: null, status: 'Pending' },
      { n: 2, amount: 229166, dueDate: '2026-06-15', paidDate: null, status: 'Pending' },
      { n: 3, amount: 229166, dueDate: '2026-07-15', paidDate: null, status: 'Pending' },
      { n: 4, amount: 229166, dueDate: '2026-08-15', paidDate: null, status: 'Pending' },
      { n: 5, amount: 229166, dueDate: '2026-09-15', paidDate: null, status: 'Pending' },
      { n: 6, amount: 229170, dueDate: '2026-10-15', paidDate: null, status: 'Pending' },
    ],
    documents: [
      { id: 'DOC-001', name: 'Booking Confirmation.pdf', type: 'PDF', uploadedAt: '2026-04-15', size: '1.2 MB' },
    ],
    actionLogs: [
      { time: '2026-04-15 09:00', action: 'Order Created', by: 'System', desc: 'Order ORD-1001 created for Mohammed Ahmed.' },
    ],
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
    transactions: [
      { id: 'TRX-77A9', amount: 50000, paymentType: 'Deposit', type: 'Credit', method: 'Bank Transfer', status: 'Completed', createdAt: '2026-04-10 14:30', reference: 'REF-BNK-001' },
    ],
    bills: [
      { id: 'BILL-002', sadadNumber: 'SADAD-100234', amount: 50000, status: 'Bill Paid', createdAt: '2026-04-10 09:00', expiryDate: '2026-05-10 23:59', invoiceId: 'INV-5540' }
    ],
    installments: [
      { n: 1, amount: 187500, dueDate: '2026-05-10', paidDate: null, status: 'Pending' },
      { n: 2, amount: 187500, dueDate: '2026-06-10', paidDate: null, status: 'Pending' },
      { n: 3, amount: 187500, dueDate: '2026-07-10', paidDate: null, status: 'Pending' },
      { n: 4, amount: 187500, dueDate: '2026-08-10', paidDate: null, status: 'Pending' },
    ],
    documents: [
      { id: 'DOC-002', name: 'Proof of Payment Receipt.pdf', type: 'PDF', uploadedAt: '2026-04-10', size: '0.8 MB' },
      { id: 'DOC-003', name: 'Brokerage Agreement.pdf', type: 'PDF', uploadedAt: '2026-04-08', size: '2.1 MB' },
    ],
    actionLogs: [
      { time: '2026-04-10 09:00', action: 'Order Created', by: 'System', desc: 'Order ORD-1002 was created for Sarah Al-Qahtani.' },
      { time: '2026-04-10 14:30', action: 'Deposit Recorded', by: 'Admin', desc: 'Deposit of 50,000 SAR recorded. Status updated to Deposit Paid.' },
    ],
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
    transactions: [
      { id: 'TRX-AA01', amount: 110000, paymentType: 'Deposit', type: 'Credit', method: 'SADAD', status: 'Completed', createdAt: '2026-03-20 09:15', reference: 'SAD-201' },
      { id: 'TRX-AA02', amount: 261250, paymentType: 'Installment', type: 'Credit', method: 'SADAD', status: 'Completed', createdAt: '2026-04-20 11:00', reference: 'SAD-202' },
    ],
    bills: [],
    installments: [
      { n: 1, amount: 261250, dueDate: '2026-04-20', paidDate: '2026-04-20', status: 'Paid' },
      { n: 2, amount: 261250, dueDate: '2026-05-20', paidDate: '2026-05-20', status: 'Paid' },
      { n: 3, amount: 261250, dueDate: '2026-06-20', paidDate: '2026-06-20', status: 'Paid' },
      { n: 4, amount: 261250, dueDate: '2026-07-20', paidDate: '2026-07-20', status: 'Paid' },
      { n: 5, amount: 261250, dueDate: '2026-08-20', paidDate: '2026-08-20', status: 'Paid' },
      { n: 6, amount: 261250, dueDate: '2026-09-20', paidDate: '2026-09-20', status: 'Paid' },
      { n: 7, amount: 261250, dueDate: '2026-10-20', paidDate: '2026-10-20', status: 'Paid' },
      { n: 8, amount: 261250, dueDate: '2026-11-20', paidDate: '2026-11-20', status: 'Paid' },
    ],
    documents: [
      { id: 'DOC-004', name: 'Final Payment Certificate.pdf', type: 'PDF', uploadedAt: '2026-11-20', size: '1.5 MB' },
    ],
    actionLogs: [
      { time: '2026-03-20 09:00', action: 'Order Created', by: 'System', desc: 'Order ORD-1003 created for Fahad Al-Dosari.' },
      { time: '2026-03-20 09:15', action: 'Deposit Recorded', by: 'Admin', desc: 'Deposit of 110,000 SAR recorded.' },
      { time: '2026-11-20 12:00', action: 'All Installments Paid', by: 'System', desc: 'All 8 installments completed. Status updated to Installment Paid.' },
    ],
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
    transactions: [
      { id: 'TRX-BB01', amount: 90000, paymentType: 'Deposit', type: 'Credit', method: 'Cash', status: 'Completed', createdAt: '2026-01-05 11:45' },
    ],
    bills: [],
    installments: [
      { n: 1, amount: 276666, dueDate: '2026-02-05', paidDate: '2026-02-05', status: 'Paid' },
      { n: 2, amount: 276666, dueDate: '2026-03-05', paidDate: '2026-03-05', status: 'Paid' },
      { n: 3, amount: 276666, dueDate: '2026-04-05', paidDate: '2026-04-05', status: 'Paid' },
      { n: 4, amount: 276666, dueDate: '2026-05-05', paidDate: '2026-05-05', status: 'Paid' },
      { n: 5, amount: 276666, dueDate: '2026-06-05', paidDate: '2026-06-05', status: 'Paid' },
      { n: 6, amount: 276670, dueDate: '2026-07-05', paidDate: '2026-07-05', status: 'Paid' },
    ],
    documents: [
      { id: 'DOC-005', name: 'Deed of Transfer.pdf', type: 'PDF', uploadedAt: '2026-07-10', size: '3.2 MB' },
      { id: 'DOC-006', name: 'Tax Clearance Certificate.pdf', type: 'PDF', uploadedAt: '2026-07-08', size: '1.1 MB' },
    ],
    actionLogs: [
      { time: '2026-01-05 09:00', action: 'Order Created', by: 'System', desc: 'Order ORD-1004 created for Noura Al-Shehri.' },
      { time: '2026-07-10 10:00', action: 'Deed Transferred', by: 'Faisal Al-Otaibi', desc: 'Property deed successfully transferred. Order complete.' },
    ],
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
    transactions: [],
    bills: [
      { id: 'BILL-003', sadadNumber: 'SADAD-200999', amount: 46000, status: 'Expired', createdAt: '2026-04-12 10:00', expiryDate: '2026-04-20 23:59', invoiceId: 'INV-4403' }
    ],
    installments: [
      { n: 1, amount: 218500, dueDate: '2026-05-12', paidDate: null, status: 'Pending' },
      { n: 2, amount: 218500, dueDate: '2026-06-12', paidDate: null, status: 'Pending' },
      { n: 3, amount: 218500, dueDate: '2026-07-12', paidDate: null, status: 'Pending' },
      { n: 4, amount: 218500, dueDate: '2026-08-12', paidDate: null, status: 'Pending' },
    ],
    documents: [],
    actionLogs: [
      { time: '2026-04-12 09:00', action: 'Order Created', by: 'System', desc: 'Order ORD-1005 created for Khalid Al-Ghamdi.' },
      { time: '2026-04-20 23:59', action: 'Order Expired', by: 'System', desc: 'Payment deadline passed. Status changed to Expire.' },
    ],
  },
];
