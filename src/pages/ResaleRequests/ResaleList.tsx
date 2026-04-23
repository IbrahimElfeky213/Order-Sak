import React from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function ResaleList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resale Requests</h1>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex gap-4">
            <Button variant="default">All</Button>
            <Button variant="ghost">New</Button>
            <Button variant="ghost">Approved</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Request ID</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Customer Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Property</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Submitted Date</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-brand">RES-501</td>
                  <td className="px-6 py-4">Saad Al-Mutairi</td>
                  <td className="px-6 py-4">Villa A1 - Al Yasmeen</td>
                  <td className="px-6 py-4"><Badge variant="default">New</Badge></td>
                  <td className="px-6 py-4 text-gray-500">2026-04-18</td>
                  <td className="px-6 py-4"><Button variant="ghost" size="sm" className="text-brand">Review</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
