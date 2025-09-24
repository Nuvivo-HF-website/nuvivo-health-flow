import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Award, Shield, CheckCircle, Clock, Users, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LabAccreditation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <FlaskConical className="h-8 w-8 text-primary" />
              Laboratory Accreditation & Standards
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Ensuring accurate, reliable, and high-quality diagnostic testing through rigorous accreditation standards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4 text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">UKAS Accredited</h3>
                <p className="text-sm text-muted-foreground">ISO 15189 medical laboratory standards</p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">Comprehensive quality management systems</p>
              </Card>
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Expert Staff</h3>
                <p className="text-sm text-muted-foreground">Qualified biomedical scientists and pathologists</p>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Primary Accreditations</h2>
              
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Award className="h-6 w-6 text-blue-600" />
                    UKAS Accreditation (ISO 15189:2022)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-3">Accreditation Scope</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Clinical biochemistry</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Haematology and coagulation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Immunology and serology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Microbiology and virology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Molecular diagnostics</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-3">Quality Standards</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Competent personnel requirements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Equipment validation and maintenance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Pre-analytical sample handling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Post-analytical result verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Continuous improvement processes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-purple-600" />
                    Additional Certifications
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">ISO Certifications</h4>
                      <ul className="text-sm space-y-1 text-purple-700">
                        <li>• ISO 9001:2015 - Quality Management</li>
                        <li>• ISO 14001:2015 - Environmental Management</li>
                        <li>• ISO 45001:2018 - Health & Safety</li>
                        <li>• ISO 27001:2013 - Information Security</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Professional Bodies</h4>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Royal College of Pathologists (RCPath)</li>
                        <li>• Institute of Biomedical Science (IBMS)</li>
                        <li>• Association of Clinical Biochemistry (ACB)</li>
                        <li>• British Society for Haematology (BSH)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Quality Management System</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 text-blue-600 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Pre-analytical Phase
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Patient preparation guidelines</li>
                      <li>• Sample collection protocols</li>
                      <li>• Transportation requirements</li>
                      <li>• Sample acceptance criteria</li>
                      <li>• Rejection and resampling procedures</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 text-purple-600 flex items-center gap-2">
                      <FlaskConical className="h-5 w-5" />
                      Analytical Phase
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Validated testing procedures</li>
                      <li>• Equipment calibration programs</li>
                      <li>• Quality control monitoring</li>
                      <li>• Method verification studies</li>
                      <li>• Uncertainty of measurement</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 text-orange-600 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Post-analytical Phase
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Result review and authorization</li>
                      <li>• Critical value notification</li>
                      <li>• Report generation and dispatch</li>
                      <li>• Result interpretation support</li>
                      <li>• Customer service and queries</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Laboratory Personnel Qualifications</h2>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-200 p-3 text-left">Role</th>
                        <th className="border border-gray-200 p-3 text-left">Minimum Qualification</th>
                        <th className="border border-gray-200 p-3 text-left">Professional Registration</th>
                        <th className="border border-gray-200 p-3 text-left">Continuing Education</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 p-3">Laboratory Director</td>
                        <td className="border border-gray-200 p-3">Medical degree + Pathology specialty</td>
                        <td className="border border-gray-200 p-3">GMC + FRCPath</td>
                        <td className="border border-gray-200 p-3">50 CPD points annually</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Chief Biomedical Scientist</td>
                        <td className="border border-gray-200 p-3">BSc Biomedical Science + MSc</td>
                        <td className="border border-gray-200 p-3">HCPC + FIBMS</td>
                        <td className="border border-gray-200 p-3">30 CPD points annually</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Senior Biomedical Scientist</td>
                        <td className="border border-gray-200 p-3">BSc Biomedical Science</td>
                        <td className="border border-gray-200 p-3">HCPC Registration</td>
                        <td className="border border-gray-200 p-3">30 CPD points annually</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Medical Laboratory Assistant</td>
                        <td className="border border-gray-200 p-3">A-levels + Laboratory training</td>
                        <td className="border border-gray-200 p-3">Internal competency assessment</td>
                        <td className="border border-gray-200 p-3">15 hours training annually</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">External Quality Assessment (EQA)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">Participation Programs</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• UK NEQAS (National External Quality Assessment Service)</li>
                    <li>• RIQAS (Randox International Quality Assessment Scheme)</li>
                    <li>• CAP (College of American Pathologists) Surveys</li>
                    <li>• EQALM (European Organization for External Quality Assurance)</li>
                    <li>• Specialist society EQA schemes</li>
                    <li>• Point-of-care testing schemes</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">Performance Standards</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Target: {'>'}95% acceptable performance</li>
                    <li>• Monthly EQA sample analysis</li>
                    <li>• Immediate investigation of poor performance</li>
                    <li>• Corrective action implementation</li>
                    <li>• Trend analysis and improvement plans</li>
                    <li>• Annual performance review meetings</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Equipment & Technology Standards</h2>
              <div className="space-y-4">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Analytical Instrumentation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Automated Analyzers</h4>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Abbott Alinity ci-series (Clinical Chemistry)</li>
                        <li>• Sysmex XN-Series (Haematology)</li>
                        <li>• BioMérieux VITEK 2 (Microbiology)</li>
                        <li>• Roche cobas 8000 (High-throughput testing)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Specialized Equipment</h4>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Mass spectrometry systems</li>
                        <li>• PCR and sequencing platforms</li>
                        <li>• Flow cytometry systems</li>
                        <li>• Automated microscopy systems</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Maintenance & Calibration</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Daily Checks</strong>
                      <ul className="mt-1 space-y-1 text-green-700">
                        <li>• System performance verification</li>
                        <li>• Quality control samples</li>
                        <li>• Temperature monitoring</li>
                        <li>• Reagent inventory checks</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Periodic Maintenance</strong>
                      <ul className="mt-1 space-y-1 text-green-700">
                        <li>• Monthly preventive maintenance</li>
                        <li>• Quarterly calibration verification</li>
                        <li>• Annual service contracts</li>
                        <li>• Software updates and validation</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Documentation</strong>
                      <ul className="mt-1 space-y-1 text-green-700">
                        <li>• Maintenance logs and records</li>
                        <li>• Calibration certificates</li>
                        <li>• Performance trending data</li>
                        <li>• Non-conformance reports</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Turnaround Time Standards</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-200 p-3 text-left">Test Category</th>
                      <th className="border border-gray-200 p-3 text-left">Routine TAT</th>
                      <th className="border border-gray-200 p-3 text-left">Urgent TAT</th>
                      <th className="border border-gray-200 p-3 text-left">Critical Results</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-3">Full Blood Count</td>
                      <td className="border border-gray-200 p-3">2 hours</td>
                      <td className="border border-gray-200 p-3">30 minutes</td>
                      <td className="border border-gray-200 p-3">Immediate phone call</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Basic Metabolic Panel</td>
                      <td className="border border-gray-200 p-3">4 hours</td>
                      <td className="border border-gray-200 p-3">1 hour</td>
                      <td className="border border-gray-200 p-3">Within 1 hour</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Lipid Profile</td>
                      <td className="border border-gray-200 p-3">24 hours</td>
                      <td className="border border-gray-200 p-3">4 hours</td>
                      <td className="border border-gray-200 p-3">N/A</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Hormone Testing</td>
                      <td className="border border-gray-200 p-3">48 hours</td>
                      <td className="border border-gray-200 p-3">24 hours</td>
                      <td className="border border-gray-200 p-3">Same day</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Microbiology Culture</td>
                      <td className="border border-gray-200 p-3">48-72 hours</td>
                      <td className="border border-gray-200 p-3">24 hours</td>
                      <td className="border border-gray-200 p-3">Immediate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Laboratory Safety & Environment</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 border-l-4 border-red-500">
                  <h4 className="font-medium text-red-700 mb-2">Biological Safety</h4>
                  <ul className="text-sm space-y-1">
                    <li>• BSL-2 containment facilities</li>
                    <li>• Biosafety cabinet certification</li>
                    <li>• Personal protective equipment protocols</li>
                    <li>• Waste disposal and decontamination</li>
                    <li>• Occupational health monitoring</li>
                  </ul>
                </Card>
                
                <Card className="p-4 border-l-4 border-green-500">
                  <h4 className="font-medium text-green-700 mb-2">Environmental Control</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Temperature and humidity monitoring</li>
                    <li>• Air filtration and ventilation systems</li>
                    <li>• Emergency power backup systems</li>
                    <li>• Water quality testing and purification</li>
                    <li>• Chemical storage and handling protocols</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Audit & Inspection Schedule</h2>
              <div className="p-6 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Internal Audits</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Monthly quality reviews</li>
                      <li>• Quarterly system audits</li>
                      <li>• Annual management review</li>
                      <li>• Continuous improvement assessments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">External Inspections</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Annual UKAS assessments</li>
                      <li>• Regulatory authority inspections</li>
                      <li>• Customer audit visits</li>
                      <li>• Professional body reviews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Certification Renewals</h4>
                    <ul className="text-sm space-y-1">
                      <li>• ISO 15189 (4-year cycle)</li>
                      <li>• UKAS accreditation renewal</li>
                      <li>• Professional registrations</li>
                      <li>• Equipment certifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact & Verification</h2>
              <div className="p-6 bg-muted rounded-lg">
                <p className="mb-4">For laboratory accreditation verification or technical enquiries:</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Laboratory Director</strong>
                    <p>lab.director@healthplatform.co.uk</p>
                    <p>UKAS Assessment Manager</p>
                  </div>
                  <div>
                    <strong>Quality Manager</strong>
                    <p>quality@healthplatform.co.uk</p>
                    <p>+44 (0) 20 7000 0001</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium text-primary mb-2">Accreditation Certificates</p>
                  <p className="text-sm">
                    UKAS Accreditation No: Medical 0000 | ISO 15189:2022 | 
                    Valid until: December 2025 | Scope available on UKAS website
                  </p>
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

export default LabAccreditation;