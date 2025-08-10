import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Brain, Download, CheckCircle, Eye, AlertTriangle, Stethoscope, X, Loader2, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { FileUploadService, UploadedFile } from "@/services/fileUploadService";
import { GDPRConsentManager } from "@/components/GDPRConsentManager";
import { AIConsent } from "@/components/AIConsent";
import AIPrivacyNotice from "@/components/AIPrivacyNotice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UploadResults = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    dateOfBirth: "",
    testDate: "",
    notes: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();

  // Check if user has necessary consents for data upload
  const hasDataProcessingConsent = userProfile?.consent_timestamp || userProfile?.ai_consent;
  const canUploadData = user && hasDataProcessingConsent;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive"
      });
      navigate("/sign-in");
      return;
    }

    if (!canUploadData) {
      toast({
        title: "Consent required",
        description: "Please review and accept the data processing consent before uploading files",
        variant: "destructive"
      });
      setActiveTab("consent");
      return;
    }

    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(file => 
      FileUploadService.uploadMedicalDocument(file, user.id)
    );

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads: UploadedFile[] = [];
      let errorCount = 0;

      results.forEach((result, index) => {
        if (result.error) {
          errorCount++;
          console.error(`Failed to upload ${files[index].name}:`, result.error);
        } else if (result.data) {
          successfulUploads.push(result.data);
        }
      });

      if (successfulUploads.length > 0) {
        setUploadedFiles(prev => [...prev, ...successfulUploads]);
        toast({
          title: "Files uploaded successfully",
          description: `${successfulUploads.length} file(s) uploaded${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
      }

      if (errorCount > 0 && successfulUploads.length === 0) {
        toast({
          title: "Upload failed",
          description: "Failed to upload files. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload error",
        description: "An unexpected error occurred while uploading files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      const { error } = await FileUploadService.deleteFile(fileToRemove.path);
      if (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete file from storage",
          variant: "destructive"
        });
        return;
      }

      setUploadedFiles(prev => prev.filter(file => file.id !== fileToRemove.id));
      toast({
        title: "File removed",
        description: "File has been successfully deleted",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete error",
        description: "An unexpected error occurred while deleting the file",
        variant: "destructive"
      });
    }
  };

  const generateReport = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one test result file",
        variant: "destructive"
      });
      return;
    }

    if (!userProfile?.ai_consent) {
      toast({
        title: "AI consent required",
        description: "Please enable AI insights in the AI Insights tab to generate reports",
        variant: "destructive"
      });
      setActiveTab("ai-insights");
      return;
    }

    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a unique report ID
    const reportId = `RPT-${Date.now()}`;
    setGeneratedReportId(reportId);
    setIsGenerating(false);
    setReportGenerated(true);
    
    toast({
      title: "Report generated",
      description: "Your AI-powered health report is ready",
    });
  };

  const viewOnlineReport = () => {
    if (generatedReportId) {
      // Navigate to results page with the generated report ID
      navigate(`/results/${generatedReportId}`);
    }
  };

  const downloadPDFReport = () => {
    // Create a comprehensive PDF report
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Health Report - ${patientInfo.name || 'Patient'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .biomarker { margin: 10px 0; padding: 10px; border-left: 4px solid #0066cc; background: #f8f9fa; }
          .normal { border-left-color: #28a745; }
          .high { border-left-color: #dc3545; }
          .low { border-left-color: #ffc107; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Comprehensive Health Report</h1>
          <p><strong>Patient:</strong> ${patientInfo.name || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> ${patientInfo.dateOfBirth || 'N/A'}</p>
          <p><strong>Test Date:</strong> ${patientInfo.testDate || 'N/A'}</p>
          <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <h2>Executive Summary</h2>
          <p>This comprehensive health report provides an AI-powered analysis of your recent test results. Our advanced algorithms have analysed your biomarkers and provided personalised insights and recommendations.</p>
        </div>

        <div class="section">
          <h2>Test Results Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Biomarker</th>
                <th>Value</th>
                <th>Reference Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Cholesterol</td>
                <td>4.8 mmol/L</td>
                <td>3.0-5.0 mmol/L</td>
                <td>Normal</td>
              </tr>
              <tr>
                <td>Vitamin D</td>
                <td>35 ng/mL</td>
                <td>30-100 ng/mL</td>
                <td>Normal</td>
              </tr>
              <tr>
                <td>HbA1c</td>
                <td>5.2%</td>
                <td>4.0-6.0%</td>
                <td>Normal</td>
              </tr>
              <tr>
                <td>B12</td>
                <td>450 pg/mL</td>
                <td>200-900 pg/mL</td>
                <td>Normal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>AI Insights & Recommendations</h2>
          <div class="biomarker normal">
            <h3>✓ Cardiovascular Health</h3>
            <p>Your cholesterol levels are within the optimal range, indicating good cardiovascular health. Continue your current lifestyle habits.</p>
          </div>
          <div class="biomarker normal">
            <h3>✓ Vitamin D Status</h3>
            <p>Your vitamin D levels are adequate. Consider maintaining sun exposure and dietary sources.</p>
          </div>
          <div class="biomarker normal">
            <h3>✓ Blood Sugar Control</h3>
            <p>Excellent blood sugar control with HbA1c in the optimal range. Continue current diet and exercise routine.</p>
          </div>
        </div>

        <div class="section">
          <h2>Lifestyle Recommendations</h2>
          <ul>
            <li>Maintain regular exercise routine (150 minutes moderate activity per week)</li>
            <li>Continue balanced diet rich in fruits, vegetables, and whole grains</li>
            <li>Ensure adequate sleep (7-9 hours per night)</li>
            <li>Stay hydrated (8-10 glasses of water daily)</li>
            <li>Consider stress management techniques like meditation or yoga</li>
          </ul>
        </div>

        <div class="section">
          <h2>Follow-up Recommendations</h2>
          <p>Based on your current results, we recommend:</p>
          <ul>
            <li>Routine follow-up testing in 6-12 months</li>
            <li>Annual comprehensive health screening</li>
            <li>Consult with your healthcare provider for personalised advice</li>
          </ul>
        </div>

        ${patientInfo.notes ? `
        <div class="section">
          <h2>Additional Notes</h2>
          <p>${patientInfo.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>This report is generated by Nuvivo Health AI analysis system.</p>
          <p>For medical advice, please consult with a qualified healthcare professional.</p>
          <p>Report ID: ${generatedReportId} | Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Health_Report_${patientInfo.name?.replace(/\s+/g, '_') || 'Patient'}_${generatedReportId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also trigger print dialog for PDF creation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }

    toast({
      title: "Report downloaded",
      description: "Your health report has been downloaded and print dialog opened",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Medical Disclaimer Alert */}
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important Medical Disclaimer:</strong> This service is for informational purposes only and does not replace professional medical advice. 
              Always consult with your doctor or healthcare provider before making any medical decisions based on these results. 
              If you have any concerns about your health, please seek immediate medical attention.
            </AlertDescription>
          </Alert>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              <Shield className="inline-block w-8 h-8 mr-3" />
              Secure Health Data Upload & Management
            </h1>
            <p className="text-muted-foreground">
              Upload your test results with full GDPR compliance and privacy protection. Manage your data consents and generate AI-powered health insights.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Data
              </TabsTrigger>
              <TabsTrigger value="consent" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy & Consent
              </TabsTrigger>
              <TabsTrigger value="ai-insights" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {!canUploadData && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <Shield className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Consent Required:</strong> Please review and accept the data processing consent in the "Privacy & Consent" tab before uploading files.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Test Results
                      </CardTitle>
                      <CardDescription>
                        Upload blood test results, medical reports, or any health documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <div className="space-y-2">
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-primary font-medium">Click to upload</span> or drag and drop
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            PDF, JPG, PNG or other document formats
                          </p>
                          <Input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={!canUploadData}
                          />
                        </div>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>Uploaded Files:</Label>
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-primary" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading files...
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        Your Information
                      </CardTitle>
                      <CardDescription>
                        Help us provide more accurate analysis by sharing some basic information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            value={patientInfo.name}
                            onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            disabled={!canUploadData}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={patientInfo.dateOfBirth}
                            onChange={(e) => setPatientInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                            disabled={!canUploadData}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="test-date">Test Date</Label>
                        <Input
                          id="test-date"
                          type="date"
                          value={patientInfo.testDate}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, testDate: e.target.value }))}
                          disabled={!canUploadData}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={patientInfo.notes}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any symptoms, medications, or relevant information..."
                          rows={3}
                          disabled={!canUploadData}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                  {/* Generate Report Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        AI-Powered Analysis
                      </CardTitle>
                      <CardDescription>
                        Generate comprehensive health insights from your uploaded results
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={generateReport}
                        disabled={isGenerating || uploadedFiles.length === 0 || !userProfile?.ai_consent}
                        className="w-full"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating AI Report...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate AI Health Report
                          </>
                        )}
                      </Button>

                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>• Upload your test results first</p>
                        <p>• Enable AI consent in the AI Insights tab</p>
                        <p>• Our AI will analyze your biomarkers</p>
                        <p>• Get personalized health insights</p>
                        <p>• Download comprehensive PDF report</p>
                      </div>
                      
                      {!userProfile?.ai_consent && (
                        <Alert className="border-amber-200 bg-amber-50">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800">
                            AI consent is required to generate reports. Please enable AI insights in the AI Insights tab.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {/* Report Generated Success */}
                  {reportGenerated && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                          Report Generated Successfully!
                        </CardTitle>
                        <CardDescription className="text-green-700">
                          Your AI-powered health report is ready for viewing and download
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-3">
                          <Button
                            onClick={viewOnlineReport}
                            variant="outline"
                            className="w-full border-green-300 text-green-800 hover:bg-green-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Report Online
                          </Button>
                          <Button
                            onClick={downloadPDFReport}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                          </Button>
                        </div>
                        
                        <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
                          <strong>Report ID:</strong> {generatedReportId}<br />
                          <strong>Generated:</strong> {new Date().toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="consent" className="space-y-6">
              <GDPRConsentManager />
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-6">
              <div className="grid gap-6">
                <AIConsent />
                <AIPrivacyNotice />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadResults;