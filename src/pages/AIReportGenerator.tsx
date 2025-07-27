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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ClipboardList,
  User,
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { BloodTestReport } from "@/components/BloodTestReport";
import { AIReportService } from "@/services/AIReportService";

interface PatientInfo {
  name: string;
  nhsNumber: string;
  dateOfBirth: string;
  gender: string;
}

interface ConsultationData {
  symptoms: string[];
  symptomDuration: string;
  currentMedications: string[];
  medicalHistory: string[];
  familyHistory: string[];
  lifestyle: {
    smoking: string;
    alcohol: string;
    exercise: string;
    diet: string;
  };
  concerns: string;
  previousResults: string;
  reasonForTest: string;
  additionalInfo: string;
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
  consultationData: ConsultationData;
  testData: BloodTestData;
  interpretation: {
    summary: string;
    findings: string[];
    redFlags: string[];
    followUp: string[];
    causes: string[];
    contextualInsights: string[];
  };
  clinicianNotes?: string;
  generatedAt: string;
  status: 'draft' | 'reviewed' | 'approved';
  reviewedBy?: string;
}

export default function AIReportGenerator() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Consultation, 3: Patient Info, 4: Generate
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

  const [consultationData, setConsultationData] = useState<ConsultationData>({
    symptoms: [],
    symptomDuration: '',
    currentMedications: [],
    medicalHistory: [],
    familyHistory: [],
    lifestyle: {
      smoking: '',
      alcohol: '',
      exercise: '',
      diet: ''
    },
    concerns: '',
    previousResults: '',
    reasonForTest: '',
    additionalInfo: ''
  });

  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [clinicianNotes, setClinicianNotes] = useState('');

  // Common symptoms list
  const commonSymptoms = [
    'Fatigue', 'Headaches', 'Dizziness', 'Chest pain', 'Shortness of breath',
    'Palpitations', 'Joint pain', 'Muscle weakness', 'Weight loss', 'Weight gain',
    'Frequent urination', 'Excessive thirst', 'Nausea', 'Skin changes', 'Hair loss'
  ];

  const commonMedications = [
    'Aspirin', 'Ibuprofen', 'Paracetamol', 'Statins', 'Blood pressure medication',
    'Diabetes medication', 'Thyroid medication', 'Antidepressants', 'Supplements',
    'Birth control', 'HRT', 'Steroids'
  ];

  const medicalConditions = [
    'Diabetes', 'High blood pressure', 'Heart disease', 'Stroke', 'Cancer',
    'Thyroid problems', 'Kidney disease', 'Liver disease', 'Autoimmune condition',
    'Mental health condition', 'Arthritis', 'Osteoporosis'
  ];

  const handleSymptomToggle = (symptom: string) => {
    setConsultationData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleMedicationToggle = (medication: string) => {
    setConsultationData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.includes(medication)
        ? prev.currentMedications.filter(m => m !== medication)
        : [...prev.currentMedications, medication]
    }));
  };

  const handleMedicalHistoryToggle = (condition: string) => {
    setConsultationData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }));
  };

  const handleFamilyHistoryToggle = (condition: string) => {
    setConsultationData(prev => ({
      ...prev,
      familyHistory: prev.familyHistory.includes(condition)
        ? prev.familyHistory.filter(c => c !== condition)
        : [...prev.familyHistory, condition]
    }));
  };

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
        description: "Blood test results have been processed. Please proceed to consultation.",
      });
      setCurrentStep(2); // Move to consultation step
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
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate AI processing stages with consultation context
      const stages = [
        "Extracting test data...",
        "Analyzing consultation responses...",
        "Correlating symptoms with results...",
        "Checking reference ranges...",
        "Considering medical history...",
        "Identifying personalized red flags...",
        "Generating contextual interpretation...",
        "Formatting NHS-compliant report..."
      ];

      for (let i = 0; i < stages.length; i++) {
        setProgress((i + 1) * 12.5);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Enhanced mock report with consultation context
      const mockReport: GeneratedReport = {
        id: `RPT-${Date.now()}`,
        patientInfo,
        consultationData,
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
            },
            {
              testName: "Vitamin D",
              value: "35",
              unit: "nmol/L",
              referenceRange: "50-120",
              status: "low",
              loincCode: "25058-6"
            },
            {
              testName: "HbA1c",
              value: "48",
              unit: "mmol/mol",
              referenceRange: "<42",
              status: "high",
              loincCode: "4548-4"
            }
          ]
        },
        interpretation: {
          summary: `Based on your consultation responses and blood test results, several findings require attention. Your reported symptoms of ${consultationData.symptoms.join(', ').toLowerCase() || 'general health concerns'} correlate with some of the test abnormalities.`,
          findings: [
            "Haemoglobin levels are below normal range, indicating mild anaemia - this aligns with your reported fatigue symptoms",
            "Total cholesterol is elevated above recommended levels",
            "Vitamin D deficiency detected, which may contribute to muscle weakness and fatigue",
            "HbA1c indicates pre-diabetic levels - important given your family history"
          ],
          redFlags: [
            consultationData.symptoms.includes('Chest pain') ? "Chest pain symptoms with elevated cholesterol require urgent cardiac assessment" : "No immediate emergency concerns identified"
          ],
          followUp: [
            "Follow-up appointment recommended within 2-4 weeks given symptom correlation",
            "Dietary review for cholesterol and blood sugar management",
            "Iron studies to investigate anaemia cause",
            "Vitamin D supplementation recommended",
            consultationData.familyHistory.includes('Diabetes') ? "Enhanced diabetes screening due to family history" : "Blood sugar monitoring advised"
          ],
          causes: [
            "Low haemoglobin may be due to iron deficiency, particularly relevant given your dietary habits",
            "Elevated cholesterol may be related to genetic factors (family history noted) and lifestyle",
            "Vitamin D deficiency common in UK population, especially with limited sun exposure",
            "Pre-diabetic levels may be influenced by family history and lifestyle factors"
          ],
          contextualInsights: [
            consultationData.lifestyle.smoking !== 'Never' ? "Smoking history may contribute to cardiovascular risk" : "",
            consultationData.lifestyle.exercise === 'Rarely' ? "Increased physical activity could help with multiple risk factors" : "",
            consultationData.currentMedications.length > 0 ? `Current medications (${consultationData.currentMedications.join(', ')}) reviewed for interactions` : "",
            consultationData.symptomDuration === '6+ months' ? "Chronic nature of symptoms suggests need for comprehensive management plan" : ""
          ].filter(insight => insight !== "")
        },
        generatedAt: new Date().toISOString(),
        status: 'draft'
      };

      setGeneratedReport(mockReport);
      toast({
        title: "Personalized report generated successfully",
        description: "AI interpretation complete with consultation context. Please review before finalising.",
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
      description: "Personalized report has been clinically approved and is ready for patient delivery",
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return uploadedFile !== null;
      case 2: return true; // Consultation is optional but recommended
      case 3: return patientInfo.name && patientInfo.nhsNumber;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          NHS AI Blood Test Report Generator
        </h1>
        <p className="text-muted-foreground">
          Generate personalized, patient-friendly blood test interpretations with pre-consultation context
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">DCB0129 Compliant</Badge>
          <Badge variant="secondary">NHS Digital IG</Badge>
          <Badge variant="secondary">WCAG 2.2 AA</Badge>
          <Badge variant="secondary">GDPR Compliant</Badge>
          <Badge variant="secondary">AI Enhanced</Badge>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[
            { step: 1, title: "Upload Results", icon: Upload },
            { step: 2, title: "Consultation", icon: ClipboardList },
            { step: 3, title: "Patient Info", icon: User },
            { step: 4, title: "Generate Report", icon: FileText }
          ].map(({ step, title, icon: Icon }) => (
            <div
              key={step}
              className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-muted'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm ${currentStep >= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {title}
              </span>
              {step < 4 && (
                <div className={`flex-1 h-0.5 ml-4 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: File Upload */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Blood Test Results
            </CardTitle>
            <CardDescription>
              Upload PDF, CSV, Excel files or images of blood test results to begin the AI analysis
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
      )}

      {/* Step 2: Consultation Questionnaire */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Pre-Consultation Questionnaire
            </CardTitle>
            <CardDescription>
              Help us provide more personalized and accurate blood test interpretation by sharing relevant health information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="symptoms" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="medical">Medical History</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="concerns">Concerns</TabsTrigger>
              </TabsList>

              <TabsContent value="symptoms" className="space-y-6 mt-6">
                <div>
                  <Label className="text-base font-medium">Are you currently experiencing any of these symptoms?</Label>
                  <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonSymptoms.map(symptom => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={consultationData.symptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomToggle(symptom)}
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="symptom-duration">How long have you been experiencing these symptoms?</Label>
                  <Select value={consultationData.symptomDuration} onValueChange={(value) => 
                    setConsultationData(prev => ({ ...prev, symptomDuration: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="< 1 week">Less than 1 week</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="1 month">About 1 month</SelectItem>
                      <SelectItem value="2-3 months">2-3 months</SelectItem>
                      <SelectItem value="6+ months">6 months or longer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason-for-test">Reason for this blood test</Label>
                  <Textarea
                    id="reason-for-test"
                    value={consultationData.reasonForTest}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, reasonForTest: e.target.value }))}
                    placeholder="e.g., Routine check-up, investigating symptoms, monitoring condition..."
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-6 mt-6">
                <div>
                  <Label className="text-base font-medium">Current Medications & Supplements</Label>
                  <p className="text-sm text-muted-foreground mb-4">Including over-the-counter medications and supplements</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonMedications.map(medication => (
                      <div key={medication} className="flex items-center space-x-2">
                        <Checkbox
                          id={medication}
                          checked={consultationData.currentMedications.includes(medication)}
                          onCheckedChange={() => handleMedicationToggle(medication)}
                        />
                        <Label htmlFor={medication} className="text-sm">{medication}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Personal Medical History</Label>
                  <p className="text-sm text-muted-foreground mb-4">Conditions you have been diagnosed with</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {medicalConditions.map(condition => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`personal-${condition}`}
                          checked={consultationData.medicalHistory.includes(condition)}
                          onCheckedChange={() => handleMedicalHistoryToggle(condition)}
                        />
                        <Label htmlFor={`personal-${condition}`} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Family Medical History</Label>
                  <p className="text-sm text-muted-foreground mb-4">Conditions that run in your family</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {medicalConditions.map(condition => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`family-${condition}`}
                          checked={consultationData.familyHistory.includes(condition)}
                          onCheckedChange={() => handleFamilyHistoryToggle(condition)}
                        />
                        <Label htmlFor={`family-${condition}`} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="previous-results">Previous Blood Test Results (if relevant)</Label>
                  <Textarea
                    id="previous-results"
                    value={consultationData.previousResults}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, previousResults: e.target.value }))}
                    placeholder="Any relevant previous test results or trends..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Smoking Status</Label>
                    <RadioGroup 
                      value={consultationData.lifestyle.smoking} 
                      onValueChange={(value) => setConsultationData(prev => ({
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, smoking: value }
                      }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Never" id="smoke-never" />
                        <Label htmlFor="smoke-never">Never smoked</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Former" id="smoke-former" />
                        <Label htmlFor="smoke-former">Former smoker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Current" id="smoke-current" />
                        <Label htmlFor="smoke-current">Current smoker</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Alcohol Consumption</Label>
                    <RadioGroup 
                      value={consultationData.lifestyle.alcohol} 
                      onValueChange={(value) => setConsultationData(prev => ({
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, alcohol: value }
                      }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="None" id="alcohol-none" />
                        <Label htmlFor="alcohol-none">No alcohol</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Moderate" id="alcohol-moderate" />
                        <Label htmlFor="alcohol-moderate">Moderate (within guidelines)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Heavy" id="alcohol-heavy" />
                        <Label htmlFor="alcohol-heavy">Above recommended limits</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Exercise Frequency</Label>
                    <RadioGroup 
                      value={consultationData.lifestyle.exercise} 
                      onValueChange={(value) => setConsultationData(prev => ({
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, exercise: value }
                      }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Regular" id="exercise-regular" />
                        <Label htmlFor="exercise-regular">Regular (3+ times/week)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Occasional" id="exercise-occasional" />
                        <Label htmlFor="exercise-occasional">Occasional (1-2 times/week)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rarely" id="exercise-rarely" />
                        <Label htmlFor="exercise-rarely">Rarely or never</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Diet Type</Label>
                    <RadioGroup 
                      value={consultationData.lifestyle.diet} 
                      onValueChange={(value) => setConsultationData(prev => ({
                        ...prev, 
                        lifestyle: { ...prev.lifestyle, diet: value }
                      }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Balanced" id="diet-balanced" />
                        <Label htmlFor="diet-balanced">Balanced diet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Vegetarian" id="diet-vegetarian" />
                        <Label htmlFor="diet-vegetarian">Vegetarian</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Vegan" id="diet-vegan" />
                        <Label htmlFor="diet-vegan">Vegan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Restricted" id="diet-restricted" />
                        <Label htmlFor="diet-restricted">Restricted (medical/other)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="concerns" className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="specific-concerns">Specific Health Concerns</Label>
                  <Textarea
                    id="specific-concerns"
                    value={consultationData.concerns}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, concerns: e.target.value }))}
                    placeholder="What specific health concerns or questions do you have about your blood test results?"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Textarea
                    id="additional-info"
                    value={consultationData.additionalInfo}
                    onChange={(e) => setConsultationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    placeholder="Any other information you think might be relevant for interpreting your results..."
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    This information helps our AI provide more personalized and accurate interpretations of your blood test results. 
                    All information is confidential and used solely for generating your report.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Patient Information */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
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
                <Select value={patientInfo.gender} onValueChange={(value) => setPatientInfo({...patientInfo, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generate Report */}
      {currentStep === 4 && !generatedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate AI Report
            </CardTitle>
            <CardDescription>
              Review your information and generate personalized blood test interpretation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">File Uploaded</p>
                <p className="text-xs text-muted-foreground">{uploadedFile?.name}</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">Consultation Complete</p>
                <p className="text-xs text-muted-foreground">
                  {consultationData.symptoms.length + consultationData.currentMedications.length} responses
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">Patient Info Complete</p>
                <p className="text-xs text-muted-foreground">{patientInfo.name}</p>
              </div>
            </div>

            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating Personalized Report...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate AI Report with Consultation Context
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">
                  Enhanced AI analysis in progress - incorporating consultation responses
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < 4 && (
          <Button
            onClick={nextStep}
            disabled={!canProceedToNext()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Generated Report Section */}
      {generatedReport && (
        <div className="mt-8 space-y-6">
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
        </div>
      )}
    </div>
  );
}