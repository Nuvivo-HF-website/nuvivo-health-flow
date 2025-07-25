import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Heart, Target, Star } from "lucide-react";

const SponsoredAthletes = () => {
  const athletes = [
    {
      name: "Emma Thompson",
      sport: "Marathon Running",
      achievement: "Olympic Qualifier 2024",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
      quote: "Regular health monitoring through Nuvivo helps me maintain peak performance and stay injury-free.",
      tests: ["Sports Performance Panel", "Iron Studies", "Vitamin D"],
      verified: true
    },
    {
      name: "James Mitchell",
      sport: "Professional Cycling",
      achievement: "Tour de France Competitor",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=face",
      quote: "The detailed blood analysis helps me optimise my training and recovery like never before.",
      tests: ["Endurance Athlete Panel", "Lactate Threshold", "Hormones"],
      verified: true
    },
    {
      name: "Sarah Williams",
      sport: "Professional Tennis",
      achievement: "Wimbledon Quarter-Finalist",
      image: "https://images.unsplash.com/photo-1594736797933-d0dfdb6c0100?w=400&h=400&fit=crop&crop=face",
      quote: "Nuvivo's comprehensive testing gives me the confidence to push my limits safely.",
      tests: ["Complete Health Check", "Stress Hormones", "Nutrition Panel"],
      verified: true
    },
    {
      name: "Marcus Chen",
      sport: "Triathlon",
      achievement: "Ironman World Championship",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
      quote: "The precision of Nuvivo's testing helps me fine-tune every aspect of my performance.",
      tests: ["Endurance Panel", "Recovery Markers", "Metabolic Health"],
      verified: true
    }
  ];

  const partnerships = [
    {
      title: "Performance Optimisation",
      description: "Advanced biomarker analysis for peak athletic performance",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Injury Prevention",
      description: "Early detection of health markers that could lead to injury",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Recovery Monitoring",
      description: "Track recovery metrics and training adaptations",
      icon: <Trophy className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              Elite Athletes Trust Nuvivo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how world-class athletes use our precision blood testing to achieve peak performance 
              and maintain optimal health throughout their careers.
            </p>
          </div>

          {/* Partnership Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {partnerships.map((partnership, index) => (
              <Card key={index} className="text-center border-primary/20">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      {partnership.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{partnership.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {partnership.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Athletes Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {athletes.map((athlete, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={athlete.image}
                          alt={athlete.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        {athlete.verified && (
                          <div className="absolute -top-1 -right-1 bg-primary p-1 rounded-full">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{athlete.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{athlete.sport}</Badge>
                          <Badge variant="secondary">{athlete.achievement}</Badge>
                        </div>
                      </div>
                      
                      <blockquote className="text-sm text-muted-foreground italic">
                        "{athlete.quote}"
                      </blockquote>
                      
                      <div>
                        <p className="text-xs font-medium mb-1">Regular Testing:</p>
                        <div className="flex flex-wrap gap-1">
                          {athlete.tests.map((test, testIndex) => (
                            <Badge key={testIndex} variant="outline" className="text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Optimise Your Performance?
              </h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Join elite athletes in using precision blood testing to unlock your potential. 
                Whether you're a weekend warrior or professional competitor, we have the tests you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.location.href = "/blood-tests"}
                >
                  Explore Sports Testing
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => window.location.href = "/booking"}
                >
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SponsoredAthletes;