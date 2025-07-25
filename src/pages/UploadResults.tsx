import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Brain, Download, CheckCircle, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const UploadResults = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    dateOfBirth: "",
    testDate: "",
    notes: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Files uploaded",
      description: `${files.length} file(s) uploaded successfully`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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
          <p>This comprehensive health report provides an AI-powered analysis of your recent test results. Our advanced algorithms have analyzed your biomarkers and provided personalized insights and recommendations.</p>
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
            <li>Consult with your healthcare provider for personalized advice</li>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Upload Results & Generate Report</h1>
            <p className="text-muted-foreground">
              Upload your test results and get an AI-powered comprehensive health report
            </p>
          </div>

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
                      />
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files:</Label>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>
                    Provide additional context for more accurate analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Patient Name</Label>
                      <Input
                        id="name"
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={patientInfo.dateOfBirth}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
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
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Generation Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Report Generation
                  </CardTitle>
                  <CardDescription>
                    Generate a comprehensive health report using AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    {!reportGenerated ? (
                      <>
                        <Brain className="w-16 h-16 mx-auto text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Ready to Generate Report</h3>
                        <p className="text-muted-foreground mb-6">
                          Our AI will analyze your results and provide insights, recommendations, and explanations
                        </p>
                        <Button
                          onClick={generateReport}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                              Analyzing Results...
                            </>
                          ) : (
                            <>
                              <Brain className="w-4 h-4 mr-2" />
                              Generate AI Report
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Report Generated Successfully</h3>
                        <p className="text-muted-foreground mb-6">
                          Your comprehensive health report is ready for download
                        </p>
                        <div className="space-y-3">
                          <Button 
                            onClick={downloadPDFReport}
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={viewOnlineReport}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Online Report
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What's Included in Your Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Detailed analysis of all biomarkers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Risk assessment and health insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Personalized recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lifestyle and dietary suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Follow-up recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Specialist referral suggestions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UploadResults;