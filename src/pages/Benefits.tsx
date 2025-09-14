import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, DollarSign, Globe, Clock, Users, Stethoscope, ArrowLeft, Heart, Award, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Benefits() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "White-Label Solutions",
      description: "Complete branded kits and materials with your practice identity",
      details: [
        "Custom branded test kits with your practice logo",
        "Professional packaging and presentation materials",
        "Personalized patient communication templates",
        "Co-branded marketing materials and resources"
      ]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Complete Fulfillment", 
      description: "We handle printing, shipping, and all logistics for you",
      details: [
        "Automated order processing and fulfillment",
        "Direct drop-shipping to your patients nationwide",
        "Real-time tracking and delivery notifications",
        "Quality control and packaging standards"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Lab Partnerships",
      description: "Full lab contracts and result delivery managed",
      details: [
        "Access to nationwide accredited laboratories",
        "Automated result processing and delivery",
        "Quality assurance and certification management",
        "Seamless integration with your practice workflow"
      ]
    },
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: "AI Health Tools",
      description: "Access the world's most advanced health platform",
      details: [
        "AI-powered result interpretation and insights",
        "Predictive health analytics and trend analysis",
        "Automated patient risk assessment tools",
        "Intelligent recommendation engine for follow-ups"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Transparent Pricing",
      description: "£29/month + percentage fee - no hidden costs",
      details: [
        "Clear and predictable monthly subscription fee",
        "Transparent commission structure on sales",
        "No setup fees or hidden charges",
        "Flexible payment terms based on practice needs"
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Reach",
      description: "Connect with patients worldwide through our platform",
      details: [
        "Access to international patient network",
        "Multi-language support and localization",
        "Cross-border payment processing capabilities",
        "Global compliance and regulatory support"
      ]
    }
  ];

  const additionalBenefits = [
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Patient Care Excellence",
      description: "Enhanced tools for superior patient outcomes and satisfaction"
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Professional Development",
      description: "Continuous training and certification programs for partners"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Innovation Access",
      description: "First access to new tests, technologies, and health solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/d10bf310-8418-438d-af09-376e2c242db8.png" 
                alt="Nuvivo Health Logo" 
                className="w-12 h-12 object-contain"
              />
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/join-professional")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Join Professional
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Partnership Benefits
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Why Choose <span className="text-primary">Nuvivo Partnership</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the comprehensive benefits and support that come with joining the Nuvivo healthcare professional network. 
            From white-label solutions to AI-powered tools, we provide everything you need to enhance your practice and patient care.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-lg bg-background/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </div>
                <CardDescription className="text-base font-medium">
                  {benefit.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {benefit.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Additional Partnership Advantages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 border border-primary/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Partner Network?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start your journey with Nuvivo today and transform your practice with our comprehensive healthcare solutions. 
            Join thousands of healthcare professionals who trust Nuvivo for their patient care needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/partner-register")}
              className="px-8 py-3"
            >
              Start Registration
              <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/join-professional")}
              className="px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}