import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Heart, 
  Activity, 
  Target,
  Calendar,
  Bell,
  Zap,
  Shield,
  Eye,
  Dna,
  ChevronRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface HealthRiskFactor {
  id: string
  name: string
  category: 'genetic' | 'lifestyle' | 'environmental' | 'medical'
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  probability: number
  confidence: number
  description: string
  recommendations: string[]
  timeframe: string
  sources: string[]
}

interface PredictiveInsight {
  id: string
  title: string
  prediction: string
  confidence: number
  timeframe: string
  category: string
  impact: 'low' | 'medium' | 'high'
  actionable: boolean
  recommendations: string[]
}

interface HealthTrend {
  date: string
  biomarker: string
  value: number
  predicted: number
  range: { min: number; max: number }
}

export default function PredictiveHealthAnalytics() {
  const [activeTab, setActiveTab] = useState('overview')
  const [riskFactors, setRiskFactors] = useState<HealthRiskFactor[]>([])
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading predictive analytics data
    setTimeout(() => {
      setRiskFactors(mockRiskFactors)
      setInsights(mockInsights)
      setHealthTrends(mockHealthTrends)
      setIsLoading(false)
    }, 1000)
  }, [])

  const mockRiskFactors: HealthRiskFactor[] = [
    {
      id: '1',
      name: 'Cardiovascular Disease',
      category: 'medical',
      riskLevel: 'moderate',
      probability: 23.5,
      confidence: 87,
      description: 'Based on family history, cholesterol levels, and lifestyle factors',
      recommendations: [
        'Increase aerobic exercise to 150 minutes/week',
        'Reduce sodium intake to <2,300mg/day',
        'Schedule annual cardiology checkup'
      ],
      timeframe: '10 years',
      sources: ['Genetic Analysis', 'Blood Work', 'Lifestyle Assessment']
    },
    {
      id: '2',
      name: 'Type 2 Diabetes',
      category: 'genetic',
      riskLevel: 'high',
      probability: 34.2,
      confidence: 92,
      description: 'Strong genetic predisposition with current pre-diabetic markers',
      recommendations: [
        'Implement low-glycemic diet',
        'Monitor blood glucose monthly',
        'Consider metformin consultation'
      ],
      timeframe: '5 years',
      sources: ['Genetic Analysis', 'HbA1c Results', 'Family History']
    },
    {
      id: '3',
      name: 'Vitamin D Deficiency',
      category: 'lifestyle',
      riskLevel: 'high',
      probability: 76.8,
      confidence: 94,
      description: 'Current levels below optimal range with limited sun exposure',
      recommendations: [
        'Take 2000 IU Vitamin D3 daily',
        'Increase outdoor activities',
        'Include fortified foods in diet'
      ],
      timeframe: '6 months',
      sources: ['Blood Work', 'Location Data', 'Lifestyle Assessment']
    }
  ]

  const mockInsights: PredictiveInsight[] = [
    {
      id: '1',
      title: 'Blood Pressure Trend Alert',
      prediction: 'Your blood pressure shows an upward trend and may exceed normal range within 3 months',
      confidence: 89,
      timeframe: '3 months',
      category: 'cardiovascular',
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Reduce sodium intake by 30%',
        'Increase potassium-rich foods',
        'Schedule blood pressure monitoring appointment'
      ]
    },
    {
      id: '2',
      title: 'Sleep Quality Optimization',
      prediction: 'Your sleep patterns indicate potential for 23% improvement in recovery metrics',
      confidence: 76,
      timeframe: '2 weeks',
      category: 'lifestyle',
      impact: 'high',
      actionable: true,
      recommendations: [
        'Maintain consistent bedtime routine',
        'Limit screen time 2 hours before bed',
        'Consider magnesium supplementation'
      ]
    },
    {
      id: '3',
      title: 'Genetic Variant Impact',
      prediction: 'Your APOE gene variant suggests enhanced cognitive protection with Mediterranean diet',
      confidence: 95,
      timeframe: 'Long-term',
      category: 'genetic',
      impact: 'high',
      actionable: true,
      recommendations: [
        'Adopt Mediterranean diet pattern',
        'Increase omega-3 fatty acids',
        'Regular cognitive exercises'
      ]
    }
  ]

  const mockHealthTrends: HealthTrend[] = [
    { date: '2024-01', biomarker: 'HbA1c', value: 5.2, predicted: 5.4, range: { min: 4.0, max: 6.0 } },
    { date: '2024-02', biomarker: 'HbA1c', value: 5.3, predicted: 5.5, range: { min: 4.0, max: 6.0 } },
    { date: '2024-03', biomarker: 'HbA1c', value: 5.4, predicted: 5.6, range: { min: 4.0, max: 6.0 } },
    { date: '2024-04', biomarker: 'HbA1c', value: 5.5, predicted: 5.7, range: { min: 4.0, max: 6.0 } },
    { date: '2024-05', biomarker: 'HbA1c', value: 5.6, predicted: 5.8, range: { min: 4.0, max: 6.0 } },
    { date: '2024-06', biomarker: 'HbA1c', value: 5.7, predicted: 5.9, range: { min: 4.0, max: 6.0 } }
  ]

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'genetic': return Dna
      case 'lifestyle': return Activity
      case 'environmental': return Shield
      case 'medical': return Heart
      case 'cardiovascular': return Heart
      default: return Brain
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading predictive analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictive Health Analytics
          </CardTitle>
          <CardDescription>
            AI-powered insights and predictions based on your health data, genetics, and lifestyle patterns
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risk-factors">Risk Assessment</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Health Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Overall Health Score</h3>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold mb-2">87/100</div>
                <Progress value={87} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Excellent health with minor optimization opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Risk Reduction Potential</h3>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-2">34%</div>
                <Progress value={34} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Potential risk reduction through lifestyle changes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Genetic Advantage</h3>
                  <Dna className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold mb-2">92%</div>
                <Progress value={92} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Strong genetic foundation for longevity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Priority Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight) => {
                  const IconComponent = getCategoryIcon(insight.category)
                  return (
                    <div key={insight.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.prediction}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span>Confidence: {insight.confidence}%</span>
                          <span>Timeframe: {insight.timeframe}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-factors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Risk Assessment</CardTitle>
              <CardDescription>
                Personalized risk analysis based on genetics, lifestyle, and health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskFactors.map((risk) => {
                  const IconComponent = getCategoryIcon(risk.category)
                  return (
                    <Card key={risk.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{risk.name}</h3>
                            <Badge className={getRiskColor(risk.riskLevel)}>
                              {risk.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{risk.probability}%</div>
                          <div className="text-sm text-muted-foreground">
                            {risk.confidence}% confidence
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{risk.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <ul className="space-y-1">
                            {risk.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Data Sources</h4>
                          <div className="flex flex-wrap gap-1">
                            {risk.sources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Timeframe: {risk.timeframe}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Predictions</CardTitle>
              <CardDescription>
                Machine learning-powered predictions for your health trajectory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => {
                  const IconComponent = getCategoryIcon(insight.category)
                  return (
                    <Card key={insight.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact} impact
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline">
                                <Target className="h-3 w-3 mr-1" />
                                Actionable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-3">{insight.prediction}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>Confidence: {insight.confidence}%</span>
                            <span>Timeframe: {insight.timeframe}</span>
                            <span>Category: {insight.category}</span>
                          </div>
                          {insight.actionable && (
                            <div>
                              <h4 className="font-medium mb-2">Recommended Actions</h4>
                              <ul className="space-y-1">
                                {insight.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Health Trends</CardTitle>
              <CardDescription>
                Historical data and future projections for key health biomarkers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Actual Values"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Values"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Trend Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Your HbA1c levels show a gradual upward trend. Based on current patterns, 
                  values may exceed optimal range within 6 months. Consider implementing 
                  dietary modifications and increasing physical activity.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}