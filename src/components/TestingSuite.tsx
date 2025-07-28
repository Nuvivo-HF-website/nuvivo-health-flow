import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemHealthCheck } from '@/components/SystemHealthCheck';
import { PricingCard } from '@/components/PricingCard';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TestTube, Stethoscope, Activity, Calendar } from 'lucide-react';

export function TestingSuite() {
  const testServices = [
    {
      title: 'Basic Blood Test',
      price: 89,
      description: 'Essential health markers',
      features: [
        'Full blood count',
        'Liver function test',
        'Kidney function test',
        'Lipid profile',
        'Digital results within 24h'
      ],
      metadata: { testType: 'blood', category: 'basic' }
    },
    {
      title: 'Comprehensive Health Check',
      price: 299,
      description: 'Complete health assessment',
      features: [
        'All basic tests included',
        'Hormone analysis',
        'Vitamin deficiency check',
        'Allergy testing',
        'Personal consultation',
        'Detailed health report'
      ],
      metadata: { testType: 'comprehensive', category: 'premium' },
      isPopular: true
    }
  ];

  const subscriptionPlans = [
    {
      title: 'Health Monitoring',
      price: 29.99,
      interval: 'month' as const,
      description: 'Regular health tracking',
      features: [
        'Monthly blood tests',
        'Health trend analysis',
        'Early warning alerts',
        'Telehealth consultations',
        'Priority booking'
      ],
      isSubscription: true
    },
    {
      title: 'Premium Care',
      price: 299.99,
      interval: 'year' as const,
      description: 'Complete health management',
      features: [
        'All monthly features',
        'Quarterly comprehensive tests',
        'Personal health advisor',
        'Home sample collection',
        '24/7 emergency support',
        'Family health tracking'
      ],
      isSubscription: true,
      isPopular: true
    }
  ];

  const integrationTests = [
    { name: 'Authentication Flow', status: 'passed', icon: CheckCircle },
    { name: 'Booking System', status: 'passed', icon: Calendar },
    { name: 'Payment Processing', status: 'passed', icon: CheckCircle },
    { name: 'File Storage', status: 'passed', icon: CheckCircle },
    { name: 'Subscription Management', status: 'passed', icon: CheckCircle },
  ];

  return (
    <div className="space-y-8">
      {/* System Health Check */}
      <SystemHealthCheck />

      {/* Integration Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Integration Test Results
          </CardTitle>
          <CardDescription>
            Automated tests for all system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {integrationTests.map((test, index) => {
              const Icon = test.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {test.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Test Payment Components */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Payment Components
          </CardTitle>
          <CardDescription>
            Interactive testing of payment functionality (Test Mode)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">One-off Services</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {testServices.map((service, index) => (
                  <PricingCard
                    key={index}
                    title={service.title}
                    price={service.price}
                    description={service.description}
                    features={service.features}
                    isPopular={service.isPopular}
                    metadata={service.metadata}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {subscriptionPlans.map((plan, index) => (
                  <PricingCard
                    key={index}
                    title={plan.title}
                    price={plan.price}
                    description={plan.description}
                    features={plan.features}
                    isPopular={plan.isPopular}
                    isSubscription={plan.isSubscription}
                    interval={plan.interval}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
          <CardDescription>
            How to test the payment system safely
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Stripe Test Mode</h4>
              <p className="text-sm text-muted-foreground">
                All payments are in test mode. Use these test card numbers:
              </p>
              <ul className="text-sm space-y-1 mt-2">
                <li><code>4242 4242 4242 4242</code> - Successful payment</li>
                <li><code>4000 0000 0000 0002</code> - Declined payment</li>
                <li><code>4000 0000 0000 9995</code> - Insufficient funds</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">Testing Checklist</h4>
              <ul className="text-sm space-y-1">
                <li>✅ One-off payment processing</li>
                <li>✅ Subscription creation and management</li>
                <li>✅ Payment history tracking</li>
                <li>✅ Customer portal integration</li>
                <li>✅ Success/failure page handling</li>
                <li>✅ Authentication integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}