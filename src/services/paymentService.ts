import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface PaymentRequest {
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionRequest {
  priceAmount: number;
  interval?: 'month' | 'year';
  description?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  stripe_session_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

class PaymentService {
  async createOneOffPayment(paymentData: PaymentRequest): Promise<{ url: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: paymentData
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Payment creation error:', error);
      throw new Error(error.message || 'Failed to create payment session');
    }
  }

  async createSubscription(subscriptionData: SubscriptionRequest): Promise<{ url: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: subscriptionData
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      throw new Error(error.message || 'Failed to create subscription session');
    }
  }

  async checkSubscription(): Promise<Subscription> {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Subscription check error:', error);
      throw new Error(error.message || 'Failed to check subscription status');
    }
  }

  async openCustomerPortal(): Promise<{ url: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Customer portal error:', error);
      throw new Error(error.message || 'Failed to open customer portal');
    }
  }

  async getUserOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Orders fetch error:', error);
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  async getSubscriptionInfo(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Subscription info error:', error);
      return null;
    }
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  }
}

export const paymentService = new PaymentService();