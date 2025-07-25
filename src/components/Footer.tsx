import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-semibold">Nuvivo Health</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Private, secure, and professional blood testing services 
              with doctor-reviewed results delivered to your home.
            </p>
            <div className="space-y-1 text-sm text-primary-foreground/80">
              <p>📍 8 Carmondean Centre Road, EH54 8PT, Livingston</p>
              <p>📞 0333 305 9916</p>
              <p>✉️ hello@nuvivo.co.uk</p>
            </div>
            <div className="text-xs text-primary-foreground/60">
              GDPR Compliant • ISO 27001 Certified
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-accent transition-colors">Essential Health</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Advanced Wellness</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Performance Plus</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Home Visits</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Clinic Locations</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-accent transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Book Appointment</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Track Results</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">GDPR Compliance</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Medical Disclaimer</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Data Protection</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-primary-foreground/60">
            © 2024 Nuvivo Health. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Medical Certification
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Lab Accreditation
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
              Quality Standards
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;