// Enhanced Medical Records Dashboard with AI summaries and PDF downloads
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, Download, Share, Eye, Calendar, User, 
  TestTube, Activity, Pill, Shield, AlertTriangle,
  TrendingUp, Brain, Clock, Filter, Search
} from 'lucide-react';
import { format } from 'date-fns';

interface MedicalDocument {
  id: string;
  document_name: string;
  document_type: string;
  description?: string;
  file_url?: string;
  created_at: string;
  category: {
    name: string;
    icon: string;
    color: string;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  doctor_name?: string;
  clinic_name?: string;
  download_count: number;
}

interface TestResult {
  id: string;
  test_name: string;
  test_type: string;
  test_date: string;
  result_status: 'normal' | 'abnormal' | 'critical' | 'pending';
  ai_interpretation?: any;
  ai_summary?: string;
  doctor_notes?: string;
  doctor_name?: string;
  clinic_name?: string;
  result_values: any;
  reference_ranges: any;
  flagged_values: any[];
  doctor_reviewed: boolean;
}

export function EnhancedMedicalRecords() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadMedicalData();
      loadCategories();
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error loading categories:', error);
    }
  };

  const loadMedicalData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load medical documents
      const { data: docsData, error: docsError } = await supabase
        .from('medical_documents')
        .select(`
          *,
          category:document_categories(name, icon, color)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments((docsData as any[]) || []);  // Type assertion to fix the type mismatch

      // Load test results
      const { data: testsData, error: testsError } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('test_date', { ascending: false });

      if (testsError) throw testsError;
      setTestResults((testsData as any[]) || []);  // Type assertion to fix the type mismatch

    } catch (error: any) {
      console.error('Error loading medical data:', error);
      toast({
        title: "Error loading medical records",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async (testId: string) => {
    try {
      const testResult = testResults.find(t => t.id === testId);
      if (!testResult) return;

      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: {
          bloodTestResults: Object.entries(testResult.result_values).map(([key, value]) => ({
            testName: key,
            value: value as string,
            unit: '',
            referenceRange: testResult.reference_ranges[key] || 'Not specified'
          })),
          patientInfo: {
            age: 'Not specified',
            gender: 'Not specified'
          }
        }
      });

      if (error) throw error;

      // Update test result with AI interpretation
      const { error: updateError } = await supabase
        .from('test_results')
        .update({
          ai_interpretation: data,
          ai_summary: data.summary
        })
        .eq('id', testId);

      if (updateError) throw updateError;

      toast({
        title: "AI Analysis Complete",
        description: "Your test results have been analyzed by AI.",
      });

      await loadMedicalData();
    } catch (error: any) {
      toast({
        title: "AI Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (document: MedicalDocument) => {
    try {
      if (!document.file_url) {
        toast({
          title: "No file available",
          description: "This document doesn't have a downloadable file.",
          variant: "destructive",
        });
        return;
      }

      // Update download count
      await supabase
        .from('medical_documents')
        .update({ 
          download_count: document.download_count + 1,
          last_accessed: new Date().toISOString()
        })
        .eq('id', document.id);

      // Trigger download
      const link = window.document.createElement('a');
      link.href = document.file_url;
      link.download = document.document_name;
      link.click();

      toast({
        title: "Download started",
        description: `Downloading ${document.document_name}`,
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category?.name === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const filteredTestResults = testResults.filter(test => 
    test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.test_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your medical documents and test results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{documents.length} Documents</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <TestTube className="h-3 w-3" />
            <span>{testResults.length} Test Results</span>
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="test-results" className="flex items-center space-x-2">
            <TestTube className="h-4 w-4" />
            <span>Test Results</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'Your medical documents will appear here once uploaded.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: document.category?.color || '#6b7280' }}
                        >
                          {document.category?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium line-clamp-2">
                            {document.document_name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {document.category?.name || 'Uncategorized'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(document.priority)}`}
                      >
                        {document.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {document.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(document.created_at), 'dd/MM/yyyy')}</span>
                        </div>
                        {document.doctor_name && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{document.doctor_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => downloadDocument(document)}
                          disabled={!document.file_url}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="test-results" className="space-y-4">
          {filteredTestResults.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No test results found</h3>
                <p className="text-muted-foreground text-center">
                  Your test results will appear here once available.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTestResults.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <TestTube className="h-5 w-5" />
                          <span>{test.test_name}</span>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(test.result_status)}
                          >
                            {test.result_status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span>{test.test_type}</span>
                          <span>•</span>
                          <span>{format(new Date(test.test_date), 'dd/MM/yyyy')}</span>
                          {test.doctor_name && (
                            <>
                              <span>•</span>
                              <span>{test.doctor_name}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {test.doctor_reviewed && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Reviewed
                          </Badge>
                        )}
                        {test.flagged_values?.length > 0 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {test.flagged_values.length} Flagged
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* AI Summary */}
                      {test.ai_summary ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">AI Analysis</span>
                          </div>
                          <p className="text-sm text-blue-800">{test.ai_summary}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">AI analysis not available</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateAISummary(test.id)}
                            >
                              Generate Analysis
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Doctor Notes */}
                      {test.doctor_notes && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-900">Doctor's Notes</span>
                          </div>
                          <p className="text-sm text-green-800">{test.doctor_notes}</p>
                        </div>
                      )}

                      {/* Test Values */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(test.result_values).map(([key, value]) => (
                          <div key={key} className="bg-white p-3 rounded-lg border">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            <div className="text-lg font-semibold text-primary">
                              {value as string}
                            </div>
                            {test.reference_ranges[key] && (
                              <div className="text-xs text-muted-foreground">
                                Reference: {test.reference_ranges[key]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Compare History
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-3 w-3 mr-1" />
                          Share with Doctor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}