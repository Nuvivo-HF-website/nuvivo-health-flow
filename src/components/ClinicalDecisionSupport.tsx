import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  AlertTriangle, 
  Pill,
  Shield,
  BookOpen,
  Search,
  TrendingUp,
  Clock,
  Users,
  FileText,
  Stethoscope,
  Heart,
  Activity,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';

interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  description: string;
  mechanism: string;
  recommendations: string[];
  evidence: string;
}

interface ClinicalGuideline {
  id: string;
  condition: string;
  title: string;
  recommendation: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  source: string;
  relevanceScore: number;
  applicability: string[];
}

interface TreatmentRecommendation {
  condition: string;
  primaryTreatment: string;
  alternativeTreatments: string[];
  contraindications: string[];
  considerations: string[];
  monitoringRequired: string[];
  efficacy: number;
  safety: number;
}

interface DiagnosticSuggestion {
  symptomPattern: string[];
  possibleDiagnoses: Array<{
    diagnosis: string;
    probability: number;
    supportingFactors: string[];
    requiredTests: string[];
    differentials: string[];
  }>;
  urgency: 'low' | 'moderate' | 'high' | 'emergency';
  redFlags: string[];
}

export function ClinicalDecisionSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [guidelines, setGuidelines] = useState<ClinicalGuideline[]>([]);
  const [treatmentRecs, setTreatmentRecs] = useState<TreatmentRecommendation[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [diagnosticSuggestions, setDiagnosticSuggestions] = useState<DiagnosticSuggestion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'interactions' | 'guidelines' | 'treatments' | 'diagnostics'>('interactions');

  useEffect(() => {
    loadClinicalData();
  }, []);

  useEffect(() => {
    if (selectedMedications.length >= 2) {
      checkDrugInteractions();
    } else {
      setInteractions([]);
    }
  }, [selectedMedications]);

  useEffect(() => {
    if (symptoms.length > 0) {
      generateDiagnosticSuggestions();
    }
  }, [symptoms]);

  const loadClinicalData = () => {
    // Mock clinical guidelines
    setGuidelines([
      {
        id: '1',
        condition: 'Hypertension',
        title: 'First-line treatment for hypertension in adults',
        recommendation: 'ACE inhibitors or ARBs are recommended as first-line therapy for most patients with hypertension',
        evidenceLevel: 'A',
        source: 'AHA/ACC Hypertension Guidelines 2023',
        relevanceScore: 95,
        applicability: ['Adults 18-65', 'No contraindications', 'New diagnosis']
      },
      {
        id: '2',
        condition: 'Type 2 Diabetes',
        title: 'Metformin as first-line therapy',
        recommendation: 'Metformin should be initiated as first-line therapy unless contraindicated',
        evidenceLevel: 'A',
        source: 'ADA Standards of Care 2023',
        relevanceScore: 98,
        applicability: ['Type 2 diabetes', 'No kidney disease', 'No heart failure']
      }
    ]);

    // Mock treatment recommendations
    setTreatmentRecs([
      {
        condition: 'Acute Myocardial Infarction',
        primaryTreatment: 'Dual antiplatelet therapy (Aspirin + P2Y12 inhibitor)',
        alternativeTreatments: ['Anticoagulation with heparin', 'Beta-blockers', 'ACE inhibitors'],
        contraindications: ['Active bleeding', 'Severe liver disease', 'Allergy to aspirin'],
        considerations: ['Age >75 years', 'Bleeding risk assessment', 'Kidney function'],
        monitoringRequired: ['Complete blood count', 'Liver function', 'Kidney function'],
        efficacy: 92,
        safety: 85
      }
    ]);
  };

  const checkDrugInteractions = () => {
    // Mock drug interaction checking
    const mockInteractions: DrugInteraction[] = [
      {
        drugA: 'Warfarin',
        drugB: 'Aspirin',
        severity: 'major',
        description: 'Increased risk of bleeding when used together',
        mechanism: 'Additive anticoagulant effects',
        recommendations: [
          'Monitor INR more frequently',
          'Consider lower warfarin dose',
          'Watch for signs of bleeding',
          'Consider alternative to aspirin if possible'
        ],
        evidence: 'Strong clinical evidence from multiple studies'
      },
      {
        drugA: 'Metformin',
        drugB: 'Lisinopril',
        severity: 'minor',
        description: 'May enhance hypoglycemic effect',
        mechanism: 'ACE inhibitors may improve insulin sensitivity',
        recommendations: [
          'Monitor blood glucose closely',
          'Patient education on hypoglycemia symptoms'
        ],
        evidence: 'Moderate clinical evidence'
      }
    ];

    // Only show interactions if user has selected relevant medications
    const relevantInteractions = mockInteractions.filter(interaction => 
      selectedMedications.some(med => 
        med.toLowerCase().includes(interaction.drugA.toLowerCase()) ||
        med.toLowerCase().includes(interaction.drugB.toLowerCase())
      )
    );

    setInteractions(relevantInteractions);
  };

  const generateDiagnosticSuggestions = () => {
    // Mock diagnostic AI
    const mockSuggestion: DiagnosticSuggestion = {
      symptomPattern: symptoms,
      possibleDiagnoses: [
        {
          diagnosis: 'Viral Upper Respiratory Infection',
          probability: 75,
          supportingFactors: ['Gradual onset', 'Low-grade fever', 'Rhinorrhea'],
          requiredTests: ['Physical examination', 'Vital signs'],
          differentials: ['Bacterial sinusitis', 'Allergic rhinitis', 'COVID-19']
        },
        {
          diagnosis: 'Acute Bronchitis',
          probability: 60,
          supportingFactors: ['Persistent cough', 'Chest discomfort'],
          requiredTests: ['Chest X-ray if symptoms persist', 'Pulse oximetry'],
          differentials: ['Pneumonia', 'Asthma exacerbation']
        }
      ],
      urgency: 'low',
      redFlags: []
    };

    setDiagnosticSuggestions(mockSuggestion);
  };

  const addMedication = () => {
    if (newMedication.trim() && !selectedMedications.includes(newMedication)) {
      setSelectedMedications([...selectedMedications, newMedication]);
      setNewMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setSelectedMedications(selectedMedications.filter(med => med !== medication));
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom)) {
      setSymptoms([...symptoms, newSymptom]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return 'bg-red-100 border-red-500 text-red-700';
      case 'major': return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'moderate': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'minor': return 'bg-blue-100 border-blue-500 text-blue-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'major': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'moderate': return <Info className="h-5 w-5 text-yellow-500" />;
      case 'minor': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Clinical Decision Support System
          </CardTitle>
          <CardDescription>
            AI-powered clinical insights, drug interaction checking, and evidence-based treatment recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'interactions' ? 'default' : 'outline'}
              onClick={() => setActiveTab('interactions')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Drug Interactions
            </Button>
            <Button
              variant={activeTab === 'guidelines' ? 'default' : 'outline'}
              onClick={() => setActiveTab('guidelines')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Clinical Guidelines
            </Button>
            <Button
              variant={activeTab === 'treatments' ? 'default' : 'outline'}
              onClick={() => setActiveTab('treatments')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Treatments
            </Button>
            <Button
              variant={activeTab === 'diagnostics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('diagnostics')}
              className="flex items-center gap-2"
            >
              <Stethoscope className="h-4 w-4" />
              Diagnostics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drug Interactions Tab */}
      {activeTab === 'interactions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-orange-500" />
                Drug Interaction Checker
              </CardTitle>
              <CardDescription>
                Check for interactions between medications and get safety recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter medication name..."
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                />
                <Button onClick={addMedication}>Add</Button>
              </div>

              {/* Selected Medications */}
              <div className="flex flex-wrap gap-2">
                {selectedMedications.map((med, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {med}
                    <button onClick={() => removeMedication(med)} className="ml-1">×</button>
                  </Badge>
                ))}
              </div>

              {/* Interactions Results */}
              {interactions.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-semibold text-lg">Detected Interactions</h3>
                  {interactions.map((interaction, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(interaction.severity)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(interaction.severity)}
                          <div>
                            <h4 className="font-semibold">
                              {interaction.drugA} + {interaction.drugB}
                            </h4>
                            <p className="text-sm capitalize">{interaction.severity} Interaction</p>
                          </div>
                        </div>
                      </div>

                      <p className="mb-3 text-sm">{interaction.description}</p>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-1">Mechanism:</h5>
                        <p className="text-xs">{interaction.mechanism}</p>
                      </div>

                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-1">Recommendations:</h5>
                        <ul className="space-y-1">
                          {interaction.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-xs flex items-start gap-2">
                              <span className="w-1 h-1 bg-current rounded-full mt-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Evidence: {interaction.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Clinical Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Evidence-Based Guidelines
              </CardTitle>
              <CardDescription>
                Latest clinical practice guidelines and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search guidelines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {guidelines.map((guideline) => (
                  <div key={guideline.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{guideline.title}</h3>
                        <p className="text-sm text-muted-foreground">{guideline.condition}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`text-white ${getEvidenceColor(guideline.evidenceLevel)}`}
                        >
                          Level {guideline.evidenceLevel}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">{guideline.relevanceScore}%</div>
                          <div className="text-xs text-muted-foreground">Relevance</div>
                        </div>
                      </div>
                    </div>

                    <p className="mb-3 text-sm">{guideline.recommendation}</p>

                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-1">Applicable to:</h4>
                      <div className="flex flex-wrap gap-1">
                        {guideline.applicability.map((app, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Source: {guideline.source}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Treatment Recommendations Tab */}
      {activeTab === 'treatments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Treatment Recommendations
              </CardTitle>
              <CardDescription>
                Evidence-based treatment protocols and monitoring guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {treatmentRecs.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{treatment.condition}</h3>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{treatment.efficacy}%</div>
                        <div className="text-xs text-muted-foreground">Efficacy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{treatment.safety}%</div>
                        <div className="text-xs text-muted-foreground">Safety</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-700">Primary Treatment</h4>
                      <p className="text-sm p-2 bg-green-50 rounded">{treatment.primaryTreatment}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Alternative Treatments</h4>
                      <ul className="space-y-1">
                        {treatment.alternativeTreatments.map((alt, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-2" />
                            {alt}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-red-700">Contraindications</h4>
                      <ul className="space-y-1">
                        {treatment.contraindications.map((contra, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <XCircle className="h-3 w-3 text-red-500 mt-1" />
                            {contra}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-yellow-700">Monitoring Required</h4>
                      <ul className="space-y-1">
                        {treatment.monitoringRequired.map((monitor, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <Activity className="h-3 w-3 text-yellow-500 mt-1" />
                            {monitor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Diagnostic Assistance Tab */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-purple-500" />
                AI Diagnostic Assistant
              </CardTitle>
              <CardDescription>
                Symptom analysis and differential diagnosis suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter symptom..."
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                />
                <Button onClick={addSymptom}>Add</Button>
              </div>

              {/* Selected Symptoms */}
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {symptom}
                    <button onClick={() => removeSymptom(symptom)} className="ml-1">×</button>
                  </Badge>
                ))}
              </div>

              {/* Diagnostic Suggestions */}
              {diagnosticSuggestions && (
                <div className="space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">AI Diagnostic Suggestions</h3>
                    <Badge variant={diagnosticSuggestions.urgency === 'emergency' ? 'destructive' : 'secondary'}>
                      {diagnosticSuggestions.urgency} priority
                    </Badge>
                  </div>

                  {diagnosticSuggestions.possibleDiagnoses.map((diagnosis, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{diagnosis.diagnosis}</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={diagnosis.probability} className="w-20" />
                          <span className="text-sm font-medium">{diagnosis.probability}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-1 text-green-700">Supporting Factors</h5>
                          <ul className="space-y-1">
                            {diagnosis.supportingFactors.map((factor, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm mb-1 text-blue-700">Required Tests</h5>
                          <ul className="space-y-1">
                            {diagnosis.requiredTests.map((test, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-2">
                                <FileText className="h-3 w-3 text-blue-500 mt-0.5" />
                                {test}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm mb-1 text-orange-700">Differentials</h5>
                          <ul className="space-y-1">
                            {diagnosis.differentials.map((diff, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-2">
                                <span className="w-1 h-1 bg-orange-500 rounded-full mt-2" />
                                {diff}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Clinical Decision Support:</strong> These AI-powered recommendations are designed to assist clinical 
          decision-making and should always be used in conjunction with clinical judgment and current medical standards. 
          Always verify drug interactions and treatment recommendations with current literature and guidelines.
        </AlertDescription>
      </Alert>
    </div>
  );
}