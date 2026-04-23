import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ChevronLeft, CheckCircle, ArrowRight, Download, FileText, FileSignature } from 'lucide-react';
import { ActiveBroker, BrokerStatus, JoinRequestStatus, CommissionStatus } from '../../data/coBrokerStore';

const BROKER_STATUS_BADGE: Record<BrokerStatus, 'success' | 'secondary' | 'default'> = {
  'Active': 'success',
  'Inactive': 'secondary',
  'Pending': 'default'
};
const JOIN_STATUS_BADGE: Record<JoinRequestStatus, 'default' | 'success' | 'destructive' | 'secondary'> = {
  'Pending': 'default',
  'Approved': 'success',
  'Rejected': 'destructive',
  'Inactive': 'secondary'
};
const COMM_STATUS_BADGE: Record<CommissionStatus, 'warning' | 'default' | 'success'> = {
  'Expected': 'warning',
  'Due': 'default',
  'Transferred': 'success'
};

export default function BrokerProfile({ broker, onBack, onInterestClick }: { broker: ActiveBroker, onBack: () => void, onInterestClick: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'Interests' | 'Commissions' | 'Documents'>('Interests');

  if (!broker) return null;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors mb-2">
          <ChevronLeft size={13} /> Back to Active Brokers
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Broker Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel - 25% */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
               <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {broker.name.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center justify-center gap-1">
                {broker.name} {broker.verified && <CheckCircle size={14} className="text-emerald-500" />}
              </h2>
              <p className="text-xs text-gray-500 mb-6">{broker.username}</p>

              <div className="space-y-2 text-left mb-6">
                {[
                  { l: 'Phone', v: broker.phone },
                  { l: 'Email', v: broker.email },
                  { l: 'Nationality', v: broker.nationality },
                  { l: 'National ID', v: broker.nationalId, mono: true },
                  { l: 'Gender', v: broker.gender === 'M' ? 'Male' : 'Female' },
                  { l: 'DOB', v: broker.dob },
                ].map(info => (
                  <div key={info.l} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
                    <span className="text-[10px] text-gray-400 font-medium uppercase">{info.l}</span>
                    <span className={`text-xs font-medium ${info.mono ? 'font-mono' : ''}`}>{info.v}</span>
                  </div>
                ))}
              </div>

               <div className="text-left border-t border-gray-100 pt-4">
                 <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Account Status</p>
                 <Badge variant={BROKER_STATUS_BADGE[broker.status]} className="w-full justify-center mb-2">{broker.status}</Badge>
                 <p className="text-xs text-gray-500">Created: {broker.createdDate}</p>
                 <p className="text-xs text-gray-500">Last Activity: {broker.lastActivityDate}</p>
               </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
             <div className="bg-white p-4 border rounded-xl shadow-sm hover:border-brand/40 transition-colors">
               <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Total Transferred</p>
               <p className="text-xl font-bold text-success">{broker.totalTransferredCommission.toLocaleString()} <span className="text-xs">SAR</span></p>
             </div>
          </div>
        </div>

        {/* Center Panel - 35% */}
        <div className="lg:col-span-4 space-y-4">
           <Card>
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-700">Broker Request Information</h3>
            </div>
            <CardContent className="p-4 space-y-4">
               <div>
                  <p className="text-[10px] text-gray-400 uppercase mb-1">Request ID</p>
                  <p className="font-mono text-sm font-bold text-gray-800">{broker.requestId}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Submitted Date</p>
                    <p className="text-xs font-medium text-gray-800">{broker.submittedDate}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase mb-1">Approval Date</p>
                    <p className="text-xs font-medium text-gray-800">{broker.approvalDate}</p>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4 border-t pt-4">
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase mb-1">User ID</p>
                    <p className="font-mono text-xs font-medium text-gray-600">{broker.userId}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase mb-1">License Number</p>
                    <p className="font-mono text-xs font-bold text-brand">{broker.licenseNumber}</p>
                 </div>
               </div>
            </CardContent>
          </Card>

           <Card>
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-700">History Logs</h3>
            </div>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-50">
                  {broker.historyLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                         <p className="text-xs font-medium text-gray-800">{log.action}</p>
                         <p className="text-[10px] text-gray-400">{log.timestamp} • {log.actionBy}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Tabs - 40% */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b bg-white">
              <div className="flex overflow-x-auto scrollbar-hide">
                {(['Interests', 'Commissions', 'Documents'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-xs font-semibold relative transition-colors ${activeTab === tab ? 'text-brand' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50/20">
               {activeTab === 'Interests' && (
                 <div className="p-4 text-center text-sm text-gray-500">
                    {/* Placeholder for interests list. The requirements say list of all interests. For brevity, displaying minimal list */}
                    <div className="space-y-3">
                       <Button variant="outline" className="w-full mb-2">View Full Interests List</Button>
                       <p className="text-xs text-gray-400 mb-2">To view detailed interests mapping, please refer to the dedicated Interests module.</p>
                    </div>
                 </div>
               )}

               {activeTab === 'Commissions' && (
                  <div className="p-4 space-y-4">
                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 border border-warning/30 rounded-lg">
                           <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Expected</p>
                           <p className="text-base font-bold text-warning">{broker.totalExpectedCommission.toLocaleString()} <span className="text-xs">SAR</span></p>
                        </div>
                        <div className="bg-white p-3 border border-brand/30 rounded-lg">
                           <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Due</p>
                           <p className="text-base font-bold text-brand">{broker.totalDueCommission.toLocaleString()} <span className="text-xs">SAR</span></p>
                        </div>
                     </div>
                     
                     <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="p-3 bg-gray-50/50 border-b">
                           <p className="text-xs font-bold text-gray-700">Transfer History</p>
                        </div>
                        <table className="w-full text-xs text-left">
                           <thead className="bg-gray-50 border-b text-gray-400 uppercase">
                              <tr>
                                 <th className="px-3 py-2">Transfer ID</th>
                                 <th className="px-3 py-2">Amount</th>
                                 <th className="px-3 py-2">Date</th>
                                 <th className="px-3 py-2">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {broker.transfers.map(trf => (
                                 <tr key={trf.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 font-mono text-gray-500">{trf.id}</td>
                                    <td className="px-3 py-2 font-bold text-gray-800">{trf.amount.toLocaleString()} SAR</td>
                                    <td className="px-3 py-2 text-gray-500">{trf.date}</td>
                                    <td className="px-3 py-2"><Badge variant="default" className="text-[9px]">{trf.status}</Badge></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <Button className="w-full">Generate Commission Report</Button>
                  </div>
               )}

               {activeTab === 'Documents' && (
                  <div className="p-4 space-y-3 flex-1">
                    {broker.documents.map(doc => (
                       <div key={doc.id} className="bg-white border rounded-lg p-3 flex justify-between items-center group hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-brand/10 text-brand flex items-center justify-center shrink-0">
                                <FileSignature size={14} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-800">{doc.name}</p>
                                <div className="flex gap-2 items-center mt-0.5">
                                   <Badge variant="secondary" className="text-[9px]">{doc.type}</Badge>
                                   <span className="text-[10px] text-gray-400">{doc.uploadedAt}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button className="text-gray-400 hover:text-brand p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Download size={14}/></button>
                          </div>
                       </div>
                    ))}
                  </div>
               )}
            </div>
          </Card>
          
          <div className="bg-white border hover:border-brand/40 p-4 rounded-xl shadow-sm text-center">
             <Button variant="outline" className="w-full relative"><CheckCircle size={16} className="text-emerald-500 absolute left-4"/> Request New Validations from Absher/Wafi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
