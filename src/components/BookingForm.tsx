import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/AuthContext'
import { bookingService, BookingRequest } from '@/services/bookingService'
import { patientService } from '@/services/patientService'
import { toast } from '@/hooks/use-toast'
import { Loader2, Calendar as CalendarIcon, Clock, MapPin, Home, Video, Stethoscope } from 'lucide-react'
import { format } from 'date-fns'

const SERVICE_TYPES = [
  { value: 'blood-test', label: 'Blood Test', price: 89, duration: 30 },
  { value: 'consultation', label: 'General Consultation', price: 150, duration: 45 },
  { value: 'health-check', label: 'Health Check-up', price: 200, duration: 60 },
  { value: 'specialist-consultation', label: 'Specialist Consultation', price: 250, duration: 60 },
  { value: 'iv-therapy', label: 'IV Vitamin Therapy', price: 180, duration: 90 },
  { value: 'physiotherapy', label: 'Physiotherapy', price: 120, duration: 60 },
]

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
]

export function BookingForm() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [patientProfile, setPatientProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    service_type: '',
    appointment_time: '',
    location_type: 'clinic' as 'clinic' | 'home' | 'online',
    location_address: '',
    special_instructions: '',
    patient_name: '',
    patient_phone: '',
    patient_email: ''
  })

  useEffect(() => {
    if (user && userProfile?.user_type === 'patient') {
      loadPatientData()
    }
  }, [user, userProfile])

  const loadPatientData = async () => {
    if (!user) return
    
    try {
      const { data } = await patientService.getPatientProfile(user.id)
      if (data) {
        setPatientProfile(data)
        setFormData(prev => ({
          ...prev,
          patient_name: `${data.first_name} ${data.last_name}`,
          patient_phone: data.phone || '',
          patient_email: user.email || ''
        }))
      }
    } catch (error) {
      console.error('Error loading patient data:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getSelectedService = () => {
    return SERVICE_TYPES.find(service => service.value === formData.service_type)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedDate) return

    const selectedService = getSelectedService()
    if (!selectedService) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive",
      })
      return
    }

    if (!formData.appointment_time) {
      toast({
        title: "Error", 
        description: "Please select an appointment time",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const bookingData: BookingRequest = {
        patient_id: user.id,
        service_type: formData.service_type,
        service_name: selectedService.label,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: formData.appointment_time,
        duration_minutes: selectedService.duration,
        location_type: formData.location_type,
        location_address: formData.location_address,
        price: selectedService.price,
        special_instructions: formData.special_instructions,
        patient_name: formData.patient_name,
        patient_phone: formData.patient_phone,
        patient_email: formData.patient_email
      }

      const { data, error } = await bookingService.createBooking(bookingData)

      if (error) {
        toast({
          title: "Booking Failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Booking Successful!",
          description: `Your ${selectedService.label} appointment has been booked for ${format(selectedDate, 'MMMM do, yyyy')} at ${formData.appointment_time}`,
        })
        
        // Reset form
        setFormData({
          service_type: '',
          appointment_time: '',
          location_type: 'clinic',
          location_address: '',
          special_instructions: '',
          patient_name: formData.patient_name,
          patient_phone: formData.patient_phone,
          patient_email: formData.patient_email
        })
        setSelectedDate(undefined)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>Please sign in to book an appointment</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const selectedService = getSelectedService()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Book an Appointment
          </CardTitle>
          <CardDescription>
            Choose your service and preferred time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.label}</span>
                        <span className="ml-2 text-sm text-muted-foreground">£{service.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedService && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedService.duration} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <span>£{selectedService.price}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </div>
              {selectedDate && (
                <p className="text-center text-sm text-muted-foreground">
                  Selected: {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </p>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={formData.appointment_time === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('appointment_time', time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Location Type */}
            <div className="space-y-4">
              <Label>Appointment Location</Label>
              <RadioGroup
                value={formData.location_type}
                onValueChange={(value) => handleInputChange('location_type', value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="clinic" id="clinic" />
                  <Label htmlFor="clinic" className="flex items-center gap-2 cursor-pointer">
                    <Stethoscope className="h-4 w-4" />
                    At Clinic
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    Home Visit
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Online
                  </Label>
                </div>
              </RadioGroup>

              {formData.location_type === 'home' && (
                <div className="space-y-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea
                    id="address"
                    value={formData.location_address}
                    onChange={(e) => handleInputChange('location_address', e.target.value)}
                    placeholder="Enter your full address for the home visit"
                    required
                  />
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Full Name</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => handleInputChange('patient_name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient_phone">Phone Number</Label>
                  <Input
                    id="patient_phone"
                    type="tel"
                    value={formData.patient_phone}
                    onChange={(e) => handleInputChange('patient_phone', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient_email">Email Address</Label>
                <Input
                  id="patient_email"
                  type="email"
                  value={formData.patient_email}
                  onChange={(e) => handleInputChange('patient_email', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                placeholder="Any special requests or medical information we should know..."
              />
            </div>

            {/* Summary */}
            {selectedService && selectedDate && formData.appointment_time && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{selectedService.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{formData.appointment_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedService.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium capitalize">{formData.location_type}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>£{selectedService.price}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}