import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { supabase } from '@/integrations/supabase/client'
import { doctorService, DoctorProfile } from '@/services/doctorService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, User, Edit, Check, X, Shield } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { DoctorProfileForm } from "@/components/DoctorProfileForm"

interface ExtendedDoctorProfile extends DoctorProfile {
  verification_status: 'incomplete' | 'pending_review' | 'approved' | 'rejected'
  is_marketplace_ready: boolean
  is_active: boolean
}

export default function ManageStaff() {
  const { user, hasRole } = useAuth()
  const { toast } = useToast()
  const [doctors, setDoctors] = useState<ExtendedDoctorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedDoctor, setSelectedDoctor] = useState<ExtendedDoctorProfile | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // Check if user has clinic staff access
  const hasAccess = hasRole('clinic_staff') || hasRole('admin')

  useEffect(() => {
    if (hasAccess) {
      fetchDoctors()
    }
  }, [hasAccess])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDoctors(data as ExtendedDoctorProfile[])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      toast({
        title: "Error",
        description: "Failed to load doctor profiles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateDoctorStatus = async (doctorId: string, updates: Partial<ExtendedDoctorProfile>) => {
    try {
      const { error } = await supabase
        .from('doctor_profiles')
        .update(updates)
        .eq('id', doctorId)

      if (error) throw error

      setDoctors(prev => prev.map(doc => 
        doc.id === doctorId ? { ...doc, ...updates } : doc
      ))

      toast({
        title: "Success",
        description: "Doctor profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating doctor:', error)
      toast({
        title: "Error",
        description: "Failed to update doctor profile",
        variant: "destructive",
      })
    }
  }

  const handleApprove = (doctorId: string) => {
    updateDoctorStatus(doctorId, {
      verification_status: 'approved',
      is_marketplace_ready: true,
      is_active: true
    })
  }

  const handleReject = (doctorId: string) => {
    updateDoctorStatus(doctorId, {
      verification_status: 'rejected',
      is_marketplace_ready: false,
      is_active: false
    })
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || doctor.verification_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string, isActive: boolean) => {
    switch (status) {
      case 'approved':
        return <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? 'Active' : 'Approved (Inactive)'}
        </Badge>
      case 'pending_review':
        return <Badge variant="outline">Pending Review</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Incomplete</Badge>
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">You need clinic staff privileges to access this page.</p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Staff</h1>
          <p className="text-muted-foreground">Manage doctor profiles and verification status</p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Profiles List */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading doctors...</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredDoctors.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                    <p className="text-muted-foreground">No doctor profiles match your search criteria.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {doctor.first_name} {doctor.last_name}
                          {getStatusBadge(doctor.verification_status, doctor.is_active)}
                        </CardTitle>
                        <CardDescription>
                          {doctor.specialty} • {doctor.qualification}
                          {doctor.years_of_experience && ` • ${doctor.years_of_experience} years experience`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedDoctor(doctor)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Doctor Profile</DialogTitle>
                              <DialogDescription>
                                Update doctor information and manage verification status
                              </DialogDescription>
                            </DialogHeader>
                            <DoctorProfileForm />
                          </DialogContent>
                        </Dialog>
                        
                        {doctor.verification_status === 'pending_review' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(doctor.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(doctor.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">License:</span>
                        <span className="ml-2">{doctor.license_number || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="ml-2">{doctor.phone || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="ml-2">{doctor.city ? `${doctor.city}, ${doctor.country}` : 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Consultation Fee:</span>
                        <span className="ml-2">{doctor.consultation_fee ? `£${doctor.consultation_fee}` : 'Not set'}</span>
                      </div>
                    </div>
                    {doctor.bio && (
                      <div className="mt-4">
                        <span className="text-muted-foreground">Bio:</span>
                        <p className="mt-1 text-sm">{doctor.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}