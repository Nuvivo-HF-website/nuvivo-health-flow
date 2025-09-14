import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Shield, DollarSign, Globe, Clock, Users, Stethoscope, ArrowLeft, Plus, Minus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Benefits() {
  const navigate = useNavigate();
  
  const [collapsibleStates, setCollapsibleStates] = useState({
    pricing: false,
    professional: false,
    patientCare: false,
    support: false
  });

  const toggleCollapsible = (key: keyof typeof collapsibleStates) => {
    setCollapsibleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
            Partnership Benefits & Terms
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-primary">Partnership Details</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Complete information about our partnership program, pricing structure, and professional requirements.
          </p>
        </div>

        {/* Partnership Details */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Partnership Benefits
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subscription & Pricing Structure */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Partnership Investment & White-Label Solutions</h3>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                  <h4 className="font-medium text-primary mb-3">Monthly Partnership Fee</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">Platform Access & Tools</span>
                    <span className="text-2xl font-bold text-primary">£29/month</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span>Commission on Sales</span>
                    <span className="font-medium">+ Percentage fee</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete access to the world's most advanced health platform with white-label solutions, 
                    drop-shipping services, and full lab partnership management.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">White-Label Kit Solutions</h4>
                  <p className="text-sm text-green-700 mb-3">
                    We provide complete white-label blood test kits branded with your practice identity. 
                    Our team handles all printing, packaging, and drop-shipping directly to your patients. 
                    You simply place orders through your dashboard, and we take care of everything else.
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Custom branded test kits with your practice logo</li>
                    <li>• Direct drop-shipping to your patients nationwide</li>
                    <li>• All lab contracts and partnerships managed for you</li>
                    <li>• Professional result delivery and reporting</li>
                    <li>• Complete fulfillment and logistics handling</li>
                  </ul>
                </div>
              </div>

              {/* How It Works */}
              <div>
                <h3 className="font-semibold text-lg mb-3">How the Partnership Works</h3>
                <p className="text-muted-foreground mb-4">
                  Our partnership model is designed to be straightforward and profitable. You simply order blood tests through your dedicated 
                  dashboard at partner prices, customize the pricing for your patients based on your practice needs, and keep the difference 
                  as additional revenue. We handle all the laboratory processing, result delivery, and technical aspects while you focus on 
                  patient care and growing your practice.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                    <h4 className="font-medium mb-2">Order Tests</h4>
                    <p className="text-sm text-muted-foreground">Access wholesale pricing through your partner dashboard</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                    <h4 className="font-medium mb-2">Set Your Prices</h4>
                    <p className="text-sm text-muted-foreground">Customize patient pricing with our recommended guidelines</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                    <h4 className="font-medium mb-2">Earn Revenue</h4>
                    <p className="text-sm text-muted-foreground">Generate additional income for your practice</p>
                  </div>
                </div>
              </div>

              {/* Partnership Rules */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Partnership Terms & Standards</h3>
                <div className="space-y-4">
                  <Collapsible open={collapsibleStates.pricing} onOpenChange={() => toggleCollapsible('pricing')}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 border-l-4 border-primary bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                        <h4 className="font-medium">Pricing Guidelines</h4>
                        {collapsibleStates.pricing ? (
                          <Minus className="h-5 w-5 text-primary" />
                        ) : (
                          <Plus className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-l-4 border-primary bg-muted/30">
                        <p className="text-sm">
                          To maintain market integrity and professional standards, partners must adhere to our pricing guidelines. 
                          You're free to set competitive prices but cannot advertise below our recommended retail prices without prior approval. 
                          Payment terms are flexible and will be discussed individually based on your practice requirements and partnership agreement.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={collapsibleStates.professional} onOpenChange={() => toggleCollapsible('professional')}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 border-l-4 border-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                        <h4 className="font-medium">Professional Requirements</h4>
                        {collapsibleStates.professional ? (
                          <Minus className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Plus className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-l-4 border-orange-500 bg-orange-25">
                        <p className="text-sm">
                          All partners must maintain current professional registration with relevant bodies (GMC, NMC, HCPC, etc.) and 
                          hold valid indemnity insurance. We require compliance with NICE guidelines for test recommendations and regular 
                          CPD participation. These standards ensure we maintain the highest quality of care across our partner network 
                          and protect both patients and practitioners.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={collapsibleStates.patientCare} onOpenChange={() => toggleCollapsible('patientCare')}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                        <h4 className="font-medium">Patient Care Excellence</h4>
                        {collapsibleStates.patientCare ? (
                          <Minus className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Plus className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-25">
                        <p className="text-sm">
                          Our partnership is built on delivering exceptional patient care. Partners are expected to provide thorough 
                          consultations before recommending tests, explain results clearly and comprehensively, and offer appropriate 
                          follow-up care or specialist referrals when needed. All patient interactions must maintain strict confidentiality 
                          and full GDPR compliance to protect sensitive health information.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={collapsibleStates.support} onOpenChange={() => toggleCollapsible('support')}>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 border-l-4 border-green-500 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                        <h4 className="font-medium">Comprehensive Support</h4>
                        {collapsibleStates.support ? (
                          <Minus className="h-5 w-5 text-green-500" />
                        ) : (
                          <Plus className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-l-4 border-green-500 bg-green-25">
                        <p className="text-sm">
                          When you join Nuvivo, you gain access to our extensive support network. This includes our nationwide laboratory 
                          infrastructure, automated result delivery systems, professional reporting tools, marketing support with co-branded 
                          materials, and a dedicated partner support team available to assist with any questions or technical issues you may encounter.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              {/* Agreement Confirmation */}
              <div className="p-4 bg-muted border rounded-lg">
                <p className="text-sm font-medium mb-2">Partnership Commitment</p>
                <p className="text-sm text-muted-foreground">
                  By proceeding with registration, you agree to maintain the highest professional standards in all patient interactions, 
                  use our services ethically and in patients' best interests, comply with all relevant medical regulations and guidelines, 
                  and participate in quarterly partner reviews to ensure continuous improvement of our shared service quality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 border border-primary/20 rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Partner Network?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start your journey with Nuvivo today and transform your practice with our comprehensive healthcare solutions.
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
              Back to Overview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}