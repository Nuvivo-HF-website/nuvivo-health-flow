import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/AuthContext'
import { patientPortalService } from '@/services/patientPortalService'
import { toast } from '@/hooks/use-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  CalendarDays, 
  FileText, 
  TestTube, 
  Pill, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  User,
  Activity,
  Heart,
  TrendingUp,
  Download,
  Eye,
  Plus
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

export default function PatientDashboard() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const summary = await patientPortalService.getDashboardSummary(user.id)
      setDashboardData(summary)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access your patient dashboard.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: { variant: 'default', label: 'Normal', color: 'bg-green-500' },
      abnormal: { variant: 'destructive', label: 'Abnormal', color: 'bg-yellow-500' },
      critical: { variant: 'destructive', label: 'Critical', color: 'bg-red-500' },
      pending: { variant: 'secondary', label: 'Pending', color: 'bg-blue-500' },
      scheduled: { variant: 'default', label: 'Scheduled', color: 'bg-blue-500' },
      completed: { variant: 'default', label: 'Completed', color: 'bg-green-500' },
      active: { variant: 'default', label: 'Active', color: 'bg-green-500' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', label: status, color: 'bg-gray-500' }
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
        <Badge variant={config.variant as any}>{config.label}</Badge>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {userProfile?.full_name || user.email?.split('@')[0] || 'Patient'}
              </h1>
              <p className="text-muted-foreground">
                Your health dashboard - Track your progress and stay on top of your care
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test Results</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.totalTestResults || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total results available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.upcomingAppointments?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Next 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.activeMedications?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Currently taking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Consultation Notes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Consultation Notes
                  </CardTitle>
                  <CardDescription>Notes and recommendations from your recent consultations</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate('/my-bookings')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentConsultations?.length > 0 ? (
                  dashboardData.recentConsultations.map((consultation: any) => (
                    <div key={consultation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-lg">{consultation.consultation_type}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(consultation.appointment_date), 'MMM dd, yyyy • h:mm a')}
                          </div>
                        </div>
                        {getStatusBadge(consultation.status)}
                      </div>
                      
                      {consultation.symptoms && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-muted-foreground">Symptoms Discussed:</p>
                          <p className="text-sm">{consultation.symptoms}</p>
                        </div>
                      )}
                      
                      {consultation.diagnosis && (
                        <div className="mb-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm font-medium text-blue-900">Diagnosis:</p>
                          <p className="text-sm text-blue-800">{consultation.diagnosis}</p>
                        </div>
                      )}
                      
                      {consultation.doctor_notes && (
                        <div className="mb-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm font-medium text-green-900">Doctor's Notes:</p>
                          <p className="text-sm text-green-800">{consultation.doctor_notes}</p>
                        </div>
                      )}
                      
                      {consultation.treatment_plan && (
                        <div className="mb-3 bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm font-medium text-purple-900">Treatment Plan:</p>
                          <p className="text-sm text-purple-800">{consultation.treatment_plan}</p>
                        </div>
                      )}
                      
                      {consultation.prescription && (
                        <div className="mb-3 bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                          <p className="text-sm font-medium text-orange-900">Prescription:</p>
                          <p className="text-sm text-orange-800">{consultation.prescription}</p>
                        </div>
                      )}
                      
                      {consultation.follow_up_required && consultation.follow_up_date && (
                        <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-sm font-medium text-yellow-900">Follow-up Required:</p>
                          <p className="text-sm text-yellow-800">
                            Scheduled for {format(new Date(consultation.follow_up_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No consultation notes yet</p>
                    <Button variant="outline" className="mt-2" onClick={() => navigate('/booking')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Test Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Recent Test Results
                  </CardTitle>
                  <CardDescription>Your latest lab results and reports</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate('/my-test-results')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentTestResults?.length > 0 ? (
                  dashboardData.recentTestResults.map((result: any) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{result.test_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(result.test_date), 'MMM dd, yyyy')} • {result.clinic_name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(result.result_status)}
                        <Button size="sm" variant="ghost" onClick={() => navigate(`/test-results/${result.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No test results yet</p>
                    <Button variant="outline" className="mt-2" onClick={() => navigate('/blood-tests')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Book a Test
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Your scheduled consultations and visits</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate('/my-bookings')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.upcomingAppointments?.length > 0 ? (
                  dashboardData.upcomingAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{appointment.appointment_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(appointment.appointment_date), 'MMM dd, yyyy • h:mm a')}
                        </div>
                        {appointment.location && (
                          <div className="text-xs text-muted-foreground">{appointment.location}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming appointments</p>
                    <Button variant="outline" className="mt-2" onClick={() => navigate('/booking')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Current Medications
                  </CardTitle>
                  <CardDescription>Your active prescriptions and supplements</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate('/my-medications')}>
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.activeMedications?.length > 0 ? (
                  dashboardData.activeMedications.map((medication: any) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{medication.medication_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {medication.dosage} • {medication.frequency}
                        </div>
                        {medication.prescribed_by && (
                          <div className="text-xs text-muted-foreground">
                            Prescribed by {medication.prescribed_by}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(medication.status)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active medications</p>
                    <Button variant="outline" className="mt-2" onClick={() => navigate('/my-medications')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/blood-tests')}>
                  <TestTube className="h-6 w-6" />
                  Book Blood Test
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/booking')}>
                  <CalendarDays className="h-6 w-6" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/my-files')}>
                  <FileText className="h-6 w-6" />
                  Upload Documents
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 p-4" onClick={() => navigate('/profile')}>
                  <User className="h-6 w-6" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}