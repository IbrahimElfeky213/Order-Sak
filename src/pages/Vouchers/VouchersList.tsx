
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Search, Download, Filter, ChevronUp, ChevronDown, 
  ChevronsUpDown, ExternalLink, Ticket, Copy, CheckCircle
} from 'lucide-react';
import { Voucher, VoucherType, VoucherStatus, mockVouchers } from '../../data/vouchersStore';

type SortKey = keyof Pick<Voucher, 'id' | 'code' | 'value' | 'customerName' | 'projectName' | 'isUsed' | 'usageDate' | 'expiryDate'>;
type SortDir = 'asc' | 'desc';

interface Props {
  onSelectVoucher: (id: string) => void;
  onCustomerClick: (id: string) => void;
  onOrderClick: (id: string) => void;
}

export default function VouchersList({ onSelectVoucher, onCustomerClick, onOrderClick }: Props) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<VoucherStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<VoucherType | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('expiryDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const tabs: (VoucherStatus | 'All')[] = ['All', 'Used', 'Unused', 'Expired'];

  const filtered = useMemo(() => {
    return mockVouchers.filter(v => {
      // Status Tab Filter
      const isExpired = new Date(v.expiryDate) < new Date() && !v.isUsed;
      if (activeTab === 'Used' && !v.isUsed) return false;
      if (activeTab === 'Unused' && (v.isUsed || isExpired)) return false;
      if (activeTab === 'Expired' && !isExpired) return false;
      
      // Type Filter
      if (typeFilter !== 'All' && v.type !== typeFilter) return false;

      // Search
      const q = search.toLowerCase();
      return !q || 
        v.code.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.customerName.toLowerCase().includes(q) ||
        v.customerNationalId.includes(q) ||
        v.projectName.toLowerCase().includes(q) ||
        v.propertyName.toLowerCase().includes(q) ||
        (v.orderId && v.orderId.toLowerCase().includes(q));
    });
  }, [search, activeTab, typeFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const TH = ({ id, label }: { id: SortKey; label: string }) => (
    <th 
      className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider cursor-pointer group whitespace-nowrap"
      onClick={() => toggleSort(id)}
    >
      <div className="flex items-center gap-1 group-hover:text-brand transition-colors">
        {label}
        {sortKey === id ? (
          sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        ) : (
          <ChevronsUpDown size={14} className="text-gray-300" />
        )}
      </div>
    </th>
  );

  const handleExport = () => {
    const header = ['ID', 'Code', 'Type', 'Value', 'Customer', 'Project', 'Property', 'Is Used', 'Usage Date', 'Expiry Date', 'Order ID'];
    const rows = filtered.map(v => [
      v.id, v.code, v.type, v.value, v.customerName, v.projectName, v.propertyName, 
      v.isUsed ? 'Yes' : 'No', v.usageDate || '-', v.expiryDate, v.orderId || '-'
    ]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'vouchers_export.csv'; link.click();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Ticket size={24} className="text-brand" /> Vouchers & Discounts
          </h1>
          <p className="text-sm text-gray-400 font-medium">Manage and track promotional discounts assigned to customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2 font-bold text-gray-600 bg-white shadow-sm hover:shadow-md transition-all">
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`px-6 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
            {filtered.length > 0 && activeTab === tab && (
              <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-md text-[10px]">{filtered.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by code, customer, project, order..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as any); setPage(1); }}
            className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Fixed Amount">Fixed Amount</option>
            <option value="Percentage">Percentage</option>
          </select>
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-400 font-bold">
            <Filter size={16} /> Filters
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px]">
              <tr>
                <TH id="id" label="Voucher ID" />
                <TH id="code" label="Voucher Code" />
                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Type</th>
                <TH id="value" label="Value" />
                <TH id="customerName" label="Customer" />
                <TH id="projectName" label="Project / Property" />
                <TH id="isUsed" label="Status" />
                <TH id="usageDate" label="Usage Date" />
                <TH id="expiryDate" label="Expiry" />
                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Order</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                        <Ticket size={32} />
                      </div>
                      <p className="text-gray-500 font-black">No vouchers found</p>
                      <p className="text-xs text-gray-400">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map(voucher => {
                  const isExpired = new Date(voucher.expiryDate) < new Date() && !voucher.isUsed;
                  const isExpiringSoon = !voucher.isUsed && !isExpired && 
                    (new Date(voucher.expiryDate).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={voucher.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs font-black text-brand bg-brand/5 px-2 py-1 rounded border border-brand/10">
                          {voucher.id}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-black bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg tracking-wider border border-gray-200">
                            {voucher.code}
                          </code>
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(voucher.code); }}
                            className="text-gray-300 hover:text-brand transition-colors p-1"
                            title="Copy Code"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={`text-[10px] uppercase font-black tracking-widest ${
                          voucher.type === 'Fixed Amount' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {voucher.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-gray-900 leading-none">
                          {voucher.type === 'Fixed Amount' ? `SAR ${voucher.value.toLocaleString()}` : `${voucher.value}%`}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span 
                            className="font-bold text-gray-900 hover:text-brand cursor-pointer transition-colors"
                            onClick={() => onCustomerClick(voucher.customerId)}
                          >
                            {voucher.customerName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">ID: {voucher.customerNationalId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{voucher.projectName}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{voucher.propertyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {voucher.isUsed ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-black shadow-sm">USED</Badge>
                        ) : isExpired ? (
                          <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-black shadow-sm">EXPIRED</Badge>
                        ) : (
                          <Badge className="bg-gray-50 text-gray-500 border-gray-200 text-[10px] font-black shadow-sm">UNUSED</Badge>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-bold text-gray-500">
                          {voucher.usageDate ? voucher.usageDate.split(' ')[0] : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[11px] font-black ${
                          isExpired ? 'text-red-500' : isExpiringSoon ? 'text-orange-500 animate-pulse' : 'text-gray-500'
                        }`}>
                          {voucher.expiryDate.split(' ')[0]}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {voucher.orderId ? (
                          <button 
                            onClick={() => onOrderClick(voucher.orderId!)}
                            className="flex items-center gap-1.5 font-bold text-brand hover:underline"
                          >
                            <span className="text-xs">{voucher.orderId}</span>
                            <ExternalLink size={12} />
                          </button>
                        ) : '—'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onSelectVoucher(voucher.id)}
                          className="hover:bg-brand/5 text-brand font-bold text-xs"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Showing <span className="text-gray-900">{((page - 1) * PAGE_SIZE) + 1}</span> to <span className="text-gray-900">{Math.min(page * PAGE_SIZE, sorted.length)}</span> of <span className="text-gray-900">{sorted.length}</span>
            </p>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-white transition-all shadow-sm"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg border text-xs font-black transition-all ${
                    page === i + 1 
                      ? 'bg-brand text-white border-brand shadow-md shadow-brand/20' 
                      : 'border-gray-200 text-gray-600 hover:bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-white transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
