import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { PatientProfileForm } from '@/components/PatientProfileForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PatientProfile() {
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

  // If no profile exists yet, allow access so they can create one
  // If profile exists but isn't a patient, restrict access
  if (userProfile && userProfile.user_type !== 'patient') {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>
          <p className="text-muted-foreground">This page is only available for patients.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and medical history</p>
        </div>
        <PatientProfileForm />
      </div>
      <Footer />
    </div>
  )
}