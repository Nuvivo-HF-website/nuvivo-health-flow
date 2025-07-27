import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, Shield, Eye, Brain } from "lucide-react";

const ScansCancer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Cancer Screening Scans</h1>
            <p className="text-xl text-muted-foreground">
              Early detection cancer screening with advanced imaging technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Scan className="w-12 h-12 text-primary mb-4" />
                <CardTitle>CT Cancer Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive CT scan for early cancer detection
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£450</p>
                  <p className="text-sm text-muted-foreground">45 minutes</p>
                </div>
                <Button className="w-full">Book Scan</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Eye className="w-12 h-12 text-primary mb-4" />
                <CardTitle>MRI Full Body</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Advanced MRI screening for comprehensive cancer detection
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£795</p>
                  <p className="text-sm text-muted-foreground">60 minutes</p>
                </div>
                <Button className="w-full">Book MRI</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="w-12 h-12 text-primary mb-4" />
                <CardTitle>PET-CT Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Advanced metabolic imaging for cancer detection
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£1,250</p>
                  <p className="text-sm text-muted-foreground">2 hours</p>
                </div>
                <Button className="w-full">Book PET-CT</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Cancer Prevention Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete cancer screening package with blood tests
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£650</p>
                  <p className="text-sm text-muted-foreground">Half day</p>
                </div>
                <Button className="w-full">Book Package</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScansCancer;