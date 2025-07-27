import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import MedicalQuiz from "@/components/MedicalQuiz";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <Hero />
      <Services />
      <div className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Already Have Results?</h2>
          <p className="text-muted-foreground mb-8">Upload your existing blood test results and get an AI-powered analysis and personalized health insights.</p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/upload-results'}
            className="bg-primary hover:bg-primary/90"
          >
            Generate Your Report
          </Button>
        </div>
      </div>
      <MedicalQuiz />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
