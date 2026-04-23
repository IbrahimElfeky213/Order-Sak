import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Settings, Users, Shield } from 'lucide-react';

export default function SystemManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">System Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-brand">
          <CardHeader>
            <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-2">
              <Users size={20} />
            </div>
            <CardTitle>Internal Users</CardTitle>
            <CardDescription>Manage staff accounts and access.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-2">
              <Shield size={20} />
            </div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Define granular RBAC control.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-2">
              <Settings size={20} />
            </div>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>System-wide configurations.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
