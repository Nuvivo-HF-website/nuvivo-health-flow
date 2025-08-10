import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Download, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConsentStatus {
  ai_consent: boolean;
  marketing_consent: boolean;
  research_consent: boolean;
  data_retention_consent: boolean;
  consent_timestamp?: string;
  consent_version?: string;
}

export const GDPRConsentManager: React.FC = () => {
  const { user } = useAuth();
  const [consents, setConsents] = useState<ConsentStatus>({
    ai_consent: false,
    marketing_consent: false,
    research_consent: false,
    data_retention_consent: false
  });
  const [loading, setLoading] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchConsentStatus();
    }
  }, [user]);

  const fetchConsentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_consent, marketing_consent, research_consent, data_retention_consent, consent_timestamp, consent_version')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setConsents(data);
      }
    } catch (error) {
      console.error('Error fetching consent status:', error);
      toast.error('Failed to load consent preferences');
    }
  };

  const updateConsent = async (consentType: keyof ConsentStatus, value: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const updates = {
        [consentType]: value,
        consent_timestamp: new Date().toISOString(),
        consent_version: 'v1.0'
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      // If withdrawing consent, call the withdrawal function
      if (!value) {
        const { error: withdrawalError } = await supabase.rpc('withdraw_consent', {
          _user_id: user.id,
          _consent_type: consentType.replace('_consent', '').replace('_', '_')
        });

        if (withdrawalError) {
          console.error('Withdrawal function error:', withdrawalError);
        }
      }

      setConsents(prev => ({ ...prev, [consentType]: value }));
      toast.success(`Consent ${value ? 'granted' : 'withdrawn'} successfully`);
    } catch (error) {
      console.error('Error updating consent:', error);
      toast.error('Failed to update consent');
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('export_user_data', {
        _user_id: user.id
      });

      if (error) throw error;

      // Download the data as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data export downloaded successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create GDPR deletion request
      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          request_type: 'deletion',
          status: 'pending',
          details: {
            requested_at: new Date().toISOString(),
            trigger: 'user_request'
          }
        });

      if (error) throw error;

      setDeletionRequested(true);
      toast.success('Data deletion request submitted. You will be contacted within 30 days.');
    } catch (error) {
      console.error('Error requesting deletion:', error);
      toast.error('Failed to submit deletion request');
    } finally {
      setLoading(false);
    }
  };

  const consentItems = [
    {
      key: 'ai_consent' as keyof ConsentStatus,
      title: 'AI Processing',
      description: 'Allow AI analysis of your anonymized medical test results for patient-friendly summaries',
      required: false,
      dataCategory: 'Health Data (Anonymized)'
    },
    {
      key: 'marketing_consent' as keyof ConsentStatus,
      title: 'Marketing Communications',
      description: 'Receive health tips, service updates, and promotional materials',
      required: false,
      dataCategory: 'Contact Information'
    },
    {
      key: 'research_consent' as keyof ConsentStatus,
      title: 'Medical Research',
      description: 'Allow anonymized data to contribute to medical research studies',
      required: false,
      dataCategory: 'Health Data (Anonymized)'
    },
    {
      key: 'data_retention_consent' as keyof ConsentStatus,
      title: 'Extended Data Retention',
      description: 'Store your data beyond the minimum healthcare record retention period',
      required: true,
      dataCategory: 'All Personal Data'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            GDPR Consent Management
          </CardTitle>
          <CardDescription>
            Manage your data processing consents and privacy preferences. You can withdraw consent at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consent Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {consentItems.map((item) => (
              <div key={item.key} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {consents[item.key] ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div className="text-sm font-medium">{item.title}</div>
                <Badge variant={consents[item.key] ? "default" : "secondary"} className="mt-1">
                  {consents[item.key] ? 'Granted' : 'Not Granted'}
                </Badge>
              </div>
            ))}
          </div>

          <Separator />

          {/* Individual Consent Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Consent Preferences</h3>
            {consentItems.map((item) => (
              <div key={item.key} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Data Category: {item.dataCategory}
                    </p>
                  </div>
                  <Checkbox
                    checked={Boolean(consents[item.key])}
                    onCheckedChange={(checked) => updateConsent(item.key, Boolean(checked))}
                    disabled={loading || (item.required && Boolean(consents[item.key]))}
                  />
                </div>
              </div>
            ))}
          </div>

          {consents.consent_timestamp && (
            <Alert>
              <AlertDescription>
                Last updated: {new Date(consents.consent_timestamp).toLocaleString()} 
                (Version: {consents.consent_version})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Data Subject Rights */}
      <Card>
        <CardHeader>
          <CardTitle>Your Data Rights</CardTitle>
          <CardDescription>
            Under GDPR, you have the right to access, export, and delete your personal data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={exportUserData}
              disabled={loading}
              variant="outline"
              className="h-auto p-4 justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">Export My Data</div>
                <div className="text-sm text-muted-foreground">
                  Download all your personal data in JSON format
                </div>
              </div>
            </Button>

            <Button
              onClick={requestDataDeletion}
              disabled={loading || deletionRequested}
              variant="destructive"
              className="h-auto p-4 justify-start"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">
                  {deletionRequested ? 'Deletion Requested' : 'Delete My Data'}
                </div>
                <div className="text-sm text-destructive-foreground">
                  {deletionRequested 
                    ? 'Request submitted - you will be contacted within 30 days'
                    : 'Permanently delete all your personal data'
                  }
                </div>
              </div>
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Data deletion is permanent and cannot be undone. 
              Some audit logs may be retained for legal compliance as required by healthcare regulations.
              Medical records may need to be retained for the statutory period regardless of consent withdrawal.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};