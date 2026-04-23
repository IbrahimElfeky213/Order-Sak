export type ResaleStatus = 
  | 'New Submission' 
  | 'Review in Progress' 
  | 'Awaiting Agreement' 
  | 'Publicly Listed' 
  | 'Declined' 
  | 'Withdrawn';

export interface ResaleHistoryItem {
  timestamp: string;
  action: string;
  actionBy: string;
  notes?: string;
}

export interface ResaleRequest {
  id: string;
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
  
  propertyName: string;
  projectName: string;
  projectId: string;
  propertyType: string;
  propertyUsage: string;
  city: string;
  facade: string;
  blockNumber: string;
  bedrooms: number;
  bathrooms: number;
  neighborhood: string;
  totalArea: number;
  additionalNotes?: string;
  propertyImages: string[];
  
  purchaseOrderId: string;
  purchaseDate: string;
  purchasePrice: number;
  originalPricePerMeter: number;
  purchaseOrderStatus: string;
  
  status: ResaleStatus;
  submittedDate: string;
  cmsPropertyId?: string;
  cmsPublishStatus: 'Draft' | 'Published';
  advertisingNumber?: string;
  brokerageAgreementNumber?: string;
  
  requestedSalePrice: number;
  commissionFee: number; // 2.5%
  rejectionReason?: string;
  cancellationReason?: string;
  
  deedType: string;
  deedNumber: string;
  ownerIdType: string;
  ownerNationalId: string;
  
  history: ResaleHistoryItem[];
}

export const mockResaleRequests: ResaleRequest[] = [
  {
    id: 'RSL-5001',
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
    
    propertyName: 'Villa A3',
    projectName: 'Al Yasmeen Residences',
    projectId: 'PRJ-001',
    propertyType: 'Villa',
    propertyUsage: 'Residential',
    city: 'Riyadh',
    facade: 'Western',
    blockNumber: '12',
    bedrooms: 5,
    bathrooms: 4,
    neighborhood: 'Al Yasmeen',
    totalArea: 350,
    additionalNotes: 'Prime location near the main park.',
    propertyImages: [
      'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
    ],
    
    purchaseOrderId: 'ORD-1008',
    purchaseDate: '2026-02-10',
    purchasePrice: 1650000,
    originalPricePerMeter: 4714.28,
    purchaseOrderStatus: 'Deed Transferred',
    
    status: 'New Submission',
    submittedDate: '2026-04-20 14:30',
    cmsPublishStatus: 'Draft',
    
    requestedSalePrice: 1850000,
    commissionFee: 46250,
    
    deedType: 'صك الكتروني من وزاره العدل',
    deedNumber: '9208347120',
    ownerIdType: 'هوية وطنية',
    ownerNationalId: '1087654321',
    
    history: [
      {
        timestamp: '2026-04-20 14:30',
        action: 'Request Submitted',
        actionBy: 'Customer',
        notes: 'Initial submission of resale request.'
      }
    ]
  },
  {
    id: 'RSL-5002',
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
    
    propertyName: 'Apartment B4',
    projectName: 'Olaya Towers',
    projectId: 'PRJ-002',
    propertyType: 'Apartment',
    propertyUsage: 'Residential',
    city: 'Riyadh',
    facade: 'Northern',
    blockNumber: 'A',
    bedrooms: 3,
    bathrooms: 2,
    neighborhood: 'Al Olaya',
    totalArea: 145,
    propertyImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
    ],
    
    purchaseOrderId: 'ORD-1002',
    purchaseDate: '2026-04-10',
    purchasePrice: 850000,
    originalPricePerMeter: 5862.06,
    purchaseOrderStatus: 'Deed Transferred',
    
    status: 'Review in Progress',
    submittedDate: '2026-04-15 09:15',
    cmsPublishStatus: 'Draft',
    
    requestedSalePrice: 950000,
    commissionFee: 23750,
    
    deedType: 'صك الكتروني من وزاره العدل',
    deedNumber: '8310928374',
    ownerIdType: 'هوية وطنية',
    ownerNationalId: '1098765432',
    
    history: [
      {
        timestamp: '2026-04-15 09:15',
        action: 'Request Submitted',
        actionBy: 'Customer'
      },
      {
        timestamp: '2026-04-16 11:00',
        action: 'Review Started',
        actionBy: 'Faisal Al-Otaibi',
        notes: 'Checking deed documentation.'
      }
    ]
  },
  {
    id: 'RSL-5003',
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
    
    propertyName: 'Townhouse C2',
    projectName: 'Riyadh Hills',
    projectId: 'PRJ-003',
    propertyType: 'Townhouse',
    propertyUsage: 'Residential',
    city: 'Riyadh',
    facade: 'Southern',
    blockNumber: 'C-Block',
    bedrooms: 4,
    bathrooms: 3,
    neighborhood: 'Al Malqa',
    totalArea: 220,
    propertyImages: [],
    
    purchaseOrderId: 'ORD-1003',
    purchaseDate: '2026-03-20',
    purchasePrice: 2200000,
    originalPricePerMeter: 10000,
    purchaseOrderStatus: 'Deed Transferred',
    
    status: 'Awaiting Agreement',
    submittedDate: '2026-04-10 10:00',
    cmsPublishStatus: 'Draft',
    
    requestedSalePrice: 2450000,
    commissionFee: 61250,
    
    deedType: 'صك الكتروني من وزاره العدل',
    deedNumber: '7102938475',
    ownerIdType: 'هوية وطنية',
    ownerNationalId: '1076543210',
    
    history: [
      {
        timestamp: '2026-04-10 10:00',
        action: 'Request Submitted',
        actionBy: 'Customer'
      },
      {
        timestamp: '2026-04-12 14:00',
        action: 'Approved',
        actionBy: 'Faisal Al-Otaibi',
        notes: 'Price and deed verified.'
      }
    ]
  },
  {
    id: 'RSL-5004',
    customerId: 'CST-3003',
    customerName: 'Noura Bader Al-Shehri',
    customerNationalId: '1065432109',
    customerUsername: '@noura_s',
    customerEmail: 'noura@email.com',
    customerPhone: '+966 50 555 1234',
    customerNationality: 'Saudi',
    customerGender: 'F',
    customerDob: '1990-06-18',
    customerVerified: true,
    
    propertyName: 'Villa D5',
    projectName: 'Al Yasmeen Residences',
    projectId: 'PRJ-001',
    propertyType: 'Villa',
    propertyUsage: 'Residential',
    city: 'Riyadh',
    facade: 'Eastern',
    blockNumber: '15',
    bedrooms: 5,
    bathrooms: 5,
    neighborhood: 'Al Yasmeen',
    totalArea: 320,
    propertyImages: [
      'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800'
    ],
    
    purchaseOrderId: 'ORD-1004',
    purchaseDate: '2026-01-05',
    purchasePrice: 1800000,
    originalPricePerMeter: 5625,
    purchaseOrderStatus: 'Deed Transferred',
    
    status: 'Publicly Listed',
    submittedDate: '2026-04-01 11:30',
    cmsPropertyId: 'CMS-PROP-8821',
    cmsPublishStatus: 'Published',
    advertisingNumber: 'AD-2026-001',
    brokerageAgreementNumber: 'AGR-77291',
    
    requestedSalePrice: 2000000,
    commissionFee: 50000,
    
    deedType: 'صك الكتروني من وزاره العدل',
    deedNumber: '6610293847',
    ownerIdType: 'هوية وطنية',
    ownerNationalId: '1065432109',
    
    history: [
      {
        timestamp: '2026-04-01 11:30',
        action: 'Request Submitted',
        actionBy: 'Customer'
      },
      {
        timestamp: '2026-04-03 10:00',
        action: 'Approved',
        actionBy: 'Admin'
      },
      {
        timestamp: '2026-04-05 15:30',
        action: 'Brokerage Agreement Linked',
        actionBy: 'Admin',
        notes: 'AGR-77291'
      },
      {
        timestamp: '2026-04-06 09:00',
        action: 'Published to Platform',
        actionBy: 'System'
      }
    ]
  }
];
