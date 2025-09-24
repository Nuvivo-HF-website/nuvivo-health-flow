import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <CardDescription className="text-center text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, date of birth, and contact information</li>
                  <li>NHS number and medical identifiers</li>
                  <li>Medical history and health records</li>
                  <li>Test results and diagnostic information</li>
                  <li>Prescription and medication data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing medical testing and diagnostic services</li>
                <li>Processing test results and generating reports</li>
                <li>Communicating with healthcare providers</li>
                <li>Improving our services through AI-powered insights (with consent)</li>
                <li>Ensuring patient safety and quality of care</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your healthcare providers and specialists</li>
                <li>Laboratory partners for test processing</li>
                <li>Regulatory bodies as required by law</li>
                <li>Emergency services when medically necessary</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                We never sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="mb-4">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure cloud storage with regular backups</li>
                <li>Role-based access controls</li>
                <li>Regular security audits and penetration testing</li>
                <li>GDPR-compliant data handling procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="mb-4">Under GDPR and UK data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. AI Processing</h2>
              <p className="mb-4">
                We use AI technology to enhance our diagnostic capabilities. This processing:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Requires explicit consent</li>
                <li>Uses anonymized data only</li>
                <li>Operates within EU data centers</li>
                <li>Never stores personal identifiers externally</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p>We retain medical data for 7 years as required by medical regulations. You can request earlier deletion in certain circumstances.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p>For privacy-related questions, contact our Data Protection Officer:</p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p><strong>Email:</strong> privacy@healthplatform.co.uk</p>
                <p><strong>Address:</strong> Data Protection Officer, Health Platform Ltd, London, UK</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;