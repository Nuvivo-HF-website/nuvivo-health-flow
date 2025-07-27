import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, DollarSign, Globe, Clock, Users, Stethoscope, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JoinProfessional() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Set Your Own Fees",
      description: "List services and control your pricing"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Flexible Hours", 
      description: "Work when it suits you with full calendar control"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Keep Independence",
      description: "Maintain your professional autonomy"
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      title: "AI Health Tools",
      description: "Access our AI interpreter and testing platform"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Platform",
      description: "Fully compliant and secure environment"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Reach More Patients",
      description: "Connect with patients across Scotland"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              For Healthcare Professionals
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Become a <span className="text-primary">Nuvivo Partner</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the UK's modern health platform and monetise your skills. Whether you're a doctor, nurse, 
              physiotherapist, psychologist, or specialist — Nuvivo gives you the tools to:
            </p>

            {/* Key Benefits List */}
            <div className="text-left max-w-2xl mx-auto mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>List services and set your own fees</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Accept bookings with full calendar control</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Order tests, access results, and use our AI interpreter</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Get paid quickly with zero admin hassle</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Flexible hours
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Keep your independence
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Access to labs, nurses, and patients across Scotland
              </Badge>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Fully secure
              </Badge>
              <Badge className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Zero signup fee
              </Badge>
              <Badge className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Reach more patients
              </Badge>
            </div>

            <div className="text-center mb-8">
              <p className="text-lg mb-6">👉 Start now – fill in your profile and we'll do the rest.</p>
              
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate("/partner-register")}
              >
                Create Partner Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Nuvivo?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}