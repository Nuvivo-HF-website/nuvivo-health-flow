import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SummaryButton } from '@/components/SummaryButton';
import { RiskFlaggingButton } from '@/components/RiskFlaggingButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock 
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Result {
  id: string;
  user_id: string;
  uploaded_by: string;
  parsed_data: any;
  ai_summary: string;
  ai_generated_at: string;
  ai_flags?: any;
  ai_risk_score?: number;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  ai_consent: boolean;
}

export default function ResultView() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  
  const [result, setResult] = useState<Result | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isStaff = hasRole('admin') || hasRole('doctor');

  useEffect(() => {
    if (resultId && user) {
      loadResult();
    }
  }, [resultId, user]);

  const loadResult = async () => {
    if (!resultId) return;

    setLoading(true);
    try {
      // Load the result
      const { data: resultData, error: resultError } = await supabase
        .from('results')
        .select('id, user_id, uploaded_by, parsed_data, ai_summary, ai_generated_at, ai_flags, ai_risk_score, created_at, updated_at')
        .eq('id', resultId)
        .single();

      if (resultError) throw resultError;

      setResult(resultData);

      // Load the user profile for the result owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, ai_consent')
        .eq('user_id', resultData.user_id)
        .single();

      if (profileError) throw profileError;

      setUserProfile(profileData);

    } catch (error) {
      console.error('Error loading result:', error);
      toast({
        title: "Error",
        description: "Failed to load result details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSummaryGenerated = async () => {
    setRefreshing(true);
    await loadResult();
    setRefreshing(false);
  };

  const extractTestValues = (parsedData: any) => {
    if (!parsedData || !Array.isArray(parsedData.tests)) return [];
    
    return parsedData.tests.map((test: any) => ({
      name: test.name || 'Unknown Test',
      value: test.value || 'N/A',
      unit: test.unit || '',
      reference: test.reference || '',
      status: test.status || 'normal'
    }));
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'high':
      case 'low':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      normal: { variant: 'default', label: 'Normal' },
      high: { variant: 'destructive', label: 'High' },
      low: { variant: 'destructive', label: 'Low' },
      critical: { variant: 'destructive', label: 'Critical' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', label: status || 'Unknown' };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to view this result.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user can access this result (either owner or staff)
  const canAccess = isStaff || (result && result.user_id === user.id);
  
  if (!loading && !canAccess) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this result.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Blood Test Result</h1>
          <p className="text-muted-foreground">
            {isStaff ? 'Staff view of patient result' : 'Detailed view of your test result'}
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading result...</p>
            </CardContent>
          </Card>
        ) : result ? (
          <div className="space-y-6">
            {/* Result Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Result Details
                    </CardTitle>
                    <CardDescription>
                      Uploaded on {format(new Date(result.created_at), 'PPP')}
                    </CardDescription>
                  </div>
                  
                  {isStaff && (
                    <div className="flex gap-2">
                      <SummaryButton
                        resultId={result.id}
                        hasExistingSummary={!!result.ai_summary}
                        userHasConsent={userProfile?.ai_consent}
                        onSummaryGenerated={handleSummaryGenerated}
                        disabled={refreshing}
                      />
                      <RiskFlaggingButton
                        resultId={result.id}
                        hasExistingFlags={!!result.ai_flags}
                        onFlagsGenerated={handleSummaryGenerated}
                        disabled={refreshing}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {isStaff && userProfile && (
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{userProfile.full_name} ({userProfile.email})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span>AI Consent: {userProfile.ai_consent ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* AI Summary */}
            {result.ai_summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    AI Summary
                  </CardTitle>
                  <CardDescription>
                    Generated on {format(new Date(result.ai_generated_at), 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm leading-relaxed">{result.ai_summary}</p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <p>
                      This AI-generated summary is for educational purposes only and should not replace professional medical advice. 
                      Please discuss these results with your healthcare provider.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Flags - Staff Only */}
            {isStaff && result.ai_flags && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    AI-generated risk analysis for clinical review only
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          result.ai_flags.riskLevel === 'high' ? 'destructive' :
                          result.ai_flags.riskLevel === 'medium' ? 'default' : 'secondary'
                        }
                        className="text-sm"
                      >
                        {result.ai_flags.riskLevel?.toUpperCase()} RISK
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Score: {result.ai_risk_score}/3
                      </span>
                    </div>
                    
                    {result.ai_flags.flaggedTests?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Flagged Tests:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.ai_flags.flaggedTests.map((test: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {result.ai_flags.reasoning && (
                      <div>
                        <p className="text-sm font-medium mb-2">Clinical Reasoning:</p>
                        <p className="text-sm text-muted-foreground bg-white rounded p-3 border">
                          {result.ai_flags.reasoning}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      ⚠️ This risk assessment is for staff review only and should not be shared with patients.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Values */}
            <Card>
              <CardHeader>
                <CardTitle>Test Values</CardTitle>
                <CardDescription>Individual test results and reference ranges</CardDescription>
              </CardHeader>
              <CardContent>
                {result.parsed_data ? (
                  <div className="space-y-4">
                    {extractTestValues(result.parsed_data).map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <p className="font-medium">{test.name}</p>
                            {test.reference && (
                              <p className="text-sm text-muted-foreground">
                                Reference: {test.reference}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {test.value} {test.unit}
                          </p>
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No test data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Result Not Found</h3>
              <p className="text-muted-foreground">The requested result could not be found.</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}