import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SponsoredAthletes from "@/components/SponsoredAthletes";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            About Nuvivo Health
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn more about our company, our mission, and the athletes we proudly sponsor and support.
          </p>
        </div>

        <SponsoredAthletes />
      </div>
      
      <Footer />
    </div>
  );
};

export default About;