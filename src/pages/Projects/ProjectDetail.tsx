import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Project, Unit, UnitStatus } from '../../data/projectsStore';
import {
  ChevronLeft, MapPin, Calendar, Building2, Users, FileText,
  TrendingUp, Search, ArrowUpDown, Download, ExternalLink,
  Image, ChevronDown, Filter, CheckCircle2, Clock, Tag
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

/* ── helpers ─────────────────────────────────────────────────── */
const fmt = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(2)}M SAR`
    : `${v.toLocaleString()} SAR`;

const UNIT_STATUS_COLORS: Record<UnitStatus, string> = {
  'Available':   'bg-emerald-500',
  'Booked':      'bg-amber-400',
  'Sold':        'bg-red-500',
  'Coming Soon': 'bg-blue-400',
  'Reserved':    'bg-purple-400',
};
const UNIT_STATUS_BADGE: Record<UnitStatus, 'success' | 'warning' | 'destructive' | 'default' | 'secondary'> = {
  'Available':   'success',
  'Booked':      'warning',
  'Sold':        'destructive',
  'Coming Soon': 'default',
  'Reserved':    'secondary',
};
const PROJ_STATUS_BADGE = {
  'Available':   'success',
  'Coming Soon': 'default',
  'Sold Out':    'destructive',
  'On Hold':     'secondary',
} as const;

/* ── piechart helper ─────────────────────────────────────────── */
const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

/* ── stat card ───────────────────────────────────────────────── */
function KpiCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-lg font-bold ${color ?? 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
interface Props {
  project: Project;
  onBack: () => void;
  onOrderClick: (id: string) => void;
}

export default function ProjectDetail({ project: p, onBack, onOrderClick }: Props) {
  const [activeTab, setActiveTab] = useState('Units');
  const [unitSearch, setUnitSearch]     = useState('');
  const [unitStatus, setUnitStatus]     = useState<UnitStatus | 'All'>('All');
  const [orderSearch, setOrderSearch]   = useState('');
  const [teamSearch, setTeamSearch]     = useState('');
  const [lightbox, setLightbox]         = useState<string | null>(null);

  const tabs = ['Units', 'Orders', 'Sales Team', 'Images', 'Documents', 'Analytics'];

  /* filtered units */
  const filteredUnits = useMemo(() =>
    p.units.filter(u =>
      (unitStatus === 'All' || u.status === unitStatus) &&
      (u.id.toLowerCase().includes(unitSearch.toLowerCase()) || u.block.toLowerCase().includes(unitSearch.toLowerCase()))
    ), [p.units, unitStatus, unitSearch]
  );

  /* filtered orders */
  const filteredOrders = useMemo(() =>
    p.orders.filter(o =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(orderSearch.toLowerCase())
    ), [p.orders, orderSearch]
  );

  /* filtered team */
  const filteredTeam = useMemo(() =>
    p.salesTeam.filter(s =>
      s.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(teamSearch.toLowerCase())
    ), [p.salesTeam, teamSearch]
  );

  /* pie data */
  const pieData = [
    { name: 'Available',   value: p.availableUnits   },
    { name: 'Booked',      value: p.bookedUnits       },
    { name: 'Sold',        value: p.soldUnits         },
    { name: 'Coming Soon', value: p.comingSoonUnits   },
  ].filter(d => d.value > 0);

  /* price distribution */
  const priceBuckets = useMemo(() => {
    const buckets: Record<string, number> = {};
    p.units.forEach(u => {
      const label = u.price < 500000 ? '<500K' : u.price < 1000000 ? '500K–1M' :
        u.price < 1500000 ? '1M–1.5M' : u.price < 2000000 ? '1.5M–2M' : '>2M';
      buckets[label] = (buckets[label] || 0) + 1;
    });
    return Object.entries(buckets).map(([name, count]) => ({ name, count }));
  }, [p.units]);

  return (
    <div className="space-y-5">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors mb-2">
          <ChevronLeft size={13} /> Back to Projects
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
          <Badge variant={PROJ_STATUS_BADGE[p.status] as any} className="text-xs px-2.5 py-1">{p.status}</Badge>
        </div>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <MapPin size={10} /> {p.address}
          &nbsp;&middot;&nbsp; <span className="font-mono text-gray-300">{p.id}</span>
        </p>
      </div>

      {/* ── 2-COLUMN LAYOUT ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* ════ LEFT PANEL ════════════════════════════════════ */}
        <div className="xl:col-span-4 space-y-4 xl:sticky xl:top-4">

          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-0">
              {[
                { l: 'Project ID',  v: p.id,          mono: true },
                { l: 'City',        v: p.city },
                { l: 'Developer',   v: p.developer,   link: true },
                { l: 'Phase',       v: p.phase },
                { l: 'Launch Date', v: p.launchDate },
                { l: 'Completion',  v: p.completionDate },
              ].map(row => (
                <div key={row.l} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{row.l}</span>
                  <span className={`text-sm font-medium text-right ${row.mono ? 'font-mono text-xs text-gray-500' : ''} ${row.link ? 'text-brand hover:underline cursor-pointer flex items-center gap-1' : 'text-gray-900'}`}>
                    {row.v}
                    {row.link && <ExternalLink size={10} className="opacity-40" />}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Description */}
          {p.description && (
            <Card>
              <CardContent className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">About</p>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Inventory Summary */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-center mb-3">
                <p className="text-3xl font-black text-gray-900">{p.totalUnits}</p>
                <p className="text-xs text-gray-400">Total Units</p>
              </div>
              {/* visual squares */}
              <div className="flex flex-wrap gap-0.5 mb-3 rounded-lg overflow-hidden">
                {p.units.map(u => (
                  <div key={u.id} title={`${u.id} · ${u.status}`}
                    className={`w-4 h-4 ${UNIT_STATUS_COLORS[u.status]} hover:opacity-70 transition-opacity cursor-default`} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: 'Available',   n: p.availableUnits,   c: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { l: 'Booked',      n: p.bookedUnits,       c: 'text-amber-600',   bg: 'bg-amber-50' },
                  { l: 'Sold',        n: p.soldUnits,         c: 'text-red-600',     bg: 'bg-red-50' },
                  { l: 'Coming Soon', n: p.comingSoonUnits,   c: 'text-blue-600',    bg: 'bg-blue-50' },
                ].map(s => (
                  <div key={s.l} className={`${s.bg} rounded-lg p-2.5 text-center`}>
                    <p className={`text-lg font-bold ${s.c}`}>{s.n}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{s.l}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                <Calendar size={10} /> Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="relative border-l-2 border-gray-100 ml-3 space-y-4">
                {[
                  { label: 'Project Launch',     date: p.launchDate,     done: true  },
                  { label: p.phase,              date: 'In Progress',    done: false },
                  { label: 'Expected Completion',date: p.completionDate, done: false },
                ].map((ev, i) => (
                  <div key={i} className="relative pl-4">
                    <div className={`absolute -left-[7px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${ev.done ? 'bg-brand border-brand' : 'bg-white border-gray-300'}`} />
                    <p className="text-xs font-semibold text-gray-800">{ev.label}</p>
                    <p className="text-[11px] text-gray-400">{ev.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ════ RIGHT PANEL ═══════════════════════════════════ */}
        <div className="xl:col-span-8 space-y-4">

          {/* Sales KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KpiCard label="Total Revenue"       value={fmt(p.totalRevenue)}   color={p.totalRevenue > 0 ? 'text-emerald-600' : 'text-gray-400'} />
            <KpiCard label="Total Bookings"      value={fmt(p.totalBookings)} />
            <KpiCard label="Avg Unit Price"      value={fmt(p.avgUnitPrice)} />
            <KpiCard label="Highest Unit"        value={fmt(p.highestPrice)} />
            <KpiCard label="Lowest Unit"         value={fmt(p.lowestPrice)} />
            <KpiCard label="Sales Velocity"      value={`${p.salesVelocity} / mo`} color="text-brand" />
          </div>

          {/* Tabs */}
          <Card className="overflow-hidden">
            <div className="border-b bg-gray-50/40">
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap relative transition-colors flex-shrink-0 ${activeTab === tab ? 'text-brand' : 'text-gray-400 hover:text-gray-600'}`}>
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            {/* ── UNITS TAB ────────────────────────────────── */}
            {activeTab === 'Units' && (
              <div>
                <div className="p-4 border-b flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {(['All', 'Available', 'Booked', 'Sold', 'Coming Soon'] as const).map(s => (
                      <button key={s} onClick={() => setUnitStatus(s)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${unitStatus === s ? 'bg-brand text-white font-semibold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input value={unitSearch} onChange={e => setUnitSearch(e.target.value)}
                      placeholder="Search unit ID or block…"
                      className="pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand w-52" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                      <tr>{['Unit ID','Block','Type','Area','Price','Status','Order','Updated'].map(h =>
                        <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUnits.length === 0 ? (
                        <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-300 text-sm">No units found.</td></tr>
                      ) : filteredUnits.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{u.id}</td>
                          <td className="px-4 py-3 text-gray-500">{u.block}</td>
                          <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{u.type}</Badge></td>
                          <td className="px-4 py-3 text-gray-700">{u.area} m²</td>
                          <td className="px-4 py-3 font-semibold text-sm">{u.price.toLocaleString()} SAR</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              u.status === 'Available' ? 'bg-emerald-50 text-emerald-700' :
                              u.status === 'Booked'    ? 'bg-amber-50 text-amber-700' :
                              u.status === 'Sold'      ? 'bg-red-50 text-red-700' :
                              'bg-blue-50 text-blue-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${UNIT_STATUS_COLORS[u.status]}`} />
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {u.orderId ? (
                              <button onClick={() => onOrderClick(u.orderId!)}
                                className="text-[11px] font-mono font-semibold text-brand hover:underline">
                                {u.orderId}
                              </button>
                            ) : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{u.lastUpdated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t bg-gray-50/30 text-xs text-gray-400">
                  Showing {filteredUnits.length} of {p.units.length} units
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ───────────────────────────────── */}
            {activeTab === 'Orders' && (
              <div>
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Search by Order ID or buyer…"
                      className="pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand w-full" />
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{filteredOrders.length} orders</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                      <tr>{['Order ID','Buyer','Unit','Status','Booking Date','Total Amount'].map(h =>
                        <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-300 text-sm">No orders for this project.</td></tr>
                      ) : filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => onOrderClick(o.id)}>
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-brand hover:underline">{o.id}</td>
                          <td className="px-4 py-3 font-medium">{o.buyerName}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{o.unit}</td>
                          <td className="px-4 py-3">
                            <Badge variant={o.status === 'Deed Transferred' ? 'success' : o.status === 'Expire' ? 'destructive' : 'default'} className="text-[10px]">{o.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{o.bookingDate}</td>
                          <td className="px-4 py-3 font-semibold">{o.totalAmount.toLocaleString()} SAR</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── SALES TEAM TAB ───────────────────────────── */}
            {activeTab === 'Sales Team' && (
              <div>
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input value={teamSearch} onChange={e => setTeamSearch(e.target.value)}
                      placeholder="Search by name or email…"
                      className="pl-9 pr-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand w-full" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                      <tr>{['Name','Email','Phone','Role','Units Sold','Commission','Status'].map(h =>
                        <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredTeam.length === 0 ? (
                        <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-300 text-sm">No staff assigned.</td></tr>
                      ) : filteredTeam.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-brand/10 text-brand text-xs flex items-center justify-center font-bold">
                                {s.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                              </div>
                              <span className="font-medium text-sm">{s.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{s.email}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{s.phone}</td>
                          <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{s.role}</Badge></td>
                          <td className="px-4 py-3 font-bold text-brand">{s.unitsSold}</td>
                          <td className="px-4 py-3 font-semibold">{s.commission.toLocaleString()} SAR</td>
                          <td className="px-4 py-3"><Badge variant={s.status === 'Active' ? 'success' : 'secondary'} className="text-[10px]">{s.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── IMAGES TAB ───────────────────────────────── */}
            {activeTab === 'Images' && (
              <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Image size={28} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">No images uploaded yet</p>
                <p className="text-xs text-gray-400">Project images will appear here once uploaded via the CMS.</p>
                <Button variant="outline" className="gap-1.5 h-8 text-xs mt-2">Request Images from CMS</Button>
              </div>
            )}

            {/* ── DOCUMENTS TAB ────────────────────────────── */}
            {activeTab === 'Documents' && (
              <div className="p-4 space-y-2">
                {p.documents.length === 0 ? (
                  <p className="text-center py-10 text-gray-300 text-sm">No documents available.</p>
                ) : p.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={14} className="text-brand" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-[10px]">{doc.type}</Badge>
                          <span className="text-xs text-gray-400">{doc.size} · {doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download size={12} /> Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* ── ANALYTICS TAB ────────────────────────────── */}
            {activeTab === 'Analytics' && (
              <div className="p-5 space-y-8">
                {p.monthlySales.length === 0 ? (
                  <div className="py-12 text-center text-gray-300">
                    <TrendingUp size={36} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No sales data available yet — project not launched.</p>
                  </div>
                ) : (
                  <>
                    {/* Sales trend */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Monthly Sales Trend</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={p.monthlySales} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip formatter={(v: number, n: string) => [n === 'units' ? `${v} units` : `${v.toLocaleString()} SAR`, n === 'units' ? 'Units Sold' : 'Revenue']} />
                          <Line type="monotone" dataKey="units"   stroke="#3b5bdb" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Units distribution + price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Units by Status</h3>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Price Distribution</h3>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={priceBuckets} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b5bdb" radius={[4,4,0,0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
