import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import ComprehensivePatientPortal from './ComprehensivePatientPortal';
import StaffDashboard from './StaffDashboard';
import AdminDashboard from './AdminDashboard';

export default function Portal() {
  const { user, userRoles, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check user roles and redirect to appropriate dashboard
  const hasAdminRole = userRoles.includes('admin');
  const hasDoctorRole = userRoles.includes('doctor');
  
  if (hasAdminRole) {
    return <AdminDashboard />;
  }
  
  if (hasDoctorRole) {
    return <StaffDashboard />;
  }

  // Default to patient portal
  return <ComprehensivePatientPortal />;
}