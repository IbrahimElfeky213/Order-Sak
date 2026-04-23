import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Download, Filter, ArrowRight, RefreshCw, Plus,
  FileText, User, ShoppingCart
} from 'lucide-react';
import { ResaleRequest, mockResaleRequests, ResaleStatus } from '../../data/resaleStore';

type SortKey = keyof Pick<ResaleRequest, 'id' | 'customerName' | 'propertyName' | 'projectName' | 'status' | 'requestedSalePrice' | 'submittedDate'>;
type SortDir = 'asc' | 'desc';

interface Props {
  requests: ResaleRequest[];
  onSelectRequest: (id: string) => void;
  onCustomerClick: (id: string) => void;
  onOrderClick: (id: string) => void;
}

export default function ResaleList({ requests, onSelectRequest, onCustomerClick, onOrderClick }: Props) {
  const [activeTab, setActiveTab] = useState<ResaleStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('submittedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const tabs: (ResaleStatus | 'All')[] = [
    'All', 'New Submission', 'Review in Progress', 'Awaiting Agreement', 'Publicly Listed', 'Declined', 'Withdrawn'
  ];

  const getStatusLabel = (status: ResaleStatus) => {
    switch (status) {
      case 'New Submission': return 'طلب جديد';
      case 'Review in Progress': return 'قيد المراجعة';
      case 'Awaiting Agreement': return 'بانتظار الاتفاقية';
      case 'Publicly Listed': return 'معروض للمزايدة';
      case 'Declined': return 'مرفوض';
      case 'Withdrawn': return 'مسحوب';
      default: return status;
    }
  };

  const getStatusColor = (status: ResaleStatus) => {
    switch (status) {
      case 'New Submission': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Review in Progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Awaiting Agreement': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Publicly Listed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Declined': return 'bg-red-50 text-red-700 border-red-200';
      case 'Withdrawn': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchTab = activeTab === 'All' || r.status === activeTab;
      const q = search.toLowerCase();
      const matchSearch = !q || 
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.propertyName.toLowerCase().includes(q) ||
        r.projectName.toLowerCase().includes(q) ||
        r.customerNationalId.includes(q);
      return matchTab && matchSearch;
    });
  }, [activeTab, search, requests]);

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
    const header = ['ID', 'Customer', 'National ID', 'Property', 'Project', 'Status', 'Sale Price', 'Commission', 'Submitted Date'];
    const rows = filtered.map(r => [
      r.id, r.customerName, r.customerNationalId, r.propertyName, r.projectName, 
      r.status, r.requestedSalePrice, r.commissionFee, r.submittedDate
    ]);
    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'resale_requests.csv'; link.click();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <RefreshCw size={24} className="text-brand animate-spin-slow" /> Resale Requests
          </h1>
          <p className="text-sm text-gray-400 font-medium">Manage and review property resale listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2 font-bold text-gray-600 bg-white shadow-sm hover:shadow-md transition-all">
            <Download size={16} /> Export CSV
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-white gap-2 font-bold shadow-lg shadow-brand/20 transition-all active:scale-95">
            <Plus size={16} /> New Internal Request
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
            placeholder="Search by ID, name, property, project, ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-500 font-bold">
          <Filter size={16} /> Filters
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px]">
              <tr>
                <TH id="id" label="Request ID" />
                <TH id="customerName" label="Customer Name" />
                <th className="px-6 py-4 font-bold text-gray-500">Property Information</th>
                <TH id="status" label="Status" />
                <TH id="requestedSalePrice" label="Sale Price" />
                <th className="px-6 py-4 font-bold text-gray-500">Commission (2.5%)</th>
                <TH id="submittedDate" label="Submitted" />
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                        <RefreshCw size={32} />
                      </div>
                      <p className="text-gray-500 font-black">No resale requests found</p>
                      <p className="text-xs text-gray-400">Try adjusting your filters or search query</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => onSelectRequest(request.id)}>
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs font-black text-brand bg-brand/5 px-2 py-1 rounded border border-brand/10">
                        {request.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px] ring-1 ring-white shadow-sm">
                          {request.customerName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span 
                            className="font-bold text-gray-900 group-hover:text-brand transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); onCustomerClick(request.customerId); }}
                          >
                            {request.customerName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">ID: {request.customerNationalId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900">{request.propertyName}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{request.projectName}</span>
                        <div 
                          className="mt-1 flex items-center gap-1 text-[10px] font-black text-brand/70 hover:text-brand cursor-pointer transition-colors"
                          onClick={(e) => { e.stopPropagation(); onOrderClick(request.purchaseOrderId); }}
                        >
                          <ShoppingCart size={10} /> Order #{request.purchaseOrderId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider border transition-all ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 leading-tight">SAR {request.requestedSalePrice.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">Request amount</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-emerald-600 leading-tight">SAR {request.commissionFee.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400">2.5% platform fee</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-600">{request.submittedDate.split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-400">{request.submittedDate.split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand hover:bg-brand/5 transition-all">
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
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
