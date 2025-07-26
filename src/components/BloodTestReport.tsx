import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Info, Calendar, User, FileText } from "lucide-react";

interface BloodTestResult {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  loincCode?: string;
}

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

interface BloodTestReportProps {
  report: GeneratedReport;
}

export function BloodTestReport({ report }: BloodTestReportProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-warning" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="secondary" className="bg-success/10 text-success">Normal</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-warning/10 text-warning">High</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Low</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blood Test Report
              </CardTitle>
              <CardDescription>Report ID: {report.id}</CardDescription>
            </div>
            <div className="text-right">
              <Badge 
                variant={report.status === 'approved' ? 'default' : 'secondary'}
                className="mb-2"
              >
                {report.status.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Patient:</span>
              <span>{report.patientInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Test Date:</span>
              <span>{new Date(report.testData.testDate).toLocaleDateString('en-GB')}</span>
            </div>
            <div>
              <span className="font-medium">NHS Number:</span> {report.patientInfo.nhsNumber}
            </div>
            <div>
              <span className="font-medium">DOB:</span> {new Date(report.patientInfo.dateOfBirth).toLocaleDateString('en-GB')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            Your blood test results compared to normal reference ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.testData.results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h4 className="font-medium">{result.testName}</h4>
                    {result.loincCode && (
                      <p className="text-xs text-muted-foreground">LOINC: {result.loincCode}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{result.value} {result.unit}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Normal: {result.referenceRange}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle>What Your Results Mean</CardTitle>
          <CardDescription>
            Patient-friendly interpretation of your blood test results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-sm leading-relaxed">{report.interpretation.summary}</p>
          </div>

          <Separator />

          {/* Key Findings */}
          <div>
            <h4 className="font-semibold mb-3">Key Findings</h4>
            <ul className="space-y-2">
              {report.interpretation.findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Possible Causes */}
          <div>
            <h4 className="font-semibold mb-3">Possible Causes</h4>
            <ul className="space-y-2">
              {report.interpretation.causes.map((cause, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Red Flags */}
          {report.interpretation.redFlags.length > 0 && (
            <>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Important Safety Information
                </h4>
                <ul className="space-y-2">
                  {report.interpretation.redFlags.map((redFlag, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive flex-shrink-0" />
                      <span>{redFlag}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
            </>
          )}

          {/* Follow-up Recommendations */}
          <div>
            <h4 className="font-semibold mb-3">Recommended Next Steps</h4>
            <ul className="space-y-2">
              {report.interpretation.followUp.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NHS Safety Statement */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-primary">Important Safety Notice</h4>
            <p className="text-sm text-muted-foreground">
              This report is AI-generated and for information purposes only. If you experience any 
              concerning symptoms or have urgent health concerns, contact your GP immediately or 
              call NHS 111. In case of emergency, dial 999.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clinician Notes */}
      {report.clinicianNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Clinical Review Notes</CardTitle>
            <CardDescription>
              Additional notes from reviewing clinician
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">{report.clinicianNotes}</p>
              {report.reviewedBy && (
                <p className="text-xs text-muted-foreground mt-2">
                  Reviewed by: {report.reviewedBy}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}