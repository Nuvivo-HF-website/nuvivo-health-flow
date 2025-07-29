import React from 'react';
import { PaymentButton } from '@/components/PaymentButton';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown, Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isSubscription?: boolean;
  interval?: 'month' | 'year';
  metadata?: Record<string, any>;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  isPopular = false,
  isSubscription = false,
  interval = 'month',
  metadata = {}
}: PricingCardProps) {
  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {isSubscription ? <Crown className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <div className="mt-4">
          <span className="text-4xl font-bold">£{price}</span>
          {isSubscription && <span className="text-muted-foreground">/{interval}</span>}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="pt-4">
          {isSubscription ? (
            <PaymentButton
              amount={price}
              description={`${title} - ${interval}ly subscription`}
              metadata={{...metadata, subscription: true, interval}}
              className="w-full"
              variant={isPopular ? 'default' : 'outline'}
            >
              Subscribe Now
            </PaymentButton>
          ) : (
            <PaymentButton
              amount={price}
              description={title}
              metadata={metadata}
              className="w-full"
              variant={isPopular ? 'default' : 'outline'}
            >
              Pay Now
            </PaymentButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}