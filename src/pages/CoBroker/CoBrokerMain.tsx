import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, ChevronDown, CheckCircle, ArrowRight } from 'lucide-react';
import { CoBrokerData, JoinRequestStatus, BrokerStatus, InterestStatus } from '../../data/coBrokerStore';

const JOIN_STATUS_BADGE: Record<JoinRequestStatus, 'default' | 'success' | 'destructive' | 'secondary'> = {
  'Pending': 'default',
  'Approved': 'success',
  'Rejected': 'destructive',
  'Inactive': 'secondary'
};

const BROKER_STATUS_BADGE: Record<BrokerStatus, 'success' | 'secondary' | 'default'> = {
  'Active': 'success',
  'Inactive': 'secondary',
  'Pending': 'default'
};

const INTEREST_STATUS_BADGE: Record<InterestStatus, 'success' | 'destructive'> = {
  'Active': 'success',
  'Expired': 'destructive'
};

export default function CoBrokerMain({ 
  data, onJoinRequestClick, onBrokerClick, onInterestClick 
}: { 
  data: CoBrokerData; 
  onJoinRequestClick: (id: string) => void;
  onBrokerClick: (id: string) => void;
  onInterestClick: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'Requests' | 'Brokers' | 'Interests'>('Requests');
  const [search, setSearch] = useState('');
  
  // Tab: Join Requests
  const filteredRequests = data.joinRequests.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.userId.toLowerCase().includes(search.toLowerCase())
  );

  // Tab: Active Brokers
  const filteredBrokers = data.activeBrokers.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.userId.toLowerCase().includes(search.toLowerCase())
  );

  // Tab: Interests
  const filteredInterests = data.interests.filter(i => 
    i.clientName.toLowerCase().includes(search.toLowerCase()) || 
    i.projectName.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Co-Broker Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage broker applications, active accounts, and property interests.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-white">
          <div className="flex">
            {(['Requests', 'Brokers', 'Interests'] as const).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSearch(''); }}
                className={`px-6 py-4 text-sm font-semibold relative transition-colors ${activeTab === tab ? 'text-brand' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'Requests' && 'Join Requests'}
                {tab === 'Brokers' && 'Active Brokers'}
                {tab === 'Interests' && 'Broker Interests'}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b bg-gray-50/50 flex gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white min-h-[400px]">
          <table className="w-full text-sm text-left">
            
            {activeTab === 'Requests' && (
              <>
                <thead className="bg-gray-50/50 text-gray-500 border-b text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">User ID</th>
                    <th className="px-6 py-3 font-medium">License</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Phone</th>
                    <th className="px-6 py-3 font-medium">Submitted</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{req.userId}</td>
                      <td className="px-6 py-4 font-mono text-xs">{req.licenseNumber}</td>
                      <td className="px-6 py-4 font-semibold text-brand cursor-pointer hover:underline" onClick={() => onJoinRequestClick(req.id)}>
                        {req.name} {req.verified && <CheckCircle size={12} className="inline text-emerald-500 mb-0.5" />}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{req.phone}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{req.submittedDate}</td>
                      <td className="px-6 py-4"><Badge variant={JOIN_STATUS_BADGE[req.status] as any}>{req.status}</Badge></td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => onJoinRequestClick(req.id)} className="text-brand hover:bg-brand/10 p-1.5 rounded-lg transition-colors">
                           <ArrowRight size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No requests found.</td></tr>
                  )}
                </tbody>
              </>
            )}

            {activeTab === 'Brokers' && (
              <>
                <thead className="bg-gray-50/50 text-gray-500 border-b text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">User ID</th>
                    <th className="px-6 py-3 font-medium">License</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Phone</th>
                    <th className="px-6 py-3 font-medium">Approved Date</th>
                    <th className="px-6 py-3 font-medium">Req Status</th>
                    <th className="px-6 py-3 font-medium">Account Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBrokers.map(brk => (
                    <tr key={brk.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{brk.userId}</td>
                      <td className="px-6 py-4 font-mono text-xs">{brk.licenseNumber}</td>
                      <td className="px-6 py-4 font-semibold text-brand cursor-pointer hover:underline" onClick={() => onBrokerClick(brk.id)}>
                        {brk.name} {brk.verified && <CheckCircle size={12} className="inline text-emerald-500 mb-0.5" />}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{brk.phone}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{brk.approvalDate}</td>
                      <td className="px-6 py-4"><Badge variant={JOIN_STATUS_BADGE[brk.requestStatus] as any} className="text-[10px]">{brk.requestStatus}</Badge></td>
                      <td className="px-6 py-4"><Badge variant={BROKER_STATUS_BADGE[brk.status]}>{brk.status}</Badge></td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => onBrokerClick(brk.id)} className="text-brand hover:bg-brand/10 p-1.5 rounded-lg transition-colors">
                           <ArrowRight size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBrokers.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No active brokers found.</td></tr>
                  )}
                </tbody>
              </>
            )}

            {activeTab === 'Interests' && (
              <>
                <thead className="bg-gray-50/50 text-gray-500 border-b text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Interest ID</th>
                    <th className="px-6 py-3 font-medium">Client Name</th>
                    <th className="px-6 py-3 font-medium">Client Phone</th>
                    <th className="px-6 py-3 font-medium">Project</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Created</th>
                    <th className="px-6 py-3 font-medium">Expiry</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInterests.map(int => (
                    <tr key={int.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-brand cursor-pointer hover:underline" onClick={() => onInterestClick(int.id)}>{int.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{int.clientName}</td>
                      <td className="px-6 py-4 text-gray-600">{int.clientPhone}</td>
                      <td className="px-6 py-4 text-gray-600">{int.projectName}</td>
                      <td className="px-6 py-4"><Badge variant={INTEREST_STATUS_BADGE[int.status]}>{int.status}</Badge></td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{int.createdDate}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{int.expiryDate}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => onInterestClick(int.id)} className="text-brand hover:bg-brand/10 p-1.5 rounded-lg transition-colors">
                           <ArrowRight size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInterests.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No interests found.</td></tr>
                  )}
                </tbody>
              </>
            )}

          </table>
        </div>
      </Card>
    </div>
  );
}
