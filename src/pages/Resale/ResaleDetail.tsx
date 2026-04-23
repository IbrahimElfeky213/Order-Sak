import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  ChevronLeft, CheckCircle, XCircle, ShoppingBag,
  ExternalLink, FileText, MapPin, Home,
  Calendar, DollarSign, Activity, HelpCircle,
  AlertTriangle, Phone, Mail, User, Info,
  ChevronDown, ChevronUp, Image as ImageIcon,
  Check, X, RefreshCw, UserCircle, ArrowRight, Plus
} from 'lucide-react';
import { ResaleRequest, ResaleStatus } from '../../data/resaleStore';

interface Props {
  request: ResaleRequest;
  onBack: () => void;
  onCustomerClick: (id: string) => void;
  onOrderClick: (id: string) => void;
  onProjectClick: (id: string) => void;
  onUpdate: (updated: ResaleRequest) => void;
}

export default function ResaleDetail({ request, onBack, onCustomerClick, onOrderClick, onProjectClick, onUpdate }: Props) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPropInfoOpen, setIsPropInfoOpen] = useState(true);
  
  // Local state for inputs
  const [brokerageAgreement, setBrokerageAgreement] = useState(request.brokerageAgreementNumber || '');
  const [advertisingNum, setAdvertisingNum] = useState(request.advertisingNumber || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const [returnNotes, setReturnNotes] = useState('');

  const handleStatusChange = (newStatus: ResaleStatus, notes?: string) => {
    const newHistory = [
      {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: `Status changed to ${newStatus}`,
        actionBy: 'Faisal Al-Otaibi',
        notes: notes
      },
      ...request.history
    ];
    onUpdate({
      ...request,
      status: newStatus,
      history: newHistory,
      brokerageAgreementNumber: brokerageAgreement || request.brokerageAgreementNumber,
      advertisingNumber: advertisingNum || request.advertisingNumber
    });
  };

  const getStatusColor = (status: ResaleStatus) => {
    switch (status) {
      case 'New Submission': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Review in Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Awaiting Agreement': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Listed': 
      case 'Publicly Listed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined': 
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Withdrawn': 
      case 'Cancelled': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const SectionHeader = ({ icon, title, badge }: { icon: React.ReactNode; title: string, badge?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
          {icon}
        </div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{title}</h3>
      </div>
      {badge}
    </div>
  );

  const DataItem = ({ label, value, mono = false, copyable = false, clickable = false, onClick = () => {} }: { label: string; value: any; mono?: boolean; copyable?: boolean; clickable?: boolean; onClick?: () => void }) => (
    <div className={`flex flex-col gap-1 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all ${clickable ? 'cursor-pointer group' : ''}`} onClick={onClick}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold text-gray-800 ${mono ? 'font-mono tracking-tighter' : ''} ${clickable ? 'group-hover:text-brand' : ''}`}>
          {value || '—'}
        </span>
        {clickable && <ExternalLink size={10} className="text-gray-300 group-hover:text-brand transition-colors" />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-all shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 leading-none">Resale Request Detail</h1>
              <Badge variant="outline" className={`px-2 py-1 text-[10px] uppercase font-black tracking-widest ${getStatusColor(request.status)}`}>
                {request.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 font-medium mt-1">Requested by {request.customerName} for {request.propertyName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white border-gray-200 text-gray-600 font-bold shadow-sm">
            Download Application PDF
          </Button>
          <Button className="bg-brand text-white font-bold shadow-lg shadow-brand/20">
            Internal Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* LEFT PANEL: 30% (3 columns) */}
        <div className="lg:col-span-3 space-y-6 h-fit sticky top-24">
          
          {/* Customer Profile Summary */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-brand/5 border border-brand/10 flex items-center justify-center text-3xl font-black text-brand shadow-inner mb-4">
                  {request.customerName.charAt(0)}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{request.customerName}</h2>
                  {request.customerVerified && <CheckCircle size={16} className="text-emerald-500" />}
                </div>
                <p className="text-sm text-gray-400 font-medium">{request.customerUsername}</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-1">
                <DataItem label="National ID" value={request.customerNationalId} mono={true} />
                <DataItem label="Phone Number" value={request.customerPhone} />
                <DataItem label="Email Address" value={request.customerEmail} />
                <DataItem label="Nationality" value={request.customerNationality} />
                <div className="grid grid-cols-2 gap-1">
                  <DataItem label="Gender" value={request.customerGender === 'M' ? 'Male' : 'Female'} />
                  <DataItem label="Date of Birth" value={request.customerDob} />
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full h-11 border border-dashed border-gray-200 text-brand font-black text-xs uppercase tracking-widest hover:bg-brand/5"
                onClick={() => onCustomerClick(request.customerId)}
              >
                View Full Customer Profile <ArrowRight size={14} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Original Purchase Order Card */}
          <Card className="border-gray-100 shadow-sm overflow-hidden ring-4 ring-gray-50/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center justify-between">
                <span>Original Purchase</span>
                <ShoppingBag size={14} className="text-gray-300" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-1">
                <DataItem 
                  label="Purchase Order ID" 
                  value={request.purchaseOrderId} 
                  mono={true} 
                  clickable={true}
                  onClick={() => onOrderClick(request.purchaseOrderId)}
                />
                <DataItem label="Purchase Date" value={request.purchaseDate} />
                <DataItem label="Purchase Price" value={`SAR ${request.purchasePrice.toLocaleString()}`} />
                <DataItem label="Price per Meter" value={`SAR ${request.originalPricePerMeter.toLocaleString()}`} />
                <div className="px-3 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Order Status</span>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-2.5 py-1 text-[10px]">
                    {request.purchaseOrderStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: 70% (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Request Info & Actions Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-gray-100 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-6">
                <SectionHeader icon={<FileText size={18}/>} title="General Request Info" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted Date</span>
                    <span className="text-sm font-black text-gray-800">{request.submittedDate}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CMS Ownership</span>
                    <span className="text-sm font-mono font-black text-brand bg-brand/5 px-2 py-0.5 rounded border border-brand/10 w-fit">
                      {request.cmsPropertyId || "UNASSIGNED"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-right md:text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CMS Status</span>
                    <Badge variant={request.cmsPublishStatus === 'Published' ? 'success' : 'secondary'} className="w-fit text-[10px] font-black">
                      {request.cmsPublishStatus}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brokerage Agreement</span>
                    <span className="text-sm font-bold text-gray-700">{request.brokerageAgreementNumber || "Pending Agreement"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Advertising ID</span>
                    <span className="text-sm font-bold text-gray-700">{request.advertisingNumber || "Not Linked"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Actions Container */}
            <Card className="border-gray-100 shadow-sm overflow-hidden bg-gray-50/50 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Actions</p>
              
              {(request.status === 'New Submission' || request.status === 'Review in Progress') && (
                <div className="w-full space-y-3">
                  <Button onClick={() => setShowApproveModal(true)} className="w-full bg-brand text-white font-black uppercase text-[11px] tracking-widest h-12 gap-2 shadow-xl shadow-brand/20">
                    <CheckCircle size={16} /> Approve Request
                  </Button>
                  <Button variant="outline" onClick={() => setShowReturnModal(true)} className="w-full bg-white border-gray-200 text-amber-600 font-bold h-11 gap-2">
                    <RefreshCw size={14} /> Return for Edits
                  </Button>
                  <Button variant="ghost" onClick={() => setShowRejectModal(true)} className="w-full text-red-500 font-bold h-10 hover:bg-red-50">
                    Reject Application
                  </Button>
                </div>
              )}

              {request.status === 'Awaiting Agreement' && (
                <div className="w-full space-y-4">
                   <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                      <div className="text-left space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Agreement #</label>
                        <input 
                          value={brokerageAgreement}
                          onChange={(e) => setBrokerageAgreement(e.target.value)}
                          placeholder="e.g. AGR-12345"
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>
                      <div className="text-left space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Advertising # (Opt.)</label>
                        <input 
                          value={advertisingNum}
                          onChange={(e) => setAdvertisingNum(e.target.value)}
                          placeholder="e.g. AD-2026-001"
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>
                      <Button 
                        onClick={() => handleStatusChange('Publicly Listed')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] tracking-widest h-11 gap-2 shadow-xl shadow-emerald-600/20"
                      >
                        <Check size={16} /> Finalize & Activate
                      </Button>
                   </div>
                   <Button variant="ghost" onClick={() => setShowCancelModal(true)} className="w-full text-gray-400 font-bold h-10 hover:text-red-500 transition-colors">
                      Cancel This Request
                   </Button>
                </div>
              )}

              {(request.status === 'Publicly Listed' || request.status === 'Listed') && (
                <div className="w-full space-y-3">
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100/50 animate-pulse">
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed mb-1">Property Active</p>
                    <p className="text-[10px] font-medium opacity-80 italic">Verified and listed on platform.</p>
                  </div>
                  <Button variant="ghost" className="w-full text-red-500 font-bold h-10 hover:bg-red-50" onClick={() => setShowCancelModal(true)}>
                    Cancel Listing
                  </Button>
                </div>
              )}

              {(request.status === 'Declined' || request.status === 'Withdrawn' || request.status === 'Rejected' || request.status === 'Cancelled') && (
                <div className="flex flex-col items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-500 border-transparent font-black px-4 py-2">
                    CLOSED APPLICATION
                  </Badge>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No further actions available</p>
                </div>
              )}
            </Card>
          </div>

          {/* Pricing Details */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
             <CardHeader className="bg-gray-50/30 border-b border-gray-100 p-6 flex flex-row items-center justify-between">
                <SectionHeader icon={<DollarSign size={18}/>} title="Price breakdown" />
                <Badge variant="outline" className="text-brand border-brand/20 bg-brand/5 font-black px-4 py-1.5 h-7">
                   2.5% Commission Enabled
                </Badge>
             </CardHeader>
             <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/20">
                   {[
                     { label: 'Orig. Price/m²', value: `SAR ${request.originalPricePerMeter.toLocaleString()}`, light: true },
                     { label: 'Sale Price (Req.)', value: `SAR ${request.requestedSalePrice.toLocaleString()}`, bold: true },
                     { label: 'Commission (2.5%)', value: `SAR ${request.commissionFee.toLocaleString()}`, emerald: true },
                     { label: 'Final Price/m²', value: `SAR ${(request.requestedSalePrice / request.totalArea).toFixed(2)}`, light: true },
                     { label: 'Total Listing Price', value: `SAR ${(request.requestedSalePrice + request.commissionFee).toLocaleString()}`, highlight: true },
                   ].map((item, idx) => (
                     <div key={idx} className={`p-5 flex flex-col gap-1 border-r last:border-r-0 border-gray-100 ${item.highlight ? 'bg-brand text-white' : ''}`}>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.highlight ? 'text-white/70' : 'text-gray-400'}`}>{item.label}</span>
                        <p className={`text-sm font-black whitespace-nowrap ${item.bold ? 'text-gray-900 border-b-2 border-brand/20 w-fit' : item.emerald ? 'text-emerald-600' : item.highlight ? 'text-white text-lg' : 'text-gray-600'}`}>
                          {item.value}
                        </p>
                     </div>
                   ))}
                </div>
             </CardContent>
          </Card>

          {/* Expandable Property Information */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setIsPropInfoOpen(!isPropInfoOpen)}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <SectionHeader icon={<Home size={18}/>} title="Property & Ownership details" />
              <div className="text-gray-400">
                {isPropInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            {isPropInfoOpen && (
              <CardContent className="p-0 animate-in slide-in-from-top-4 duration-300">
                <div className="p-6 space-y-8 bg-gray-50/10">
                  
                  {/* Deed Data */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white rounded-2xl border border-gray-100 shadow-inner ring-4 ring-gray-50/50">
                    <DataItem label="Deed Type" value={request.deedType} mono />
                    <DataItem label="Deed Number" value={request.deedNumber} mono />
                    <DataItem label="Owner ID Type" value={request.ownerIdType} />
                    <DataItem label="Owner National ID" value={request.ownerNationalId} mono />
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6">
                    <DataItem label="Property Name" value={request.propertyName} />
                    <DataItem label="Project Name" value={request.projectName} clickable onClick={() => onProjectClick(request.projectId)} />
                    <DataItem label="Total Area" value={`${request.totalArea} m²`} />
                    <DataItem label="Property Type" value={<Badge variant="secondary" className="scale-90 font-black">{request.propertyType}</Badge>} />
                    
                    <DataItem label="Property Usage" value={<Badge variant="secondary" className="scale-90 font-black">{request.propertyUsage}</Badge>} />
                    <DataItem label="City" value={request.city} />
                    <DataItem label="Facade" value={request.facade} />
                    <DataItem label="Block Number" value={request.blockNumber} mono />

                    <DataItem label="Bedrooms" value={request.bedrooms} />
                    <DataItem label="Bathrooms" value={request.bathrooms} />
                    <DataItem label="Neighborhood" value={request.neighborhood} />
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-gray-100">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Additional Notes</span>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{request.additionalNotes || "No additional notes provided for this property."}"
                    </p>
                  </div>

                  {/* Images */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ImageIcon size={12} /> Property Images
                    </span>
                    {request.propertyImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {request.propertyImages.map((img, i) => (
                          <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all group relative cursor-pointer">
                            <img src={img} alt={`Prop ${i}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                               <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                                 <Plus size={20} />
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                         <p className="text-xs text-gray-400 font-bold">No images uploaded for this listing</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Activity Log / History */}
          <Card className="border-gray-100 shadow-sm overflow-hidden bg-white">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-4">
                <SectionHeader icon={<Activity size={18}/>} title="Activity Timeline" />
             </CardHeader>
             <CardContent className="p-6">
                <div className="space-y-6 relative">
                   <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gray-100" />
                   {request.history.map((item, idx) => (
                     <div key={idx} className="relative flex gap-4 items-start group">
                        <div className={`mt-1 w-8 h-8 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-gray-50 transition-all group-hover:scale-110 ${
                          idx === 0 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                           {idx === 0 ? <RefreshCw size={14} className="animate-spin-slow" /> : <Activity size={14} />}
                        </div>
                        <div className="flex-1 space-y-1">
                           <div className="flex items-center justify-between">
                              <p className={`text-sm font-black ${idx === 0 ? 'text-gray-900' : 'text-gray-600'}`}>{item.action}</p>
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{item.timestamp}</span>
                           </div>
                           {item.notes && (
                             <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 mt-2">
                                <p className="text-xs text-gray-500 font-medium italic">"{item.notes}"</p>
                             </div>
                           )}
                           <div className="flex items-center gap-1.5 pt-1.5 opacity-60">
                              <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[8px] font-black">{item.actionBy.charAt(0)}</div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">By {item.actionBy}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* MODALS */}
      
      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <Card className="max-w-md w-full animate-in zoom-in duration-300 overflow-hidden">
             <CardHeader className="bg-emerald-50 border-b border-emerald-100 p-6 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-white text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                   <CheckCircle size={32} />
                </div>
                <CardTitle className="text-xl font-black text-emerald-900">Approve Resale Request?</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  Once approved, the customer will be notified and this request will move to <span className="font-bold text-gray-900">Pending Brokerage Agreement</span> status.
                </p>
                <div className="flex gap-3">
                   <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setShowApproveModal(false)}>Cancel</Button>
                   <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 shadow-xl shadow-emerald-600/20" onClick={() => { handleStatusChange('Awaiting Agreement'); setShowApproveModal(false); }}>Confirm Approval</Button>
                </div>
             </CardContent>
           </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <Card className="max-w-md w-full animate-in zoom-in duration-300">
             <CardHeader className="bg-red-50 border-b border-red-100 p-6 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/10">
                   <AlertTriangle size={32} />
                </div>
                <CardTitle className="text-xl font-black text-red-900">Reject Application?</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Reason for Rejection (Required)</label>
                  <textarea 
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Deed information could not be verified with MoJ records."
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex gap-3">
                   <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                   <Button variant="destructive" className="flex-1 font-black h-12 shadow-xl shadow-red-600/20" disabled={!rejectionReason} onClick={() => { handleStatusChange('Declined', rejectionReason); setShowRejectModal(false); }}>Confirm Rejection</Button>
                </div>
             </CardContent>
           </Card>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <Card className="max-w-md w-full animate-in zoom-in duration-300">
             <CardHeader className="bg-amber-50 border-b border-amber-100 p-6 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-white text-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/10">
                   <RefreshCw size={32} />
                </div>
                <CardTitle className="text-xl font-black text-amber-900">Return for Edits?</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Notes for Customer (Required)</label>
                  <textarea 
                    rows={4}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. Please upload more clear images of the property interior."
                    className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex gap-3">
                   <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setShowReturnModal(false)}>Cancel</Button>
                   <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black h-12 shadow-xl shadow-amber-500/20" disabled={!returnNotes} onClick={() => { handleStatusChange('Review in Progress', returnNotes); setShowReturnModal(false); }}>Send to Customer</Button>
                </div>
             </CardContent>
           </Card>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <Card className="max-w-md w-full animate-in zoom-in duration-300">
             <CardHeader className="bg-red-50 border-b border-red-100 p-6 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/10">
                   <XCircle size={32} />
                </div>
                <CardTitle className="text-xl font-black text-red-900">Cancel Listing?</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  This listing will be removed from the public platform and move to <span className="font-bold text-gray-900">Cancelled</span> status.
                </p>
                <div className="flex gap-3">
                   <Button variant="outline" className="flex-1 font-bold h-12" onClick={() => setShowCancelModal(false)}>Wait, don't</Button>
                   <Button variant="destructive" className="flex-1 font-black h-12 shadow-xl shadow-red-600/20" onClick={() => { handleStatusChange('Withdrawn'); setShowCancelModal(false); }}>Cancel Forever</Button>
                </div>
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
