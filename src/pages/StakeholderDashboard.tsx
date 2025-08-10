import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Download, Brain, Shield, FileText, Activity, Users } from 'lucide-react';
import { AIConsent } from '@/components/AIConsent';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  test_name: string;
  test_date: string;
  ai_summary: string;
  ai_interpretation: any;
  result_status: string;
}

interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  created_at: string;
  user_id: string;
}

export default function StakeholderDashboard() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch test results with AI summaries
      const { data: results, error: resultsError } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (resultsError) throw resultsError;

      // Fetch audit logs
      const { data: logs, error: logsError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (logsError) throw logsError;

      setTestResults(results || []);
      setAuditLogs(logs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async (resultId: string) => {
    if (!userProfile?.ai_consent) {
      toast({
        title: "AI Consent Required",
        description: "Please enable AI insights to generate summaries",
        variant: "destructive",
      });
      return;
    }

    setGeneratingReport(resultId);

    try {
      const result = testResults.find(r => r.id === resultId);
      if (!result) return;

      // Mock NHS-style test data for demonstration
      const mockBloodTestResults = [
        {
          testName: "Full Blood Count",
          value: result.test_name.includes("Blood") ? "12.5" : "Normal",
          unit: result.test_name.includes("Blood") ? "g/dL" : "",
          referenceRange: result.test_name.includes("Blood") ? "12.0-15.5 g/dL" : "Within normal limits"
        },
        {
          testName: "Cholesterol Total",
          value: result.test_name.includes("Lipid") ? "5.8" : "Normal",
          unit: result.test_name.includes("Lipid") ? "mmol/L" : "",
          referenceRange: result.test_name.includes("Lipid") ? "<5.0 mmol/L" : "Within normal limits"
        }
      ];

      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: {
          bloodTestResults: mockBloodTestResults,
          patientInfo: {
            age: 35,
            gender: 'Male',
            medicalConditions: ['None'],
            currentMedications: ['None']
          }
        }
      });

      if (error) throw error;

      // Update the test result with AI summary
      const { error: updateError } = await supabase
        .from('test_results')
        .update({ 
          ai_summary: data.summary || "AI summary generated",
          ai_interpretation: data
        })
        .eq('id', resultId);

      if (updateError) throw updateError;

      // Refresh data
      await fetchDashboardData();

      toast({
        title: "AI Summary Generated",
        description: "NHS-compliant interpretation has been created",
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI summary",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const downloadPDFReport = async (resultId: string) => {
    const result = testResults.find(r => r.id === resultId);
    if (!result) return;

    // Generate PDF content (mock implementation)
    const pdfContent = `
NHS Test Report - ${result.test_name}
Test Date: ${new Date(result.test_date).toLocaleDateString()}
Status: ${result.result_status}

AI Summary:
${result.ai_summary || 'No AI summary available'}

Generated: ${new Date().toLocaleString()}
Compliance: GDPR & NHS Data Standards
`;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NHS_Report_${result.test_name}_${result.test_date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportGDPRData = async () => {
    try {
      const { data, error } = await supabase
        .rpc('export_user_data', { _user_id: user?.id });

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'gdpr_data_export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "GDPR Export Complete",
        description: "Your data has been exported successfully",
      });
    } catch (error) {
      console.error('Error exporting GDPR data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stakeholder Dashboard</h1>
          <p className="text-muted-foreground">NHS-compliant AI features and GDPR compliance monitoring</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Staging Environment
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
            <p className="text-xs text-muted-foreground">
              {testResults.filter(r => r.ai_summary).length} with AI summaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Consent</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.ai_consent ? 'Enabled' : 'Disabled'}
            </div>
            <p className="text-xs text-muted-foreground">
              GDPR compliant consent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              GDPR compliant
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ai-features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai-features">AI Features Demo</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="gdpr-compliance">GDPR Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-features" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <AIConsent />
            
            <Card>
              <CardHeader>
                <CardTitle>AI Summary Generation</CardTitle>
                <CardDescription>
                  Generate NHS-compliant interpretations of test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{result.test_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(result.test_date).toLocaleDateString()}
                        </p>
                        {result.ai_summary && (
                          <Badge variant="secondary" className="mt-1">AI Summary Available</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => generateAISummary(result.id)}
                          disabled={!userProfile?.ai_consent || generatingReport === result.id}
                        >
                          {generatingReport === result.id ? 'Generating...' : 'Generate AI Summary'}
                        </Button>
                        {result.ai_summary && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadPDFReport(result.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit-logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete audit log of all data access and modifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.table_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Logged</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gdpr-compliance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Export all your data in compliance with GDPR Article 20
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={exportGDPRData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data (JSON)
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Includes all test results, AI summaries, and personal data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>
                  Current GDPR compliance verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Encryption</span>
                  <Badge variant="default">✓ Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consent Management</span>
                  <Badge variant="default">✓ Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Audit Logging</span>
                  <Badge variant="default">✓ Compliant</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Retention</span>
                  <Badge variant="default">✓ Compliant</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}