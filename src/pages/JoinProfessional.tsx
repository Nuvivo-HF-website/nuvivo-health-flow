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
      title: "White-Label Solutions",
      description: "Branded kits and materials with your practice identity"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Complete Fulfillment", 
      description: "We handle printing, shipping, and all logistics for you"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Lab Partnerships",
      description: "Full lab contracts and result delivery managed"
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      title: "AI Health Tools",
      description: "Access the world's most advanced health platform"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Transparent Pricing",
      description: "£29/month + percentage fee - no hidden costs"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Global Reach",
      description: "Connect with patients worldwide through our platform"
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
              Join the world's most advanced health platform with complete white-label solutions. Whether you're a doctor, nurse, 
              physiotherapist, psychologist, or specialist — Nuvivo provides everything you need:
            </p>

            {/* Subscription Model */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-primary mb-3">Partnership Investment</h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span>Monthly Platform Access</span>
                  <span className="font-bold text-2xl text-primary">£29/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Commission on Sales</span>
                  <span className="font-medium text-lg">+ Percentage fee</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Full access to the world's most comprehensive health platform with white-label solutions
              </p>
            </div>

            {/* Key Benefits List */}
            <div className="text-left max-w-2xl mx-auto mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>White-label blood test kits with your branding</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Complete drop-shipping and fulfillment service</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>All lab contracts and result delivery handled for you</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Set your own prices and keep healthy margins</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>Access to AI interpreter and global platform tools</span>
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
                Complete white-label solution
              </Badge>
              <Badge className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Transparent pricing model
              </Badge>
              <Badge className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Global platform access
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