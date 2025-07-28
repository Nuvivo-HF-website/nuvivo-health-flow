import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/AuthContext'
import { bookingService, Appointment } from '@/services/bookingService'
import { toast } from '@/hooks/use-toast'
import { Loader2, Calendar, Clock, MapPin, Phone, Mail, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'

export function AppointmentList({ viewType = 'patient' }: { viewType?: 'patient' | 'professional' }) {
  const { user, userProfile } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadAppointments()
    }
  }, [user, viewType])

  const loadAppointments = async () => {
    if (!user) return

    setLoading(true)
    try {
      let result
      if (viewType === 'patient') {
        result = await bookingService.getPatientAppointments(user.id)
      } else {
        // For healthcare professionals
        result = await bookingService.getProfessionalAppointments(user.id)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        })
      } else {
        setAppointments(result.data || [])
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    setUpdating(appointmentId)
    try {
      const { error } = await bookingService.updateAppointmentStatus(appointmentId, newStatus)
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update appointment",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `Appointment ${newStatus}`,
        })
        loadAppointments()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'confirmed':
        return <Badge variant="default">Confirmed</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'no_show':
        return <Badge variant="destructive">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case 'home':
        return '🏠'
      case 'online':
        return '💻'
      default:
        return '🏥'
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm || 
      appointment.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
            <p className="text-muted-foreground">
              {appointments.length === 0 
                ? "You don't have any appointments yet." 
                : "No appointments match your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{appointment.service_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(appointment.appointment_date), 'EEEE, MMMM do, yyyy')}
                      <Clock className="h-4 w-4 ml-2" />
                      {appointment.appointment_time}
                      <span className="ml-2">({appointment.duration_minutes} min)</span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{getLocationIcon(appointment.location_type)}</span>
                      <span className="capitalize">{appointment.location_type}</span>
                      {appointment.location_address && (
                        <span className="text-muted-foreground">- {appointment.location_address}</span>
                      )}
                    </div>
                    
                    {viewType === 'professional' && (
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Patient:</span>
                          <span>{appointment.patient_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.patient_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{appointment.patient_email}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Price:</span>
                      <span className="ml-2">£{appointment.price}</span>
                    </div>
                    
                    {appointment.special_instructions && (
                      <div className="text-sm">
                        <span className="font-medium">Notes:</span>
                        <p className="text-muted-foreground mt-1">{appointment.special_instructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {viewType === 'professional' && appointment.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                      disabled={updating === appointment.id}
                      size="sm"
                    >
                      {updating === appointment.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      disabled={updating === appointment.id}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {viewType === 'professional' && appointment.status === 'confirmed' && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                      disabled={updating === appointment.id}
                      size="sm"
                    >
                      {updating === appointment.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Mark Complete
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'no_show')}
                      disabled={updating === appointment.id}
                      variant="outline"
                      size="sm"
                    >
                      No Show
                    </Button>
                  </div>
                )}

                {viewType === 'patient' && ['pending', 'confirmed'].includes(appointment.status) && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      disabled={updating === appointment.id}
                      variant="outline"
                      size="sm"
                    >
                      {updating === appointment.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Cancel Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}