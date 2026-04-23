import React, { useState } from 'react';
import { Order, OrderStatus } from '../../data/ordersStore';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Download, Search, Filter } from 'lucide-react';

interface OrdersListProps {
  orders: Order[];
  onOrderClick: (orderId: string) => void;
}

const statusColors: Record<OrderStatus, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  'Prebook': 'secondary',
  'Pending': 'warning',
  'Deposit Paid': 'default',
  'Installment Paid': 'default',
  'Partially Paid': 'warning',
  'Tax Paid': 'default',
  'Deed Transferred': 'success',
  'Expire': 'destructive',
  'Cancelled': 'destructive',
  'Refunded': 'secondary'
};

export default function OrdersList({ orders, onOrderClick }: OrdersListProps) {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    'All', 'Active Orders', 'Expired Orders', 'Pending Orders',
    'Cancelled / Refund Orders', 'Deed Transfer Orders', 'Orders Needing Admin Action'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center space-x-4 mb-4">
            <h2 className="text-lg font-semibold text-brand underline decoration-2 underline-offset-8 cursor-pointer">Single Orders</h2>
            <h2 className="text-lg text-gray-500 cursor-pointer hover:text-gray-800">Shared Orders</h2>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pt-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    activeTab === tab
                    ? 'bg-brand text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full xl:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by Order ID..."
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Buyer Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Property Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Project Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Block Number</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Order Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Deposit / Fee Amount</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Booking Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onOrderClick(order.id)}
                    className="hover:bg-brand/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-brand group-hover:underline">{order.id}</td>
                    <td className="px-6 py-4 font-medium">{order.buyerName}</td>
                    <td className="px-6 py-4">{order.propertyName}</td>
                    <td className="px-6 py-4 text-gray-500">{order.projectName}</td>
                    <td className="px-6 py-4 text-gray-400">{order.blockNumber}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColors[order.status] || 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.depositAmount.toLocaleString()} SAR
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.bookingDate}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-lg">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
