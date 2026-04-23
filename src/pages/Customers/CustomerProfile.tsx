import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  ChevronLeft, CheckCircle, XCircle, ShoppingBag, 
  Home, RefreshCw, Ticket, Activity, ExternalLink, 
  DollarSign, Hash, Calendar, MapPin, Search,
  Bell, Edit, Trash2, ShieldAlert, Send, AlertTriangle, X
} from 'lucide-react';

import { Customer, CustomerOrder, InteractionEvent } from '../../data/customersStore';

interface InteractionIconProps {
  type: InteractionEvent['eventType'];
}

const InteractionIcon = ({ type }: InteractionIconProps) => {
  switch (type) {
    case 'Account Created': return <UserCircleIcon className="w-4 h-4 text-brand" />;
    case 'Order Placed': return <ShoppingBag className="w-4 h-4 text-brand" />;
    case 'Payment Made': return <DollarSign className="w-4 h-4 text-success" />;
    case 'Order Status Changed': return <Activity className="w-4 h-4 text-warning" />;
    case 'Voucher Assigned': return <Ticket className="w-4 h-4 text-purple-500" />;
    case 'Deed Transferred': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'Resale Request Submitted': return <RefreshCw className="w-4 h-4 text-blue-500" />;
    case 'Resale Request Approved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'Resale Request Rejected': return <XCircle className="w-4 h-4 text-destructive" />;
    case 'Co-Broker Interest Linked': return <MapPin className="w-4 h-4 text-orange-500" />;
    default: return <Activity className="w-4 h-4 text-gray-400" />;
  }
};

const UserCircleIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

interface Props {
  customer: Customer;
  onBack: () => void;
  onOrderClick: (id: string) => void;
  onResaleClick: (id: string) => void;
  onProjectClick: (id: string) => void;
}

const VerificationGate = ({ isVerified, message, children }: { isVerified: boolean, message: string, children: React.ReactNode }) => {
  if (isVerified) return <>{children}</>;
  return (
    <div className="p-20 text-center space-y-4 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto text-amber-500 border border-amber-100 shadow-sm shadow-amber-100/50 ring-4 ring-amber-50/50">
        <ShieldAlert size={32} strokeWidth={2.5} />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-black text-gray-900 tracking-tight">Verification Required</p>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>
      <div className="bg-gray-100/50 p-3 rounded-xl inline-block border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
           <Activity size={10}/> Verification must be completed by the User
        </p>
      </div>
    </div>
  );
};


export default function CustomerProfile({ customer, onBack, onOrderClick, onResaleClick, onProjectClick }: Props) {
  const [activeTab, setActiveTab] = useState<'Orders' | 'Properties' | 'Resale' | 'Vouchers' | 'History'>('Orders');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interaction State
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDeactivateModal,   setShowDeactivateModal]   = useState(false);
  const [showEditModal,         setShowEditModal]         = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!customer) return <div className="p-8 text-center text-gray-400">Customer not found</div>;

  const totalPaid = customer.orders.reduce((sum, o) => sum + o.depositPaid, 0); 
  const ownedProps = customer.ownedProperties.length;


  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-brand">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="cursor-pointer hover:text-brand" onClick={onBack}>Customers</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{customer.fullName}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)} className="bg-white border-gray-200 text-gray-600 gap-2">
            <Edit size={14} /> Edit Profile
          </Button>
          <Button size="sm" onClick={() => setShowNotificationModal(true)} className="bg-brand hover:bg-brand/90 text-white shadow-sm shadow-brand/20 gap-2">
            <Send size={14} /> Send Notification
          </Button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT PANEL: 25% */}
        <aside className="lg:col-span-1 space-y-6 sticky top-24">
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 text-center bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand/20 to-brand/5 text-brand flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-inner ring-1 ring-white/50">
                  {customer.fullName.substring(0, 1)}
                </div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">{customer.fullName}</h2>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-400 tracking-tight">{customer.username}</p>
                  {customer.verified && (
                    <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 px-2 flex items-center gap-1 scale-90">
                      <CheckCircle size={10} /> Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    { label: 'Customer ID', value: customer.id, icon: <Hash size={14} />, mono: true },
                    { label: 'Phone', value: customer.phone, icon: <Activity size={14} /> },
                    { label: 'Email', value: customer.email, icon: <Activity size={14} /> },
                    { label: 'Nationality', value: customer.nationality, icon: <Activity size={14} /> },
                    { label: 'National ID', value: customer.nationalId, icon: <Activity size={14} />, mono: true },
                    { label: 'Gender', value: customer.gender === 'M' ? 'Male' : 'Female', icon: <Activity size={14} /> },
                    { label: 'Date of Birth', value: customer.dob, icon: <Calendar size={14} /> },
                    { label: 'Registered', value: customer.registrationDate, icon: <Calendar size={14} /> },
                  ].map((field, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{field.label}</span>
                      <span className={`text-sm font-semibold text-gray-700 ${field.mono ? 'font-mono' : ''}`}>{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Orders', value: customer.orders.length, color: 'brand' },
              { label: 'Owned Props', value: ownedProps, color: 'emerald' },
              { label: 'Active Orders', value: customer.orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Expire' && o.status !== 'Deed Transferred').length, color: 'blue' },
              { label: 'Total Paid', value: `SAR ${totalPaid.toLocaleString()}`, color: 'emerald', full: true },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${stat.full ? 'col-span-2' : ''}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-lg font-black text-${stat.color}-600`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL: 75% */}
        <main className="lg:col-span-3 space-y-6">
          <Card className="border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <header className="bg-white border-b border-gray-100">
              <div className="flex border-b border-gray-50">
                {[
                  { id: 'Orders', label: 'Purchase Orders', icon: <ShoppingBag size={16} /> },
                  { id: 'Properties', label: 'Owned Properties', icon: <Home size={16} /> },
                  { id: 'Resale', label: 'Resale Requests', icon: <RefreshCw size={16} /> },
                  { id: 'Vouchers', label: 'Vouchers & Discounts', icon: <Ticket size={16} /> },
                  { id: 'History', label: 'Interaction History', icon: <Activity size={16} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative border-r border-gray-50 last:border-0 ${
                      activeTab === tab.id 
                        ? 'text-brand bg-brand/5' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
                  </button>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50/50 flex items-center justify-between">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search in this tab..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/10 bg-white"
                  />
                </div>
                <div className="text-[11px] text-gray-400 font-medium">
                  Showing {(Array.isArray(customer[activeTab.charAt(0).toLowerCase() + activeTab.slice(1) as keyof Customer]) ? (customer[activeTab.charAt(0).toLowerCase() + activeTab.slice(1) as keyof Customer] as unknown[]).length : 0)} entries
                </div>
              </div>
            </header>

            <div className="flex-1">
              {/* ORDERS TAB */}
              {activeTab === 'Orders' && (
                <VerificationGate isVerified={customer.verified} message="This customer is currently unverified. Purchase orders are only allowed for verified profiles to ensure legal compliance.">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50/50 border-b border-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Order ID</th>
                          <th className="px-6 py-3">Property</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3">Booking Date</th>
                          <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {customer.orders.length === 0 ? (
                          <tr><td colSpan={6} className="p-10 text-center text-gray-400">No purchase orders found</td></tr>
                        ) : (
                          customer.orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">{o.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-800">{o.propertyName}</p>
                                <p className="text-[10px] text-brand/70 font-semibold cursor-pointer" onClick={() => onProjectClick(o.projectName)}>{o.projectName}</p>
                              </td>
                              <td className="px-6 py-4"><Badge variant="outline" className="text-[10px]">{o.status}</Badge></td>
                              <td className="px-6 py-4 text-right font-bold text-gray-900">SAR {o.totalAmount.toLocaleString()}</td>
                              <td className="px-6 py-4 text-xs text-gray-400">{o.bookingDate}</td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => onOrderClick(o.id)}
                                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand hover:underline"
                                >
                                  View Order <ExternalLink size={12} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </VerificationGate>
              )}

              {/* PROPERTIES TAB */}
              {activeTab === 'Properties' && (
                <VerificationGate isVerified={customer.verified} message="Ownership data is restricted for unverified profiles. Complete identity verification to view owned properties.">
                  <div className="overflow-x-auto text-sm">
                    {customer.ownedProperties.length === 0 ? (
                      <div className="p-20 text-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                          <Home size={32} />
                        </div>
                        <p className="font-bold text-gray-500">No owned properties yet</p>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">Owned properties appear once the deed is successfully transferred to the customer.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-50 text-[10px] uppercase font-bold text-gray-400">
                          <tr>
                            <th className="px-6 py-3">Property</th>
                            <th className="px-6 py-3">Unit Type</th>
                            <th className="px-6 py-3">Area</th>
                            <th className="px-6 py-3 text-right">Purchase Price</th>
                            <th className="px-6 py-3">Transfer Date</th>
                            <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {customer.ownedProperties.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-800">{p.propertyName}</p>
                                <p className="text-[10px] text-brand/70 font-semibold">{p.projectName}</p>
                              </td>
                              <td className="px-6 py-4"><Badge variant="secondary" className="text-[10px]">{p.unitType}</Badge></td>
                              <td className="px-6 py-4 text-xs">{p.area} m²</td>
                              <td className="px-6 py-4 text-right font-bold text-gray-900">SAR {p.purchasePrice.toLocaleString()}</td>
                              <td className="px-6 py-4 text-xs text-gray-400">{p.deedTransferDate}</td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => onOrderClick(p.orderId)} className="text-brand font-bold text-[11px] hover:underline flex items-center gap-1 justify-end">
                                  Order #{p.orderId} <ExternalLink size={10} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </VerificationGate>
              )}

              {/* RESALE TAB */}
              {activeTab === 'Resale' && (
                <VerificationGate isVerified={customer.verified} message="Resale requests cannot be processed or viewed for unverified customers.">
                  <div className="overflow-x-auto text-sm">
                    {customer.resaleRequests.length === 0 ? (
                      <div className="p-20 text-center text-gray-400">No resale requests submitted</div>
                    ) : (
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-50 text-[10px] uppercase font-bold text-gray-400">
                          <tr>
                            <th className="px-6 py-3">Request ID</th>
                            <th className="px-6 py-3">Property</th>
                            <th className="px-6 py-3 text-right">Sale Price</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {customer.resaleRequests.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => onResaleClick(r.id)}>
                              <td className="px-6 py-4 font-mono font-bold text-xs text-gray-500">{r.id}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-800 group-hover:text-brand transition-colors">{r.propertyName}</p>
                                <p className="text-[10px] text-gray-400">{r.projectName}</p>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-emerald-600">SAR {r.salePrice.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className={`text-[10px] ${
                                  r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  r.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                  'bg-gray-50 text-gray-600'
                                }`}>
                                  {r.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-400">{r.submittedDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </VerificationGate>
              )}

              {/* VOUCHERS TAB */}
              {activeTab === 'Vouchers' && (
                <div className="p-6">
                  {customer.vouchers.length === 0 ? (
                    <div className="text-center p-10 text-gray-400">No vouchers assigned</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customer.vouchers.map(v => (
                        <div key={v.code} className="border border-brand/20 bg-brand/5 p-4 rounded-xl flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-brand">
                              <Ticket size={24} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-brand tracking-tighter mb-1 uppercase">{v.code}</p>
                              <p className="text-lg font-black text-gray-900 leading-none">
                                {v.type === 'Percentage' ? `${v.value}% OFF` : `SAR ${v.value.toLocaleString()} OFF`}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1 font-bold">{v.projectName} • {v.propertyName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {v.isUsed ? (
                              <Badge variant="success" className="mb-2">Used {v.usageDate}</Badge>
                            ) : (
                              <Badge variant="outline" className="mb-2 border-brand/40 text-brand">ACTIVE</Badge>
                            )}
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Expires {v.expiryDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HISTORY TAB (TIMELINE) */}
              {activeTab === 'History' && (
                <div className="p-6">
                  <div className="relative space-y-4">
                    <div className="absolute left-[21px] top-4 bottom-4 w-px bg-gray-100" />
                    {customer.interactionHistory.map((h, i) => (
                      <div key={i} className="relative flex gap-4 items-start group">
                        <div className={`mt-1.5 w-11 h-11 rounded-2xl flex items-center justify-center z-10 shadow-sm border border-white transition-all group-hover:scale-110 ${
                          i === 0 ? 'bg-brand text-white shadow-brand/20 ring-4 ring-brand/5' : 'bg-gray-50 text-gray-400'
                        }`}>
                          <InteractionIcon type={h.eventType} />
                        </div>
                        <div className={`flex-1 p-4 rounded-2xl transition-all border ${
                          i === 0 ? 'bg-white border-brand/20 shadow-lg shadow-brand/5' : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-gray-200'
                        }`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-bold ${i === 0 ? 'text-brand' : 'text-gray-900'}`}>{h.eventType}</h4>
                            <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">{h.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{h.description}</p>
                          {h.relatedEntityId && (
                            <div className="mt-2 text-[10px] font-black text-brand tracking-widest uppercase flex items-center gap-1 cursor-pointer hover:underline" onClick={() => h.relatedEntityId?.startsWith('ORD') && onOrderClick(h.relatedEntityId)}>
                              View Linked: {h.relatedEntityLabel} <ExternalLink size={10} />
                            </div>
                          )}
                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5 opacity-60">
                            <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[8px] font-bold">
                              {h.actionBy.substring(0, 1)}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">By {h.actionBy}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 text-center">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-brand text-xs">Load More Activity</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <footer className="p-4 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center mt-auto">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Confidential Admin Panel — Data Privacy Applies</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => showToast('Activity history cleared (simulated)', 'success')} className="h-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Delete History</Button>
                <Button variant="destructive" size="sm" onClick={() => setShowDeactivateModal(true)} className="h-8 text-[11px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all">Deactivate Account</Button>
              </div>
            </footer>
          </Card>
        </main>
      </div>

      {/* MODALS */}
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 ${
          toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="text-emerald-400" size={18}/> : <AlertTriangle className="text-white" size={18}/>}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <Card className="max-w-md w-full animate-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-4 border-red-50 ring-8 ring-red-50/20">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Deactivate Account?</h3>
                <p className="text-sm text-gray-500 mt-2">
                  You are about to deactivate <strong>{customer.fullName}</strong>. This will prevent the user from logging in or placing new orders.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 font-bold h-11" onClick={() => setShowDeactivateModal(false)}>Cancel</Button>
                <Button variant="destructive" className="flex-1 font-bold h-11" onClick={() => { 
                   showToast('Account deactivated successfully', 'success');
                   setShowDeactivateModal(false);
                }}>Confirm Deactivation</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-700 flex items-center gap-2"><Send size={16} className="text-brand"/> New Notification</h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Recipient</label>
                <div className="border bg-gray-50 rounded-lg p-2.5 text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px]">
                    {customer.fullName.substring(0,1)}
                  </div>
                  {customer.fullName}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Notification Title</label>
                <input placeholder="Enter title..." className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Message Body</label>
                <textarea rows={4} placeholder="Type your message here..." className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 resize-none" />
              </div>
              <Button className="w-full bg-brand hover:bg-brand/90 text-white font-bold h-12 gap-2" onClick={() => {
                showToast('Notification sent successfully');
                setShowNotificationModal(false);
              }}>
                <Send size={16}/> Send Notification Now
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal (Simulated) */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
           <Card className="max-w-2xl w-full animate-in zoom-in-95">
             <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2"><Edit size={16} className="text-brand"/> Edit Profile Information</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
             </div>
             <div className="p-6 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name (AR)</label>
                   <input defaultValue={customer.fullName} className="w-full border rounded-lg p-2.5 text-sm" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">Username</label>
                   <input defaultValue={customer.username} className="w-full border rounded-lg p-2.5 text-sm" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                   <input defaultValue={customer.email} className="w-full border rounded-lg p-2.5 text-sm" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                   <input defaultValue={customer.phone} className="w-full border rounded-lg p-2.5 text-sm" />
                </div>
                <div className="col-span-2 pt-4 flex gap-3">
                   <Button variant="outline" className="flex-1 font-bold" onClick={() => setShowEditModal(false)}>Cancel</Button>
                   <Button className="flex-1 bg-brand font-bold" onClick={() => {
                     showToast('Profile updated (simulation)');
                     setShowEditModal(false);
                   }}>Save Changes</Button>
                </div>
             </div>
           </Card>
        </div>
      )}
    </div>
  );
}
