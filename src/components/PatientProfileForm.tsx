import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/AuthContext'
import { patientService, PatientProfile } from '@/services/patientService'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, X, User, Phone, MapPin, AlertTriangle, Pill, Heart } from 'lucide-react'

export function PatientProfileForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | 'other' | 'prefer_not_to_say' | '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: [] as string[],
    allergies: [] as string[],
    current_medications: [] as string[]
  })
  const [newCondition, setNewCondition] = useState('')
  const [newAllergy, setNewAllergy] = useState('')
  const [newMedication, setNewMedication] = useState('')
  const [postcodeResults, setPostcodeResults] = useState<any[]>([])
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false)

  useEffect(() => {
    if (user) {
      loadPatientProfile()
    }
  }, [user])

  const loadPatientProfile = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await patientService.getPatientProfile(user.id)
      
      if (data) {
        setProfile(data)
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          phone: data.phone || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          postcode: data.postcode || '',
          country: data.country || 'United Kingdom',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          medical_conditions: data.medical_conditions || [],
          allergies: data.allergies || [],
          current_medications: data.current_medications || []
        })
      }
    } catch (error) {
      console.error('Error loading patient profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addToArray = (field: 'medical_conditions' | 'allergies' | 'current_medications', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }))
      
      // Clear the input
      if (field === 'medical_conditions') setNewCondition('')
      if (field === 'allergies') setNewAllergy('')
      if (field === 'current_medications') setNewMedication('')
    }
  }

  const searchPostcode = async (postcode: string) => {
    if (!postcode || postcode.length < 3) {
      setPostcodeResults([])
      return
    }

    setIsSearchingPostcode(true)
    try {
      // Using postcodes.io API for UK postcodes
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/autocomplete`)
      if (response.ok) {
        const data = await response.json()
        setPostcodeResults(data.result || [])
      }
    } catch (error) {
      console.error('Error searching postcode:', error)
    } finally {
      setIsSearchingPostcode(false)
    }
  }

  const selectPostcode = async (postcode: string) => {
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
      if (response.ok) {
        const data = await response.json()
        const result = data.result
        
        setFormData(prev => ({
          ...prev,
          postcode: result.postcode,
          city: result.admin_district,
          country: result.country
        }))
        setPostcodeResults([])
      }
    } catch (error) {
      console.error('Error fetching postcode details:', error)
    }
  }

  const removeFromArray = (field: 'medical_conditions' | 'allergies' | 'current_medications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Validate gender is selected
    if (!formData.gender) {
      toast({
        title: "Validation Error",
        description: "Please select a gender",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const profileData = {
        user_id: user.id,
        ...formData,
        // Combine address fields for backward compatibility
        address: `${formData.address_line_1}${formData.address_line_2 ? ', ' + formData.address_line_2 : ''}, ${formData.city}, ${formData.postcode}, ${formData.country}`,
        gender: formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say'
      }

      let result
      if (profile) {
        const updateData = {
          ...formData,
          address: `${formData.address_line_1}${formData.address_line_2 ? ', ' + formData.address_line_2 : ''}, ${formData.city}, ${formData.postcode}, ${formData.country}`,
          gender: formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say'
        }
        result = await patientService.updatePatientProfile(profile.id, updateData)
      } else {
        result = await patientService.createPatientProfile(profileData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: profile ? "Profile updated successfully" : "Profile created successfully",
        })
        setProfile(result.data)
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

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Profile
          </CardTitle>
          <CardDescription>
            Manage your personal information and medical history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_1">Address Line 1</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                placeholder="House number and street name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 relative">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => {
                    handleInputChange('postcode', e.target.value)
                    searchPostcode(e.target.value)
                  }}
                  placeholder="Enter postcode"
                  required
                />
                
                {/* Postcode Search Results */}
                {postcodeResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-background border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {postcodeResults.map((postcode, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => selectPostcode(postcode)}
                      >
                        {postcode}
                      </div>
                    ))}
                  </div>
                )}
                
                {isSearchingPostcode && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-background border border-border rounded-md shadow-lg p-3">
                    <div className="text-sm text-muted-foreground">Searching postcodes...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Conditions
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add medical condition"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('medical_conditions', newCondition))}
                />
                <Button
                  type="button"
                  onClick={() => addToArray('medical_conditions', newCondition)}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.medical_conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {condition}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('medical_conditions', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Allergies
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add allergy"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('allergies', newAllergy))}
                />
                <Button
                  type="button"
                  onClick={() => addToArray('allergies', newAllergy)}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {allergy}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('allergies', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Current Medications
              </h3>
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Add medication"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('current_medications', newMedication))}
                />
                <Button
                  type="button"
                  onClick={() => addToArray('current_medications', newMedication)}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.current_medications.map((medication, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {medication}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFromArray('current_medications', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}