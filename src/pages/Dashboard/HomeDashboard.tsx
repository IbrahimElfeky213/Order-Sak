import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ShoppingBag, CheckCircle, AlertCircle, DollarSign, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { Order } from '../../data/ordersStore';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid 
} from 'recharts';

// --- MOCK DATA ---
const reqActionsMock = [
  { id: 'REQ-101', type: 'Resale Request', customer: 'Saad Al-Mutairi', status: 'New', date: '2026-04-18' },
  { id: 'ORD-1002', type: 'Order', customer: 'Sarah Al-Qahtani', status: 'Deposit Paid', date: '2026-04-10' },
  { id: 'BRK-55', type: 'Co-Broker Request', customer: 'Waqar Real Estate', status: 'Pending', date: '2026-04-19' },
  { id: 'ORD-1005', type: 'Order', customer: 'Khalid Al-Ghamdi', status: 'Expire', date: '2026-04-12' },
  { id: 'REQ-102', type: 'Resale Request', customer: 'Noura Al-Shehri', status: 'Reviewing', date: '2026-04-20' },
];

const revenueMockData = [
  { name: 'Nov', revenue: 1200000 },
  { name: 'Dec', revenue: 2100000 },
  { name: 'Jan', revenue: 800000 },
  { name: 'Feb', revenue: 2500000 },
  { name: 'Mar', revenue: 3200000 },
  { name: 'Apr', revenue: 4500000 },
];

const ordersStatusMockData = [
  { name: 'Prebook', count: 45, color: '#94a3b8' },
  { name: 'Deposit', count: 80, color: '#3b82f6' },
  { name: 'Installment', count: 120, color: '#EAB308' },
  { name: 'Deed', count: 35, color: '#22C55E' },
  { name: 'Cancelled', count: 15, color: '#EF4444' },
];

interface HomeDashboardProps { orders: Order[]; onOrderClick: (id: string) => void; }

export default function HomeDashboard({ orders, onOrderClick }: HomeDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate remote fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Format currency
  const formatSAR = (value: number) => {
    return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(value);
  };

  const pendingActionsCount = reqActionsMock.length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(k => <div key={k} className="h-32 bg-gray-200 rounded-lg"></div>)}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Orders', 
            value: '1,248', 
            sub: 'All time', 
            icon: <ShoppingBag size={18} />, 
            trend: '+12%', 
            isUp: true, 
            color: 'brand' 
          },
          { 
            label: 'Active Orders', 
            value: '342', 
            sub: 'Currently active', 
            icon: <Activity size={18} />, 
            trend: '+5%', 
            isUp: true, 
            color: 'success' 
          },
          { 
            label: 'Pending Actions', 
            value: pendingActionsCount.toString(), 
            sub: 'Needs admin attention', 
            icon: <AlertCircle size={18} />, 
            trend: '-2', 
            isUp: false, 
            color: 'warning', 
            highlight: pendingActionsCount > 0 
          },
          { 
            label: 'Total Revenue', 
            value: 'SAR 45.2M', 
            sub: 'All collected payments', 
            icon: <DollarSign size={18} />, 
            trend: '+8%', 
            isUp: true, 
            color: 'primary' 
          },
        ].map((kpi, idx) => (
          <Card key={idx} className="overflow-hidden border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-tight">{kpi.label}</p>
                  <p className={`text-2xl font-bold ${kpi.highlight ? 'text-warning' : 'text-gray-900'}`}>{kpi.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${
                  kpi.color === 'brand' ? 'bg-brand/10 text-brand' :
                  kpi.color === 'success' ? 'bg-success/10 text-success' :
                  kpi.color === 'warning' ? 'bg-warning/10 text-warning' :
                  'bg-primary/10 text-primary'
                }`}>
                  {kpi.icon}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400">{kpi.sub}</p>
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  kpi.isUp ? 'text-success bg-success/10' : 'text-red-500 bg-red-50'
                }`}>
                  <TrendingUp size={10} className={kpi.isUp ? "" : "rotate-180"} />
                  {kpi.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SECTION 2: Required Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Required Actions</CardTitle>
          <Button variant="ghost" size="sm" className="text-brand">View all <ChevronRight size={14} /></Button>
        </CardHeader>
        <CardContent>
          {reqActionsMock.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50/50">
              <CheckCircle className="mx-auto mb-2 opacity-30" size={32} />
              No actions required currently
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-y">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Customer Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created Date</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reqActionsMock.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 group">
                      <td className="px-4 py-3 font-medium text-brand">{item.id}</td>
                      <td className="px-4 py-3">{item.type}</td>
                      <td className="px-4 py-3">{item.customer}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.status === 'Expire' ? 'destructive' : item.status === 'Pending' ? 'warning' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.date}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Review</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Recent Orders (60% visually -> col-span-3) */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {orders.length === 0 ? (
               <div className="text-center py-12 text-gray-500 mx-6 border rounded-lg bg-gray-50/50">
                 No recent orders found
               </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-y">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Buyer</th>
                    <th className="px-6 py-3 font-medium">Property</th>
                    <th className="px-6 py-3 font-medium">Project</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.slice(0, 10).map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onOrderClick(order.id)}>
                      <td className="px-6 py-3 font-medium text-brand">{order.id}</td>
                      <td className="px-6 py-3">{order.buyerName}</td>
                      <td className="px-6 py-3">{order.propertyName}</td>
                      <td className="px-6 py-3 text-gray-500">{order.projectName}</td>
                      <td className="px-6 py-3">
                        <Badge variant={order.status === 'Expire' ? 'destructive' : order.status === 'Deed Transferred' ? 'success' : order.status.includes('Paid') ? 'default' : 'secondary'} className="scale-90 origin-left">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{order.bookingDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
          <CardFooter className="pt-4 pb-4 border-t bg-gray-50/50 justify-center">
            <Button variant="link" className="text-brand p-0 h-auto">View all orders &rarr;</Button>
          </CardFooter>
        </Card>

        {/* Right: Reports (40% visually -> col-span-2) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Orders By Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Orders by Status</h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersStatusMockData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                      {ordersStatusMockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Revenue Over Time</h4>
                <div className="flex items-center text-xs text-success bg-success/10 px-2 py-1 rounded">
                  <TrendingUp size={12} className="mr-1"/> +24% Output
                </div>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueMockData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip 
                      formatter={(value: number) => [formatSAR(value), "Revenue"]}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#EAB308" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
