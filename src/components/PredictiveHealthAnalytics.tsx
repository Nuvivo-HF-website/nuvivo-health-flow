import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Activity,
  Brain,
  Shield,
  Target,
  Calendar,
  BarChart3,
  Zap,
  Clock,
  Info
} from 'lucide-react';

interface RiskAssessment {
  condition: string;
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  factors: string[];
  recommendations: string[];
  timeframe: string;
  confidence: number;
}

interface HealthPrediction {
  type: 'medication_adherence' | 'readmission_risk' | 'disease_progression' | 'lifestyle_impact';
  prediction: string;
  probability: number;
  timeline: string;
  actionable_insights: string[];
}

interface HealthTrend {
  metric: string;
  direction: 'improving' | 'stable' | 'declining';
  change_percentage: number;
  significance: 'high' | 'medium' | 'low';
  forecast: string;
}

export function PredictiveHealthAnalytics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [predictions, setPredictions] = useState<HealthPrediction[]>([]);
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate loading comprehensive health analytics
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - in real implementation, this would come from ML models
      setRiskAssessments([
        {
          condition: 'Type 2 Diabetes',
          riskScore: 25,
          riskLevel: 'Moderate',
          factors: ['Family history', 'BMI 28.5', 'Sedentary lifestyle', 'Age 45+'],
          recommendations: [
            'Increase physical activity to 150 min/week',
            'Reduce refined carbohydrate intake',
            'Schedule HbA1c test in 3 months',
            'Consider nutritionist consultation'
          ],
          timeframe: '5-10 years',
          confidence: 78
        },
        {
          condition: 'Cardiovascular Disease',
          riskScore: 35,
          riskLevel: 'Moderate',
          factors: ['Hypertension', 'Cholesterol levels', 'Stress levels', 'Sleep quality'],
          recommendations: [
            'Monitor blood pressure daily',
            'Stress management techniques',
            'Improve sleep hygiene',
            'Consider cardiology consultation'
          ],
          timeframe: '10-15 years',
          confidence: 82
        },
        {
          condition: 'Osteoporosis',
          riskScore: 15,
          riskLevel: 'Low',
          factors: ['Age', 'Gender', 'Calcium intake'],
          recommendations: [
            'Ensure adequate calcium intake',
            'Weight-bearing exercises',
            'Vitamin D supplementation'
          ],
          timeframe: '15-20 years',
          confidence: 65
        }
      ]);

      setPredictions([
        {
          type: 'medication_adherence',
          prediction: 'High likelihood of missing doses due to complex regimen',
          probability: 72,
          timeline: 'Next 30 days',
          actionable_insights: [
            'Simplify medication schedule',
            'Set up pill organizer',
            'Enable medication reminders'
          ]
        },
        {
          type: 'lifestyle_impact',
          prediction: 'Improved cardiovascular health with consistent exercise',
          probability: 85,
          timeline: '3-6 months',
          actionable_insights: [
            'Start with 20 minutes daily walking',
            'Track heart rate during activity',
            'Gradual intensity increase'
          ]
        }
      ]);

      setHealthTrends([
        {
          metric: 'Blood Pressure',
          direction: 'improving',
          change_percentage: -8.5,
          significance: 'high',
          forecast: 'Continue current treatment, expect normal range in 2 months'
        },
        {
          metric: 'Weight Management',
          direction: 'stable',
          change_percentage: -1.2,
          significance: 'medium',
          forecast: 'Maintain current diet and exercise routine'
        },
        {
          metric: 'Sleep Quality',
          direction: 'declining',
          change_percentage: -12.3,
          significance: 'high',
          forecast: 'Consider sleep study if pattern continues'
        }
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      toast({
        title: "Analytics Error",
        description: "Unable to load predictive analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Very High': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'medication_adherence': return <Shield className="h-5 w-5 text-blue-500" />;
      case 'readmission_risk': return <Heart className="h-5 w-5 text-red-500" />;
      case 'disease_progression': return <Activity className="h-5 w-5 text-orange-500" />;
      case 'lifestyle_impact': return <Target className="h-5 w-5 text-green-500" />;
      default: return <Brain className="h-5 w-5 text-purple-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Analyzing your health data with AI...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Predictive Health Analytics
          </CardTitle>
          <CardDescription>
            AI-powered insights about your future health risks and personalized recommendations
          </CardDescription>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated.toLocaleString()}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadAnalytics}
              className="ml-auto"
            >
              Refresh Analysis
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Risk Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Long-term Health Risk Assessment
          </CardTitle>
          <CardDescription>
            Personalized risk analysis based on your health data, genetics, and lifestyle factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {riskAssessments.map((assessment, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(assessment.riskLevel)}`} />
                  <div>
                    <h3 className="font-semibold">{assessment.condition}</h3>
                    <p className="text-sm text-muted-foreground">
                      Risk Level: {assessment.riskLevel} • Timeframe: {assessment.timeframe}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{assessment.riskScore}%</div>
                  <div className="text-xs text-muted-foreground">
                    {assessment.confidence}% confidence
                  </div>
                </div>
              </div>

              <Progress value={assessment.riskScore} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Factors:</h4>
                  <ul className="space-y-1">
                    {assessment.factors.map((factor, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {assessment.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Smart Health Predictions
          </CardTitle>
          <CardDescription>
            AI-generated insights about your health journey and outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                {getPredictionIcon(prediction.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">
                      {prediction.type.replace('_', ' ')}
                    </h3>
                    <Badge variant="outline">
                      {prediction.probability}% probability
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {prediction.prediction}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Timeline: {prediction.timeline}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Action Items:</h4>
                      <ul className="space-y-1">
                        {prediction.actionable_insights.map((insight, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Health Trend Analysis
          </CardTitle>
          <CardDescription>
            Track how your health metrics are changing over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTrendIcon(trend.direction)}
                <div>
                  <h3 className="font-medium">{trend.metric}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {trend.direction} • {Math.abs(trend.change_percentage)}% change
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={trend.significance === 'high' ? 'default' : 'outline'}
                  className="mb-1"
                >
                  {trend.significance} significance
                </Badge>
                <p className="text-xs text-muted-foreground max-w-xs">
                  {trend.forecast}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> These predictions are based on statistical models and your health data. 
          They should supplement, not replace, professional medical advice. Always consult your healthcare 
          provider for medical decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}