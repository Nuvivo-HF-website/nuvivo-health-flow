import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Watch, 
  Heart, 
  Activity,
  Zap,
  Smartphone,
  Bluetooth,
  Wifi,
  Battery,
  TrendingUp,
  Moon,
  Footprints,
  Thermometer,
  Droplets,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smart_scale' | 'blood_pressure_monitor' | 'glucose_monitor';
  brand: string;
  model: string;
  connected: boolean;
  batteryLevel: number;
  lastSync: Date;
  capabilities: string[];
}

interface RealtimeMetric {
  metric: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

interface HealthAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  deviceId: string;
  acknowledged: boolean;
}

export function WearableIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetric[]>([]);
  const [healthAlerts, setHealthAlerts] = useState<HealthAlert[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDevicesAndMetrics();
      // Set up real-time updates
      const interval = setInterval(updateRealtimeMetrics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDevicesAndMetrics = async () => {
    setLoading(true);
    try {
      // Mock connected devices
      setDevices([
        {
          id: 'apple-watch-1',
          name: 'Apple Watch Series 9',
          type: 'smartwatch',
          brand: 'Apple',
          model: 'Series 9',
          connected: true,
          batteryLevel: 85,
          lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          capabilities: ['heart_rate', 'activity', 'sleep', 'ecg', 'blood_oxygen']
        },
        {
          id: 'withings-scale-1',
          name: 'Withings Body+ Scale',
          type: 'smart_scale',
          brand: 'Withings',
          model: 'Body+',
          connected: true,
          batteryLevel: 92,
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          capabilities: ['weight', 'body_fat', 'muscle_mass', 'bone_mass']
        },
        {
          id: 'omron-bp-1',
          name: 'Omron HeartGuide',
          type: 'blood_pressure_monitor',
          brand: 'Omron',
          model: 'HeartGuide',
          connected: false,
          batteryLevel: 45,
          lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          capabilities: ['blood_pressure', 'pulse']
        }
      ]);

      // Mock real-time metrics
      setRealtimeMetrics([
        {
          metric: 'Heart Rate',
          value: '72',
          unit: 'bpm',
          status: 'normal',
          icon: <Heart className="h-5 w-5 text-red-500" />,
          trend: 'stable',
          lastUpdated: new Date()
        },
        {
          metric: 'Steps Today',
          value: '8,247',
          unit: 'steps',
          status: 'normal',
          icon: <Footprints className="h-5 w-5 text-blue-500" />,
          trend: 'up',
          lastUpdated: new Date()
        },
        {
          metric: 'Sleep Score',
          value: '85',
          unit: '/100',
          status: 'normal',
          icon: <Moon className="h-5 w-5 text-purple-500" />,
          trend: 'up',
          lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000)
        },
        {
          metric: 'Blood Oxygen',
          value: '98',
          unit: '%',
          status: 'normal',
          icon: <Droplets className="h-5 w-5 text-cyan-500" />,
          trend: 'stable',
          lastUpdated: new Date()
        }
      ]);

      // Mock health alerts
      setHealthAlerts([
        {
          id: 'alert-1',
          type: 'warning',
          title: 'Elevated Heart Rate',
          message: 'Your heart rate has been above 100 bpm for 15 minutes during rest',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          deviceId: 'apple-watch-1',
          acknowledged: false
        },
        {
          id: 'alert-2',
          type: 'info',
          title: 'Activity Goal Reached',
          message: 'Congratulations! You\'ve reached your daily step goal of 8,000 steps',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          deviceId: 'apple-watch-1',
          acknowledged: true
        }
      ]);

    } catch (error) {
      toast({
        title: "Loading Error",
        description: "Unable to load wearable device data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRealtimeMetrics = () => {
    // Simulate real-time metric updates
    setRealtimeMetrics(prev => prev.map(metric => ({
      ...metric,
      lastUpdated: new Date(),
      value: metric.metric === 'Heart Rate' 
        ? String(Math.floor(Math.random() * 20) + 65) // 65-85 bpm
        : metric.value
    })));
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    toast({
      title: "Scanning for devices",
      description: "Looking for nearby wearable devices...",
    });

    // Simulate device scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan complete",
        description: "Found 2 compatible devices nearby",
      });
    }, 3000);
  };

  const connectDevice = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSync: new Date() }
          : device
      ));
      
      toast({
        title: "Device connected",
        description: "Successfully connected to your wearable device",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to the device. Please try again.",
        variant: "destructive",
      });
    }
  };

  const syncDevice = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date() }
          : device
      ));
      
      toast({
        title: "Sync complete",
        description: "Device data has been updated",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Unable to sync device data",
        variant: "destructive",
      });
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setHealthAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return <Watch className="h-6 w-6" />;
      case 'fitness_tracker': return <Activity className="h-6 w-6" />;
      case 'smart_scale': return <TrendingUp className="h-6 w-6" />;
      case 'blood_pressure_monitor': return <Heart className="h-6 w-6" />;
      case 'glucose_monitor': return <Droplets className="h-6 w-6" />;
      default: return <Smartphone className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading wearable devices...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-6 w-6 text-blue-600" />
            Wearable Device Integration
          </CardTitle>
          <CardDescription>
            Connect and monitor your health devices for real-time insights
          </CardDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
              <label htmlFor="auto-sync" className="text-sm">Auto-sync devices</label>
            </div>
            <Button 
              onClick={scanForDevices} 
              disabled={isScanning}
              variant="outline"
            >
              {isScanning ? <Bluetooth className="h-4 w-4 animate-pulse mr-2" /> : <Bluetooth className="h-4 w-4 mr-2" />}
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Live Health Metrics
          </CardTitle>
          <CardDescription>
            Real-time data from your connected devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realtimeMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  {metric.icon}
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                    <span className="text-sm font-normal ml-1">{metric.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated {metric.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-500" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            Manage your wearable devices and health monitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${device.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <h3 className="font-medium">{device.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {device.brand} {device.model}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant={device.connected ? 'default' : 'secondary'}>
                      {device.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Battery className="h-4 w-4" />
                      {device.batteryLevel}%
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(device.lastSync).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {device.connected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => syncDevice(device.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Sync
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => connectDevice(device.id)}
                  >
                    <Wifi className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Health Alerts
          </CardTitle>
          <CardDescription>
            Notifications and alerts from your devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active health alerts</p>
              <p className="text-sm">Your devices are monitoring your health</p>
            </div>
          ) : (
            healthAlerts.map((alert) => (
              <Alert key={alert.id} className={alert.acknowledged ? 'opacity-50' : ''}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div>
                      <strong>{alert.title}</strong>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          <strong>Supported Devices:</strong> Apple Watch, Fitbit, Garmin, Withings, Omron, and more. 
          Enable permissions in your device settings to share health data securely.
        </AlertDescription>
      </Alert>
    </div>
  );
}