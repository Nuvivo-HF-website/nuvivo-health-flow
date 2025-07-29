import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, AlertTriangle, CheckCircle2, Beaker, Heart, Shield, Activity } from "lucide-react";
import { BloodTest } from "@/pages/BloodTestBooking";

const mockBloodTests: BloodTest[] = [
  // Essential Health Checks
  {
    id: "1",
    name: "Full Blood Count (FBC)",
    description: "Complete analysis of blood cells including red blood cells, white blood cells, and platelets",
    price: 25,
    preparationTime: "No preparation needed",
    fastingRequired: false,
    resultsTime: "24-48 hours",
    category: "essential"
  },
  {
    id: "2",
    name: "Lipid Profile",
    description: "Cholesterol and triglyceride levels to assess cardiovascular risk",
    price: 35,
    preparationTime: "12 hours fasting required",
    fastingRequired: true,
    resultsTime: "24-48 hours",
    category: "essential"
  },
  {
    id: "3",
    name: "HbA1c (Diabetes Check)",
    description: "3-month average blood sugar levels for diabetes monitoring",
    price: 30,
    preparationTime: "No preparation needed",
    fastingRequired: false,
    resultsTime: "24-48 hours",
    category: "essential"
  },
  
  // Comprehensive Panels
  {
    id: "4",
    name: "Complete Health MOT",
    description: "Comprehensive health check including FBC, lipids, liver, kidney, thyroid, diabetes, and vitamins",
    price: 149,
    preparationTime: "12 hours fasting required",
    fastingRequired: true,
    resultsTime: "3-5 days",
    category: "comprehensive"
  },
  {
    id: "5",
    name: "Executive Health Panel",
    description: "Premium health screening with 40+ markers including advanced cardiac and cancer markers",
    price: 299,
    preparationTime: "12 hours fasting required",
    fastingRequired: true,
    resultsTime: "5-7 days",
    category: "comprehensive"
  },
  
  // Specialized Tests
  {
    id: "6",
    name: "Thyroid Function (TSH, T3, T4)",
    description: "Complete thyroid assessment for metabolism and hormone balance",
    price: 45,
    preparationTime: "No preparation needed",
    fastingRequired: false,
    resultsTime: "24-48 hours",
    category: "specialized"
  },
  {
    id: "7",
    name: "Vitamin D Test",
    description: "Essential vitamin for bone health and immune function",
    price: 28,
    preparationTime: "No preparation needed",
    fastingRequired: false,
    resultsTime: "24-48 hours",
    category: "specialized"
  },
  {
    id: "8",
    name: "Iron Studies",
    description: "Complete iron assessment including ferritin, transferrin, and iron binding capacity",
    price: 40,
    preparationTime: "No preparation needed",
    fastingRequired: false,
    resultsTime: "24-48 hours",
    category: "specialized"
  },
  
  // Hormones
  {
    id: "9",
    name: "Testosterone (Total & Free)",
    description: "Male hormone levels for energy, muscle mass, and reproductive health",
    price: 55,
    preparationTime: "Morning sample preferred",
    fastingRequired: false,
    resultsTime: "3-5 days",
    category: "hormones"
  },
  {
    id: "10",
    name: "Female Hormone Panel",
    description: "Comprehensive female hormones including FSH, LH, oestradiol, and progesterone",
    price: 75,
    preparationTime: "Specific cycle day may be required",
    fastingRequired: false,
    resultsTime: "3-5 days",
    category: "hormones"
  }
];

const categories = [
  { id: "all", name: "All Tests", icon: Beaker, count: mockBloodTests.length },
  { id: "essential", name: "Essential", icon: Heart, count: mockBloodTests.filter(t => t.category === "essential").length },
  { id: "comprehensive", name: "Full Health MOTs", icon: Shield, count: mockBloodTests.filter(t => t.category === "comprehensive").length },
  { id: "specialized", name: "Specialized", icon: Activity, count: mockBloodTests.filter(t => t.category === "specialized").length },
  { id: "hormones", name: "Hormones", icon: Activity, count: mockBloodTests.filter(t => t.category === "hormones").length },
];

interface BloodTestSelectionProps {
  onTestsSelect: (tests: BloodTest[]) => void;
}

export function BloodTestSelection({ onTestsSelect }: BloodTestSelectionProps) {
  const [selectedTests, setSelectedTests] = useState<BloodTest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTests = mockBloodTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTestToggle = (test: BloodTest) => {
    setSelectedTests(prev => {
      const isSelected = prev.find(t => t.id === test.id);
      if (isSelected) {
        return prev.filter(t => t.id !== test.id);
      } else {
        return [...prev, test];
      }
    });
  };

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const requiresFasting = selectedTests.some(test => test.fastingRequired);

  const handleContinue = () => {
    if (selectedTests.length > 0) {
      onTestsSelect(selectedTests);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search blood tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
                <Badge variant="secondary" className="ml-1">{category.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Test Selection */}
        <div className="lg:col-span-2">
          <div className="grid gap-4">
            {filteredTests.map((test) => {
              const isSelected = selectedTests.find(t => t.id === test.id);
              return (
                <Card 
                  key={test.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleTestToggle(test)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        checked={!!isSelected}
                        onChange={() => handleTestToggle(test)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{test.name}</h3>
                          <span className="text-lg font-bold text-primary">£{test.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                        
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{test.resultsTime}</span>
                          </Badge>
                          
                          {test.fastingRequired ? (
                            <Badge variant="destructive" className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Fasting Required</span>
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>No Fasting</span>
                            </Badge>
                          )}
                          
                          <Badge variant="outline">{test.preparationTime}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Beaker className="w-5 h-5" />
                <span>Your Tests</span>
                <Badge>{selectedTests.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Select tests to continue
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {selectedTests.map((test) => (
                      <div key={test.id} className="flex justify-between items-center text-sm">
                        <span className="flex-1 truncate">{test.name}</span>
                        <span className="font-medium">£{test.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total:</span>
                      <span className="text-lg text-primary">£{totalPrice}</span>
                    </div>
                  </div>

                  {requiresFasting && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-orange-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Fasting Required</span>
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        Some of your selected tests require 12 hours fasting
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={handleContinue}
                    className="w-full"
                    size="lg"
                  >
                    Continue to Location ({selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}