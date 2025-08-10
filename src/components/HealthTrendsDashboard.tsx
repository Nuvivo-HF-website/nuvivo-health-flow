import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HealthTrendsChart } from './HealthTrendsChart';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain, 
  AlertTriangle, 
  Loader2,
  BarChart3,
  Info
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface NormalizedTestResult {
  test_name: string;
  value: number;
  unit: string;
  reference_min: number;
  reference_max: number;
  date: string;
  result_id: string;
}

interface ChartDataResponse {
  test_results: NormalizedTestResult[];
  test_names: string[];
}

export const HealthTrendsDashboard: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadChartData();
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_consent, full_name')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadChartData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('get-patient-chart-data');
      
      if (error) {
        console.error('Error loading chart data:', error);
        toast.error('Failed to load health trends data');
        return;
      }

      setChartData(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load health trends data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (testName: string) => {
    if (!chartData?.test_results) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    const testResults = chartData.test_results
      .filter(r => r.test_name === testName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (testResults.length < 2) {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
    
    const latest = testResults[testResults.length - 1];
    const previous = testResults[testResults.length - 2];
    
    if (latest.value > previous.value) {
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    } else if (latest.value < previous.value) {
      return <TrendingDown className="h-4 w-4 text-orange-500" />;
    } else {
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLatestStatus = (testName: string): 'normal' | 'borderline' | 'abnormal' => {
    if (!chartData?.test_results) return 'normal';
    
    const testResults = chartData.test_results
      .filter(r => r.test_name === testName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (testResults.length === 0) return 'normal';
    
    const latest = testResults[testResults.length - 1];
    const range = latest.reference_max - latest.reference_min;
    const borderlineMargin = range * 0.1;
    
    if (latest.value >= latest.reference_min && latest.value <= latest.reference_max) {
      return 'normal';
    } else if (latest.value >= (latest.reference_min - borderlineMargin) && 
               latest.value <= (latest.reference_max + borderlineMargin)) {
      return 'borderline';
    } else {
      return 'abnormal';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading your health trends...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.test_names.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            My Health Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Test Results Yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first test results to see health trends and visualizations.
            </p>
            <Button onClick={() => window.location.href = '/upload-results'} variant="outline">
              Upload Test Results
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-6 w-6 text-primary" />
                My Health Trends
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Visual trends of your test results over time
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {chartData.test_results.length} results • {chartData.test_names.length} tests
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Test Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {chartData.test_names.map((testName) => {
              const status = getLatestStatus(testName);
              const testResults = chartData.test_results.filter(r => r.test_name === testName);
              const latestResult = testResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
              
              return (
                <div key={testName} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{testName}</span>
                      {getTrendIcon(testName)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {latestResult?.value} {latestResult?.unit}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      status === 'normal' ? 'secondary' :
                      status === 'borderline' ? 'default' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {status === 'normal' ? 'Normal' :
                     status === 'borderline' ? 'Borderline' : 'Outside Range'}
                  </Badge>
                </div>
              );
            })}
          </div>
          
          {/* Disclaimer */}
          <Alert className="mb-6 border-amber-200 bg-amber-50/50">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Disclaimer:</strong> These visualizations are for informational purposes only and do not constitute medical advice. 
              Always consult with your healthcare provider for interpretation of test results and medical decisions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Individual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData.test_names.map((testName) => (
          <HealthTrendsChart
            key={testName}
            testName={testName}
            results={chartData.test_results}
          />
        ))}
      </div>

      {/* AI Summary Section (if consent given) */}
      {userProfile?.ai_consent && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="h-5 w-5" />
              AI Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 mb-3">
              Based on your test results, here are some general observations. Remember, these are educational insights only.
            </p>
            
            <div className="space-y-2 text-sm text-blue-600">
              {chartData.test_names.map((testName) => {
                const status = getLatestStatus(testName);
                const testResults = chartData.test_results.filter(r => r.test_name === testName);
                
                if (status === 'normal' || testResults.length < 2) return null;
                
                return (
                  <div key={testName} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Your {testName} levels show {status} values. Consider discussing this with your healthcare provider.
                    </span>
                  </div>
                );
              })}
              
              {chartData.test_names.every(testName => getLatestStatus(testName) === 'normal') && (
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Your test results are showing normal values across all measured parameters. Keep up the good work!</span>
                </div>
              )}
            </div>
            
            <Separator className="my-3" />
            
            <div className="text-xs text-blue-600">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              AI insights are based on general medical knowledge and your consent to AI analysis. 
              They do not replace professional medical advice.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};