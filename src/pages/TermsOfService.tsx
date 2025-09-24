import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <CardDescription className="text-center text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using our medical testing platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Medical Services</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">2.1 Service Scope</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Blood testing and diagnostic services</li>
                  <li>Medical consultations and telemedicine</li>
                  <li>Health monitoring and reporting</li>
                  <li>AI-powered health insights (with consent)</li>
                </ul>
                
                <h3 className="text-xl font-medium">2.2 Limitations</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our services are not intended for emergency medical situations</li>
                  <li>Results do not replace professional medical advice</li>
                  <li>AI insights are supplementary tools, not diagnostic replacements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete health information</li>
                <li>Follow pre-test preparation instructions</li>
                <li>Inform us of any medical conditions that may affect testing</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized account access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Professional Qualifications</h2>
              <p className="mb-4">All medical professionals on our platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are registered with the General Medical Council (GMC)</li>
                <li>Hold appropriate medical insurance</li>
                <li>Undergo regular competency assessments</li>
                <li>Follow GMC guidelines and professional standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is required before service delivery</li>
                <li>Prices include all applicable taxes</li>
                <li>Refunds are subject to our cancellation policy</li>
                <li>Additional charges may apply for expedited services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cancellation and Refunds</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Cancellation Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Appointments can be cancelled up to 24 hours before scheduled time</li>
                  <li>Test kits can be cancelled before dispatch</li>
                  <li>Emergency cancellations will be considered on a case-by-case basis</li>
                </ul>
                
                <h3 className="text-xl font-medium">Refund Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full refund for services not yet delivered</li>
                  <li>Partial refund may apply for cancelled consultations</li>
                  <li>No refund for completed tests or consultations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Liability and Disclaimers</h2>
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <p className="font-medium text-amber-800">Important Medical Disclaimer:</p>
                <p className="text-amber-700">
                  Our services are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. 
                  Always consult with qualified healthcare professionals for medical decisions.
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are not liable for decisions made based on test results</li>
                <li>Results accuracy depends on sample quality and collection method</li>
                <li>Technical issues may occasionally affect service delivery</li>
                <li>Force majeure events may impact service availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Protection and Privacy</h2>
              <p>
                Your privacy is paramount. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your personal and medical data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All platform content is protected by copyright</li>
                <li>AI algorithms and diagnostic tools are proprietary</li>
                <li>Users retain ownership of their personal health data</li>
                <li>Platform usage does not grant rights to our intellectual property</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p>
                These terms are governed by the laws of England and Wales. Any disputes will be resolved through the UK court system.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p><strong>Legal Enquiries:</strong> legal@healthplatform.co.uk</p>
                <p><strong>Customer Support:</strong> support@healthplatform.co.uk</p>
                <p><strong>Address:</strong> Health Platform Ltd, London, UK</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;