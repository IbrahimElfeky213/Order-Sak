import React from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function CoBrokerList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Co-Broker Management</h1>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex gap-4">
            <Button variant="default">Active Brokers</Button>
            <Button variant="ghost">Join Requests <Badge variant="destructive" className="ml-2 scale-75">3</Badge></Button>
            <Button variant="ghost">Submitted Interests</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Broker ID</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">License Number</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Account Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-brand">CB-001</td>
                  <td className="px-6 py-4">Waqar Real Estate LLC</td>
                  <td className="px-6 py-4 text-gray-500 font-mono">VAL-998123</td>
                  <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
                  <td className="px-6 py-4"><Button variant="ghost" size="sm">Profile</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
