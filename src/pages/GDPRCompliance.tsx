import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Download, Trash2, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GDPRCompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              GDPR Compliance
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Your data protection rights under the General Data Protection Regulation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Data Protection by Design</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our platform is built with privacy as a core principle, implementing technical and organizational measures to protect your data.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Transparent Processing</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We provide clear information about what data we collect, why we process it, and who we share it with.
                </p>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights</h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Download className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-medium">Right of Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of all personal data we hold about you, including test results, medical records, and account information.
                    </p>
                  </div>
                  <Badge variant="secondary">Article 15</Badge>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Settings className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-medium">Right to Rectification</h3>
                    <p className="text-sm text-muted-foreground">
                      Correct any inaccurate or incomplete personal data we hold about you.
                    </p>
                  </div>
                  <Badge variant="secondary">Article 16</Badge>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Trash2 className="h-5 w-5 mt-1 text-primary" />
                  <div>
                    <h3 className="font-medium">Right to Erasure</h3>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your personal data (subject to medical record retention requirements).
                    </p>
                  </div>
                  <Badge variant="secondary">Article 17</Badge>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Legal Basis for Processing</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Healthcare Services (Article 9.2.h)</h3>
                  <p className="text-sm">
                    Processing of health data for the provision of healthcare services, including medical testing, diagnosis, and treatment.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Consent (Article 6.1.a)</h3>
                  <p className="text-sm">
                    AI-powered health insights, marketing communications, and research participation require explicit consent.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Legitimate Interest (Article 6.1.f)</h3>
                  <p className="text-sm">
                    Fraud prevention, security monitoring, and service improvement based on legitimate business interests.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Categories We Process</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-red-600 mb-2">Special Category Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Medical test results and reports</li>
                    <li>• Health conditions and symptoms</li>
                    <li>• Medication and treatment history</li>
                    <li>• Voice recordings (telemedicine)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-blue-600 mb-2">Personal Data</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Identity information (name, DOB)</li>
                    <li>• Contact details</li>
                    <li>• Payment information</li>
                    <li>• Usage and preference data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-200 p-3 text-left">Data Type</th>
                      <th className="border border-gray-200 p-3 text-left">Retention Period</th>
                      <th className="border border-gray-200 p-3 text-left">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-3">Medical Records</td>
                      <td className="border border-gray-200 p-3">7 years</td>
                      <td className="border border-gray-200 p-3">Medical regulations</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Account Information</td>
                      <td className="border border-gray-200 p-3">Until account deletion</td>
                      <td className="border border-gray-200 p-3">Service provision</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Audit Logs</td>
                      <td className="border border-gray-200 p-3">7 years</td>
                      <td className="border border-gray-200 p-3">Compliance requirements</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Marketing Consents</td>
                      <td className="border border-gray-200 p-3">Until withdrawn</td>
                      <td className="border border-gray-200 p-3">Consent management</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <p className="font-medium mb-2">EU Data Residency</p>
                <p className="text-sm">
                  All personal and health data is stored within the European Union. Any AI processing uses EU-based Azure OpenAI services with appropriate data processing agreements in place.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Security Measures</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• End-to-end encryption</li>
                  <li>• Role-based access controls</li>
                  <li>• Regular security audits</li>
                  <li>• Penetration testing</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• Multi-factor authentication</li>
                  <li>• Automated threat detection</li>
                  <li>• Secure data centers</li>
                  <li>• Staff security training</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Exercise Your Rights</h2>
              <div className="p-6 bg-primary/5 rounded-lg">
                <p className="mb-4">To exercise any of your data protection rights, contact our Data Protection Officer:</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> dpo@healthplatform.co.uk</p>
                  <p><strong>Response Time:</strong> Within 30 days</p>
                  <p><strong>Supervisory Authority:</strong> Information Commissioner's Office (ICO)</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default GDPRCompliance;