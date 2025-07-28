import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { paymentService, PaymentRequest } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

interface PaymentButtonProps {
  amount: number;
  description: string;
  metadata?: Record<string, any>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function PaymentButton({
  amount,
  description,
  metadata = {},
  variant = "default",
  size = "default",
  className = "",
  children
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const paymentData: PaymentRequest = {
        amount,
        description,
        metadata
      };

      const { url } = await paymentService.createOneOffPayment(paymentData);
      
      // Open Stripe checkout in a new tab
      window.open(url, '_blank');
      
      toast({
        title: "Redirecting to payment",
        description: "Please complete your payment in the new tab.",
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {children || `Pay ${paymentService.formatPrice(amount)}`}
    </Button>
  );
}