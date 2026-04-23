import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Download, CheckCircle, XCircle, UserCircle2, ArrowRight,
  Filter, TrendingUp, Users, UserPlus, ShieldCheck,
  MoreHorizontal
} from 'lucide-react';

import { Customer, mockCustomers } from '../../data/customersStore';

type SortKey = keyof Pick<Customer, 'id' | 'fullName' | 'nationalId' | 'phone' | 'email' | 'nationality' | 'registrationDate'> | 'orderCount';
type SortDir = 'asc' | 'desc';

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-gray-300 ml-1" />;
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-brand ml-1" />
    : <ChevronDown size={13} className="text-brand ml-1" />;
}

interface Props {
  customers: Customer[];
  onCustomerClick: (id: string) => void;
}

export default function CustomersList({ customers, onCustomerClick }: Props) {
  const [search, setSearch] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('registrationDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const nationalities = useMemo(() => {
    const nat = Array.from(new Set(customers.map(c => c.nationality)));
    return ['All', ...nat];
  }, [customers]);

  const toggleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(col); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(c => {
      const matchSearch = !q ||
        c.id.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        c.nationalId.includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q);
      const matchNat = nationalityFilter === 'All' || c.nationality === nationalityFilter;
      const matchVerified =
        verifiedFilter === 'All' ||
        (verifiedFilter === 'Verified' && c.verified) ||
        (verifiedFilter === 'Unverified' && !c.verified);
      return matchSearch && matchNat && matchVerified;
    });
  }, [customers, search, nationalityFilter, verifiedFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortKey === 'orderCount') {
        aVal = a.orders.length;
        bVal = b.orders.length;
      } else {
        aVal = (a[sortKey] as string) ?? '';
        bVal = (b[sortKey] as string) ?? '';
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    const header = ['Customer ID', 'Full Name', 'Username', 'National ID', 'Phone', 'Email', 'Nationality', 'Verified', 'Orders', 'Registration Date'];
    const rows = filtered.map(c => [
      c.id, c.fullName, c.username, c.nationalId, c.phone, c.email, c.nationality,
      c.verified ? 'Verified' : 'Unverified', c.orders.length, c.registrationDate
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'customers.csv'; a.click();
  };

  const TH = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="px-5 py-3 font-medium whitespace-nowrap cursor-pointer select-none group"
      onClick={() => toggleSort(col)}
    >
      <span className="flex items-center gap-0.5 group-hover:text-brand transition-colors">
        {label}
        <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
      </span>
    </th>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Trends & KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Customers', 
            value: customers.length.toLocaleString(), 
            trend: '+12.5%', 
            isUp: true, 
            icon: <Users className="text-brand" size={20}/>,
            desc: 'Total registered profiles'
          },
          { 
            label: 'New This Month', 
            value: '142', 
            trend: '+18.2%', 
            isUp: true, 
            icon: <UserPlus className="text-emerald-500" size={20}/>,
            desc: 'New registrations in April'
          },
          { 
            label: 'Verified Rate', 
            value: `${((customers.filter(c => c.verified).length / customers.length) * 100).toFixed(1)}%`, 
            trend: '+2.4%', 
            isUp: true, 
            icon: <ShieldCheck className="text-blue-500" size={20}/>,
            desc: 'ID verification completion'
          },
          { 
            label: 'Active Orders', 
            value: '48', 
            trend: '-3.1%', 
            isUp: false, 
            icon: <TrendingUp className="text-amber-500" size={20}/>,
            desc: 'Customers with active prebooks'
          },
        ].map((kpi, i) => (
          <Card key={i} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {kpi.icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                  kpi.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {kpi.trend} {kpi.isUp ? '↑' : '↓'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-gray-900 leading-none">{kpi.value}</h3>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">{kpi.desc}</p>
              </div>
              {/* Simulated mini Sparkline */}
              <div className="mt-4 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                 <div className={`h-full rounded-full ${kpi.isUp ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: kpi.isUp ? '70%' : '40%' }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers Directory</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length.toLocaleString()} customers found</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 text-sm">
          <Download size={15} /> Export CSV
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, ID, email…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-gray-50 transition"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={14} className="text-gray-400" />
          <span className="font-medium">Nationality:</span>
          <select
            value={nationalityFilter}
            onChange={e => { setNationalityFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            {nationalities.map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex gap-1.5 items-center">
          {['All', 'Verified', 'Unverified'].map(v => (
            <button
              key={v}
              onClick={() => { setVerifiedFilter(v); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                verifiedFilter === v
                  ? 'bg-brand text-white shadow'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
              <tr>
                <TH col="id" label="Customer ID" />
                <TH col="fullName" label="Full Name" />
                <th className="px-5 py-3 font-medium">Username</th>
                <TH col="nationalId" label="National ID" />
                <TH col="phone" label="Phone" />
                <TH col="email" label="Email" />
                <TH col="nationality" label="Nationality" />
                <th className="px-5 py-3 font-medium">Verified</th>
                <TH col="orderCount" label="Orders" />
                <TH col="registrationDate" label="Registered" />
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center">
                    <UserCircle2 size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No customers found</p>
                    <p className="text-xs text-gray-300 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginated.map(c => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => onCustomerClick(c.id)}>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{c.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/20 to-brand/10 text-brand font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {c.fullName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <span className="font-semibold text-brand group-hover:underline">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{c.username}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{c.nationalId}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{c.email}</td>
                    <td className="px-5 py-3.5 text-gray-600">{c.nationality}</td>
                    <td className="px-5 py-3.5">
                      {c.verified
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><CheckCircle size={11} /> Verified</span>
                        : <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200"><XCircle size={11} /> Unverified</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${c.orders.length > 0 ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-400'}`}>
                        {c.orders.length}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{c.registrationDate}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-colors">
                        <ArrowRight size={15} />
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
          <div className="px-5 py-3 border-t bg-gray-50/50 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}</span>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition-colors">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${p === page ? 'bg-brand text-white border-brand' : 'hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition-colors">Next</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
