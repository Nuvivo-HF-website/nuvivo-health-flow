import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { doctorService, DoctorProfile } from '@/services/doctorService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, X } from "lucide-react"

const SPECIALTIES = [
  'General Practice',
  'Cardiology', 
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Psychiatry',
  'Pulmonology',
  'Urology',
  'Other'
]

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Hindi', 'Mandarin', 'Other'
]

export function DoctorProfileForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [newLanguage, setNewLanguage] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    specialty: '',
    qualification: '',
    license_number: '',
    years_of_experience: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    clinic_name: '',
    clinic_address: '',
    consultation_fee: '',
    available_hours: { start: '09:00', end: '17:00' },
    available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    bio: '',
    languages: ['English']
  })

  useEffect(() => {
    if (user?.id) {
      loadDoctorProfile()
    }
  }, [user?.id])

  const loadDoctorProfile = async () => {
    if (!user?.id) return

    try {
      setProfileLoading(true)
      const { data, error } = await doctorService.getDoctorProfile(user.id)
      
      if (error) {
        console.error('Error loading doctor profile:', error)
        return
      }

      if (data) {
        setDoctorProfile(data)
        
        // Handle available_hours type conversion
        const availableHours = data.available_hours as any
        const parsedHours = typeof availableHours === 'object' && availableHours !== null 
          ? availableHours 
          : { start: '09:00', end: '17:00' }

        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          specialty: data.specialty || '',
          qualification: data.qualification || '',
          license_number: data.license_number || '',
          years_of_experience: data.years_of_experience?.toString() || '',
          phone: data.phone || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          postcode: data.postcode || '',
          country: data.country || 'United Kingdom',
          clinic_name: data.clinic_name || '',
          clinic_address: data.clinic_address || '',
          consultation_fee: data.consultation_fee?.toString() || '',
          available_hours: parsedHours,
          available_days: data.available_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          bio: data.bio || '',
          languages: data.languages || ['English']
        })
      }
    } catch (error) {
      console.error('Error loading doctor profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAvailableHoursChange = (field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      available_hours: {
        ...prev.available_hours,
        [field]: value
      }
    }))
  }

  const handleDayToggle = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      available_days: checked
        ? [...prev.available_days, day]
        : prev.available_days.filter(d => d !== day)
    }))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const profileData = {
        user_id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        specialty: formData.specialty,
        qualification: formData.qualification,
        license_number: formData.license_number,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
        phone: formData.phone,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        city: formData.city,
        postcode: formData.postcode,
        country: formData.country,
        clinic_name: formData.clinic_name,
        clinic_address: formData.clinic_address,
        consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : null,
        available_hours: formData.available_hours,
        available_days: formData.available_days,
        bio: formData.bio,
        languages: formData.languages
      }

      let result
      if (doctorProfile) {
        result = await doctorService.updateDoctorProfile(doctorProfile.id, profileData)
      } else {
        result = await doctorService.createDoctorProfile(profileData)
      }

      if (result.error) {
        throw result.error
      }

      setDoctorProfile(result.data)
      
      toast({
        title: "Success",
        description: doctorProfile ? "Profile updated successfully!" : "Profile created successfully!",
      })

    } catch (error) {
      console.error('Error saving doctor profile:', error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Profile</CardTitle>
        {!doctorProfile && (
          <CardDescription className="text-amber-600">
            Complete your professional profile to start offering consultations
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  placeholder="e.g., MBBS, MD"
                />
              </div>
              <div>
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => handleInputChange('license_number', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  value={formData.years_of_experience}
                  onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="consultation_fee">Consultation Fee (£)</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  step="0.01"
                  value={formData.consultation_fee}
                  onChange={(e) => handleInputChange('consultation_fee', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell patients about yourself..."
                rows={4}
              />
            </div>
          </div>

          {/* Clinic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Clinic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic_name">Clinic Name</Label>
                <Input
                  id="clinic_name"
                  value={formData.clinic_name}
                  onChange={(e) => handleInputChange('clinic_name', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="clinic_address">Clinic Address</Label>
              <Textarea
                id="clinic_address"
                value={formData.clinic_address}
                onChange={(e) => handleInputChange('clinic_address', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address_line_1">Address Line 1</Label>
                <Input
                  id="address_line_1"
                  value={formData.address_line_1}
                  onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line_2"
                  value={formData.address_line_2}
                  onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange('postcode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.available_hours.start}
                  onChange={(e) => handleAvailableHoursChange('start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.available_hours.end}
                  onChange={(e) => handleAvailableHoursChange('end', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Available Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.available_days.includes(day)}
                      onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                    />
                    <Label htmlFor={day} className="capitalize">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((language) => (
                <div key={language} className="flex items-center gap-2 bg-muted rounded-md px-3 py-1">
                  <span>{language}</span>
                  {formData.languages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={newLanguage} onValueChange={setNewLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter(lang => !formData.languages.includes(lang)).map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addLanguage} disabled={!newLanguage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              doctorProfile ? 'Update Profile' : 'Create Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}