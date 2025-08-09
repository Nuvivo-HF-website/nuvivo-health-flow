import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, CheckCircle, Download, Loader2, MessageCircle, Sparkles, Shield } from "lucide-react"
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface BloodTestResult {
  id: string;
  user_id: string;
  uploaded_by: string;
  parsed_data: any;
  ai_summary: string | null;
  ai_generated_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TestValue {
  name: string;
  value: string | number;
  unit?: string;
  reference?: string;
  status?: 'normal' | 'high' | 'low' | 'critical';
}

const PatientResults = () => {
  const { user, userProfile } = useAuth()
  const [results, setResults] = useState<BloodTestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingAI, setGeneratingAI] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadResults()
    }
  }, [user])

  const loadResults = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('Error loading results:', error)
      toast({
        title: "Error",
        description: "Failed to load test results",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAISummary = async (resultId: string) => {
    if (!userProfile?.ai_consent) {
      toast({
        title: "AI Consent Required",
        description: "Please enable AI insights in your profile to generate summaries",
        variant: "destructive",
      })
      return
    }

    setGeneratingAI(resultId)
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { resultId }
      })

      if (error) throw error

      toast({
        title: "AI Summary Generated",
        description: "Your personalized health insights are ready",
      })

      // Reload results to get the updated summary
      loadResults()
    } catch (error) {
      console.error('Error generating AI summary:', error)
      toast({
        title: "Error",
        description: "Failed to generate AI summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGeneratingAI(null)
    }
  }

  const extractTestValues = (parsedData: any): TestValue[] => {
    if (!parsedData || typeof parsedData !== 'object') return []

    // Handle different possible data structures
    if (parsedData.tests && Array.isArray(parsedData.tests)) {
      return parsedData.tests.map((test: any) => ({
        name: test.name || test.test_name || 'Unknown Test',
        value: test.value || test.result_value || 'N/A',
        unit: test.unit || test.units || '',
        reference: test.reference || test.reference_range || '',
        status: test.status || 'normal'
      }))
    }

    if (parsedData.biomarkers && Array.isArray(parsedData.biomarkers)) {
      return parsedData.biomarkers.map((biomarker: any) => ({
        name: biomarker.name || 'Unknown Test',
        value: biomarker.value || 'N/A',
        unit: biomarker.unit || '',
        reference: biomarker.reference_range || '',
        status: biomarker.status || 'normal'
      }))
    }

    // Try to extract from flat structure
    const tests: TestValue[] = []
    Object.keys(parsedData).forEach(key => {
      if (typeof parsedData[key] === 'object' && parsedData[key].value !== undefined) {
        tests.push({
          name: key,
          value: parsedData[key].value,
          unit: parsedData[key].unit || '',
          reference: parsedData[key].reference || '',
          status: parsedData[key].status || 'normal'
        })
      }
    })

    return tests
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'high':
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
      case 'high':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">High</Badge>
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Low</Badge>
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your test results...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to view your test results.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Test Results</h1>
          <p className="text-muted-foreground">
            View and analyze your blood test results with AI-powered insights
          </p>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No test results yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your blood test results to get started with AI-powered health insights.
              </p>
              <Button>Upload Results</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {results.map((result) => {
              const testValues = extractTestValues(result.parsed_data)
              const hasAISummary = !!result.ai_summary
              const canGenerateAI = userProfile?.ai_consent && !hasAISummary

              return (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Blood Test Results</CardTitle>
                        <CardDescription>
                          Uploaded {new Date(result.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* AI Summary Section */}
                    {hasAISummary ? (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">AI Health Insights</h3>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Generated {new Date(result.ai_generated_at!).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <div className="text-blue-900 whitespace-pre-line">
                            {result.ai_summary}
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-100 rounded text-xs text-blue-800">
                          <Shield className="w-4 h-4 inline mr-1" />
                          <strong>Disclaimer:</strong> This AI-generated summary is for educational purposes only 
                          and should not replace professional medical advice. Please discuss these results with your healthcare provider.
                        </div>
                      </div>
                    ) : canGenerateAI ? (
                      <div className="p-4 border border-dashed border-blue-300 rounded-lg text-center">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <h3 className="font-semibold mb-2">Generate AI Summary</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get a personalized, easy-to-understand explanation of your test results
                        </p>
                        <Button 
                          onClick={() => generateAISummary(result.id)}
                          disabled={generatingAI === result.id}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {generatingAI === result.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate AI Summary
                            </>
                          )}
                        </Button>
                      </div>
                    ) : !userProfile?.ai_consent ? (
                      <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-orange-900">AI Insights Available</h3>
                        </div>
                        <p className="text-sm text-orange-800 mb-3">
                          Enable AI insights in your profile to get personalized explanations of your test results.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/patient-profile">Enable AI Insights</a>
                        </Button>
                      </div>
                    ) : null}

                    {/* Test Values */}
                    {testValues.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-4">Test Values</h3>
                        <div className="space-y-3">
                          {testValues.map((test, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
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
                                <p className="font-semibold">
                                  {test.value} {test.unit}
                                </p>
                                {getStatusBadge(test.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default PatientResults