import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { mockProjects, Project, ProjectStatus } from '../../data/projectsStore';
import {
  Search, Building2, MapPin, Users, ArrowRight, TrendingUp,
  ChevronDown, ExternalLink, Layout
} from 'lucide-react';

/* ── constants ─────────────────────────────────────────────────── */
const PROJ_STATUS_BADGE: Record<ProjectStatus, 'success' | 'default' | 'destructive' | 'secondary'> = {
  'Available':   'success',
  'Coming Soon': 'default',
  'Sold Out':    'destructive',
  'On Hold':     'secondary',
};

const UNIT_DOT: Record<string, string> = {
  'Available':   'bg-emerald-500',
  'Booked':      'bg-amber-400',
  'Sold':        'bg-red-500',
  'Coming Soon': 'bg-blue-400',
  'Reserved':    'bg-purple-400',
};

/* ── skeleton card ─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border rounded-2xl p-5 animate-pulse space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex flex-wrap gap-0.5 py-1">
        {Array.from({ length: 24 }).map((_, i) => <div key={i} className="w-4 h-4 bg-gray-100 rounded-sm" />)}
      </div>
      <div className="grid grid-cols-4 gap-2 pt-2">
        {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
      </div>
    </div>
  );
}

/* ── project card ──────────────────────────────────────────────── */
interface CardProps { project: Project; onClick: () => void; onOrdersClick: () => void; }

function ProjectCard({ project: p, onClick, onOrdersClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-brand/30 transition-all duration-200 group space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant={PROJ_STATUS_BADGE[p.status]} className="text-[10px] px-2 py-0.5">
              {p.status}
            </Badge>
            <span className="text-[10px] font-mono text-gray-300">{p.id}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-brand transition-colors truncate">{p.name}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={10} /> {p.city}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-brand/8 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/15 transition-colors">
          <Building2 size={20} className="text-brand" />
        </div>
      </div>

      {/* Units visual grid */}
      <div>
        <p className="text-[10px] text-gray-400 mb-1.5 font-medium">
          Total: <span className="font-bold text-gray-700">{p.totalUnits} units</span>
        </p>
        <div className="flex flex-wrap gap-0.5 rounded-md overflow-hidden">
          {p.units.slice(0, 60).map(u => (
            <div key={u.id} title={`${u.id} · ${u.status}`}
              className={`w-3.5 h-3.5 ${UNIT_DOT[u.status] ?? 'bg-gray-200'} hover:opacity-70 transition-opacity`} />
          ))}
          {p.units.length > 60 && (
            <div className="w-3.5 h-3.5 bg-gray-200 flex items-center justify-center">
              <span className="text-[7px] text-gray-500">+</span>
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="flex gap-3 mt-1.5 flex-wrap">
          {[
            { l: 'Available', c: 'bg-emerald-500', n: p.availableUnits },
            { l: 'Booked',    c: 'bg-amber-400',   n: p.bookedUnits },
            { l: 'Sold',      c: 'bg-red-500',      n: p.soldUnits },
          ].map(s => s.n > 0 && (
            <span key={s.l} className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className={`w-2 h-2 rounded-sm ${s.c}`} />
              {s.l}: <strong className="text-gray-700">{s.n}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t">
        {[
          { l: 'Available', n: p.availableUnits,   c: 'text-emerald-600' },
          { l: 'Booked',    n: p.bookedUnits,       c: 'text-amber-600' },
          { l: 'Sold',      n: p.soldUnits,         c: 'text-red-600' },
          { l: 'Soon',      n: p.comingSoonUnits,   c: 'text-blue-600' },
        ].map(s => (
          <div key={s.l} className="text-center">
            <p className={`text-base font-bold ${s.c}`}>{s.n}</p>
            <p className="text-[9px] text-gray-400 leading-tight">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t">
        <button
          onClick={e => { e.stopPropagation(); onOrdersClick(); }}
          className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 transition-colors"
        >
          {p.orders.length} Orders <ExternalLink size={10} />
        </button>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          {p.developer.length > 22 ? p.developer.slice(0, 22) + '…' : p.developer}
        </span>
      </div>
    </div>
  );
}

/* ── main component ────────────────────────────────────────────── */
interface Props {
  onProjectClick: (id: string) => void;
  onOrdersFilter?: (projectName: string) => void;
}

export default function ProjectsList({ onProjectClick, onOrdersFilter }: Props) {
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatus]   = useState<ProjectStatus | 'All'>('All');
  const [sortBy,     setSortBy]     = useState<'name' | 'total' | 'available'>('name');

  const filtered = useMemo(() => {
    let list = mockProjects.filter(p =>
      (statusFilter === 'All' || p.status === statusFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.id.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy === 'name')      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'total')     list = [...list].sort((a, b) => b.totalUnits - a.totalUnits);
    if (sortBy === 'available') list = [...list].sort((a, b) => b.availableUnits - a.availableUnits);
    return list;
  }, [search, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* ── Page header ───────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-400 mt-1">Read-only data synced from the Content Management System.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Synced with CMS
        </div>
      </div>

      {/* ── Summary stats bar ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: 'Total Projects',   n: mockProjects.length,                                      c: 'text-gray-900' },
          { l: 'Total Units',      n: mockProjects.reduce((s, p) => s + p.totalUnits, 0),       c: 'text-gray-700' },
          { l: 'Available Units',  n: mockProjects.reduce((s, p) => s + p.availableUnits, 0),   c: 'text-emerald-600' },
          { l: 'Sold Units',       n: mockProjects.reduce((s, p) => s + p.soldUnits, 0),         c: 'text-red-600' },
        ].map(s => (
          <div key={s.l} className="bg-white border rounded-xl p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-0.5">{s.l}</p>
            <p className={`text-xl font-bold ${s.c}`}>{s.n}</p>
          </div>
        ))}
      </div>

      {/* ── Filters bar ───────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by project name or ID…"
            className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {(['All', 'Available', 'Coming Soon', 'Sold Out', 'On Hold'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                statusFilter === s
                  ? 'bg-brand text-white border-brand shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand/40 hover:text-brand'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative ml-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="appearance-none bg-white border rounded-lg pl-3 pr-8 py-2.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand cursor-pointer"
          >
            <option value="name">Sort: Name</option>
            <option value="total">Sort: Total Units</option>
            <option value="available">Sort: Available</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Building2 size={28} className="text-gray-300" />
          </div>
          <p className="text-base font-semibold text-gray-500">No projects found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter.</p>
          <Button variant="outline" className="mt-4 text-xs h-8" onClick={() => { setSearch(''); setStatus('All'); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => onProjectClick(p.id)}
              onOrdersClick={() => onOrdersFilter?.(p.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
