// Removed Shield import since we're using the proper logo image
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/d10bf310-8418-438d-af09-376e2c242db8.png"
                alt="Nuvivo Health Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-semibold">Nuvivo Health</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              The world's most advanced health platform - connecting millions to precision diagnostics, 
              world-class specialists, and breakthrough treatments through cutting-edge technology.
            </p>
            <div className="space-y-1 text-sm text-primary-foreground/80">
              <p>📍 8 Carmondean Centre Road, EH54 8PT, Livingston</p>
              <p>📞 0333 305 9916</p>
              <p>✉️ hello@nuvivo.co.uk</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate("/professional-registration")}
              className="mt-4"
            >
              Join as Professional
            </Button>
            <div className="text-xs text-primary-foreground/60">
              GDPR Compliant • ISO 27001 Certified
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><button onClick={() => navigate("/blood-tests")} className="hover:text-accent transition-colors text-left">Blood Tests</button></li>
              <li><button onClick={() => navigate("/treatments")} className="hover:text-accent transition-colors text-left">Treatments & Therapies</button></li>
              <li><button onClick={() => navigate("/consultations")} className="hover:text-accent transition-colors text-left">Consultations</button></li>
              <li><button onClick={() => navigate("/scans")} className="hover:text-accent transition-colors text-left">Scans & Imaging</button></li>
              <li><button onClick={() => navigate("/mobile/home-collection")} className="hover:text-accent transition-colors text-left">Mobile & On-site Services</button></li>
              <li><button onClick={() => navigate("/clinic-finder")} className="hover:text-accent transition-colors text-left">Find Clinic</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><button onClick={() => navigate("/")} className="hover:text-accent transition-colors text-left">How It Works</button></li>
              <li><button onClick={() => navigate("/faq")} className="hover:text-accent transition-colors text-left">FAQ</button></li>
              <li><button onClick={() => navigate("/clinic-finder")} className="hover:text-accent transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => navigate("/booking")} className="hover:text-accent transition-colors text-left">Book Appointment</button></li>
              <li><button onClick={() => navigate("/results/track")} className="hover:text-accent transition-colors text-left">Track Results</button></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><button onClick={() => navigate("/privacy")} className="hover:text-accent transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => navigate("/terms")} className="hover:text-accent transition-colors text-left">Terms of Service</button></li>
              <li><button onClick={() => navigate("/gdpr")} className="hover:text-accent transition-colors text-left">GDPR Compliance</button></li>
              <li><button onClick={() => navigate("/disclaimer")} className="hover:text-accent transition-colors text-left">Medical Disclaimer</button></li>
              <li><button onClick={() => navigate("/data-protection")} className="hover:text-accent transition-colors text-left">Data Protection</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-primary-foreground/60">
            © 2024 Nuvivo Health. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => navigate("/certifications")} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Medical Certification
            </button>
            <button onClick={() => navigate("/accreditation")} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Lab Accreditation
            </button>
            <button onClick={() => navigate("/quality")} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Quality Standards
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;