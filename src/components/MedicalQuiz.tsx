import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ArrowRight, RotateCcw, TestTube } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedicalQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const quizSteps = [
    {
      title: "General Symptoms",
      description: "Select any symptoms you've been experiencing recently",
      symptoms: [
        { id: "fatigue", label: "Persistent fatigue or tiredness", tests: ["Advanced Wellness Blood Panel", "Thyroid Function Tests", "Iron Studies", "Vitamin B12 & Folate"] },
        { id: "weight-changes", label: "Unexplained weight gain or loss", tests: ["Thyroid Function Tests", "Diabetes Health Check", "Hormone Health Panel"] },
        { id: "mood-changes", label: "Mood changes, anxiety, or depression", tests: ["Thyroid Function Tests", "Vitamin D", "Cortisol", "Hormone Health Panel"] },
        { id: "sleep-issues", label: "Sleep problems or insomnia", tests: ["Cortisol", "Thyroid Function Tests", "Advanced Wellness Blood Panel"] },
        { id: "headaches", label: "Frequent headaches or migraines", tests: ["Advanced Wellness Blood Panel", "Inflammation Markers", "Vitamin Levels"] }
      ]
    },
    {
      title: "Physical Symptoms",
      description: "Do you experience any of these physical symptoms?",
      symptoms: [
        { id: "joint-pain", label: "Joint or muscle pain", tests: ["Inflammation Markers", "Vitamin D", "Advanced Wellness Blood Panel"] },
        { id: "skin-issues", label: "Skin problems or rashes", tests: ["Food Intolerance Test", "Inflammation Markers", "Vitamin Levels"] },
        { id: "digestive", label: "Digestive issues or stomach problems", tests: ["Food Intolerance Test", "Inflammation Markers", "Advanced Wellness Blood Panel"] },
        { id: "breathing", label: "Shortness of breath or low energy", tests: ["Iron Studies", "Thyroid Function Tests", "Advanced Wellness Blood Panel"] },
        { id: "heart-palpitations", label: "Heart palpitations or chest discomfort", tests: ["Thyroid Function Tests", "Heart Health Check", "Advanced Wellness Blood Panel"] }
      ]
    },
    {
      title: "Lifestyle & Risk Factors",
      description: "Help us understand your lifestyle and health risks",
      symptoms: [
        { id: "family-diabetes", label: "Family history of diabetes", tests: ["Diabetes Health Check", "HbA1c", "Advanced Wellness Blood Panel"] },
        { id: "family-heart", label: "Family history of heart disease", tests: ["Heart Health Check", "Cholesterol Panel", "Advanced Wellness Blood Panel"] },
        { id: "high-stress", label: "High stress levels or demanding job", tests: ["Cortisol", "Inflammation Markers", "Advanced Wellness Blood Panel"] },
        { id: "poor-diet", label: "Poor diet or irregular eating habits", tests: ["Diabetes Health Check", "Vitamin Levels", "Advanced Wellness Blood Panel"] },
        { id: "little-exercise", label: "Sedentary lifestyle or lack of exercise", tests: ["Heart Health Check", "Diabetes Health Check", "Vitamin D"] }
      ]
    },
    {
      title: "Hormones & Reproductive Health",
      description: "Select any hormonal or reproductive health concerns you may have",
      symptoms: [
        { id: "hormone-imbalance", label: "Suspected hormone imbalance or changes", tests: ["Hormone Health Panel", "Thyroid Function Tests", "Advanced Wellness Blood Panel"] },
        { id: "reproductive-health", label: "Fertility concerns or reproductive health issues", tests: ["Fertility Health Check", "Hormone Health Panel", "Thyroid Function Tests"] },
        { id: "libido-energy", label: "Decreased sex drive or energy levels", tests: ["Hormone Health Panel", "Thyroid Function Tests", "Advanced Wellness Blood Panel"] },
        { id: "mood-hormones", label: "Mood swings or hormonal mood changes", tests: ["Hormone Health Panel", "Thyroid Function Tests", "Cortisol"] },
        { id: "physical-changes", label: "Unexplained hair loss, acne, or body changes", tests: ["Hormone Health Panel", "Thyroid Function Tests", "PCOS Profile"] }
      ]
    },
    {
      title: "Performance & Wellness Goals",
      description: "What are your health and performance goals?",
      symptoms: [
        { id: "athletic-performance", label: "Improve athletic performance", tests: ["Sports Performance Panel", "Iron Studies", "Vitamin D"] },
        { id: "weight-management", label: "Weight loss or muscle building goals", tests: ["Metabolism Check", "Thyroid Function Tests", "Sports Performance Panel"] },
        { id: "energy-optimization", label: "Optimize energy and mental clarity", tests: ["Advanced Wellness Blood Panel", "Vitamin B12 & Folate", "Iron Studies"] },
        { id: "aging-concerns", label: "Anti-aging and longevity focus", tests: ["Advanced Wellness Blood Panel", "Hormone Health Panel", "Inflammation Markers"] },
        { id: "preventive-health", label: "Preventive health screening", tests: ["Advanced Wellness Blood Panel", "Heart Health Check", "Cancer Markers"] }
      ]
    }
  ];

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    }
  };

  const generateRecommendations = () => {
    const testCounts: { [key: string]: number } = {};
    const testReasons: { [key: string]: string[] } = {};

    // Count how many times each test is recommended
    quizSteps.forEach(step => {
      step.symptoms.forEach(symptom => {
        if (selectedSymptoms.includes(symptom.id)) {
          symptom.tests.forEach(test => {
            testCounts[test] = (testCounts[test] || 0) + 1;
            if (!testReasons[test]) testReasons[test] = [];
            testReasons[test].push(symptom.label);
          });
        }
      });
    });

    // Sort tests by frequency and create recommendations
    const sortedTests = Object.entries(testCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([test, count]) => ({
        name: test,
        priority: count > 2 ? "High" : count > 1 ? "Medium" : "Low",
        reasons: testReasons[test],
        count
      }));

    setRecommendations(sortedTests);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedSymptoms([]);
    setRecommendations([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <TestTube className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Your Personalised Test Recommendations</CardTitle>
                <CardDescription>
                  Based on your symptoms, here are the blood tests we recommend
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recommendations.length > 0 ? (
                  <>
                    <div className="grid gap-4">
                      {recommendations.slice(0, 5).map((test, index) => (
                        <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{test.name}</h3>
                              <Badge 
                                variant={test.priority === "High" ? "destructive" : 
                                        test.priority === "Medium" ? "default" : "secondary"}
                              >
                                {test.priority} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Recommended for: {test.reasons.slice(0, 2).join(", ")}
                              {test.reasons.length > 2 && ` + ${test.reasons.length - 2} more`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 justify-center pt-4">
                      <Button onClick={() => navigate("/blood-tests")}>
                        View All Tests
                      </Button>
                      <Button variant="outline" onClick={resetQuiz}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Quiz
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Based on your responses, we recommend a general health check-up.
                    </p>
                    <Button onClick={() => navigate("/blood-tests")}>
                      Browse All Tests
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  const currentQuizStep = quizSteps[currentStep];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {currentStep === 0 && (
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <ClipboardCheck className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">
                Health Symptom Assessment
              </h2>
              <p className="text-xl text-muted-foreground">
                Tell us about your symptoms and we'll recommend the most relevant blood tests for you
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle>{currentQuizStep.title}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {quizSteps.length}
                </span>
              </div>
              <CardDescription>{currentQuizStep.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
                />
              </div>

              {/* Symptoms */}
              <div className="space-y-3">
                {currentQuizStep.symptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <Checkbox
                      id={symptom.id}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                    />
                    <label
                      htmlFor={symptom.id}
                      className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
                    >
                      {symptom.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                {currentStep === quizSteps.length - 1 ? (
                  <Button onClick={generateRecommendations}>
                    Get My Recommendations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MedicalQuiz;