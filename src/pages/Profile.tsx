import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { PatientProfileForm } from '@/components/PatientProfileForm'
import { DoctorProfileForm } from '@/components/DoctorProfileForm'
import { AIConsent } from '@/components/AIConsent'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Stethoscope, Shield } from 'lucide-react'

export default function Profile() {
  const { user, userProfile } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access your profile.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const getUserTypeIcon = () => {
    switch (userProfile?.user_type) {
      case 'doctor':
        return <Stethoscope className="h-6 w-6" />
      case 'admin':
        return <Shield className="h-6 w-6" />
      default:
        return <User className="h-6 w-6" />
    }
  }

  const getUserTypeLabel = () => {
    switch (userProfile?.user_type) {
      case 'doctor':
        return 'Healthcare Professional'
      case 'admin':
        return 'Administrator'
      default:
        return 'Patient'
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          {getUserTypeIcon()}
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">{getUserTypeLabel()} Profile - Manage your personal information</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {userProfile?.user_type === 'patient' || !userProfile?.user_type ? (
            <>
              <PatientProfileForm />
              <AIConsent />
            </>
          ) : userProfile?.user_type === 'doctor' ? (
            <>
              <DoctorProfileForm />
              <AIConsent />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Professional Profile</CardTitle>
                <CardDescription>
                  Your professional profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <p className="text-foreground">{userProfile?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">User Type</label>
                    <p className="text-foreground capitalize">{userProfile?.user_type || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Created</label>
                    <p className="text-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Professional profile management features will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}