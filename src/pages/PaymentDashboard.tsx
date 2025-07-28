import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentHistory } from '@/components/PaymentHistory';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { PaymentButton } from '@/components/PaymentButton';
import { SubscriptionButton } from '@/components/SubscriptionButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService } from '@/services/paymentService';
import { CreditCard, Crown, TrendingUp, Users, DollarSign, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await paymentService.checkSubscription();
      setSubscription(data);
    } catch (error: any) {
      console.error('Subscription check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Dashboard</CardTitle>
              <CardDescription>Please sign in to access payment features</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/sign-in">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const sampleServices = [
    { id: 1, name: 'Blood Test', price: 89, description: 'Comprehensive blood analysis' },
    { id: 2, name: 'Health Consultation', price: 150, description: '45-minute consultation with specialist' },
    { id: 3, name: 'Medical Scan', price: 320, description: 'Advanced imaging and analysis' },
  ];

  const subscriptionPlans = [
    { 
      id: 1, 
      name: 'Basic Plan', 
      price: 9.99, 
      interval: 'month' as const,
      description: 'Essential health monitoring',
      features: ['Monthly health reports', 'Basic consultations', 'Email support']
    },
    { 
      id: 2, 
      name: 'Premium Plan', 
      price: 29.99, 
      interval: 'month' as const,
      description: 'Comprehensive health management',
      features: ['Weekly health reports', 'Priority consultations', 'Phone support', '24/7 emergency line']
    },
    { 
      id: 3, 
      name: 'Annual Premium', 
      price: 299.99, 
      interval: 'year' as const,
      description: 'Best value - save 17%',
      features: ['All Premium features', '2 months free', 'Personal health advisor', 'Home visits']
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Payment Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Manage your payments and subscriptions
              </p>
            </div>
            <Button
              variant="outline"
              onClick={checkSubscription}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
          
          {subscription && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                <span className="font-medium">
                  Subscription Status: {subscription.subscribed ? 'Active' : 'Inactive'}
                </span>
                {subscription.subscription_tier && (
                  <Badge variant="default">{subscription.subscription_tier}</Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">One-off Services</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="manage">Manage Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Health Services
                </CardTitle>
                <CardDescription>
                  Pay for individual health services and consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sampleServices.map((service) => (
                    <Card key={service.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold">
                            {paymentService.formatPrice(service.price)}
                          </span>
                        </div>
                        <PaymentButton
                          amount={service.price}
                          description={service.name}
                          metadata={{ serviceId: service.id }}
                          className="w-full"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Subscription Plans
                </CardTitle>
                <CardDescription>
                  Choose a subscription plan for ongoing health management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className={plan.name === 'Premium Plan' ? 'border-primary' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          {plan.name === 'Premium Plan' && (
                            <Badge variant="default">Popular</Badge>
                          )}
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold">
                            {paymentService.formatPrice(plan.price)}
                          </span>
                          <span className="text-muted-foreground">/{plan.interval}</span>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <SubscriptionButton
                          priceAmount={plan.price}
                          interval={plan.interval}
                          description={plan.name}
                          className="w-full"
                          variant={plan.name === 'Premium Plan' ? 'default' : 'outline'}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <PaymentHistory />
          </TabsContent>

          <TabsContent value="manage">
            <SubscriptionManager />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}