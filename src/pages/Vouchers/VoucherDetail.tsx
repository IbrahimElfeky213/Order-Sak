
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  ChevronLeft, Copy, CheckCircle, ExternalLink, 
  User, Home, ShoppingBag, Clock, Info, 
  MapPin, ShieldCheck, Calendar, Activity, 
  ArrowRight, Ticket, AlertCircle
} from 'lucide-react';
import { Voucher } from '../../data/vouchersStore';

interface Props {
  voucher: Voucher;
  onBack: () => void;
  onCustomerClick: (id: string) => void;
  onOrderClick: (id: string) => void;
  onProjectClick: (id: string) => void;
}

export default function VoucherDetail({ voucher, onBack, onCustomerClick, onOrderClick, onProjectClick }: Props) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const isExpired = new Date(voucher.expiryDate) < new Date() && !voucher.isUsed;
  const isExpiringSoon = !voucher.isUsed && !isExpired && 
    (new Date(voucher.expiryDate).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000;

  // Calculation
  const discountApplied = voucher.type === 'Fixed Amount' 
    ? voucher.value 
    : (voucher.propertyPrice * voucher.value) / 100;
  
  const finalPrice = voucher.propertyPrice - discountApplied;

  const DataItem = ({ label, value, mono = false, copyable = false, clickable = false, onClick = () => {}, isRed = false, isGreen = false }: { 
    label: string; 
    value: any; 
    mono?: boolean; 
    copyable?: boolean; 
    clickable?: boolean; 
    onClick?: () => void;
    isRed?: boolean;
    isGreen?: boolean;
  }) => (
    <div className={`flex flex-col gap-1 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all ${clickable ? 'cursor-pointer group' : ''}`} onClick={onClick}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold ${isRed ? 'text-red-500' : isGreen ? 'text-emerald-600' : 'text-gray-800'} ${mono ? 'font-mono tracking-tighter' : ''} ${clickable ? 'group-hover:text-brand' : ''}`}>
          {value || '—'}
        </span>
        {copyable && (
          <button onClick={copyCode} className="text-gray-300 hover:text-brand">
            {copySuccess ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        )}
        {clickable && <ExternalLink size={10} className="text-gray-300 group-hover:text-brand" />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand transition-all shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 leading-none">Voucher Detail</h1>
              <Badge variant="outline" className={`px-2 py-1 text-[10px] uppercase font-black tracking-widest border ${
                voucher.isUsed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : isExpired ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                {voucher.isUsed ? 'USED' : isExpired ? 'EXPIRED' : 'UNUSED'}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 font-medium mt-1">Voucher ID: <span className="font-mono">{voucher.id}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* LEFT PANEL: 30% */}
        <div className="lg:col-span-3 space-y-6 sticky top-24 h-fit">
          
          {/* Customer Card */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-brand/5 border border-brand/10 flex items-center justify-center text-3xl font-black text-brand shadow-inner mb-4">
                  {voucher.customerName.charAt(0)}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-black text-gray-900 leading-tight">{voucher.customerName}</h2>
                  {voucher.customerVerified && <ShieldCheck size={16} className="text-emerald-500" />}
                </div>
                <p className="text-sm text-gray-400 font-medium mb-4">{voucher.customerUsername}</p>
                <div className="flex gap-1.5 flex-wrap justify-center">
                  <Badge variant="outline" className="bg-white text-[9px] uppercase tracking-tighter text-gray-500 font-black">{voucher.customerNationality}</Badge>
                  <Badge variant="outline" className="bg-white text-[9px] uppercase tracking-tighter text-gray-500 font-black">{voucher.customerGender === 'M' ? 'Male' : 'Female'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <DataItem label="National ID" value={voucher.customerNationalId} mono={true} />
              <DataItem label="Phone Number" value={voucher.customerPhone} />
              <DataItem label="Email Address" value={voucher.customerEmail} />
              <Button 
                variant="ghost" 
                className="w-full border border-dashed border-gray-200 text-brand font-black text-xs uppercase tracking-widest h-11 hover:bg-brand/5"
                onClick={() => onCustomerClick(voucher.customerId)}
              >
                View Full Customer Profile <ArrowRight size={14} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Property Card */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Home size={20} className="text-brand" />
                <Badge className="bg-white/10 text-white border-transparent text-[9px] font-black tracking-widest">{voucher.propertyStatus.toUpperCase()}</Badge>
              </div>
              <h3 className="text-lg font-black tracking-tight">{voucher.propertyName}</h3>
              <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm font-bold">
                <MapPin size={14} /> {voucher.projectName}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-1">
                <DataItem label="Type" value={voucher.propertyType} />
                <DataItem label="Area" value={`${voucher.propertyArea} m²`} />
              </div>
              <div className="grid grid-cols-1 gap-1 pt-2 border-t border-gray-50">
                <DataItem label="Original Price" value={`SAR ${voucher.propertyPrice.toLocaleString()}`} />
                <DataItem label="Price After Discount" value={`SAR ${finalPrice.toLocaleString()}`} isGreen={true} />
              </div>
              <Button 
                variant="outline" 
                className="w-full font-black text-xs uppercase tracking-widest h-11 border-gray-200 text-gray-500 hover:bg-gray-50"
                onClick={() => onProjectClick(voucher.projectId)}
              >
                View Project Details <ArrowRight size={14} className="ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Transaction Summary (Sticky Footer) */}
          {voucher.isUsed ? (
            <Card className="border-emerald-100 bg-emerald-50/30 overflow-hidden shadow-xl shadow-emerald-600/5 ring-1 ring-emerald-100">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest leading-none mb-1">Applied to Order</p>
                    <p className="text-sm font-black text-emerald-700 leading-none" onClick={() => onOrderClick(voucher.orderId!)}>{voucher.orderId}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm pt-2 border-t border-emerald-100/50">
                  <div className="flex justify-between font-medium text-emerald-700/70">
                    <span>Final Amount Paid</span>
                    <span className="font-black text-emerald-800">SAR {voucher.orderTotalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-gray-100 p-8 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <Clock className="text-gray-300 mb-3" size={32} />
              <p className="text-sm font-black text-gray-400 uppercase tracking-tight">Voucher not used yet</p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: 70% */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Voucher Grid */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100 p-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center shadow-2xl shadow-brand/20">
                    <Ticket size={32} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unique Code</p>
                    <div className="flex items-center gap-3">
                      <code className="text-2xl font-mono font-black text-gray-900 tracking-tight bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">{voucher.code}</code>
                      <button onClick={copyCode} className="p-3 bg-white border border-gray-200 rounded-xl hover:text-brand hover:border-brand shadow-sm transition-all group">
                        {copySuccess ? <CheckCircle size={20} className="text-emerald-500" /> : <Copy size={20} className="text-gray-400 group-hover:text-brand" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`px-4 py-2 text-xs font-black tracking-widest ${
                    voucher.type === 'Fixed Amount' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {voucher.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-b border-gray-100">
                <div className="p-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Voucher Value</p>
                  <p className="text-2xl font-black text-gray-900">
                    {voucher.type === 'Fixed Amount' ? `SAR ${voucher.value.toLocaleString()}` : `${voucher.value}%`}
                  </p>
                </div>
                <div className="p-8 font-semibold">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Calculated Discount</p>
                  <p className="text-2xl font-black text-red-500 leading-none">
                    - SAR {discountApplied.toLocaleString()}
                  </p>
                </div>
                <div className="p-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className={isExpired ? 'text-red-500' : 'text-gray-400'} />
                    <span className={`text-lg font-black ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-orange-500 animate-pulse' : 'text-gray-800'}`}>
                      {voucher.expiryDate.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Platform Assigned</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-300" />
                    <span className="text-lg font-black text-gray-800">{voucher.assignedAt.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {isExpired && (
                <div className="bg-red-50 border-t border-red-100 p-4 flex items-center gap-3 text-red-700">
                  <AlertCircle size={20} />
                  <span className="text-sm font-black uppercase tracking-widest">This voucher has expired and can no longer be used.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discount Breakdown Card (Infographic style) */}
          <Card className="border-gray-100 shadow-sm bg-gray-50/50 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-8">
                <Info size={16} className="text-brand" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Discount Breakdown</h3>
              </div>
              
              <div className="space-y-6">
                {/* Visual Line */}
                <div className="relative pt-6">
                  <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Original Price</p>
                      <p className="text-xl font-bold text-gray-500 line-through tracking-tighter">SAR {voucher.propertyPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Final Price</p>
                      <p className="text-4xl font-black text-emerald-600 tracking-tight leading-none shadow-sm px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 shine">SAR {finalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Progress/Bar visualization could go here */}
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex shadow-inner border border-white">
                    <div className="h-full bg-emerald-500 shadow-lg shadow-emerald-200/50" style={{ width: `${(finalPrice/voucher.propertyPrice) * 100}%` }} />
                    <div className="h-full bg-red-400" style={{ width: `${(discountApplied/voucher.propertyPrice) * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-3 px-1 text-[11px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Paid: {((finalPrice/voucher.propertyPrice)*100).toFixed(1)}%</span>
                    <span className="text-red-400">Discount: {((discountApplied/voucher.propertyPrice)*100).toFixed(1)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 pt-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TagIcon className="w-16 h-16 text-brand" />
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Discount Type</p>
                     <p className="text-lg font-black text-gray-900">{voucher.type}</p>
                     <p className="text-xs text-gray-400 font-medium">{voucher.type === 'Percentage' ? `${voucher.value}% off the original price` : `Flat SAR ${voucher.value.toLocaleString()} reduction`}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 pt-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShoppingBag size={64} className="text-emerald-500" />
                     </div>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Net Savings</p>
                     <p className="text-2xl font-black text-emerald-600">SAR {discountApplied.toLocaleString()}</p>
                     <p className="text-xs text-emerald-700/50 font-black uppercase tracking-tighter shadow-sm w-fit bg-emerald-50 px-2 py-0.5 rounded-md mt-1">Total Property Discount</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Details Section */}
          <SectionHeader title="Usage Details" icon={<ShoppingBag size={18} />} />
          {voucher.isUsed ? (
            <Card className="border-gray-100 shadow-sm overflow-hidden">
               <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
                  <DataItem label="Booking Date" value={voucher.orderBookingDate} />
                  <DataItem label="Total Order Amount" value={`SAR ${voucher.orderTotalAmount?.toLocaleString()}`} />
                  <DataItem label="Payment Option" value={<Badge variant="outline" className="bg-gray-50 text-[10px] font-black tracking-widest border-gray-200">{voucher.orderPaymentOption?.toUpperCase()}</Badge>} />
               </div>
               <div className="p-6 bg-emerald-50/20 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-emerald-100/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 text-emerald-600">
                      <CheckCircle size={14} />
                    </div>
                    <span className="text-sm font-black text-emerald-800 tracking-tight">Successfully applied to <span className="font-mono bg-emerald-100/50 px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-200 transition-colors" onClick={() => onOrderClick(voucher.orderId!)}>{voucher.orderId}</span></span>
                  </div>
                  <Button onClick={() => onOrderClick(voucher.orderId!)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest h-10 gap-2 shadow-lg shadow-emerald-500/20">
                    <ShoppingBag size={14} /> View Order Details
                  </Button>
               </div>
            </Card>
          ) : (
            <div className="p-20 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4 border border-gray-100 shadow-sm">
                <Ticket size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-400 uppercase tracking-tight">Voucher Available</h3>
              <p className="text-xs text-gray-400 mt-1">This voucher has not been used in any order yet.</p>
            </div>
          )}

          {/* Activity Log Section */}
          <SectionHeader title="Activity Log" icon={<Activity size={18} />} />
          <div className="relative space-y-4">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gray-100" />
            {voucher.history.map((item, index) => (
              <div key={index} className="relative flex gap-4 items-start group">
                <div className={`mt-1.5 w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm border border-white transition-all group-hover:scale-110 ${
                  index === 0 ? 'bg-brand text-white shadow-brand/20 ring-4 ring-brand/5' : 'bg-gray-50 text-gray-300'
                }`}>
                  <Clock size={16} />
                </div>
                <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                  index === 0 ? 'bg-white border-brand/20 shadow-lg shadow-brand/5' : 'bg-white border-gray-100 hover:border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-black tracking-tight ${index === 0 ? 'text-brand' : 'text-gray-900'}`}>{item.action}</h4>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 uppercase tracking-widest">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">By {item.actionBy}</span>
                    {item.notes && <span className="text-[10px] text-gray-300">•</span>}
                    <span className="text-[10px] text-gray-400 font-medium italic">{item.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-6">
      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
        {icon}
      </div>
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">{title}</h3>
    </div>
  );
}

function TagIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
  )
}
