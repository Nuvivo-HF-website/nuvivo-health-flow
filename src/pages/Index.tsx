import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import MedicalQuiz from "@/components/MedicalQuiz";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
      
      {/* AI Report Generation CTA */}
      <section className="py-20 bg-gradient-warm">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-inter font-normal text-black mb-6">
            Already Have Results?
          </h2>
          <p className="text-xl text-black/80 mb-12 max-w-2xl mx-auto font-inter">
            Upload your existing blood test results and get AI-powered analysis from the world's most advanced health platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/upload-results')}
            className="text-lg px-12 py-4 font-inter"
          >
            Generate Your AI Report
          </Button>
        </div>
      </section>

      <MedicalQuiz />
      
      <CTASection 
        title="Ready to Take Control of Your Health?"
        subtitle="Discover trusted doctors, clinics, and tests in minutes – all in one place. Book appointments, get answers, and start feeling better, faster."
        primaryButtonText="Book Your Test Now"
        primaryButtonLink="/booking"
        secondaryButtonText="Find Nearest Clinic"
        secondaryButtonLink="/clinic-finder"
        features={["Same-day appointments", "24-48 hour results", "World-class specialists"]}
        variant="primary"
      />

      <Footer />
    </div>
  );
};

export default Index;
