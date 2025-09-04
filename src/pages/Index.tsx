import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
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
      
      <CTASection
        title="Ready to Join the Health Revolution?"
        subtitle="Experience the world's most powerful health platform trusted by millions globally"
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
