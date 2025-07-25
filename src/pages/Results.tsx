import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, MessageCircle, Download, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data - would come from API
const mockResults = {
  orderId: "NUV-2024-001",
  patientName: "Sarah Johnson",
  testDate: "2024-01-15",
  status: "ready",
  aiSummary: `Your blood test results show mostly normal values with a few areas to monitor. Your vitamin D levels are slightly below optimal range, which is common during winter months. Iron levels are on the lower end of normal - consider incorporating more iron-rich foods like spinach and lean meats. 

✓ Cholesterol levels are excellent - keep up the healthy lifestyle
✓ Blood sugar is within healthy range  
✓ Liver function markers are normal
⚠️ Vitamin D: Consider supplementation (consult your GP)
⚠️ Iron: Monitor through diet or speak to a nutritionist`,
  biomarkers: [
    { name: "Vitamin D", value: "18", range: "20-50", unit: "ng/mL", status: "low" },
    { name: "Iron", value: "45", range: "50-170", unit: "μg/dL", status: "low-normal" },
    { name: "Total Cholesterol", value: "180", range: "<200", unit: "mg/dL", status: "good" },
    { name: "HbA1c", value: "5.2", range: "<5.7", unit: "%", status: "excellent" }
  ]
};

const specialists = [
  {
    id: "1",
    name: "Dr. Emily Watson",
    specialty: "Endocrinology",
    rating: 4.9,
    reviews: 127,
    experience: "15+ years",
    nextSlot: "Tomorrow 2:30 PM",
    fee: "£85",
    avatar: "/placeholder.svg",
    relevance: "Vitamin D & metabolism expert"
  },
  {
    id: "2", 
    name: "Dr. James Chen",
    specialty: "Hematology",
    rating: 4.8,
    reviews: 89,
    experience: "12+ years", 
    nextSlot: "Wed 11:00 AM",
    fee: "£90",
    avatar: "/placeholder.svg",
    relevance: "Iron deficiency specialist"
  },
  {
    id: "3",
    name: "Dr. Sarah Mills",
    specialty: "General Practice",
    rating: 4.7,
    reviews: 203,
    experience: "10+ years",
    nextSlot: "Today 4:45 PM", 
    fee: "£65",
    avatar: "/placeholder.svg",
    relevance: "General health consultation"
  }
];

const Results = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "low":
      case "high":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
        return "bg-success/10 text-success border-success/20";
      case "low":
      case "high":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Test Results</h1>
              <p className="text-muted-foreground">Order {mockResults.orderId} • {mockResults.testDate}</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          <Badge className={getStatusColor(mockResults.status)}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Results Ready
          </Badge>
        </div>

        {/* AI Summary */}
        <Card className="mb-8 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              AI-Powered Summary
            </CardTitle>
            <CardDescription>
              Doctor-reviewed analysis of your results in plain English
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-foreground">
                {mockResults.aiSummary}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biomarkers Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>Your biomarker values and reference ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResults.biomarkers.map((marker, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(marker.status)}
                    <div>
                      <p className="font-medium">{marker.name}</p>
                      <p className="text-sm text-muted-foreground">Range: {marker.range} {marker.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{marker.value} {marker.unit}</p>
                    <Badge className={getStatusColor(marker.status)} variant="outline">
                      {marker.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specialist Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Speak with a Specialist</CardTitle>
            <CardDescription>
              Get expert advice about your results from qualified healthcare professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {specialists.map((specialist) => (
                <div 
                  key={specialist.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedSpecialist === specialist.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setSelectedSpecialist(specialist.id)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={specialist.avatar} />
                      <AvatarFallback>{specialist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{specialist.name}</h4>
                          <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-accent">{specialist.fee}</p>
                          <p className="text-xs text-muted-foreground">30 min consultation</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-medium">{specialist.rating}</span>
                          <span className="text-sm text-muted-foreground">({specialist.reviews})</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{specialist.experience}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {specialist.relevance}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-success" />
                          <span className="text-success font-medium">{specialist.nextSlot}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedSpecialist && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex gap-3">
                  <Button className="flex-1">
                    Book Consultation
                  </Button>
                  <Button variant="outline">
                    Ask a Question
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;