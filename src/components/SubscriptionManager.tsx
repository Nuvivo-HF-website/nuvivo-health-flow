import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Settings, RefreshCw, Loader2 } from 'lucide-react';
import { paymentService, Subscription } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      const data = await paymentService.checkSubscription();
      setSubscription(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setIsPortalLoading(true);
      const { url } = await paymentService.openCustomerPortal();
      window.open(url, '_blank');
      
      toast({
        title: "Redirecting to Customer Portal",
        description: "Manage your subscription in the new tab.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'Basic':
        return 'secondary';
      case 'Premium':
        return 'default';
      case 'Enterprise':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Subscription Status
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSubscription}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        ) : subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {subscription.subscribed ? 'Active Subscription' : 'No Active Subscription'}
                </h4>
                {subscription.subscription_tier && (
                  <Badge variant={getTierColor(subscription.subscription_tier)} className="mt-1">
                    {subscription.subscription_tier}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <Badge variant={subscription.subscribed ? 'default' : 'outline'}>
                  {subscription.subscribed ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {subscription.subscription_end && (
              <div className="text-sm text-muted-foreground">
                <strong>Next billing date:</strong> {formatDate(subscription.subscription_end)}
              </div>
            )}

            {subscription.subscribed && (
              <Button
                onClick={openCustomerPortal}
                disabled={isPortalLoading}
                className="w-full"
              >
                {isPortalLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="mr-2 h-4 w-4" />
                )}
                Manage Subscription
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Unable to load subscription information
          </div>
        )}
      </CardContent>
    </Card>
  );
}