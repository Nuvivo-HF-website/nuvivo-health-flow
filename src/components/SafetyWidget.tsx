import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Users, 
  Heart,
  MessageCircle,
  Navigation,
  CheckCircle,
  Info,
  Clock,
  Bell
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function SafetyWidget() {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)

  const triggerEmergencyAlert = async () => {
    setIsEmergencyMode(true)
    
    // Get current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.error('Location error:', error)
      )
    }

    toast({
      title: "Emergency Alert Activated",
      description: "Emergency services and trusted contacts have been notified.",
    })

    // In a real app, this would trigger actual emergency protocols
    setTimeout(() => {
      setIsEmergencyMode(false)
    }, 10000) // Auto-reset after 10 seconds for demo
  }

  const callEmergencyServices = () => {
    window.location.href = 'tel:999'
  }

  if (isEmergencyMode) {
    return (
      <Card className="border-red-200 bg-red-50">
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
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
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
    )
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <Shield className="h-5 w-5" />
          Your Safety Comes First
        </CardTitle>
        <CardDescription>
          If you ever feel unsafe, anxious, or in danger — we're here for you.
          Tap the "Need Help" button below for instant support.
        </CardDescription>
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

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Call Emergency Services (999)</div>
              <div className="text-muted-foreground">Get immediate help from local emergency responders.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Speak to a Free Helpline</div>
              <div className="text-muted-foreground">Talk to someone confidentially, anytime — 24/7.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Share Your Location (Optional)</div>
              <div className="text-muted-foreground">With trusted contacts or support services, so they can find you quickly.</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium">Set Up Trusted Contact</div>
              <div className="text-muted-foreground">Let a friend or family member be alerted if you trigger the SOS feature.</div>
            </div>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> We respect your privacy. Location sharing is only activated with your permission. 
            This feature does not guarantee emergency response — it's here to support you in critical moments.
            This feature is discreet and quick to access — no notifications, no sound.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}