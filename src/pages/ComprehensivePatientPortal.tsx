import React, { useState } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalRightSidebar } from '@/components/portal/PortalRightSidebar';
import { QuickActions } from '@/components/portal/QuickActions';
import { AnalyticsOverview } from '@/components/portal/AnalyticsOverview';

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
import { HealthTrendsDashboard } from '@/components/HealthTrendsDashboard';
import { MessagingInbox } from '@/components/MessagingInbox';
import { GDPRConsentManager } from '@/components/GDPRConsentManager';
import UnifiedEmergencyCenter from '@/components/UnifiedEmergencyCenter';

export default function ComprehensivePatientPortal() {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // All hooks must come before any conditional logic
  React.useEffect(() => {
    if (!user && !loading) {
      navigate('/sign-in');
    }
  }, [user, loading, navigate]);

  const handleQuickAction = (action: string) => {
    setActiveSection(action);
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

  // Don't render anything if redirecting or no user
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <QuickActions onActionClick={handleQuickAction} />
            <AnalyticsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Unified Emergency Center</h3>
                <p className="text-sm text-muted-foreground">(UnifiedEmergencyCenter)</p>
                <div className="mt-8 text-center text-muted-foreground">
                  Component preview
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Health Trends Dashboard</h3>
                <p className="text-sm text-muted-foreground">(HealthtrendsDashboard)</p>
                <div className="mt-8 text-center text-muted-foreground">
                  Component preview
                </div>
              </div>
            </div>
          </div>
        );
      case 'health-trends':
        return <HealthTrendsDashboard />;
      case 'ai-assistant':
        return <AIHealthAssistant />;
      case 'appointments':
        return <AdvancedAppointmentBooking />;
      case 'health-metrics':
        return (
          <div className="space-y-6">
            <HealthMetricsTracker />
            <WearableIntegration />
          </div>
        );
      case 'telemedicine':
        return (
          <div className="space-y-6">
            <EnhancedTelemedicine />
            <ClinicalDecisionSupport />
          </div>
        );
      case 'prescriptions':
        return <PrescriptionManager />;
      case 'goals':
        return <HealthGoalsTracker />;
      case 'records':
        return <EnhancedMedicalRecords />;
      case 'messages':
        return <MessagingInbox />;
      case 'privacy':
        return <GDPRConsentManager />;
      case 'safety':
        return <UnifiedEmergencyCenter />;
      case 'clinical-support':
        return <ClinicalDecisionSupport />;
      case 'predictive-analytics':
        return <PredictiveHealthAnalytics />;
      case 'automations':
        return <MicroAutomations />;
      case 'genomics':
        return <GenomicsAnalyzer />;
      default:
        return (
          <div className="space-y-6">
            <QuickActions onActionClick={handleQuickAction} />
            <AnalyticsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Unified Emergency Center</h3>
                <p className="text-sm text-muted-foreground">(UnifiedEmergencyCenter)</p>
                <div className="mt-8 text-center text-muted-foreground">
                  Component preview
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Health Trends Dashboard</h3>
                <p className="text-sm text-muted-foreground">(HealthtrendsDashboard)</p>
                <div className="mt-8 text-center text-muted-foreground">
                  Component preview
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - positioned to start at header logo mid-point */}
        <div className="absolute left-0 top-[-32px] z-10">
          <PortalSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>
        
        {/* Main Content - adjusted for sidebar positioning */}
        <main className="flex-1 overflow-auto p-6 ml-64">
          {renderContent()}
        </main>
        
        {/* Right Sidebar */}
        <PortalRightSidebar />
      </div>

      <Footer />
    </div>
  );
}