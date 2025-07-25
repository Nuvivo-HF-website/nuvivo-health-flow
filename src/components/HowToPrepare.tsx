import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, Droplets, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

const HowToPrepare = () => {
  const preparationSteps = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "24 Hours Before",
      items: [
        "Avoid alcohol and excessive caffeine",
        "Stay well hydrated with water",
        "Get a good night's sleep",
        "Take regular medications unless advised otherwise"
      ]
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Fasting Tests (8-12 Hours)",
      items: [
        "No food or drinks except water",
        "No chewing gum or mints", 
        "Medications can usually be taken with water",
        "Schedule morning appointments when possible"
      ]
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Day of Test",
      items: [
        "Drink plenty of water (helps with blood draw)",
        "Wear loose sleeves or sleeveless top",
        "Bring valid photo ID",
        "Arrive 10 minutes early"
      ]
    }
  ];

  const testTypes = [
    {
      name: "Fasting Required",
      badge: "8-12 hours",
      color: "destructive",
      tests: ["Glucose", "Cholesterol", "Triglycerides", "Insulin", "HbA1c"]
    },
    {
      name: "No Fasting Required", 
      badge: "Anytime",
      color: "default",
      tests: ["Full Blood Count", "Thyroid Function", "Vitamin Levels", "Kidney Function", "Liver Function"]
    },
    {
      name: "Special Instructions",
      badge: "Varies",
      color: "secondary", 
      tests: ["Cortisol (morning)", "Iron Studies (avoid supplements)", "B12 (stop supplements)"]
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              How to Prepare for Your Test
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proper preparation ensures accurate results and a smooth testing experience. 
              Follow these simple guidelines based on your test type.
            </p>
          </div>

          {/* Preparation Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {preparationSteps.map((step, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {step.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Test Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                Test-Specific Requirements
              </CardTitle>
              <CardDescription>
                Different tests have different preparation requirements. Check your test type below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {testTypes.map((type, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{type.name}</h3>
                      <Badge variant={type.color as any}>{type.badge}</Badge>
                    </div>
                    <div className="space-y-2">
                      {type.tests.map((test, testIndex) => (
                        <div key={testIndex} className="text-sm text-muted-foreground p-2 bg-muted rounded">
                          {test}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="mt-8 border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800">Medications</h4>
                  <p className="text-sm text-orange-700">
                    Continue taking prescribed medications unless specifically told otherwise by your doctor. 
                    Bring a list of all medications and supplements.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800">Special Conditions</h4>
                  <p className="text-sm text-orange-700">
                    If you're pregnant, diabetic, or have other medical conditions, 
                    please inform us when booking for specific guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowToPrepare;