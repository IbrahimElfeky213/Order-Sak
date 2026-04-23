import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Bell, CheckCircle } from 'lucide-react';

export default function NotificationsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
        <div className="space-x-2">
          <Button variant="outline">Settings</Button>
          <Button variant="default">Mark all as read</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <div className="p-4 bg-brand/5 hover:bg-brand/10 transition-colors cursor-pointer flex gap-4">
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-brand"></div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">New Resale Request</h4>
                <p className="text-sm text-gray-600 mt-1">Saad Al-Mutairi has submitted a new resale request for Villa A1.</p>
                <p className="text-xs text-brand mt-2">10 minutes ago</p>
              </div>
            </div>

            <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 opacity-70">
              <div className="mt-1">
                <CheckCircle size={16} className="text-gray-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Order ORD-1004 Completed</h4>
                <p className="text-sm text-gray-600 mt-1">The deed transfer request has been fully processed.</p>
                <p className="text-xs text-gray-500 mt-2">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
