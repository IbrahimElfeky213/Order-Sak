import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ChevronLeft, Info, CalendarClock, Building, ArrowRight, UserCircle2 } from 'lucide-react';
import { BrokerInterest, InterestStatus, CommissionStatus } from '../../data/coBrokerStore';

const STATUS_BADGE: Record<InterestStatus, 'success' | 'destructive'> = {
  'Active': 'success',
  'Expired': 'destructive'
};
const COMM_BADGE: Record<CommissionStatus, 'warning' | 'default' | 'success'> = {
  'Expected': 'warning',
  'Due': 'default',
  'Transferred': 'success'
};

export default function InterestDetail({ 
  interest, onBack, onBrokerClick, onProjectClick, onOrderClick 
}: { 
  interest: BrokerInterest, 
  onBack: () => void,
  onBrokerClick: (id: string) => void,
  onProjectClick: (id: string) => void,
  onOrderClick: (id: string) => void
}) {
  if (!interest) return null;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors mb-2">
          <ChevronLeft size={13} /> Back to Co-Broker Management
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Interest Detail</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Panel - 30% */}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <div className="p-4 border-b bg-gray-50/50 flex items-center gap-2">
               <UserCircle2 className="text-gray-400" size={16}/>
               <h3 className="text-sm font-bold text-gray-700">Client Information</h3>
            </div>
            <CardContent className="p-5">
               <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                 {interest.clientName.substring(0,2).toUpperCase()}
               </div>
               <h2 className="text-lg font-bold text-gray-900">{interest.clientName}</h2>
               <p className="text-sm text-gray-500 mb-6">{interest.clientPhone}</p>
               
               <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                     <span className="text-xs text-gray-400 uppercase">Email</span>
                     <span className="text-sm font-medium">{interest.clientEmail || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                     <span className="text-xs text-gray-400 uppercase">National ID</span>
                     <span className="text-sm font-medium font-mono">{interest.clientNationalId || 'N/A'}</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card>
            <div className="p-4 border-b bg-gray-50/50 flex items-center gap-2">
               <Info className="text-gray-400" size={16}/>
               <h3 className="text-sm font-bold text-gray-700">Broker Information</h3>
            </div>
            <CardContent className="p-5 space-y-3">
               <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Broker Name</p>
                  <button onClick={() => onBrokerClick(interest.brokerId)} className="text-sm font-bold text-brand hover:underline flex items-center gap-1">
                     {interest.brokerName} <ArrowRight size={12}/>
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                     <p className="text-xs text-gray-400 uppercase mb-1">License</p>
                     <p className="font-mono text-sm">{interest.brokerLicense}</p>
                  </div>
                  <div>
                     <p className="text-xs text-gray-400 uppercase mb-1">Phone</p>
                     <p className="text-sm">{interest.brokerPhone}</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - 70% */}
        <div className="md:col-span-8 space-y-4">
          <Card>
             <CardContent className="p-0 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x border-b">
                <div className="p-4">
                  <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-2">Request ID</p>
                  <p className="font-mono font-bold text-gray-900">{interest.id}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-2">Status</p>
                  <Badge variant={STATUS_BADGE[interest.status]} className="px-3 py-1">{interest.status}</Badge>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-2">Created Date</p>
                  <p className="text-sm font-medium">{interest.createdDate}</p>
                </div>
                <div className="p-4 bg-gray-50">
                  <p className="text-[10px] uppercase text-gray-400 tracking-wider mb-2">Expiry Date</p>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><CalendarClock size={14} className="text-warning"/> {interest.expiryDate}</p>
                </div>
             </CardContent>
             <div className="p-4 flex items-center justify-between border-b bg-gray-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                     <Building size={20}/>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Target Project</p>
                      <button onClick={() => onProjectClick(interest.projectId)} className="font-bold text-brand hover:underline">
                         {interest.projectName} <span className="text-gray-400 font-normal">({interest.propertyType})</span>
                      </button>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Expected Commission</p>
                   <p className="text-lg font-black text-emerald-600">{interest.commissionPerProperty.toLocaleString()} SAR / unit</p>
                </div>
             </div>
          </Card>

          <Card>
            <div className="p-4 border-b bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Linked Properties Inventory</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                     <tr>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Specs</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {interest.linkedProperties.map(prp => (
                        <tr key={prp.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-3 font-bold text-gray-800">{prp.name}</td>
                           <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{prp.type}</Badge></td>
                           <td className="px-4 py-3">
                              <Badge variant={prp.status === 'Available' ? 'success' : prp.status === 'Sold' ? 'destructive' : 'warning'} className="text-[10px]">
                                 {prp.status}
                              </Badge>
                           </td>
                           <td className="px-4 py-3 font-medium">{prp.price.toLocaleString()} SAR</td>
                           <td className="px-4 py-3 text-xs text-gray-500">{prp.area}m² • {prp.bedrooms}B • {prp.bathrooms}b</td>
                        </tr>
                     ))}
                     {interest.linkedProperties.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No specific properties linked yet.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          </Card>

          <Card>
             <div className="p-4 border-b bg-white flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700">Orders From This Interest</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                     <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Booking Date</th>
                        <th className="px-4 py-3">Comm. Status</th>
                        <th className="px-4 py-3 font-bold">Commission</th>
                        <th className="px-4 py-3 text-right">Order</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {interest.purchaseOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-gray-50">
                           <td className="px-4 py-3 font-mono font-bold text-gray-600">{ord.id}</td>
                           <td className="px-4 py-3 text-gray-800 font-medium">{ord.propertyName}</td>
                           <td className="px-4 py-3 text-xs text-gray-500">{ord.bookingDate}</td>
                           <td className="px-4 py-3"><Badge variant={COMM_BADGE[ord.commissionStatus]} className="text-[10px]">{ord.commissionStatus}</Badge></td>
                           <td className="px-4 py-3 font-bold text-emerald-600">{ord.commissionAmount.toLocaleString()} SAR</td>
                           <td className="px-4 py-3 text-right">
                              <button onClick={() => onOrderClick(ord.id)} className="text-brand hover:underline font-bold text-[11px]">View Order</button>
                           </td>
                        </tr>
                     ))}
                     {interest.purchaseOrders.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 bg-gray-50/50">No purchase orders connected to this interest yet.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          </Card>

           <div className="flex gap-4 items-center flex-wrap pt-2">
             <Button className="bg-red-600 hover:bg-red-700">Delete Interest</Button>
             <div className="flex-1"></div>
             {interest.status === 'Active' ? (
                <Button variant="outline">Mark as Expired</Button>
             ) : (
                <Button className="bg-emerald-600 hover:bg-emerald-700">Re-activate Interest</Button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
