import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Search, Filter, Clock, TestTube2, Heart, Droplets, 
  Zap, Shield, Calendar, CheckCircle, Users, Star, Home, Building2, ClipboardCheck, ShoppingBasket
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { bloodTests, bloodTestCategories, getTestsByCategory, type BloodTest, type BloodTestOption } from "@/data/bloodTests";

const BloodTests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [basketTests, setBasketTests] = useState<Set<string>>(new Set());

  // Load basket from localStorage on component mount
  useEffect(() => {
    const savedBasket = localStorage.getItem('bloodTestBasket');
    if (savedBasket) {
      setBasketTests(new Set(JSON.parse(savedBasket)));
    }
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bloodTestBasket', JSON.stringify(Array.from(basketTests)));
  }, [basketTests]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "General Health": return <Heart className="w-4 h-4" />;
      case "Performance & Sports": return <Zap className="w-4 h-4" />;
      case "Hormones & Fertility": return <Users className="w-4 h-4" />;
      case "Heart Health": return <Heart className="w-4 h-4" />;
      case "Sleep & Fatigue": return <Droplets className="w-4 h-4" />;
      case "Cancer Screening": return <Shield className="w-4 h-4" />;
      case "Specialty Testing": return <TestTube2 className="w-4 h-4" />;
      default: return <TestTube2 className="w-4 h-4" />;
    }
  };

  const filteredTests = bloodTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.biomarkers.some(marker => marker.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTestSelection = (testId: string) => {
    const newSelected = new Set(selectedTests);
    if (newSelected.has(testId)) {
      newSelected.delete(testId);
    } else {
      newSelected.add(testId);
    }
    setSelectedTests(newSelected);
  };

  const getTotalPrice = () => {
    return Array.from(selectedTests).reduce((total, testId) => {
      const test = bloodTests.find(t => t.id === testId);
      return total + (test?.basePrice || 0);
    }, 0);
  };

  const getBasketTotalPrice = () => {
    return Array.from(basketTests).reduce((total, testId) => {
      const test = bloodTests.find(t => t.id === testId);
      return total + (test?.basePrice || 0);
    }, 0);
  };

  const addToBasket = () => {
    if (selectedTests.size === 0) {
      toast.error("Please select tests to add to basket");
      return;
    }

    const newBasketTests = new Set([...basketTests, ...selectedTests]);
    setBasketTests(newBasketTests);
    setSelectedTests(new Set()); // Clear selection after adding to basket
    
    toast.success(`Added ${selectedTests.size} test${selectedTests.size !== 1 ? 's' : ''} to basket`);
  };

  const removeFromBasket = (testId: string) => {
    const newBasketTests = new Set(basketTests);
    newBasketTests.delete(testId);
    setBasketTests(newBasketTests);
    toast.success("Removed test from basket");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Blood Test Marketplace</h1>
          <p className="text-muted-foreground text-lg">Choose from our comprehensive range of private blood tests</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tests, biomarkers, or conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
              className="rounded-full"
            >
              All Tests
            </Button>
            {bloodTestCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full gap-2"
              >
                {getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Test Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTests.map((test) => (
                <Card 
                  key={test.id} 
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    selectedTests.has(test.id) ? 'ring-2 ring-accent border-accent' : ''
                  }`}
                  onClick={(e) => {
                    // Check if click was on the card content area, not selection buttons
                    if ((e.target as HTMLElement).closest('button')) {
                      // If clicked on a button inside the card, don't toggle selection
                      return;
                    }
                    toggleTestSelection(test.id);
                  }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(test.category)}
                          <Badge variant="secondary" className="text-xs">
                            {test.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{test.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {test.description}
                        </CardDescription>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-lg font-bold text-accent">from £{test.basePrice}</div>
                        <div className="text-sm text-muted-foreground">{test.duration}</div>
                        <div className="text-xs text-muted-foreground">3 options available</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Key Biomarkers */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Key Biomarkers:</h4>
                      <div className="flex flex-wrap gap-1">
                        {test.biomarkers.slice(0, 4).map((marker, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {marker}
                          </Badge>
                        ))}
                        {test.biomarkers.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{test.biomarkers.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Includes:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {test.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Test Details */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.turnaroundTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {test.fastingRequired ? (
                          <span className="text-warning">Fasting required</span>
                        ) : (
                          <span className="text-success">No fasting</span>
                        )}
                      </div>
                    </div>

                    {/* Pricing Options Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium mb-2 text-sm">Pricing Options:</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>Livingston Clinic</span>
                          </div>
                          <span className="font-medium">£{test.basePrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>Partner Clinic</span>
                          </div>
                          <span>£{test.basePrice + 39}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            <span>Home Visit</span>
                          </div>
                          <span>£{test.basePrice + 59}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${test.id}`);
                        }}
                      >
                        View Details & Book
                      </Button>
                    </div>

                    {/* Selection indicator */}
                    {selectedTests.has(test.id) && (
                      <div className="flex items-center justify-center pt-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Health Symptom Assessment Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  Health Symptom Assessment
                </CardTitle>
                <CardDescription>
                  Get personalized test recommendations based on your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Answer a few questions about your health and we'll recommend the most relevant tests for you.
                </p>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/health-survey')}
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Test Package Card */}
            <Card className="sticky top-[28rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBasket className="w-5 h-5" />
                  Your Test Package
                </CardTitle>
                <CardDescription>
                  {basketTests.size} test{basketTests.size !== 1 ? 's' : ''} in basket
                  {selectedTests.size > 0 && ` | ${selectedTests.size} selected`}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {basketTests.size === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Your basket is empty. Select tests to add them.
                  </p>
                ) : (
                  <>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Basket Items:</h4>
                      <div className="space-y-2">
                        {Array.from(basketTests).map(testId => {
                          const test = bloodTests.find(t => t.id === testId);
                          return test ? (
                            <div key={testId} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                              <span className="flex-1">{test.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">£{test.basePrice}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromBasket(testId)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {selectedTests.size > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2 text-sm">Currently Selected:</h4>
                          <div className="space-y-1">
                            {Array.from(selectedTests).map(testId => {
                              const test = bloodTests.find(t => t.id === testId);
                              return test ? (
                                <div key={testId} className="flex items-center justify-between text-sm">
                                  <span className="flex-1">{test.name}</span>
                                  <span className="font-medium text-muted-foreground">£{test.basePrice}</span>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between font-semibold">
                      <span>Basket Total:</span>
                      <span className="text-lg text-accent">£{getBasketTotalPrice()}</span>
                    </div>

                    <div className="space-y-2">
                      {selectedTests.size > 0 && (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="sm"
                          onClick={addToBasket}
                        >
                          <ShoppingBasket className="w-4 h-4 mr-2" />
                          Add Selected to Basket
                        </Button>
                      )}
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => navigate('/booking')}
                        disabled={basketTests.size === 0}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3" />
                        <span>Doctor-reviewed results</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Fast, reliable service</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>Fully accredited labs</span>
                      </div>
                    </div>
                  </>
                )}

                {basketTests.size === 0 && selectedTests.size > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={addToBasket}
                  >
                    <ShoppingBasket className="w-4 h-4 mr-2" />
                    Add Selected to Basket
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-accent" />
                Fast Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get your results within 2-7 business days, depending on the test complexity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-accent" />
                Doctor Reviewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All results are reviewed by qualified doctors with personalised insights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TestTube2 className="w-5 h-5 text-accent" />
                Accredited Labs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tests processed in fully accredited laboratories with the highest standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BloodTests;