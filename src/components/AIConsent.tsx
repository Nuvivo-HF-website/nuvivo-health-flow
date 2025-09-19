import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Brain, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Allowed roles that can view/use AI consent.
 * Adjust if you add more granular roles later.
 */
const ALLOWED_AI_CONSENT_ROLES = new Set(['patient']);

export function AIConsent() {
  const { user, userProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Your app may store role as `role` or `account_type`. Support both.
  const role =
    (userProfile as any)?.role ??
    (userProfile as any)?.account_type ??
    null;

  const isAllowed = role ? ALLOWED_AI_CONSENT_ROLES.has(role) : false;

  // If the signed-in user is NOT allowed (doctor, clinic, staff, admin, etc.), render nothing.
  if (!isAllowed) return null;

  const handleConsentChange = async (checked: boolean) => {
    if (!user) return;
    if (!isAllowed) return; // extra guard

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_consent: checked })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local profile state
      updateProfile({ ai_consent: checked });

      toast({
        title: checked ? 'AI Insights Enabled' : 'AI Insights Disabled',
        description: checked
          ? 'You can now generate AI-powered summaries of your test results.'
          : 'AI features have been disabled for your account.',
      });
    } catch (error) {
      console.error('Error updating AI consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to update AI consent settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription>
          Enable AI-powered analysis and summaries of your medical test results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="ai-consent" className="text-base font-medium">
            Enable AI Insights
          </Label>
          <Switch
            id="ai-consent"
            checked={Boolean(userProfile?.ai_consent)}
            onCheckedChange={handleConsentChange}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Brain className="h-4 w-4 mt-0.5" />
            <p>
              Get patient-friendly explanations of your blood test results using advanced AI technology
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 mt-0.5" />
            <p>
              Your data is anonymized before AI processing — no personal information is shared
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <p>
              AI summaries are for educational purposes only and do not replace professional medical advice
            </p>
          </div>
        </div>

        {userProfile?.ai_consent && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>AI Insights Enabled:</strong> You can now generate AI-powered summaries when viewing your test results.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
