import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Brain, Download, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const UploadResults = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    dateOfBirth: "",
    testDate: "",
    notes: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
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
    setIsGenerating(false);
    setReportGenerated(true);
    
    toast({
      title: "Report generated",
      description: "Your AI-powered health report is ready",
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
                          <Button className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                          </Button>
                          <Button variant="outline" className="w-full">
                            <FileText className="w-4 h-4 mr-2" />
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