import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle } from "lucide-react";

const ConsultationsSecondOpinions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Second Medical Opinions</h1>
            <p className="text-xl text-muted-foreground">
              Expert second opinions from leading specialists
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <FileText className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Medical Record Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive review of existing medical records and test results
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£250</p>
                  <p className="text-sm text-muted-foreground">5-7 working days</p>
                </div>
                <Button className="w-full">Request Review</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Urgent Second Opinion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Fast-track second opinion service for urgent medical decisions
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£450</p>
                  <p className="text-sm text-muted-foreground">48-72 hours</p>
                </div>
                <Button className="w-full">Request Urgent</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Treatment Plan Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Expert evaluation of proposed treatment plans and alternatives
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£350</p>
                  <p className="text-sm text-muted-foreground">3-5 working days</p>
                </div>
                <Button className="w-full">Get Opinion</Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-accent/5 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">Why Get a Second Opinion?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Peace of Mind</h4>
                <p className="text-muted-foreground">Confidence in your diagnosis and treatment plan</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Alternative Options</h4>
                <p className="text-muted-foreground">Discover different treatment approaches</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Expert Validation</h4>
                <p className="text-muted-foreground">Confirmation from leading specialists</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Better Outcomes</h4>
                <p className="text-muted-foreground">Potentially improved treatment results</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConsultationsSecondOpinions;