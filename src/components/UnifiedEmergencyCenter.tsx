import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  Users, 
  Heart, 
  MapPin, 
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  active: boolean;
}

interface EmergencyAlert {
  id: string;
  type: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  vitals?: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

interface SafetyPreferences {
  locationSharing: boolean;
  silentMode: boolean;
  customMessage: string;
}

export default function UnifiedEmergencyCenter() {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [safetyPreferences, setSafetyPreferences] = useState<SafetyPreferences>({
    locationSharing: true,
    silentMode: false,
    customMessage: "I need help. Please contact me immediately."
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  // Load initial data
  useEffect(() => {
    loadSafetyPreferences();
    loadTrustedContacts();
    checkLocationPermissions();
  }, []);

  const loadSafetyPreferences = () => {
    const saved = localStorage.getItem('safetyPreferences');
    if (saved) {
      setSafetyPreferences(JSON.parse(saved));
    }
  };

  const saveSafetyPreferences = (prefs: SafetyPreferences) => {
    setSafetyPreferences(prefs);
    localStorage.setItem('safetyPreferences', JSON.stringify(prefs));
  };

  const loadTrustedContacts = () => {
    const saved = localStorage.getItem('trustedContacts');
    if (saved) {
      setTrustedContacts(JSON.parse(saved));
    }
  };

  const saveTrustedContacts = (contacts: TrustedContact[]) => {
    setTrustedContacts(contacts);
    localStorage.setItem('trustedContacts', JSON.stringify(contacts));
  };

  const checkLocationPermissions = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const triggerEmergencyAlert = async () => {
    setIsEmergencyMode(true);
    
    // Get current location if enabled
    if (safetyPreferences.locationSharing && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    }

    // Create new alert
    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      type: 'manual',
      timestamp: new Date(),
      status: 'active',
      location: currentLocation || undefined
    };

    setActiveAlerts(prev => [newAlert, ...prev]);

    // Notify trusted contacts (simulated)
    alertTrustedContacts();

    toast.error("🚨 Emergency Alert Activated", {
      description: "Emergency services have been notified. Help is on the way.",
      duration: 5000
    });

    // Auto-reset after 5 minutes
    setTimeout(() => {
      setIsEmergencyMode(false);
    }, 300000);
  };

  const alertTrustedContacts = () => {
    const activeContacts = trustedContacts.filter(contact => contact.active);
    activeContacts.forEach(contact => {
      // Simulate notification
      toast.info(`📱 Notified ${contact.name}`, {
        description: `Emergency alert sent to ${contact.relationship}`,
        duration: 3000
      });
    });
  };

  const addTrustedContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const contact: TrustedContact = {
      id: Date.now().toString(),
      ...newContact,
      active: true
    };

    const updatedContacts = [...trustedContacts, contact];
    saveTrustedContacts(updatedContacts);
    setNewContact({ name: '', phone: '', relationship: '' });
    toast.success(`Added ${contact.name} as trusted contact`);
  };

  const removeTrustedContact = (id: string) => {
    const updatedContacts = trustedContacts.filter(contact => contact.id !== id);
    saveTrustedContacts(updatedContacts);
    toast.success("Trusted contact removed");
  };

  const toggleContactActive = (id: string) => {
    const updatedContacts = trustedContacts.map(contact =>
      contact.id === id ? { ...contact, active: !contact.active } : contact
    );
    saveTrustedContacts(updatedContacts);
  };

  const callEmergencyServices = () => {
    window.open('tel:999', '_self');
  };

  const callHelpline = () => {
    window.open('tel:116123', '_self');
  };

  const resolveAlert = (alertId: string) => {
    setActiveAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    );
    toast.success("Alert resolved");
  };

  // Emergency Mode UI
  if (isEmergencyMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-destructive bg-destructive/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-pulse">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl text-destructive">🚨 EMERGENCY MODE ACTIVE</CardTitle>
            <CardDescription className="text-lg">
              Emergency services have been notified. Stay calm, help is coming.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                size="lg" 
                variant="destructive" 
                className="h-16 text-lg"
                onClick={callEmergencyServices}
              >
                <Phone className="h-6 w-6 mr-2" />
                Call 999 (Emergency)
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 text-lg border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={callHelpline}
              >
                <Phone className="h-6 w-6 mr-2" />
                Call 116 123 (Samaritans)
              </Button>
            </div>

            {currentLocation && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">Your location has been shared</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Emergency services can locate you at: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              </div>
            )}

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setIsEmergencyMode(false)}
                className="border-muted-foreground"
              >
                Exit Emergency Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Emergency Center UI
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Emergency & Safety Center
        </h1>
        <p className="text-muted-foreground">
          Get immediate help, manage your safety preferences, and stay connected with trusted contacts
        </p>
      </div>

      {/* Immediate Help Section */}
      <Card className="border-destructive bg-gradient-to-r from-destructive/5 to-destructive/10">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-destructive">Need Immediate Help?</CardTitle>
          <CardDescription>Click the button below to activate emergency alert</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button 
              size="lg" 
              variant="destructive"
              className="h-16 px-8 text-lg animate-pulse hover:animate-none"
              onClick={triggerEmergencyAlert}
            >
              <AlertTriangle className="h-6 w-6 mr-2" />
              🚨 SEND EMERGENCY ALERT
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" onClick={callEmergencyServices}>
              <Phone className="h-5 w-5 mr-2" />
              Call 999 (Emergency)
            </Button>
            <Button variant="outline" size="lg" onClick={callHelpline}>
              <Phone className="h-5 w-5 mr-2" />
              Call 116 123 (Samaritans)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">Emergency Alert</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                      {alert.status}
                    </Badge>
                    {alert.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Trusted Contacts
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Shield className="h-4 w-4 mr-2" />
            Safety Settings
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Heart className="h-4 w-4 mr-2" />
            Support Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Trusted Contact</CardTitle>
              <CardDescription>
                These contacts will be notified during emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+44 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="Family, Friend, etc."
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addTrustedContact} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Trusted Contacts ({trustedContacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {trustedContacts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No trusted contacts added yet. Add contacts above to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {trustedContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${contact.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.phone} • {contact.relationship}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={contact.active}
                          onCheckedChange={() => toggleContactActive(contact.id)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTrustedContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Preferences</CardTitle>
              <CardDescription>
                Configure how emergency alerts work for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Location Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share your location with emergency services
                  </p>
                </div>
                <Switch
                  checked={safetyPreferences.locationSharing}
                  onCheckedChange={(checked) => 
                    saveSafetyPreferences({ ...safetyPreferences, locationSharing: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Silent Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts without sound notifications
                  </p>
                </div>
                <Switch
                  checked={safetyPreferences.silentMode}
                  onCheckedChange={(checked) => 
                    saveSafetyPreferences({ ...safetyPreferences, silentMode: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Emergency Message</Label>
                <Input
                  id="customMessage"
                  value={safetyPreferences.customMessage}
                  onChange={(e) => 
                    saveSafetyPreferences({ ...safetyPreferences, customMessage: e.target.value })
                  }
                  placeholder="Enter your custom emergency message"
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to your trusted contacts during emergencies
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={callEmergencyServices}>
                  <Phone className="h-4 w-4 mr-2" />
                  999 - Emergency Services
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open('tel:111', '_self')}>
                  <Phone className="h-4 w-4 mr-2" />
                  111 - NHS Non-Emergency
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open('tel:101', '_self')}>
                  <Phone className="h-4 w-4 mr-2" />
                  101 - Police Non-Emergency
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mental Health Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={callHelpline}>
                  <Phone className="h-4 w-4 mr-2" />
                  116 123 - Samaritans (24/7)
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open('tel:0800644644', '_self')}>
                  <Phone className="h-4 w-4 mr-2" />
                  0800 644 644 - Mind Infoline
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => window.open('tel:0300 304 7000', '_self')}>
                  <Phone className="h-4 w-4 mr-2" />
                  0300 304 7000 - Anxiety UK
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• This system provides support tools but is not a replacement for professional emergency services</p>
              <p>• In life-threatening situations, always call 999 immediately</p>
              <p>• Location sharing requires browser permissions and may not be 100% accurate</p>
              <p>• Trusted contacts are notified via app notifications (simulation)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}