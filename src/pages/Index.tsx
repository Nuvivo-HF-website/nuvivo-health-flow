import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import MedicalQuiz from "@/components/MedicalQuiz";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <Hero />
      <HowItWorks />
      <Services />
      
      {/* Testimonials/Social Proof */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by 10,000+ Patients</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">★★★★★</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-muted-foreground">London</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Fast, professional service. Got my results in 24 hours with clear explanations from the doctor."</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">★★★★★</span>
                </div>
                <div>
                  <p className="font-semibold">Dr. James K.</p>
                  <p className="text-sm text-muted-foreground">Manchester</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Excellent platform for my private practice. Easy to manage patients and great commission structure."</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">★★★★★</span>
                </div>
                <div>
                  <p className="font-semibold">Michael R.</p>
                  <p className="text-sm text-muted-foreground">Birmingham</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Home collection service was perfect. No waiting rooms, professional phlebotomist."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Report CTA */}
      <div className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Already Have Results?</h2>
          <p className="text-muted-foreground mb-8">Upload your existing blood test results and get an AI-powered analysis and personalized health insights.</p>
          <Button 
            size="lg" 
            onClick={() => navigate('/upload-results')}
            className="bg-primary hover:bg-primary/90"
          >
            Generate Your Report
          </Button>
        </div>
      </div>

      <MedicalQuiz />
      
      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl opacity-90 mb-8">Join thousands who've already discovered the power of preventive healthcare</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/booking')}
              className="min-w-[200px]"
            >
              Book Your Test Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/clinic-finder')}
              className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary"
            >
              Find Nearest Clinic
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-4">✓ Same-day appointments available ✓ Results in 24-48 hours ✓ Doctor reviewed</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
