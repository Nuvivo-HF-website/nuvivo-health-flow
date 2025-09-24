import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, BookOpen, Shield, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MedicalCertification = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              Medical Professional Certification
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Ensuring the highest standards of medical excellence and professional competence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">GMC Registered</h3>
                <p className="text-sm text-muted-foreground">All doctors verified with General Medical Council</p>
              </Card>
              <Card className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Continuous Learning</h3>
                <p className="text-sm text-muted-foreground">Mandatory CPD and professional development</p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Indemnity Cover</h3>
                <p className="text-sm text-muted-foreground">Full professional liability insurance</p>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Medical Professional Standards</h2>
              
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    General Medical Council (GMC) Registration
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-3">Registration Requirements</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Full GMC registration with license to practice</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Specialist registration (where applicable)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Good standing with no fitness to practice issues</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Annual verification and revalidation</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-3">Verification Process</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Direct GMC database verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Professional reference checks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Enhanced DBS clearance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Ongoing monitoring of professional status</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Continuing Professional Development (CPD)
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-800 mb-2">Annual Requirements</h4>
                        <ul className="text-sm space-y-1 text-purple-700">
                          <li>• Minimum 50 CPD credits per year</li>
                          <li>• Evidence-based learning activities</li>
                          <li>• Reflection on practice improvement</li>
                          <li>• Peer review and feedback sessions</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Learning Categories</h4>
                        <ul className="text-sm space-y-1 text-blue-700">
                          <li>• Clinical knowledge updates</li>
                          <li>• Patient safety and quality improvement</li>
                          <li>• Communication skills development</li>
                          <li>• Technology and digital health training</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Specialist Qualifications</h2>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-200 p-3 text-left">Specialty</th>
                        <th className="border border-gray-200 p-3 text-left">Required Qualification</th>
                        <th className="border border-gray-200 p-3 text-left">Training Duration</th>
                        <th className="border border-gray-200 p-3 text-left">Additional Requirements</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 p-3">General Practice</td>
                        <td className="border border-gray-200 p-3">MRCGP / FRACGP</td>
                        <td className="border border-gray-200 p-3">3 years</td>
                        <td className="border border-gray-200 p-3">GP trainer qualification preferred</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Cardiology</td>
                        <td className="border border-gray-200 p-3">MRCP + Specialist training</td>
                        <td className="border border-gray-200 p-3">6+ years</td>
                        <td className="border border-gray-200 p-3">Echocardiography certification</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Dermatology</td>
                        <td className="border border-gray-200 p-3">MRCP(Derm) / CCT</td>
                        <td className="border border-gray-200 p-3">5+ years</td>
                        <td className="border border-gray-200 p-3">Dermoscopy certification</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Mental Health</td>
                        <td className="border border-gray-200 p-3">MRCPsych / CCT</td>
                        <td className="border border-gray-200 p-3">6+ years</td>
                        <td className="border border-gray-200 p-3">Section 12 approval (where applicable)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Quality Assurance Framework</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Performance Monitoring
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Patient satisfaction scores</li>
                    <li>• Clinical outcome tracking</li>
                    <li>• Consultation quality reviews</li>
                    <li>• Peer assessment programs</li>
                    <li>• Regular audit participation</li>
                    <li>• Incident reporting compliance</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Professional Standards
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• GMC Good Medical Practice adherence</li>
                    <li>• Patient confidentiality protocols</li>
                    <li>• Informed consent procedures</li>
                    <li>• Clinical governance participation</li>
                    <li>• Risk management awareness</li>
                    <li>• Ethical practice guidelines</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Professional Indemnity & Insurance</h2>
              <div className="space-y-4">
                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Insurance Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Medical Defense Organizations</h4>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Medical Defence Union (MDU)</li>
                        <li>• Medical Protection Society (MPS)</li>
                        <li>• Doctors' Defence Service (DDS)</li>
                        <li>• MDDUS (Scotland)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Coverage Requirements</h4>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Minimum £6 million coverage</li>
                        <li>• Run-off cover provision</li>
                        <li>• Telemedicine inclusion</li>
                        <li>• Second opinion coverage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Technology Competency Requirements</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2 text-blue-600">Digital Health Skills</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Electronic health records</li>
                    <li>• Telemedicine platforms</li>
                    <li>• Digital prescribing systems</li>
                    <li>• Clinical decision support tools</li>
                  </ul>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2 text-purple-600">AI & Analytics</h4>
                  <ul className="text-sm space-y-1">
                    <li>• AI-assisted diagnostics understanding</li>
                    <li>• Data interpretation skills</li>
                    <li>• Machine learning basics</li>
                    <li>• Clinical decision integration</li>
                  </ul>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-2 text-orange-600">Cybersecurity Awareness</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Data protection protocols</li>
                    <li>• Secure communication practices</li>
                    <li>• Privacy compliance</li>
                    <li>• Incident reporting procedures</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Revalidation & Ongoing Assessment</h2>
              <div className="p-6 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <h3 className="font-medium mb-3">5-Year Revalidation Cycle</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Portfolio Requirements</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• 250 CPD credits over 5 years</li>
                      <li>• Quality improvement activities</li>
                      <li>• Significant event analysis</li>
                      <li>• Patient and colleague feedback</li>
                      <li>• Reflective practice evidence</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Assessment Process</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Annual appraisal meetings</li>
                      <li>• Portfolio review by appraiser</li>
                      <li>• GMC recommendation process</li>
                      <li>• Continuous monitoring system</li>
                      <li>• Enhanced support where needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact & Verification</h2>
              <div className="p-6 bg-muted rounded-lg">
                <p className="mb-4">To verify our medical professionals' credentials or for certification enquiries:</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Medical Director</strong>
                    <p>medical.director@healthplatform.co.uk</p>
                    <p>GMC Responsible Officer</p>
                  </div>
                  <div>
                    <strong>Professional Standards Team</strong>
                    <p>standards@healthplatform.co.uk</p>
                    <p>Certification verification available</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  All medical professional credentials are publicly verifiable through the GMC website and relevant specialist college databases.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MedicalCertification;