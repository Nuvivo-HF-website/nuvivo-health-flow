import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlaggedResultsDashboard } from '@/components/FlaggedResultsDashboard';
import { useAuth } from '@/hooks/useAuthContext';
import { BarChart3, AlertTriangle, Users, FileText } from 'lucide-react';

export default function StaffDashboard() {
  const { hasRole } = useAuth();
  const isStaff = hasRole('admin') || hasRole('doctor');

  if (!isStaff) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Access denied. Staff only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
      </div>

      <Tabs defaultValue="flagged-results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flagged-results" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Flagged Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flagged-results">
          <FlaggedResultsDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Patient management features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reporting features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}