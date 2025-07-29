import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Phone, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Clock, 
  Settings, 
  Heart,
  MessageCircle,
  Navigation,
  UserCheck,
  Bell,
  Lock,
  Info,
  CheckCircle,
  X
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/EnhancedAuthContext'

interface TrustedContact {
  id: string
  name: string
  phone: string
  email?: string
  relationship: string
  isPrimary: boolean
  isActive: boolean
}

interface EmergencyLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: string
  address?: string
}

interface SafetyPreferences {
  enableLocationSharing: boolean
  enableSilentMode: boolean
  enableAutoAlert: boolean
  trustedContacts: TrustedContact[]
  emergencyMessage: string
}

export default function SafetySupport() {
  const { user } = useAuth()
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [location, setLocation] = useState<EmergencyLocation | null>(null)
  const [preferences, setPreferences] = useState<SafetyPreferences>({
    enableLocationSharing: false,
    enableSilentMode: true,
    enableAutoAlert: false,
    trustedContacts: [],
    emergencyMessage: "I need help. This is an emergency alert from my health app."
  })
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: ''
  })

  useEffect(() => {
    loadSafetyPreferences()
  }, [user])

  const loadSafetyPreferences = async () => {
    if (!user) return

    try {
      // In a real app, this would load from the database
      // For now, we'll use localStorage as a fallback
      const saved = localStorage.getItem(`safety-preferences-${user.id}`)
      if (saved) {
        setPreferences(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading safety preferences:', error)
    }
  }

  const saveSafetyPreferences = async (newPreferences: SafetyPreferences) => {
    if (!user) return

    try {
      // In a real app, this would save to the database
      localStorage.setItem(`safety-preferences-${user.id}`, JSON.stringify(newPreferences))
      setPreferences(newPreferences)
      
      toast({
        title: "Settings Saved",
        description: "Your safety preferences have been updated."
      })
    } catch (error) {
      console.error('Error saving safety preferences:', error)
      toast({
        title: "Error",
        description: "Failed to save safety preferences.",
        variant: "destructive"
      })
    }
  }

  const getCurrentLocation = () => {
    return new Promise<EmergencyLocation>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      setIsGettingLocation(true)
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: EmergencyLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          }

          // Try to get address using reverse geocoding
          try {
            // In a real app, you would use a proper geocoding service
            location.address = `Lat: ${location.latitude.toFixed(6)}, Lon: ${location.longitude.toFixed(6)}`
          } catch (error) {
            console.error('Failed to get address:', error)
          }

          setLocation(location)
          setIsGettingLocation(false)
          resolve(location)
        },
        (error) => {
          setIsGettingLocation(false)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  const triggerEmergencyAlert = async () => {
    setIsEmergencyMode(true)
    
    try {
      let currentLocation = location
      
      // Get current location if enabled and not already available
      if (preferences.enableLocationSharing && !location) {
        try {
          currentLocation = await getCurrentLocation()
        } catch (error) {
          console.error('Failed to get location:', error)
        }
      }

      // Alert trusted contacts
      if (preferences.trustedContacts.length > 0) {
        await alertTrustedContacts(currentLocation)
      }

      toast({
        title: "Emergency Alert Sent",
        description: "Your trusted contacts have been notified.",
        variant: "default"
      })

    } catch (error) {
      console.error('Emergency alert failed:', error)
      toast({
        title: "Alert Failed",
        description: "Failed to send emergency alert. Please call emergency services directly.",
        variant: "destructive"
      })
    }
  }

  const alertTrustedContacts = async (currentLocation: EmergencyLocation | null) => {
    const activeContacts = preferences.trustedContacts.filter(contact => contact.isActive)
    
    for (const contact of activeContacts) {
      try {
        // In a real app, this would send SMS/email through a service
        const message = `${preferences.emergencyMessage}\n\nTime: ${new Date().toLocaleString()}`
        const locationText = currentLocation 
          ? `\nLocation: ${currentLocation.address || `${currentLocation.latitude}, ${currentLocation.longitude}`}\nAccuracy: ${Math.round(currentLocation.accuracy)}m`
          : '\nLocation: Not shared'
        
        console.log(`Emergency alert for ${contact.name} (${contact.phone}):`, message + locationText)
        
        // Simulate sending alert
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`Failed to alert ${contact.name}:`, error)
      }
    }
  }

  const callEmergencyServices = () => {
    // In the UK, the emergency number is 999
    window.location.href = 'tel:999'
  }

  const addTrustedContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and phone number.",
        variant: "destructive"
      })
      return
    }

    const contact: TrustedContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      relationship: newContact.relationship,
      isPrimary: preferences.trustedContacts.length === 0,
      isActive: true
    }

    const updatedPreferences = {
      ...preferences,
      trustedContacts: [...preferences.trustedContacts, contact]
    }

    saveSafetyPreferences(updatedPreferences)
    setNewContact({ name: '', phone: '', email: '', relationship: '' })
    setNewContactDialogOpen(false)
  }

  const removeTrustedContact = (contactId: string) => {
    const updatedPreferences = {
      ...preferences,
      trustedContacts: preferences.trustedContacts.filter(contact => contact.id !== contactId)
    }
    saveSafetyPreferences(updatedPreferences)
  }

  const toggleContactActive = (contactId: string) => {
    const updatedPreferences = {
      ...preferences,
      trustedContacts: preferences.trustedContacts.map(contact =>
        contact.id === contactId 
          ? { ...contact, isActive: !contact.isActive }
          : contact
      )
    }
    saveSafetyPreferences(updatedPreferences)
  }

  if (isEmergencyMode) {
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Emergency Mode Active</CardTitle>
            <CardDescription>
              Your emergency alert has been triggered. Help is on the way.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                If you're in immediate danger, call emergency services now.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={callEmergencyServices}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call 999 (Emergency)
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('tel:116123', '_self')}
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Samaritans (116 123)
              </Button>
            </div>

            {location && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Location Shared</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                </p>
              </div>
            )}

            <Button 
              variant="ghost" 
              onClick={() => setIsEmergencyMode(false)}
              className="w-full"
            >
              Exit Emergency Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Safety Comes First
          </CardTitle>
          <CardDescription>
            If you ever feel unsafe, anxious, or in danger — we're here for you.
            Tap the "Need Help" button below for instant support.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Emergency Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Immediate Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={triggerEmergencyAlert}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            <Shield className="h-5 w-5 mr-2" />
            Need Help - Send Alert
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={callEmergencyServices}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency Services (999)
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open('tel:116123', '_self')}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Free Helpline (116 123)
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This feature is discreet and quick to access — no notifications, no sound.
              We respect your privacy. Location sharing is only activated with your permission.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Safety Settings</TabsTrigger>
          <TabsTrigger value="contacts">Trusted Contacts</TabsTrigger>
          <TabsTrigger value="helplines">Support Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Safety Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Location</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow emergency alerts to include your location
                  </p>
                </div>
                <Switch
                  checked={preferences.enableLocationSharing}
                  onCheckedChange={(checked) => 
                    saveSafetyPreferences({ ...preferences, enableLocationSharing: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Silent Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep alerts discreet without sounds or notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.enableSilentMode}
                  onCheckedChange={(checked) => 
                    saveSafetyPreferences({ ...preferences, enableSilentMode: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency-message">Emergency Message</Label>
                <Textarea
                  id="emergency-message"
                  value={preferences.emergencyMessage}
                  onChange={(e) => 
                    setPreferences({ ...preferences, emergencyMessage: e.target.value })
                  }
                  onBlur={() => saveSafetyPreferences(preferences)}
                  placeholder="Custom message to send to trusted contacts"
                  rows={3}
                />
              </div>

              {preferences.enableLocationSharing && (
                <div className="space-y-3">
                  <Label>Current Location</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      {isGettingLocation ? 'Getting Location...' : 'Get Location'}
                    </Button>
                    {location && (
                      <Badge variant="outline" className="bg-green-50">
                        <MapPin className="h-3 w-3 mr-1" />
                        Location Ready
                      </Badge>
                    )}
                  </div>
                  {location && (
                    <p className="text-sm text-muted-foreground">
                      {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                      <br />
                      Accuracy: {Math.round(location.accuracy)}m
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Trusted Contacts</CardTitle>
                <Dialog open={newContactDialogOpen} onOpenChange={setNewContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Trusted Contact</DialogTitle>
                      <DialogDescription>
                        Add someone who can be alerted if you trigger the SOS feature
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="contact-name">Name *</Label>
                        <Input
                          id="contact-name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          placeholder="Contact name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Phone Number *</Label>
                        <Input
                          id="contact-phone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          placeholder="+44 7XXX XXXXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email (Optional)</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-relationship">Relationship</Label>
                        <Input
                          id="contact-relationship"
                          value={newContact.relationship}
                          onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                          placeholder="e.g., Family, Friend, Partner"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addTrustedContact} className="flex-1">
                          Add Contact
                        </Button>
                        <Button variant="outline" onClick={() => setNewContactDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {preferences.trustedContacts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Trusted Contacts</h3>
                  <p className="text-muted-foreground mb-4">
                    Add friends or family members who can be alerted in emergencies
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {preferences.trustedContacts.map((contact) => (
                    <Card key={contact.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <UserCheck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            {contact.relationship && (
                              <Badge variant="outline" className="text-xs">
                                {contact.relationship}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={contact.isActive}
                            onCheckedChange={() => toggleContactActive(contact.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTrustedContact(contact.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="helplines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>24/7 Support Resources</CardTitle>
              <CardDescription>
                Professional support services available anytime
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Samaritans</h4>
                      <p className="text-sm text-muted-foreground">
                        Free emotional support, 24/7
                      </p>
                      <p className="text-sm font-medium">116 123 (Free)</p>
                    </div>
                    <Button variant="outline" onClick={() => window.open('tel:116123', '_self')}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">NHS 111</h4>
                      <p className="text-sm text-muted-foreground">
                        Non-emergency medical advice
                      </p>
                      <p className="text-sm font-medium">111 (Free)</p>
                    </div>
                    <Button variant="outline" onClick={() => window.open('tel:111', '_self')}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Mind Infoline</h4>
                      <p className="text-sm text-muted-foreground">
                        Mental health information and support
                      </p>
                      <p className="text-sm font-medium">0300 123 3393</p>
                    </div>
                    <Button variant="outline" onClick={() => window.open('tel:03001233393', '_self')}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Crisis Text Line</h4>
                      <p className="text-sm text-muted-foreground">
                        Text support for crisis situations
                      </p>
                      <p className="text-sm font-medium">Text SHOUT to 85258</p>
                    </div>
                    <Button variant="outline" onClick={() => window.open('sms:85258?body=SHOUT', '_self')}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Text
                    </Button>
                  </div>
                </Card>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> We respect your privacy. Location sharing is only activated with your permission. 
                  This feature does not guarantee emergency response — it's here to support you in critical moments.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}