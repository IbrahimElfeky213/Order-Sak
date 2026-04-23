import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, Building2, Wallet } from 'lucide-react';

export default function DevelopersList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building2 className="text-gray-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Al-Arabiya Real Estate</CardTitle>
                <p className="text-sm text-brand font-medium mt-1 hover:underline cursor-pointer">View Full Profile &rarr;</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand/10 rounded-md text-brand">
                <Wallet size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Transferred</p>
                <p className="font-bold">45.2M SAR</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-md text-gray-600">
                <Building2 size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Projects</p>
                <p className="font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
