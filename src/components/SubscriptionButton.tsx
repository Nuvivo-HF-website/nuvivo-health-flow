import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Loader2 } from 'lucide-react';
import { paymentService, SubscriptionRequest } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionButtonProps {
  priceAmount: number;
  interval?: 'month' | 'year';
  description?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function SubscriptionButton({
  priceAmount,
  interval = 'month',
  description = 'Subscription Service',
  variant = "default",
  size = "default",
  className = "",
  children
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscription = async () => {
    setIsLoading(true);
    
    try {
      const subscriptionData: SubscriptionRequest = {
        priceAmount,
        interval,
        description
      };

      const { url } = await paymentService.createSubscription(subscriptionData);
      
      // Open Stripe checkout in a new tab
      window.open(url, '_blank');
      
      toast({
        title: "Redirecting to subscription",
        description: "Please complete your subscription in the new tab.",
      });
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to initiate subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSubscription}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Crown className="mr-2 h-4 w-4" />
      )}
      {children || `Subscribe ${paymentService.formatPrice(priceAmount)}/${interval}`}
    </Button>
  );
}