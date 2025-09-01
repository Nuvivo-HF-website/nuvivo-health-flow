import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, ArrowRight, ArrowLeft, RotateCcw, TestTube } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HealthSurvey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const quizSteps = [
    {
      title: "General Symptoms",
      description: "Select any symptoms you've been experiencing",
      symptoms: [
        { id: "fatigue", label: "Chronic fatigue or tiredness", tests: ["complete-blood-count", "thyroid-function"] },
        { id: "weight-changes", label: "Unexplained weight gain or loss", tests: ["thyroid-function", "diabetes-check"] },
        { id: "mood-changes", label: "Mood swings or depression", tests: ["vitamin-d", "testosterone"] },
        { id: "sleep-issues", label: "Sleep problems or insomnia", tests: ["cortisol", "thyroid-function"] },
        { id: "digestive", label: "Digestive issues", tests: ["food-intolerance", "liver-function"] }
      ]
    },
    {
      title: "Physical Symptoms",
      description: "Any physical discomfort or changes?",
      symptoms: [
        { id: "joint-pain", label: "Joint or muscle pain", tests: ["inflammatory-markers", "vitamin-d"] },
        { id: "headaches", label: "Frequent headaches", tests: ["blood-pressure", "diabetes-check"] },
        { id: "skin-issues", label: "Skin problems or changes", tests: ["allergy-testing", "nutritional-profile"] },
        { id: "heart-palpitations", label: "Heart palpitations", tests: ["thyroid-function", "heart-health"] },
        { id: "breathing", label: "Shortness of breath", tests: ["complete-blood-count", "heart-health"] }
      ]
    },
    {
      title: "Lifestyle Factors",
      description: "Tell us about your lifestyle and concerns",
      symptoms: [
        { id: "high-stress", label: "High stress levels", tests: ["cortisol", "vitamin-b"] },
        { id: "poor-diet", label: "Poor diet or nutrition concerns", tests: ["nutritional-profile", "cholesterol"] },
        { id: "lack-exercise", label: "Lack of regular exercise", tests: ["diabetes-check", "heart-health"] },
        { id: "family-history", label: "Family history of disease", tests: ["genetic-screening", "comprehensive-health"] },
        { id: "preventive-care", label: "Want preventive health screening", tests: ["comprehensive-health", "cancer-markers"] }
      ]
    }
  ];

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setSelectedSymptoms(prev => 
      checked 
        ? [...prev, symptomId]
        : prev.filter(id => id !== symptomId)
    );
  };

  const generateRecommendations = () => {
    const allSymptoms = quizSteps.flatMap(step => step.symptoms);
    const selectedSymptomsData = allSymptoms.filter(symptom => 
      selectedSymptoms.includes(symptom.id)
    );

    const testCounts = selectedSymptomsData.reduce((acc, symptom) => {
      symptom.tests.forEach(test => {
        acc[test] = (acc[test] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const testRecommendations = Object.entries(testCounts)
      .map(([test, count]) => ({
        test,
        priority: count >= 3 ? 'High' : count >= 2 ? 'Medium' : 'Low',
        reason: `Recommended based on ${count} selected symptom${count > 1 ? 's' : ''}`
      }))
      .sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      });

    setRecommendations(testRecommendations);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedSymptoms([]);
    setRecommendations([]);
    setShowResults(false);
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <TestTube className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">Your Personalized Test Recommendations</h1>
            <p className="text-xl text-muted-foreground">
              Based on your symptoms, here are our recommended blood tests
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">
                      {rec.test.replace(/-/g, ' ')}
                    </CardTitle>
                    <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <CardDescription>{rec.reason}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/blood-tests')}
              size="lg"
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              View All Tests
            </Button>
            <Button 
              onClick={resetQuiz}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <ClipboardCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">Health Symptom Assessment</h1>
          <p className="text-xl text-muted-foreground">
            Tell us about your symptoms and we'll recommend the most relevant blood tests for you
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep + 1} of {quizSteps.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{quizSteps[currentStep].title}</CardTitle>
            <CardDescription>{quizSteps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizSteps[currentStep].symptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom.id}
                  checked={selectedSymptoms.includes(symptom.id)}
                  onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                />
                <label
                  htmlFor={symptom.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {symptom.label}
                </label>
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                {currentStep === quizSteps.length - 1 ? 'Get Recommendations' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HealthSurvey;