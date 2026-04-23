export interface CustomerOrder {
  id: string;
  propertyName: string;
  projectName: string;
  status: string;
  totalAmount: number;
  depositPaid: number;
  bookingDate: string;
  paymentOption: string;
}

export interface OwnedProperty {
  propertyName: string;
  projectName: string;
  unitType: string;
  area: number;
  purchasePrice: number;
  deedTransferDate: string;
  orderId: string;
}

export interface ResaleRequest {
  id: string;
  propertyName: string;
  projectName: string;
  status: 'New' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  salePrice: number;
  commissionFee: number;
  submittedDate: string;
}

export interface CustomerVoucher {
  code: string;
  type: 'Percentage' | 'Amount';
  value: number;
  projectName: string;
  propertyName: string;
  isUsed: boolean;
  usageDate?: string;
  expiryDate: string;
}

export interface InteractionEvent {
  timestamp: string;
  eventType:
    | 'Account Created'
    | 'Order Placed'
    | 'Payment Made'
    | 'Order Status Changed'
    | 'Voucher Assigned'
    | 'Deed Transferred'
    | 'Resale Request Submitted'
    | 'Resale Request Approved'
    | 'Resale Request Rejected'
    | 'Co-Broker Interest Linked';
  description: string;
  relatedEntityId?: string;
  relatedEntityLabel?: string;
  actionBy: string;
}

export interface Customer {
  id: string;
  fullName: string;
  username: string;
  nationalId: string;
  phone: string;
  email: string;
  nationality: string;
  gender: 'M' | 'F';
  dob: string;
  registrationDate: string;
  verified: boolean;
  orders: CustomerOrder[];
  ownedProperties: OwnedProperty[];
  resaleRequests: ResaleRequest[];
  vouchers: CustomerVoucher[];
  interactionHistory: InteractionEvent[];
}

export const mockCustomers: Customer[] = [
  {
    id: 'CST-3001',
    fullName: 'Mohammed Ahmed Al-Rashidi',
    username: '@mohammed_a',
    nationalId: '1087654321',
    phone: '+966 55 987 6543',
    email: 'mohammed@email.com',
    nationality: 'Saudi',
    gender: 'M',
    dob: '1988-03-22',
    registrationDate: '2025-09-10',
    verified: true,
    orders: [
      {
        id: 'ORD-1001',
        propertyName: 'Villa A1',
        projectName: 'Al Yasmeen Residences',
        status: 'Prebook',
        totalAmount: 1500000,
        depositPaid: 0,
        bookingDate: '2026-04-15',
        paymentOption: 'Bank Transfer',
      },
      {
        id: 'ORD-1008',
        propertyName: 'Villa A3',
        projectName: 'Al Yasmeen Residences',
        status: 'Deposit Paid',
        totalAmount: 1650000,
        depositPaid: 82500,
        bookingDate: '2026-02-10',
        paymentOption: 'Cash',
      },
    ],
    ownedProperties: [],
    resaleRequests: [],
    vouchers: [
      {
        code: 'SAK-DISC-100',
        type: 'Amount',
        value: 50000,
        projectName: 'Al Yasmeen Residences',
        propertyName: 'Villa A1',
        isUsed: true,
        usageDate: '2026-04-15',
        expiryDate: '2026-06-30',
      },
    ],
    interactionHistory: [
      {
        timestamp: '2025-09-10 09:00',
        eventType: 'Account Created',
        description: 'Customer account registered via the Sak portal.',
        actionBy: 'System',
      },
      {
        timestamp: '2026-02-10 11:30',
        eventType: 'Order Placed',
        description: 'Order placed for Villa A3 in Al Yasmeen Residences.',
        relatedEntityId: 'ORD-1008',
        relatedEntityLabel: 'ORD-1008',
        actionBy: 'System',
      },
      {
        timestamp: '2026-04-14 14:00',
        eventType: 'Voucher Assigned',
        description: 'Discount voucher SAK-DISC-100 (SAR 50,000) assigned.',
        actionBy: 'Faisal Al-Otaibi',
      },
      {
        timestamp: '2026-04-15 10:00',
        eventType: 'Order Placed',
        description: 'New prebook order placed for Villa A1.',
        relatedEntityId: 'ORD-1001',
        relatedEntityLabel: 'ORD-1001',
        actionBy: 'System',
      },
    ],
  },
  {
    id: 'CST-3002',
    fullName: 'Sarah Norah Al-Qahtani',
    username: '@sarah_q',
    nationalId: '1098765432',
    phone: '+966 50 123 4567',
    email: 'sarah@example.com',
    nationality: 'Saudi',
    gender: 'F',
    dob: '1992-08-15',
    registrationDate: '2025-10-22',
    verified: true,
    orders: [
      {
        id: 'ORD-1002',
        propertyName: 'Apartment B4',
        projectName: 'Olaya Towers',
        status: 'Deposit Paid',
        totalAmount: 850000,
        depositPaid: 50000,
        bookingDate: '2026-04-10',
        paymentOption: 'Bank Transfer',
      },
    ],
    ownedProperties: [],
    resaleRequests: [
      {
        id: 'RSL-2001',
        propertyName: 'Apartment B4',
        projectName: 'Olaya Towers',
        status: 'Pending',
        salePrice: 900000,
        commissionFee: 18000,
        submittedDate: '2026-04-18',
      },
    ],
    vouchers: [],
    interactionHistory: [
      {
        timestamp: '2025-10-22 08:30',
        eventType: 'Account Created',
        description: 'Customer account registered via the Sak portal.',
        actionBy: 'System',
      },
      {
        timestamp: '2026-04-10 14:30',
        eventType: 'Order Placed',
        description: 'Order placed for Apartment B4 in Olaya Towers.',
        relatedEntityId: 'ORD-1002',
        relatedEntityLabel: 'ORD-1002',
        actionBy: 'System',
      },
      {
        timestamp: '2026-04-10 14:30',
        eventType: 'Payment Made',
        description: 'Deposit of SAR 50,000 received via Bank Transfer.',
        relatedEntityId: 'ORD-1002',
        relatedEntityLabel: 'ORD-1002',
        actionBy: 'System',
      },
      {
        timestamp: '2026-04-18 09:00',
        eventType: 'Resale Request Submitted',
        description: 'Resale request submitted for Apartment B4.',
        relatedEntityId: 'RSL-2001',
        relatedEntityLabel: 'RSL-2001',
        actionBy: 'System',
      },
    ],
  },
  {
    id: 'CST-3003',
    fullName: 'Noura Bader Al-Shehri',
    username: '@noura_s',
    nationalId: '1065432109',
    phone: '+966 50 555 1234',
    email: 'noura@email.com',
    nationality: 'Saudi',
    gender: 'F',
    dob: '1990-06-18',
    registrationDate: '2025-08-05',
    verified: true,
    orders: [
      {
        id: 'ORD-1004',
        propertyName: 'Villa D5',
        projectName: 'Al Yasmeen Residences',
        status: 'Deed Transferred',
        totalAmount: 1800000,
        depositPaid: 90000,
        bookingDate: '2026-01-05',
        paymentOption: 'Cash',
      },
    ],
    ownedProperties: [
      {
        propertyName: 'Villa D5',
        projectName: 'Al Yasmeen Residences',
        unitType: 'Villa',
        area: 320,
        purchasePrice: 1800000,
        deedTransferDate: '2026-07-10',
        orderId: 'ORD-1004',
      },
    ],
    resaleRequests: [],
    vouchers: [
      {
        code: 'SAK-VIP-VL',
        type: 'Percentage',
        value: 3,
        projectName: 'Al Yasmeen Residences',
        propertyName: 'Villa D5',
        isUsed: true,
        usageDate: '2026-01-05',
        expiryDate: '2026-03-31',
      },
    ],
    interactionHistory: [
      {
        timestamp: '2025-08-05 10:00',
        eventType: 'Account Created',
        description: 'Customer account registered.',
        actionBy: 'System',
      },
      {
        timestamp: '2026-01-05 09:00',
        eventType: 'Order Placed',
        description: 'Order placed for Villa D5.',
        relatedEntityId: 'ORD-1004',
        relatedEntityLabel: 'ORD-1004',
        actionBy: 'System',
      },
      {
        timestamp: '2026-07-10 10:00',
        eventType: 'Deed Transferred',
        description: 'Property deed for Villa D5 successfully transferred.',
        relatedEntityId: 'ORD-1004',
        relatedEntityLabel: 'ORD-1004',
        actionBy: 'Faisal Al-Otaibi',
      },
    ],
  },
  {
    id: 'CST-3004',
    fullName: 'Fahad Sami Al-Dosari',
    username: '@fahad_d',
    nationalId: '1076543210',
    phone: '+966 54 222 3344',
    email: 'fahad@email.com',
    nationality: 'Saudi',
    gender: 'M',
    dob: '1985-11-02',
    registrationDate: '2025-07-14',
    verified: true,
    orders: [
      {
        id: 'ORD-1003',
        propertyName: 'Townhouse C2',
        projectName: 'Riyadh Hills',
        status: 'Installment Paid',
        totalAmount: 2200000,
        depositPaid: 110000,
        bookingDate: '2026-03-20',
        paymentOption: 'SADAD',
      },
    ],
    ownedProperties: [],
    resaleRequests: [],
    vouchers: [],
    interactionHistory: [
      {
        timestamp: '2025-07-14 11:00',
        eventType: 'Account Created',
        description: 'Customer account registered.',
        actionBy: 'System',
      },
      {
        timestamp: '2026-03-20 09:15',
        eventType: 'Order Placed',
        description: 'Order placed for Townhouse C2 in Riyadh Hills.',
        relatedEntityId: 'ORD-1003',
        relatedEntityLabel: 'ORD-1003',
        actionBy: 'System',
      },
    ],
  },
  {
    id: 'CST-3005',
    fullName: 'Khalid Omar Al-Ghamdi',
    username: '@khalid_g',
    nationalId: '1054321098',
    phone: '+966 53 777 8899',
    email: 'khalid@email.com',
    nationality: 'Saudi',
    gender: 'M',
    dob: '1995-01-30',
    registrationDate: '2026-01-15',
    verified: false,
    orders: [],
    ownedProperties: [],
    resaleRequests: [],
    vouchers: [],
    interactionHistory: [
      {
        timestamp: '2026-01-15 14:00',
        eventType: 'Account Created',
        description: 'Customer account registered.',
        actionBy: 'System',
      },
    ],
  },
];
