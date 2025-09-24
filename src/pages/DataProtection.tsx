import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Database, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DataProtection = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Data Protection Framework
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Comprehensive data security measures protecting your medical information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4 text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Encryption</h3>
                <p className="text-sm text-muted-foreground">AES-256 encryption at rest and in transit</p>
              </Card>
              <Card className="p-4 text-center">
                <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Access Control</h3>
                <p className="text-sm text-muted-foreground">Role-based permissions and audit logs</p>
              </Card>
              <Card className="p-4 text-center">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Data Residency</h3>
                <p className="text-sm text-muted-foreground">EU-only data processing and storage</p>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Technical Security Measures</h2>
              
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    Encryption Standards
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Data at Rest</h4>
                      <ul className="text-sm space-y-1">
                        <li>• AES-256 database encryption</li>
                        <li>• Encrypted file storage</li>
                        <li>• Secure key management (HSM)</li>
                        <li>• Regular key rotation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Data in Transit</h4>
                      <ul className="text-sm space-y-1">
                        <li>• TLS 1.3 for all communications</li>
                        <li>• Certificate pinning</li>
                        <li>• API endpoint encryption</li>
                        <li>• Secure file transfers</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Access Control Systems
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Authentication</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Multi-factor authentication (MFA)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Strong password policies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Session timeout controls</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Device verification</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Authorization</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Role-based access control (RBAC)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Principle of least privilege</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Regular access reviews</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Automated deprovisioning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Classification & Handling</h2>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-red-500 bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">Critical</Badge>
                    <span className="font-medium">Special Category Health Data</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Medical test results, diagnoses, treatment records. Requires highest level of protection with additional consent mechanisms.
                  </p>
                  <ul className="text-sm mt-2 space-y-1 text-red-600">
                    <li>• End-to-end encryption</li>
                    <li>• Restricted access (medical staff only)</li>
                    <li>• Enhanced audit logging</li>
                    <li>• Anonymization for AI processing</li>
                  </ul>
                </div>

                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-500">High</Badge>
                    <span className="font-medium">Personal Identifiable Information</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Names, addresses, NHS numbers, contact details. Protected with strong access controls and encryption.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500">Medium</Badge>
                    <span className="font-medium">Usage & Preference Data</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    System usage patterns, preferences, non-medical communications. Standard encryption and access controls.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Infrastructure Security</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">Cloud Security</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• ISO 27001 certified data centers</li>
                    <li>• SOC 2 Type II compliance</li>
                    <li>• 24/7 security monitoring</li>
                    <li>• Redundant backup systems</li>
                    <li>• DDoS protection</li>
                    <li>• Network segmentation</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">Application Security</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Regular security assessments</li>
                    <li>• Penetration testing</li>
                    <li>• Code security reviews</li>
                    <li>• Dependency vulnerability scans</li>
                    <li>• OWASP compliance</li>
                    <li>• Real-time threat detection</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Compliance & Certifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 text-green-700">Healthcare Standards</h3>
                  <ul className="text-sm space-y-1">
                    <li>• HL7 FHIR compliance</li>
                    <li>• NHS Digital standards</li>
                    <li>• Medical device regulations</li>
                    <li>• Clinical governance framework</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-700">Data Protection</h3>
                  <ul className="text-sm space-y-1">
                    <li>• GDPR Article 32 compliance</li>
                    <li>• UK Data Protection Act 2018</li>
                    <li>• ISO 27001 information security</li>
                    <li>• Cyber Essentials Plus</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Monitoring & Incident Response</h2>
              <div className="space-y-4">
                <div className="p-6 bg-muted rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Continuous Monitoring
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Real-time Alerts</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Unauthorized access attempts</li>
                        <li>• Data export activities</li>
                        <li>• System anomalies</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Audit Logging</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• All data access events</li>
                        <li>• User authentication logs</li>
                        <li>• System configuration changes</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Compliance Reporting</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Regular security reports</li>
                        <li>• Privacy impact assessments</li>
                        <li>• Incident documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="font-medium mb-3">Incident Response Procedure</h3>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong className="text-red-600">1. Detection</strong>
                      <p className="mt-1">Automated alerts and monitoring systems identify potential security incidents</p>
                    </div>
                    <div>
                      <strong className="text-orange-600">2. Assessment</strong>
                      <p className="mt-1">Security team evaluates impact and determines response level</p>
                    </div>
                    <div>
                      <strong className="text-blue-600">3. Containment</strong>
                      <p className="mt-1">Immediate actions to prevent further data exposure or system compromise</p>
                    </div>
                    <div>
                      <strong className="text-green-600">4. Recovery</strong>
                      <p className="mt-1">System restoration and notification to affected parties within 72 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Breach Notification</h2>
              <div className="p-6 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <p className="font-medium mb-2">Commitment to Transparency</p>
                <p className="text-sm mb-4">
                  In the unlikely event of a data breach affecting your personal information, we will:
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Notify the ICO within 72 hours of discovery</li>
                  <li>• Inform affected individuals without undue delay</li>
                  <li>• Provide clear information about the breach and our response</li>
                  <li>• Offer guidance on protective measures you can take</li>
                  <li>• Implement additional safeguards to prevent recurrence</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="p-6 bg-muted rounded-lg">
                <p className="mb-4">For data protection and security enquiries:</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Data Protection Officer</strong>
                    <p>dpo@healthplatform.co.uk</p>
                    <p>+44 (0) 20 7000 0000</p>
                  </div>
                  <div>
                    <strong>Security Team</strong>
                    <p>security@healthplatform.co.uk</p>
                    <p>24/7 Incident Hotline: +44 (0) 800 000 0000</p>
                  </div>
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

export default DataProtection;