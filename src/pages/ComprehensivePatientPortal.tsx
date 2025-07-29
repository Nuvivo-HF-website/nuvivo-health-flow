import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  Pill, 
  Target, 
  Video, 
  FileText, 
  TrendingUp,
  Heart,
  Settings,
  Bell,
  Plus
} from 'lucide-react';

// Import all Phase 2-4 components
import { EnhancedMedicalRecords } from '@/components/EnhancedMedicalRecords';
import { AdvancedAppointmentBooking } from '@/components/AdvancedAppointmentBooking';
import { HealthMetricsTracker } from '@/components/HealthMetricsTracker';
import { TelemedicineSession } from '@/components/TelemedicineSession';
import { PrescriptionManager } from '@/components/PrescriptionManager';
import { HealthGoalsTracker } from '@/components/HealthGoalsTracker';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComprehensivePatientPortal() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back, {userProfile?.full_name || user.email}
              </h1>
              <p className="text-xl text-muted-foreground">
                Your comprehensive healthcare dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Book Appointment</div>
                    <div className="text-sm text-muted-foreground">Schedule consultation</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Log Health Data</div>
                    <div className="text-sm text-muted-foreground">Track vital signs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Start Session</div>
                    <div className="text-sm text-muted-foreground">Join telemedicine</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Set Goal</div>
                    <div className="text-sm text-muted-foreground">Track progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="health-metrics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Health Metrics
              </TabsTrigger>
              <TabsTrigger value="telemedicine" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Telemedicine
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Medications
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Records
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <AdvancedAppointmentBooking />
            </TabsContent>

            <TabsContent value="health-metrics" className="space-y-6">
              <HealthMetricsTracker />
            </TabsContent>

            <TabsContent value="telemedicine" className="space-y-6">
              <TelemedicineSession />
            </TabsContent>

            <TabsContent value="prescriptions" className="space-y-6">
              <PrescriptionManager />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <HealthGoalsTracker />
            </TabsContent>

            <TabsContent value="records" className="space-y-6">
              <EnhancedMedicalRecords />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}