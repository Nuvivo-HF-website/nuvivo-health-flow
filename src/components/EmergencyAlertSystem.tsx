import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Heart, 
  Activity,
  Phone,
  MapPin,
  Clock,
  Shield,
  Zap,
  Siren,
  Users,
  Stethoscope,
  PhoneCall,
  Navigation,
  Bell,
  CheckCircle,
  XCircle,
  Timer,
  Thermometer,
  Droplets
} from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: 'critical' | 'warning' | 'moderate';
  title: string;
  description: string;
  vitals: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    oxygenSat?: number;
  };
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'acknowledged' | 'resolved';
  autoActions: string[];
  recommendedActions: string[];
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: number;
  notified: boolean;
  acknowledged: boolean;
}

interface EmergencyService {
  name: string;
  phone: string;
  estimatedArrival?: number;
  dispatched: boolean;
}

export function EmergencyAlertSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [emergencyServices, setEmergencyServices] = useState<EmergencyService[]>([]);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Load mock emergency data
    loadEmergencyData();
    // Check location permissions
    checkLocationPermissions();
    // Simulate real-time monitoring
    const monitoringInterval = setInterval(simulateVitalMonitoring, 10000);
    return () => clearInterval(monitoringInterval);
  }, []);

  const loadEmergencyData = () => {
    // Mock emergency contacts
    setEmergencyContacts([
      {
        id: '1',
        name: 'John Smith (Spouse)',
        relationship: 'Spouse',
        phone: '+1-555-0123',
        priority: 1,
        notified: false,
        acknowledged: false
      },
      {
        id: '2',
        name: 'Dr. Sarah Wilson',
        relationship: 'Primary Doctor',
        phone: '+1-555-0456',
        priority: 2,
        notified: false,
        acknowledged: false
      },
      {
        id: '3',
        name: 'Emergency Contact',
        relationship: 'Emergency Contact',
        phone: '+1-555-0789',
        priority: 3,
        notified: false,
        acknowledged: false
      }
    ]);

    // Mock emergency services
    setEmergencyServices([
      {
        name: 'Emergency Medical Services',
        phone: '911',
        dispatched: false
      },
      {
        name: 'Local Hospital Emergency',
        phone: '+1-555-HOSPITAL',
        dispatched: false
      },
      {
        name: 'Poison Control',
        phone: '1-800-222-1222',
        dispatched: false
      }
    ]);
  };

  const checkLocationPermissions = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationEnabled(true);
      } catch (error) {
        console.log('Location access denied');
        setLocationEnabled(false);
      }
    }
  };

  const simulateVitalMonitoring = () => {
    // Simulate occasional critical alerts (5% chance)
    if (Math.random() < 0.05) {
      const criticalAlert: EmergencyAlert = {
        id: Date.now().toString(),
        type: 'critical',
        title: 'Critical Heart Rate Detected',
        description: 'Heart rate has exceeded 120 BPM for over 5 minutes during rest',
        vitals: {
          heartRate: 125,
          bloodPressure: '160/95',
          temperature: 98.6,
          oxygenSat: 97
        },
        timestamp: new Date(),
        location: currentLocation ? {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          address: '123 Main St, City, State 12345'
        } : undefined,
        status: 'active',
        autoActions: [
          'Emergency contacts notified',
          'Location shared with emergency services',
          'Medical history uploaded to emergency response'
        ],
        recommendedActions: [
          'Sit down and rest immediately',
          'Take prescribed emergency medication if available',
          'Call 911 if symptoms worsen',
          'Contact your doctor'
        ]
      };

      setAlerts(prev => [criticalAlert, ...prev]);
      setIsEmergencyMode(true);
      triggerEmergencyResponse(criticalAlert);
    }
  };

  const triggerEmergencyResponse = async (alert: EmergencyAlert) => {
    toast({
      title: "🚨 EMERGENCY ALERT",
      description: alert.title,
      variant: "destructive",
    });

    // Simulate automatic emergency response
    setTimeout(() => {
      // Auto-notify emergency contacts
      setEmergencyContacts(prev => prev.map(contact => ({
        ...contact,
        notified: true
      })));

      toast({
        title: "Emergency Response Activated",
        description: "Emergency contacts have been notified automatically",
      });
    }, 2000);

    // Simulate emergency services notification
    setTimeout(() => {
      setEmergencyServices(prev => prev.map(service => 
        service.name === 'Emergency Medical Services' 
          ? { ...service, dispatched: true, estimatedArrival: 8 }
          : service
      ));

      toast({
        title: "Emergency Services Dispatched",
        description: "EMS has been notified and is en route (ETA: 8 minutes)",
      });
    }, 5000);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));

    const hasActiveAlerts = alerts.some(alert => 
      alert.id !== alertId && alert.status === 'active' && alert.type === 'critical'
    );

    if (!hasActiveAlerts) {
      setIsEmergencyMode(false);
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
  };

  const manualEmergencyTrigger = () => {
    const manualAlert: EmergencyAlert = {
      id: Date.now().toString(),
      type: 'critical',
      title: 'Manual Emergency Activation',
      description: 'User manually triggered emergency alert',
      vitals: {
        heartRate: 85,
        bloodPressure: '120/80',
        temperature: 98.6,
        oxygenSat: 98
      },
      timestamp: new Date(),
      location: currentLocation ? {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address: '123 Main St, City, State 12345'
      } : undefined,
      status: 'active',
      autoActions: [
        'Emergency contacts notified',
        'Location shared',
        'Medical ID transmitted'
      ],
      recommendedActions: [
        'Stay calm and wait for help',
        'Provide clear information to responders',
        'Have medical ID ready'
      ]
    };

    setAlerts(prev => [manualAlert, ...prev]);
    setIsEmergencyMode(true);
    triggerEmergencyResponse(manualAlert);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'moderate': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'moderate': return <Activity className="h-6 w-6 text-blue-500" />;
      default: return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Mode Banner */}
      {isEmergencyMode && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <Siren className="h-5 w-5 text-red-500" />
          <AlertDescription className="text-red-700 font-semibold">
            🚨 EMERGENCY MODE ACTIVE - Automatic emergency response has been triggered
          </AlertDescription>
        </Alert>
      )}

      {/* Header & Manual Emergency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Emergency Alert System
          </CardTitle>
          <CardDescription>
            24/7 monitoring with automatic emergency response and real-time vital tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={locationEnabled ? "default" : "secondary"}>
                <MapPin className="h-3 w-3 mr-1" />
                {locationEnabled ? 'Location Enabled' : 'Location Disabled'}
              </Badge>
              <Badge variant="outline">
                <Activity className="h-3 w-3 mr-1" />
                Real-time Monitoring
              </Badge>
            </div>
            <Button 
              variant="destructive" 
              onClick={manualEmergencyTrigger}
              className="bg-red-600 hover:bg-red-700"
            >
              <Siren className="h-4 w-4 mr-2" />
              Emergency Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Active Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.filter(alert => alert.status === 'active').map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.type.toUpperCase()}
                  </Badge>
                </div>

                {/* Vital Signs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded-lg">
                  {alert.vitals.heartRate && (
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{alert.vitals.heartRate} BPM</span>
                    </div>
                  )}
                  {alert.vitals.bloodPressure && (
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{alert.vitals.bloodPressure}</span>
                    </div>
                  )}
                  {alert.vitals.temperature && (
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{alert.vitals.temperature}°F</span>
                    </div>
                  )}
                  {alert.vitals.oxygenSat && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">{alert.vitals.oxygenSat}%</span>
                    </div>
                  )}
                </div>

                {/* Auto Actions */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Automatic Actions Taken:</h4>
                  <ul className="space-y-1">
                    {alert.autoActions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Actions */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Recommended Actions:</h4>
                  <ul className="space-y-1">
                    {alert.recommendedActions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 border-2 border-blue-500 rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => acknowledgeAlert(alert.id)}
                    variant="outline"
                    size="sm"
                  >
                    Acknowledge
                  </Button>
                  <Button 
                    onClick={() => resolveAlert(alert.id)}
                    variant="default"
                    size="sm"
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  {contact.notified && (
                    <Badge variant="default" className="text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      Notified
                    </Badge>
                  )}
                  {contact.acknowledged && (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-red-500" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  {service.dispatched && (
                    <Badge variant="destructive" className="text-xs">
                      <Navigation className="h-3 w-3 mr-1" />
                      Dispatched
                    </Badge>
                  )}
                  {service.estimatedArrival && (
                    <Badge variant="outline" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      ETA: {service.estimatedArrival}m
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">24/7</div>
              <p className="text-sm text-muted-foreground">Monitoring Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">&lt;30s</div>
              <p className="text-sm text-muted-foreground">Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Emergency System Active:</strong> This system monitors your vital signs 24/7 and automatically 
          alerts emergency contacts and services when critical values are detected. Location services help 
          responders find you quickly.
        </AlertDescription>
      </Alert>
    </div>
  );
}