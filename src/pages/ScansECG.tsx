import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Home, Clock, Shield } from "lucide-react";

const ScansECG = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Home ECG & Monitoring</h1>
            <p className="text-xl text-muted-foreground">
              Professional cardiac monitoring services in the comfort of your home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>12-Lead ECG</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive heart rhythm analysis at home
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£120</p>
                  <p className="text-sm text-muted-foreground">30 minutes</p>
                </div>
                <Button className="w-full">Book ECG</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Home className="w-12 h-12 text-primary mb-4" />
                <CardTitle>24hr Holter Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Continuous heart monitoring for 24 hours
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£195</p>
                  <p className="text-sm text-muted-foreground">24 hours</p>
                </div>
                <Button className="w-full">Book Monitor</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Blood Pressure Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  24-hour blood pressure monitoring service
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£85</p>
                  <p className="text-sm text-muted-foreground">24 hours</p>
                </div>
                <Button className="w-full">Book Service</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Cardiac Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete cardiac health evaluation
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£250</p>
                  <p className="text-sm text-muted-foreground">90 minutes</p>
                </div>
                <Button className="w-full">Book Assessment</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScansECG;