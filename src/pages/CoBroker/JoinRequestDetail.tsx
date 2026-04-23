import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { JoinRequest, JoinRequestStatus } from '../../data/coBrokerStore';

const STATUS_BADGE: Record<JoinRequestStatus, 'default' | 'success' | 'destructive' | 'secondary'> = {
  'Pending': 'default',
  'Approved': 'success',
  'Rejected': 'destructive',
  'Inactive': 'secondary'
};

export default function JoinRequestDetail({ request, onBack }: { request: JoinRequest, onBack: () => void }) {
  if (!request) return null;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors mb-2">
          <ChevronLeft size={13} /> Back to Requests
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Join Request Detail</h1>
        <p className="text-sm text-gray-400 mt-1">Review broker application and verify details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {request.name.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                {request.name} {request.verified && <CheckCircle size={16} className="text-emerald-500" />}
              </h2>
              <p className="text-sm text-gray-500 mb-6">{request.username}</p>

              <div className="space-y-3 text-left">
                {[
                  { l: 'Phone', v: request.phone },
                  { l: 'Email', v: request.email },
                  { l: 'Nationality', v: request.nationality },
                  { l: 'National ID', v: request.nationalId, mono: true },
                  { l: 'Gender', v: request.gender === 'M' ? 'Male' : 'Female' },
                  { l: 'DOB', v: request.dob },
                ].map(info => (
                  <div key={info.l} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
                    <span className="text-xs text-gray-400 font-medium">{info.l}</span>
                    <span className={`text-sm font-medium ${info.mono ? 'font-mono' : ''}`}>{info.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-700">Broker Request Information</h3>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-3 divide-y md:divide-y-0 divide-gray-100 md:divide-x border-b">
                <div className="p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Request ID</p>
                  <p className="font-mono text-sm font-bold text-gray-800">{request.id}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Submitted Date</p>
                  <p className="text-sm font-medium text-gray-800">{request.submittedDate}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Request Status</p>
                  <Badge variant={STATUS_BADGE[request.status]}>{request.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <div className="p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">User ID</p>
                  <p className="font-mono text-sm font-medium text-gray-600">{request.userId}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">License Number</p>
                  <p className="font-mono text-sm font-bold text-brand">{request.licenseNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-700">History Logs</h3>
            </div>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b text-xs text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Action By</th>
                    <th className="px-4 py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {request.historyLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{log.action}</td>
                      <td className="px-4 py-3 text-gray-600">{log.actionBy}</td>
                      <td className="px-4 py-3 text-gray-500">{log.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="bg-white border hover:border-brand/40 transition-colors p-4 rounded-xl flex gap-3 flex-wrap shadow-sm">
            {request.status === 'Pending' && (
              <>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700"><CheckCircle size={16}/> Approve</Button>
                <Button variant="destructive" className="gap-2"><XCircle size={16}/> Reject</Button>
                <Button variant="outline" className="gap-2"><AlertCircle size={16}/> Deactivate</Button>
              </>
            )}
            {request.status === 'Approved' && (
              <>
                <Button variant="outline" className="gap-2"><AlertCircle size={16}/> Deactivate</Button>
                <Button variant="secondary" className="gap-2"><RefreshCw size={16}/> Check License Number</Button>
              </>
            )}
            {request.status === 'Rejected' && (
              <>
                <Button variant="outline" className="gap-2"><RefreshCw size={16}/> Re-open Application</Button>
                <Button variant="outline" className="gap-2"><AlertCircle size={16}/> Deactivate</Button>
              </>
            )}
            {request.status === 'Inactive' && (
              <>
                <Button className="gap-2 bg-brand hover:bg-brand/90"><CheckCircle size={16}/> Reactivate</Button>
                <Button variant="secondary" className="gap-2"><RefreshCw size={16}/> Check License Number</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
