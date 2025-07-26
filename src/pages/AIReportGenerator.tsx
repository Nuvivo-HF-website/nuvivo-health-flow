import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { BloodTestReport } from "@/components/BloodTestReport";
import { AIReportService } from "@/services/AIReportService";

interface PatientInfo {
  name: string;
  nhsNumber: string;
  dateOfBirth: string;
  gender: string;
}

interface BloodTestData {
  testDate: string;
  requestingClinician: string;
  results: BloodTestResult[];
}

interface BloodTestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  loincCode?: string;
}

interface GeneratedReport {
  id: string;
  patientInfo: PatientInfo;
  testData: BloodTestData;
  interpretation: {
    summary: string;
    findings: string[];
    redFlags: string[];
    followUp: string[];
    causes: string[];
  };
  clinicianNotes?: string;
  generatedAt: string;
  status: 'draft' | 'reviewed' | 'approved';
  reviewedBy?: string;
}

export default function AIReportGenerator() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    nhsNumber: '',
    dateOfBirth: '',
    gender: ''
  });
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [clinicianNotes, setClinicianNotes] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, CSV, Excel file, or image of blood test results",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate file processing
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: "Blood test results have been processed and are ready for AI interpretation",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again or contact support if the issue persists",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const generateReport = async () => {
    if (!uploadedFile || !patientInfo.name || !patientInfo.nhsNumber) {
      toast({
        title: "Missing information",
        description: "Please upload test results and complete patient information",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate AI processing stages
      const stages = [
        "Extracting test data...",
        "Analysing results...",
        "Checking reference ranges...",
        "Identifying red flags...",
        "Generating interpretation...",
        "Formatting NHS-compliant report..."
      ];

      for (let i = 0; i < stages.length; i++) {
        setProgress((i + 1) * 16.66);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Mock generated report - in real implementation, this would come from AI service
      const mockReport: GeneratedReport = {
        id: `RPT-${Date.now()}`,
        patientInfo,
        testData: {
          testDate: new Date().toISOString().split('T')[0],
          requestingClinician: "Dr. Example",
          results: [
            {
              testName: "Haemoglobin",
              value: "115",
              unit: "g/L",
              referenceRange: "120-150",
              status: "low",
              loincCode: "718-7"
            },
            {
              testName: "Total Cholesterol",
              value: "6.2",
              unit: "mmol/L",
              referenceRange: "<5.0",
              status: "high",
              loincCode: "2093-3"
            }
          ]
        },
        interpretation: {
          summary: "Your blood test shows some results outside the normal range that require attention.",
          findings: [
            "Haemoglobin levels are slightly below normal range, suggesting mild anaemia",
            "Total cholesterol is elevated above recommended levels"
          ],
          redFlags: [
            "No immediate emergency concerns identified"
          ],
          followUp: [
            "Follow-up appointment recommended within 4-6 weeks",
            "Dietary review for cholesterol management",
            "Consider iron studies to investigate anaemia"
          ],
          causes: [
            "Low haemoglobin may be due to iron deficiency, chronic disease, or dietary factors",
            "Elevated cholesterol may be related to diet, genetics, or lifestyle factors"
          ]
        },
        generatedAt: new Date().toISOString(),
        status: 'draft'
      };

      setGeneratedReport(mockReport);
      toast({
        title: "Report generated successfully",
        description: "AI interpretation complete. Please review before finalising.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Unable to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const approveReport = async () => {
    if (!generatedReport) return;

    const updatedReport = {
      ...generatedReport,
      status: 'approved' as const,
      reviewedBy: "Current Clinician",
      clinicianNotes
    };

    setGeneratedReport(updatedReport);
    toast({
      title: "Report approved",
      description: "Report has been clinically approved and is ready for patient delivery",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          NHS AI Blood Test Report Generator
        </h1>
        <p className="text-muted-foreground">
          Generate patient-friendly blood test interpretations following NHS standards
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">DCB0129 Compliant</Badge>
          <Badge variant="secondary">NHS Digital IG</Badge>
          <Badge variant="secondary">WCAG 2.2 AA</Badge>
          <Badge variant="secondary">GDPR Compliant</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload and Patient Info Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Blood Test Results
              </CardTitle>
              <CardDescription>
                Upload PDF, CSV, Excel files or images of blood test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="test-upload">Blood Test File</Label>
                <Input
                  id="test-upload"
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">Processing file...</p>
                  </div>
                )}
                {uploadedFile && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{uploadedFile.name}</span>
                    <CheckCircle className="h-4 w-4 text-success ml-auto" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Required for NHS-compliant reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient-name">Full Name *</Label>
                  <Input
                    id="patient-name"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                    placeholder="Patient full name"
                  />
                </div>
                <div>
                  <Label htmlFor="nhs-number">NHS Number *</Label>
                  <Input
                    id="nhs-number"
                    value={patientInfo.nhsNumber}
                    onChange={(e) => setPatientInfo({...patientInfo, nhsNumber: e.target.value})}
                    placeholder="000 000 0000"
                    maxLength={12}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={patientInfo.dateOfBirth}
                    onChange={(e) => setPatientInfo({...patientInfo, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                    placeholder="Male/Female/Other"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Report Button */}
          <Button
            onClick={generateReport}
            disabled={!uploadedFile || !patientInfo.name || !patientInfo.nhsNumber || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Generating AI Report...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate AI Report
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Target completion: &lt;60 seconds
              </p>
            </div>
          )}
        </div>

        {/* Generated Report Section */}
        <div className="space-y-6">
          {generatedReport ? (
            <>
              <BloodTestReport report={generatedReport} />
              
              {/* Clinician Review Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Clinical Review Required
                  </CardTitle>
                  <CardDescription>
                    All AI-generated reports must be reviewed by a qualified clinician
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="clinician-notes">Clinician Notes (Optional)</Label>
                    <Textarea
                      id="clinician-notes"
                      value={clinicianNotes}
                      onChange={(e) => setClinicianNotes(e.target.value)}
                      placeholder="Add any additional clinical observations or modifications..."
                      rows={3}
                    />
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <Button onClick={approveReport} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Report Generated</h3>
                <p className="text-muted-foreground">
                  Upload blood test results and complete patient information to generate an AI report
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}