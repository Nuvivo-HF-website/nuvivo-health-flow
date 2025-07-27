import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  features?: string[];
  variant?: "primary" | "secondary";
}

const CTASection = ({
  title = "Join the World's Leading Health Platform",
  subtitle = "Connect with millions worldwide who trust the most advanced health ecosystem on Earth",
  primaryButtonText = "Start Your Journey",
  primaryButtonLink = "/booking",
  secondaryButtonText = "Explore Platform",
  secondaryButtonLink = "/clinic-finder",
  features = ["Global Network", "24/7 Support", "World-Class Experts"],
  variant = "primary"
}: CTASectionProps) => {
  const navigate = useNavigate();

  const bgClass = variant === "primary" 
    ? "bg-primary text-primary-foreground" 
    : "bg-gradient-primary";

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-playfair font-normal mb-6">
          {title}
        </h2>
        <p className={`text-xl mb-12 max-w-2xl mx-auto font-inter ${
          variant === "primary" ? "text-primary-foreground/90" : "text-muted-foreground"
        }`}>
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Button 
            size="lg" 
            variant={variant === "primary" ? "secondary" : "default"}
            onClick={() => navigate(primaryButtonLink)}
            className="min-w-[200px] font-inter text-lg px-12 py-4"
          >
            {primaryButtonText}
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate(secondaryButtonLink)}
            className={`min-w-[200px] font-inter text-lg px-12 py-4 ${
              variant === "primary" 
                ? "border-white text-white hover:bg-white hover:text-primary" 
                : ""
            }`}
          >
            {secondaryButtonText}
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 pt-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className={`w-5 h-5 ${
                variant === "primary" ? "text-primary-foreground" : "text-success"
              }`} />
              <span className={`text-sm font-inter ${
                variant === "primary" ? "text-primary-foreground/90" : "text-muted-foreground"
              }`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;