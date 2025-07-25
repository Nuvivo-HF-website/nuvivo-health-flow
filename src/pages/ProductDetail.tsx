import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, Calendar, Clock, TestTube2, CheckCircle, AlertTriangle, 
  Users, Heart, Zap, Brain, Shield, Star, Info, Droplets, Building2, Home, MapPin, ChevronDown, ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTestById, type BloodTest } from "@/data/bloodTests";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>("clinic");
  const [expandedBiomarkers, setExpandedBiomarkers] = useState<number[]>([]);
  
  const test = id ? getTestById(id) : undefined;

  const toggleBiomarker = (index: number) => {
    setExpandedBiomarkers(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Test Not Found</h1>
            <p className="text-muted-foreground mb-6">The blood test you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/blood-tests")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "General Health": return <Heart className="w-5 h-5" />;
      case "Performance & Sports": return <Zap className="w-5 h-5" />;
      case "Hormones & Fertility": return <Users className="w-5 h-5" />;
      case "Heart Health": return <Heart className="w-5 h-5" />;
      case "Sleep & Fatigue": return <Brain className="w-5 h-5" />;
      case "Cancer Screening": return <Shield className="w-5 h-5" />;
      case "Specialty Testing": return <TestTube2 className="w-5 h-5" />;
      default: return <TestTube2 className="w-5 h-5" />;
    }
  };

  const getSelectedOption = () => {
    return test?.options.find(option => option.type === selectedOption);
  };

  const getOptionIcon = (type: string) => {
    switch (type) {
      case 'clinic': return <Building2 className="w-4 h-4" />;
      case 'partner': return <MapPin className="w-4 h-4" />;
      case 'home': return <Home className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const handleBooking = () => {
    const option = getSelectedOption();
    toast({
      title: "Booking initiated",
      description: `Adding ${test.name} (${option?.name}) to your appointment booking`,
    });
    navigate(`/booking?test=${test.id}&option=${selectedOption}`);
  };

  const addToBasket = () => {
    const option = getSelectedOption();
    toast({
      title: "Added to basket",
      description: `${test.name} (${option?.name}) has been added to your basket`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/blood-tests")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blood Tests
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getCategoryIcon(test.category)}
                      <Badge variant="secondary" className="text-sm">
                        {test.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold mb-3">{test.name}</CardTitle>
                    <CardDescription className="text-lg leading-relaxed">
                      {test.description}
                    </CardDescription>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-primary">from £{test.basePrice}</div>
                    <div className="text-muted-foreground">{test.duration} appointment</div>
                    <div className="text-sm text-muted-foreground">3 options available</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Key Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Test Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{test.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Results:</span>
                    <span className="font-medium">{test.turnaroundTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fasting:</span>
                    <span className={`font-medium ${test.fastingRequired ? 'text-orange-600' : 'text-green-600'}`}>
                      {test.fastingRequired ? 'Required (12 hours)' : 'Not required'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biomarkers:</span>
                    <span className="font-medium">{test.biomarkers.length} markers tested</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {test.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Fasting Alert */}
            {test.fastingRequired && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Fasting Required:</strong> Please fast for 12 hours before your blood draw (water is allowed). 
                  Schedule your appointment for morning hours for convenience.
                </AlertDescription>
              </Alert>
            )}

            {/* Interactive Biomarkers Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-red-500" />
                  Comprehensive Biomarker Analysis ({test.biomarkers.length} markers)
                </CardTitle>
                <CardDescription>
                  Click on any biomarker below to view detailed information, normal ranges, and clinical significance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {test.biomarkers.map((biomarkerName, index) => {
                    // Find detailed info for this biomarker
                    const detailedBiomarker = test.biomarkerDetails.find(
                      detail => detail.name.toLowerCase().includes(biomarkerName.toLowerCase()) || 
                                biomarkerName.toLowerCase().includes(detail.name.toLowerCase())
                    );
                    
                    return (
                      <Collapsible key={index} open={expandedBiomarkers.includes(index)} onOpenChange={() => toggleBiomarker(index)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between p-4 h-auto hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <TestTube2 className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-left">
                                {detailedBiomarker ? detailedBiomarker.name : biomarkerName}
                              </span>
                            </div>
                            {expandedBiomarkers.includes(index) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <div className="border-l-4 border-primary/20 pl-4 py-3 bg-secondary/20 rounded-r-lg">
                            <p className="text-muted-foreground mb-3 leading-relaxed">
                              {detailedBiomarker?.description || 
                               `${biomarkerName} analysis provides important insights into your health status and overall wellbeing.`}
                            </p>
                            
                            <div className="p-3 bg-secondary/30 border border-border rounded">
                              <p className="text-sm text-foreground">
                                {detailedBiomarker?.significance || 
                                 `This biomarker helps assess your current health status and identify potential areas for optimization.`}
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </CardContent>
            </Card>


            {/* Suitable For Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Who Should Take This Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {test.suitableFor.map((indication, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{indication}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Sample Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    Blood sample collected via simple venipuncture by trained phlebotomists. 
                    The procedure takes just a few minutes and is generally well tolerated.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Results Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Results are reviewed by qualified doctors and delivered securely through your 
                    patient portal with detailed explanations and personalized recommendations.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    All tests are processed in accredited laboratories following strict quality 
                    control measures and international standards.
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">HIS Registered</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-600">ACAS Accredited</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Choose Your Option</CardTitle>
                <CardDescription>Select how you'd like to take your test</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Pricing Options */}
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {test.options.map((option) => (
                    <div key={option.type} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value={option.type} id={option.type} />
                      <Label 
                        htmlFor={option.type} 
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getOptionIcon(option.type)}
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">£{option.price}</div>
                            {option.additionalCost > 0 && (
                              <div className="text-xs text-muted-foreground">+£{option.additionalCost}</div>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Separator />

                {/* Selected Option Summary */}
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Selected:</span>
                    <span className="text-lg font-bold text-primary">£{getSelectedOption()?.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {getSelectedOption()?.name}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleBooking} className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now - £{getSelectedOption()?.price}
                  </Button>
                  <Button variant="outline" onClick={addToBasket} className="w-full">
                    Add to Basket
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Fast {test.turnaroundTime} results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Doctor-reviewed analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure online results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Personalized insights</span>
                  </div>
                </div>

                <Separator />

                {/* Certification Badges */}
                <div className="flex justify-center gap-3">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">HIS Registered</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">ACAS Accredited</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-secondary/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 text-sm">Need Help Choosing?</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Not sure if this test is right for you? Our health experts can help.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Expert Advice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;