import React, { useState } from 'react';
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
  Plus,
  Brain,
  Bot,
  AlertTriangle,
  Zap,
  Shield,
  Dna
} from 'lucide-react';

// Import all Phase 2-4 components
import { EnhancedMedicalRecords } from '@/components/EnhancedMedicalRecords';
import { AdvancedAppointmentBooking } from '@/components/AdvancedAppointmentBooking';
import { HealthMetricsTracker } from '@/components/HealthMetricsTracker';
import { TelemedicineSession } from '@/components/TelemedicineSession';
import { PrescriptionManager } from '@/components/PrescriptionManager';
import { HealthGoalsTracker } from '@/components/HealthGoalsTracker';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AIHealthAssistant } from '@/components/AIHealthAssistant';
import PredictiveHealthAnalytics from '@/components/PredictiveHealthAnalytics';
import MicroAutomations from '@/components/MicroAutomations';
import GenomicsAnalyzer from '@/components/GenomicsAnalyzer';
import { WearableIntegration } from '@/components/WearableIntegration';
import { EmergencyAlertSystem } from '@/components/EmergencyAlertSystem';
import { EnhancedTelemedicine } from '@/components/EnhancedTelemedicine';
import { ClinicalDecisionSupport } from '@/components/ClinicalDecisionSupport';
import SafetySupport from '@/components/SafetySupport';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComprehensivePatientPortal() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'safety':
        setActiveTab('safety');
        break;
      case 'appointment':
        setActiveTab('appointments');
        break;
      case 'health-data':
        setActiveTab('health-metrics');
        break;
      case 'telemedicine':
        setActiveTab('telemedicine');
        break;
      case 'goals':
        setActiveTab('goals');
        break;
      case 'ai-assistant':
        setActiveTab('ai-assistant');
        break;
      default:
        break;
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  React.useEffect(() => {
    if (!user && !loading) {
      navigate('/sign-in');
    }
  }, [user, loading, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('safety')}>
              <CardContent className="flex flex-col items-center p-6">
                <Shield className="h-8 w-8 text-red-500 mb-2" />
                <h3 className="font-semibold text-center">Need Help?</h3>
                <p className="text-sm text-muted-foreground text-center">Emergency support</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('appointment')}>
              <CardContent className="flex flex-col items-center p-6">
                <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-semibold text-center">Book Appointment</h3>
                <p className="text-sm text-muted-foreground text-center">Schedule with specialists</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('health-data')}>
              <CardContent className="flex flex-col items-center p-6">
                <Activity className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-semibold text-center">Track Health</h3>
                <p className="text-sm text-muted-foreground text-center">Monitor vital signs</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction('ai-assistant')}>
              <CardContent className="flex flex-col items-center p-6">
                <Brain className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-semibold text-center">AI Assistant</h3>
                <p className="text-sm text-muted-foreground text-center">Get health insights</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Assistant
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

            {/* Phase 2 & 3 Tabs */}
            <div className="mt-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="safety" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Safety
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Emergency
                </TabsTrigger>
                <TabsTrigger value="clinical-support" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Clinical Support
                </TabsTrigger>
                <TabsTrigger value="predictive-analytics" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Predictive Analytics
                </TabsTrigger>
                <TabsTrigger value="automations" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Automations
                </TabsTrigger>
                <TabsTrigger value="genomics" className="flex items-center gap-2">
                  <Dna className="h-4 w-4" />
                  Genomics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <AnalyticsDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SafetySupport />
                <EmergencyAlertSystem />
              </div>
            </TabsContent>

            <TabsContent value="ai-assistant" className="space-y-6">
              <AIHealthAssistant />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <AdvancedAppointmentBooking />
            </TabsContent>

            <TabsContent value="health-metrics" className="space-y-6">
              <HealthMetricsTracker />
              <WearableIntegration />
            </TabsContent>

            <TabsContent value="telemedicine" className="space-y-6">
              <EnhancedTelemedicine />
              <ClinicalDecisionSupport />
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

            {/* Phase 2 & 3 Tab Content */}
            <TabsContent value="safety" className="space-y-6">
              <SafetySupport />
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <EmergencyAlertSystem />
            </TabsContent>

            <TabsContent value="clinical-support" className="space-y-6">
              <ClinicalDecisionSupport />
            </TabsContent>

            <TabsContent value="predictive-analytics" className="space-y-6">
              <PredictiveHealthAnalytics />
            </TabsContent>

            <TabsContent value="automations" className="space-y-6">
              <MicroAutomations />
            </TabsContent>

            <TabsContent value="genomics" className="space-y-6">
              <GenomicsAnalyzer />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}