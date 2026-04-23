export type ProjectStatus = 'Available' | 'Coming Soon' | 'Sold Out' | 'On Hold';
export type UnitStatus    = 'Available' | 'Booked' | 'Sold' | 'Coming Soon' | 'Reserved';
export type UnitType      = 'Apartment' | 'Villa' | 'Townhouse' | 'Land' | 'Commercial' | 'Penthouse';

export interface Unit {
  id: string;
  block: string;
  type: UnitType;
  area: number;
  price: number;
  status: UnitStatus;
  orderId?: string;
  lastUpdated: string;
}

export interface ProjectOrder {
  id: string;
  buyerName: string;
  unit: string;
  status: string;
  bookingDate: string;
  totalAmount: number;
}

export interface SalesStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  unitsSold: number;
  commission: number;
  status: 'Active' | 'Inactive';
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'Brochure' | 'Floor Plan' | 'Master Plan' | 'Spec Sheet' | 'Legal' | 'Other';
  size: string;
  uploadedAt: string;
}

export interface MonthlySale {
  month: string;
  units: number;
  revenue: number;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  city: string;
  address: string;
  description: string;
  developer: string;
  developerId: string;
  launchDate: string;
  completionDate: string;
  phase: string;
  totalUnits: number;
  availableUnits: number;
  bookedUnits: number;
  soldUnits: number;
  comingSoonUnits: number;
  totalRevenue: number;
  totalBookings: number;
  avgUnitPrice: number;
  highestPrice: number;
  lowestPrice: number;
  salesVelocity: number;
  units: Unit[];
  orders: ProjectOrder[];
  salesTeam: SalesStaff[];
  documents: ProjectDocument[];
  monthlySales: MonthlySale[];
  images: string[];
}

/* ── helpers ── */
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const UNITS_A: Unit[] = [
  { id: 'PRP-301', block: 'B-12', type: 'Villa',     area: 280, price: 1500000, status: 'Booked',    orderId: 'ORD-1001', lastUpdated: '2026-04-15' },
  { id: 'PRP-302', block: 'B-13', type: 'Villa',     area: 310, price: 1700000, status: 'Sold',      orderId: 'ORD-1004', lastUpdated: '2026-01-05' },
  { id: 'PRP-303', block: 'C-01', type: 'Villa',     area: 260, price: 1350000, status: 'Available', lastUpdated: '2026-03-01' },
  { id: 'PRP-304', block: 'C-02', type: 'Villa',     area: 295, price: 1480000, status: 'Available', lastUpdated: '2026-03-01' },
  { id: 'PRP-305', block: 'D-01', type: 'Villa',     area: 320, price: 1800000, status: 'Sold',                            lastUpdated: '2026-01-05' },
  { id: 'PRP-306', block: 'D-02', type: 'Villa',     area: 340, price: 1950000, status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-307', block: 'A-01', type: 'Apartment', area: 130, price: 650000,  status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-308', block: 'A-02', type: 'Apartment', area: 145, price: 720000,  status: 'Booked',    lastUpdated: '2026-04-10' },
  { id: 'PRP-309', block: 'A-03', type: 'Apartment', area: 110, price: 580000,  status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-310', block: 'A-04', type: 'Apartment', area: 155, price: 780000,  status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-311', block: 'E-01', type: 'Penthouse', area: 420, price: 3200000, status: 'Available', lastUpdated: '2026-02-01' },
  { id: 'PRP-312', block: 'E-02', type: 'Penthouse', area: 450, price: 3600000, status: 'Available', lastUpdated: '2026-02-01' },
];

const UNITS_B: Unit[] = [
  { id: 'PRP-401', block: 'A-01', type: 'Apartment', area: 120, price: 750000,  status: 'Sold',    orderId: 'ORD-1005', lastUpdated: '2026-04-12' },
  { id: 'PRP-402', block: 'A-02', type: 'Apartment', area: 135, price: 840000,  status: 'Sold',                          lastUpdated: '2026-03-01' },
  { id: 'PRP-403', block: 'A-03', type: 'Apartment', area: 145, price: 900000,  status: 'Booked',  orderId: 'ORD-1002',  lastUpdated: '2026-04-10' },
  { id: 'PRP-404', block: 'A-04', type: 'Apartment', area: 160, price: 960000,  status: 'Sold',                           lastUpdated: '2026-02-15' },
  { id: 'PRP-405', block: 'B-01', type: 'Apartment', area: 115, price: 720000,  status: 'Sold',                           lastUpdated: '2026-01-10' },
  { id: 'PRP-406', block: 'B-02', type: 'Apartment', area: 125, price: 780000,  status: 'Sold',                           lastUpdated: '2026-01-10' },
  { id: 'PRP-407', block: 'B-03', type: 'Penthouse', area: 320, price: 2400000, status: 'Sold',                           lastUpdated: '2025-12-01' },
  { id: 'PRP-408', block: 'B-04', type: 'Penthouse', area: 350, price: 2700000, status: 'Sold',                           lastUpdated: '2025-12-01' },
];

const UNITS_C: Unit[] = [
  { id: 'PRP-501', block: 'Z-01', type: 'Apartment',  area: 90,  price: 400000,  status: 'Coming Soon', lastUpdated: '2026-04-01' },
  { id: 'PRP-502', block: 'Z-01', type: 'Apartment',  area: 105, price: 460000,  status: 'Coming Soon', lastUpdated: '2026-04-01' },
  { id: 'PRP-503', block: 'Z-02', type: 'Villa',      area: 240, price: 1100000, status: 'Coming Soon', lastUpdated: '2026-04-01' },
  { id: 'PRP-504', block: 'Z-02', type: 'Villa',      area: 260, price: 1200000, status: 'Coming Soon', lastUpdated: '2026-04-01' },
  { id: 'PRP-505', block: 'Z-03', type: 'Commercial', area: 180, price: 900000,  status: 'Coming Soon', lastUpdated: '2026-04-01' },
];

const UNITS_D: Unit[] = [
  { id: 'PRP-601', block: 'D-01', type: 'Townhouse', area: 200, price: 1100000, status: 'Sold',      orderId: 'ORD-1003', lastUpdated: '2026-03-20' },
  { id: 'PRP-602', block: 'D-02', type: 'Townhouse', area: 215, price: 1190000, status: 'Sold',                           lastUpdated: '2026-03-01' },
  { id: 'PRP-603', block: 'D-03', type: 'Townhouse', area: 210, price: 1150000, status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-604', block: 'E-01', type: 'Villa',     area: 300, price: 1700000, status: 'Booked',    lastUpdated: '2026-04-15' },
  { id: 'PRP-605', block: 'E-02', type: 'Villa',     area: 320, price: 1850000, status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-606', block: 'F-01', type: 'Land',      area: 600, price: 580000,  status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-607', block: 'F-02', type: 'Land',      area: 550, price: 530000,  status: 'Available', lastUpdated: '2026-04-01' },
  { id: 'PRP-608', block: 'F-03', type: 'Land',      area: 620, price: 600000,  status: 'Sold',                           lastUpdated: '2026-02-10' },
];

const MONTHLY_A: MonthlySale[] = [
  { month: 'Nov 2025', units: 3, revenue: 4500000 }, { month: 'Dec 2025', units: 5, revenue: 7000000 },
  { month: 'Jan 2026', units: 4, revenue: 5500000 }, { month: 'Feb 2026', units: 6, revenue: 8200000 },
  { month: 'Mar 2026', units: 2, revenue: 3100000 }, { month: 'Apr 2026', units: 3, revenue: 4800000 },
];
const MONTHLY_B: MonthlySale[] = [
  { month: 'Aug 2025', units: 8, revenue: 6200000 }, { month: 'Sep 2025', units: 12, revenue: 9400000 },
  { month: 'Oct 2025', units: 10, revenue: 8100000 }, { month: 'Nov 2025', units: 15, revenue: 11500000 },
  { month: 'Dec 2025', units: 5, revenue: 4200000 },
];
const MONTHLY_D: MonthlySale[] = [
  { month: 'Jan 2026', units: 2, revenue: 2300000 }, { month: 'Feb 2026', units: 3, revenue: 3400000 },
  { month: 'Mar 2026', units: 4, revenue: 4600000 }, { month: 'Apr 2026', units: 2, revenue: 2200000 },
];

const DOCS_A: ProjectDocument[] = [
  { id: 'D001', name: 'Al Yasmeen Brochure 2026.pdf',      type: 'Brochure',     size: '8.4 MB',  uploadedAt: '2026-01-10' },
  { id: 'D002', name: 'Villa Floor Plans.pdf',              type: 'Floor Plan',   size: '12.1 MB', uploadedAt: '2026-01-10' },
  { id: 'D003', name: 'Master Site Plan.pdf',               type: 'Master Plan',  size: '5.2 MB',  uploadedAt: '2026-01-12' },
  { id: 'D004', name: 'Material Spec Sheet.pdf',            type: 'Spec Sheet',   size: '3.8 MB',  uploadedAt: '2026-02-01' },
  { id: 'D005', name: 'Ownership Contract Template.docx',   type: 'Legal',        size: '1.1 MB',  uploadedAt: '2026-02-15' },
];
const DOCS_B: ProjectDocument[] = [
  { id: 'D006', name: 'Olaya Towers Brochure.pdf',          type: 'Brochure',     size: '6.2 MB',  uploadedAt: '2025-09-01' },
  { id: 'D007', name: 'Apartment Floor Plans.pdf',          type: 'Floor Plan',   size: '9.8 MB',  uploadedAt: '2025-09-01' },
  { id: 'D008', name: 'Completion Certificate.pdf',         type: 'Legal',        size: '0.9 MB',  uploadedAt: '2026-02-20' },
];
const DOCS_D: ProjectDocument[] = [
  { id: 'D009', name: 'Riyadh Hills Master Plan.pdf',       type: 'Master Plan',  size: '7.3 MB',  uploadedAt: '2026-01-05' },
  { id: 'D010', name: 'Townhouse Floor Plans.pdf',          type: 'Floor Plan',   size: '10.4 MB', uploadedAt: '2026-01-05' },
  { id: 'D011', name: 'Phase 1 Brochure.pdf',               type: 'Brochure',     size: '5.5 MB',  uploadedAt: '2026-01-10' },
];

const TEAM_A: SalesStaff[] = [
  { id: 'ST001', name: 'Ahmed Al-Rashid',   email: 'ahmed@sak.sa',    phone: '+966 55 100 1001', role: 'Sales Manager',   unitsSold: 8,  commission: 240000, status: 'Active' },
  { id: 'ST002', name: 'Layla Al-Nasser',   email: 'layla@sak.sa',    phone: '+966 55 200 2002', role: 'Sales Agent',     unitsSold: 5,  commission: 125000, status: 'Active' },
  { id: 'ST003', name: 'Omar Al-Shammari',  email: 'omar@sak.sa',     phone: '+966 55 300 3003', role: 'Sales Agent',     unitsSold: 3,  commission:  72000, status: 'Active' },
];
const TEAM_B: SalesStaff[] = [
  { id: 'ST004', name: 'Hana Al-Mutairi',   email: 'hana@sak.sa',     phone: '+966 55 400 4004', role: 'Sales Manager',   unitsSold: 22, commission: 580000, status: 'Active' },
  { id: 'ST005', name: 'Kareem Al-Zahrani', email: 'kareem@sak.sa',   phone: '+966 55 500 5005', role: 'Sales Agent',     unitsSold: 18, commission: 430000, status: 'Inactive' },
  { id: 'ST006', name: 'Nora Al-Dossari',   email: 'nora@sak.sa',     phone: '+966 55 600 6006', role: 'Senior Agent',    unitsSold: 10, commission: 260000, status: 'Active' },
];
const TEAM_D: SalesStaff[] = [
  { id: 'ST007', name: 'Faris Al-Otaibi',   email: 'faris@sak.sa',    phone: '+966 55 700 7007', role: 'Sales Manager',   unitsSold: 4,  commission: 110000, status: 'Active' },
  { id: 'ST008', name: 'Sana Al-Harbi',     email: 'sana@sak.sa',     phone: '+966 55 800 8008', role: 'Sales Agent',     unitsSold: 2,  commission:  55000, status: 'Active' },
];

export const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Al Yasmeen Residences',
    status: 'Available',
    city: 'Riyadh',
    address: 'Al Yasmeen District, King Salman Road, Riyadh 13325',
    description: 'A premium mixed-use residential development featuring villas, apartments, and penthouses in the heart of Al Yasmeen district. Designed with families in mind, offering green spaces, a community club, retail amenities, and 24/7 security.',
    developer: 'Al Madar Real Estate',
    developerId: 'DEV-001',
    launchDate: '2025-11-01',
    completionDate: '2027-06-30',
    phase: 'Phase 1 – Structural',
    totalUnits: 120,
    availableUnits: 45,
    bookedUnits: 15,
    soldUnits: 58,
    comingSoonUnits: 2,
    totalRevenue: 87000000,
    totalBookings: 18750000,
    avgUnitPrice: 1328000,
    highestPrice: 3600000,
    lowestPrice: 580000,
    salesVelocity: 3.8,
    units: UNITS_A,
    orders: [
      { id: 'ORD-1001', buyerName: 'Mohammed Ahmed',  unit: 'Villa A1 (PRP-301)', status: 'Prebook',      bookingDate: '2026-04-15', totalAmount: 1450000 },
      { id: 'ORD-1004', buyerName: 'Noura Al-Shehri', unit: 'Villa D5 (PRP-305)', status: 'Deed Transferred', bookingDate: '2026-01-05', totalAmount: 1800000 },
    ],
    salesTeam: TEAM_A,
    documents: DOCS_A,
    monthlySales: MONTHLY_A,
    images: [],
  },
  {
    id: 'PRJ-002',
    name: 'Olaya Towers',
    status: 'Sold Out',
    city: 'Riyadh',
    address: 'Olaya Street, Al Olaya District, Riyadh 12244',
    description: 'A landmark high-rise development of luxury apartments and penthouses in the prestigious Olaya district. All units have been sold. The project is now 100% occupied and managed.',
    developer: 'Tameer Development Co.',
    developerId: 'DEV-002',
    launchDate: '2025-08-15',
    completionDate: '2026-02-28',
    phase: 'Completed',
    totalUnits: 50,
    availableUnits: 0,
    bookedUnits: 0,
    soldUnits: 50,
    comingSoonUnits: 0,
    totalRevenue: 102000000,
    totalBookings: 0,
    avgUnitPrice: 1650000,
    highestPrice: 2700000,
    lowestPrice: 720000,
    salesVelocity: 10,
    units: UNITS_B,
    orders: [
      { id: 'ORD-1002', buyerName: 'Sarah Al-Qahtani',  unit: 'Apartment B4 (PRP-403)', status: 'Deposit Paid',  bookingDate: '2026-04-10', totalAmount: 800000 },
      { id: 'ORD-1005', buyerName: 'Khalid Al-Ghamdi',  unit: 'Apartment A10 (PRP-401)', status: 'Expire',       bookingDate: '2026-04-12', totalAmount: 920000 },
    ],
    salesTeam: TEAM_B,
    documents: DOCS_B,
    monthlySales: MONTHLY_B,
    images: [],
  },
  {
    id: 'PRJ-003',
    name: 'Jeddah Seafront Living',
    status: 'Coming Soon',
    city: 'Jeddah',
    address: 'North Corniche, Al Shati District, Jeddah 23514',
    description: 'A breathtaking waterfront collection of apartments and villas along the Red Sea in Jeddah. Set to launch Q3 2026, this development will redefine coastal living with private beach access, infinity pools, and panoramic ocean views.',
    developer: 'Coastal Properties Group',
    developerId: 'DEV-003',
    launchDate: '2026-09-01',
    completionDate: '2029-12-31',
    phase: 'Pre-Launch',
    totalUnits: 200,
    availableUnits: 0,
    bookedUnits: 0,
    soldUnits: 0,
    comingSoonUnits: 200,
    totalRevenue: 0,
    totalBookings: 0,
    avgUnitPrice: 1860000,
    highestPrice: 5200000,
    lowestPrice: 400000,
    salesVelocity: 0,
    units: UNITS_C,
    orders: [],
    salesTeam: [],
    documents: [],
    monthlySales: [],
    images: [],
  },
  {
    id: 'PRJ-004',
    name: 'Riyadh Hills',
    status: 'Available',
    city: 'Riyadh',
    address: 'Al Malqa District, Northern Ring Road, Riyadh 13523',
    description: 'An expansive gated community in north Riyadh featuring townhouses, villas, and land plots. Phase 1 is now complete with delivery underway. Phase 2 launches Q2 2026.',
    developer: 'Burooj Development',
    developerId: 'DEV-004',
    launchDate: '2026-01-01',
    completionDate: '2028-03-31',
    phase: 'Phase 2 – Foundations',
    totalUnits: 85,
    availableUnits: 40,
    bookedUnits: 8,
    soldUnits: 30,
    comingSoonUnits: 7,
    totalRevenue: 38700000,
    totalBookings: 10500000,
    avgUnitPrice: 1210000,
    highestPrice: 1850000,
    lowestPrice: 530000,
    salesVelocity: 2.8,
    units: UNITS_D,
    orders: [
      { id: 'ORD-1003', buyerName: 'Fahad Al-Dosari', unit: 'Townhouse C2 (PRP-601)', status: 'Installment Paid', bookingDate: '2026-03-20', totalAmount: 2200000 },
    ],
    salesTeam: TEAM_D,
    documents: DOCS_D,
    monthlySales: MONTHLY_D,
    images: [],
  },
];
