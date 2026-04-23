export type JoinRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Inactive';
export type BrokerStatus = 'Active' | 'Inactive' | 'Pending';
export type InterestStatus = 'Active' | 'Expired';
export type CommissionStatus = 'Expected' | 'Due' | 'Transferred';

export interface JoinRequestLog {
  timestamp: string;
  action: string;
  actionBy: string;
  notes?: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  licenseNumber: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  nationality: string;
  nationalId: string;
  gender: 'M' | 'F';
  dob: string;
  submittedDate: string;
  status: JoinRequestStatus;
  verified: boolean;
  historyLogs: JoinRequestLog[];
}

export interface BrokerDocument {
  id: string;
  name: string;
  type: 'License' | 'ID' | 'Bank' | 'Other';
  uploadedAt: string;
  url: string;
}

export interface CommissionTransfer {
  id: string;
  date: string;
  amount: number;
  transferredBy: string;
  status: 'Completed' | 'Pending';
  relatedInterests: string[];
}

export interface ActiveBroker {
  id: string;
  requestId: string;
  userId: string;
  licenseNumber: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  nationality: string;
  nationalId: string;
  gender: 'M' | 'F';
  dob: string;
  verified: boolean;
  status: BrokerStatus;
  createdDate: string;
  lastActivityDate: string;
  submittedDate: string;
  approvalDate: string;
  requestStatus: JoinRequestStatus;
  historyLogs: JoinRequestLog[];
  documents: BrokerDocument[];
  totalExpectedCommission: number;
  totalDueCommission: number;
  totalTransferredCommission: number;
  transfers: CommissionTransfer[];
}

export interface LinkedProperty {
  id: string;
  name: string;
  type: string;
  status: 'Available' | 'Booked' | 'Sold';
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
}

export interface InterestOrder {
  id: string;
  propertyName: string;
  bookingDate: string;
  status: string;
  commissionAmount: number;
  commissionStatus: CommissionStatus;
  transferredAt?: string;
}

export interface BrokerInterest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientNationalId?: string;
  brokerId: string;
  brokerName: string;
  brokerLicense: string;
  brokerPhone: string;
  projectId: string;
  projectName: string;
  propertyType: string;
  commissionPerProperty: number;
  status: InterestStatus;
  createdDate: string;
  expiryDate: string;
  brokerRegisteredOn: string;
  linkedProperties: LinkedProperty[];
  purchaseOrders: InterestOrder[];
}

export interface CoBrokerData {
  joinRequests: JoinRequest[];
  activeBrokers: ActiveBroker[];
  interests: BrokerInterest[];
}

const mockJoinRequests: JoinRequest[] = [
  {
    id: 'REQ-1001',
    userId: 'USR-8821',
    licenseNumber: 'FAL-123456',
    name: 'Abdullah Al-Fahad',
    username: '@abdullah_f',
    phone: '+966 50 111 2222',
    email: 'abdullah.f@example.com',
    nationality: 'Saudi',
    nationalId: '1098765432',
    gender: 'M',
    dob: '1985-06-15',
    submittedDate: '2026-04-18',
    status: 'Pending',
    verified: true,
    historyLogs: [
      { timestamp: '2026-04-18 10:30', action: 'Applied', actionBy: 'System', notes: 'Application submitted via portal.' }
    ]
  },
  {
    id: 'REQ-1002',
    userId: 'USR-8825',
    licenseNumber: 'FAL-654321',
    name: 'Sara Al-Otaibi',
    username: '@sara_o',
    phone: '+966 55 333 4444',
    email: 'sara.o@example.com',
    nationality: 'Saudi',
    nationalId: '1087654321',
    gender: 'F',
    dob: '1990-11-20',
    submittedDate: '2026-04-15',
    status: 'Rejected',
    verified: false,
    historyLogs: [
      { timestamp: '2026-04-15 09:00', action: 'Applied', actionBy: 'System', notes: 'Application submitted via portal.' },
      { timestamp: '2026-04-16 11:20', action: 'Rejected', actionBy: 'Faisal Al-Otaibi', notes: 'License number invalid.' }
    ]
  }
];

const mockActiveBrokers: ActiveBroker[] = [
  {
    id: 'BRK-5001',
    requestId: 'REQ-0950',
    userId: 'USR-7710',
    licenseNumber: 'FAL-998877',
    name: 'Waqar Real Estate',
    username: '@waqar_re',
    phone: '+966 54 999 8888',
    email: 'info@waqar-re.sa',
    nationality: 'Saudi',
    nationalId: '1055555555',
    gender: 'M',
    dob: '1980-01-01',
    verified: true,
    status: 'Active',
    createdDate: '2025-10-01',
    lastActivityDate: '2026-04-20',
    submittedDate: '2025-09-25',
    approvalDate: '2025-10-01',
    requestStatus: 'Approved',
    historyLogs: [
      { timestamp: '2025-09-25 14:00', action: 'Applied', actionBy: 'System' },
      { timestamp: '2025-10-01 10:00', action: 'Approved', actionBy: 'Admin Team' }
    ],
    documents: [
      { id: 'DOC-B1', name: 'Broker_License.pdf', type: 'License', uploadedAt: '2025-09-25', url: '#' },
      { id: 'DOC-B2', name: 'National_ID.pdf', type: 'ID', uploadedAt: '2025-09-25', url: '#' }
    ],
    totalExpectedCommission: 150000,
    totalDueCommission: 50000,
    totalTransferredCommission: 300000,
    transfers: [
      { id: 'TRF-1001', date: '2026-01-15', amount: 150000, transferredBy: 'Finance Dept', status: 'Completed', relatedInterests: ['INT-2001', 'INT-2002'] },
      { id: 'TRF-1055', date: '2026-03-20', amount: 150000, transferredBy: 'Finance Dept', status: 'Completed', relatedInterests: ['INT-2010'] }
    ]
  }
];

const mockInterests: BrokerInterest[] = [
  {
    id: 'INT-3001',
    clientName: 'Khalid Al-Ghamdi',
    clientPhone: '+966 53 777 8899',
    clientEmail: 'khalid@example.com',
    clientNationalId: '1054321098',
    brokerId: 'BRK-5001',
    brokerName: 'Waqar Real Estate',
    brokerLicense: 'FAL-998877',
    brokerPhone: '+966 54 999 8888',
    projectId: 'PRJ-002',
    projectName: 'Olaya Towers',
    propertyType: 'Apartment',
    commissionPerProperty: 25000,
    status: 'Active',
    createdDate: '2026-04-10',
    expiryDate: '2026-05-10',
    brokerRegisteredOn: '2026-04-10',
    linkedProperties: [
      { id: 'PRP-410', name: 'Apartment A10', type: 'Apartment', status: 'Available', price: 920000, area: 120, bedrooms: 2, bathrooms: 2 }
    ],
    purchaseOrders: [
      { id: 'ORD-1005', propertyName: 'Apartment A10', bookingDate: '2026-04-12', status: 'Exclude', commissionAmount: 25000, commissionStatus: 'Expected' }
    ]
  },
  {
    id: 'INT-3002',
    clientName: 'Nawal Al-Zahrani',
    clientPhone: '+966 50 123 9876',
    brokerId: 'BRK-5001',
    brokerName: 'Waqar Real Estate',
    brokerLicense: 'FAL-998877',
    brokerPhone: '+966 54 999 8888',
    projectId: 'PRJ-001',
    projectName: 'Al Yasmeen Residences',
    propertyType: 'Villa',
    commissionPerProperty: 50000,
    status: 'Expired',
    createdDate: '2026-01-10',
    expiryDate: '2026-02-10',
    brokerRegisteredOn: '2026-01-10',
    linkedProperties: [
      { id: 'PRP-302', name: 'Villa B-13', type: 'Villa', status: 'Sold', price: 1700000, area: 310, bedrooms: 4, bathrooms: 5 }
    ],
    purchaseOrders: []
  }
];

export const mockCoBrokerData: CoBrokerData = {
  joinRequests: mockJoinRequests,
  activeBrokers: mockActiveBrokers,
  interests: mockInterests
};
