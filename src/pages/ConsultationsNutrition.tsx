import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Scale, Target } from "lucide-react";

const ConsultationsNutrition = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Nutrition & Weight Management</h1>
            <p className="text-xl text-muted-foreground">
              Expert nutritional guidance and weight management support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Apple className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Nutritionist Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Personalized nutrition plans and dietary guidance
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£85 per consultation</p>
                  <p className="text-sm text-muted-foreground">45 minutes</p>
                </div>
                <Button className="w-full">Book Consultation</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Scale className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Weight Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive weight loss and management programs
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £150 per month</p>
                  <p className="text-sm text-muted-foreground">Ongoing support</p>
                </div>
                <Button className="w-full">Start Program</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Sports Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Specialized nutrition for athletes and fitness enthusiasts
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£95 per consultation</p>
                  <p className="text-sm text-muted-foreground">60 minutes</p>
                </div>
                <Button className="w-full">Book Session</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConsultationsNutrition;