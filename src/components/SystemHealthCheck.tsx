import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService } from '@/services/paymentService';
import { bookingService } from '@/services/bookingService';
import { AlertTriangle, CheckCircle, RefreshCw, Users, Calendar, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemHealth {
  payment: 'healthy' | 'warning' | 'error';
  booking: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
  subscription: 'healthy' | 'warning' | 'error';
}

export function SystemHealthCheck() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [health, setHealth] = useState<SystemHealth>({
    payment: 'healthy',
    booking: 'healthy',
    auth: 'healthy',
    subscription: 'healthy'
  });
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runHealthCheck = async () => {
    setIsChecking(true);
    const newHealth: SystemHealth = {
      payment: 'healthy',
      booking: 'healthy',
      auth: 'healthy',
      subscription: 'healthy'
    };

    try {
      // Check Authentication
      if (!user) {
        newHealth.auth = 'warning';
      }

      // Check Payment System
      try {
        await paymentService.getUserOrders();
      } catch (error) {
        newHealth.payment = 'error';
      }

      // Check Booking System
      try {
        if (user) {
          await bookingService.getPatientAppointments(user.id);
        }
      } catch (error) {
        newHealth.booking = 'warning';
      }

      // Check Subscription System
      try {
        if (user) {
          await paymentService.checkSubscription();
        }
      } catch (error) {
        newHealth.subscription = 'warning';
      }

      setHealth(newHealth);
      setLastCheck(new Date());
      
      const hasErrors = Object.values(newHealth).some(status => status === 'error');
      const hasWarnings = Object.values(newHealth).some(status => status === 'warning');
      
      if (hasErrors) {
        toast({
          title: "System Health Check",
          description: "Some systems are experiencing issues",
          variant: "destructive",
        });
      } else if (hasWarnings) {
        toast({
          title: "System Health Check",
          description: "Some systems have warnings",
        });
      } else {
        toast({
          title: "System Health Check",
          description: "All systems operational",
        });
      }
    } catch (error) {
      console.error('Health check error:', error);
      toast({
        title: "Health Check Failed",
        description: "Unable to complete system health check",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const systems = [
    { name: 'Authentication', key: 'auth' as keyof SystemHealth, icon: Users },
    { name: 'Booking System', key: 'booking' as keyof SystemHealth, icon: Calendar },
    { name: 'Payment System', key: 'payment' as keyof SystemHealth, icon: CreditCard },
    { name: 'Subscriptions', key: 'subscription' as keyof SystemHealth, icon: Users },
  ];

  const overallStatus = Object.values(health).every(status => status === 'healthy') 
    ? 'healthy' 
    : Object.values(health).some(status => status === 'error') 
    ? 'error' 
    : 'warning';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              System Health Check
            </CardTitle>
            <CardDescription>
              Monitor the health of all system components
              {lastCheck && (
                <span className="block text-xs mt-1">
                  Last checked: {lastCheck.toLocaleTimeString()}
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runHealthCheck}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Now
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant={overallStatus === 'error' ? 'destructive' : 'default'}>
          {getStatusIcon(overallStatus)}
          <AlertTitle>Overall System Status</AlertTitle>
          <AlertDescription>
            {overallStatus === 'healthy' && "All systems are operating normally"}
            {overallStatus === 'warning' && "Some systems have warnings but are functional"}
            {overallStatus === 'error' && "Critical systems are experiencing issues"}
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          {systems.map((system) => {
            const Icon = system.icon;
            const status = health[system.key];
            
            return (
              <div key={system.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{system.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  {getStatusBadge(status)}
                </div>
              </div>
            );
          })}
        </div>

        {!user && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Some system checks require user authentication. Please sign in for complete health monitoring.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}