import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Shield, TrendingUp, Users, CheckCircle, AlertTriangle, Award, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const QualityStandards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Quality Standards & Framework
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Our comprehensive approach to maintaining excellence in healthcare delivery and service quality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="p-4 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Excellence</h3>
                <p className="text-sm text-muted-foreground">Continuous improvement in all services</p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Safety</h3>
                <p className="text-sm text-muted-foreground">Patient safety as our highest priority</p>
              </Card>
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Patient-Centered</h3>
                <p className="text-sm text-muted-foreground">Care tailored to individual needs</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Innovation</h3>
                <p className="text-sm text-muted-foreground">Adopting best practices and technology</p>
              </Card>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-6">Clinical Quality Framework</h2>
              
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Clinical Governance Structure
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-3">Governance Bodies</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Clinical Quality Committee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Patient Safety Group</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Clinical Effectiveness Board</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Risk Management Committee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Information Governance Panel</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-3">Key Functions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Clinical audit oversight</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Incident investigation and learning</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Policy development and review</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Quality improvement initiatives</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Professional development oversight</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                    <Award className="h-6 w-6 text-purple-600" />
                    Quality Indicators & Metrics
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Clinical Effectiveness</h4>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• Test accuracy and reliability rates</li>
                        <li>• Diagnostic concordance with specialists</li>
                        <li>• Clinical outcome measurements</li>
                        <li>• Evidence-based practice adherence</li>
                        <li>• Treatment effectiveness tracking</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Patient Safety</h4>
                      <ul className="text-sm space-y-1 text-green-700">
                        <li>• Incident reporting rates</li>
                        <li>• Never events (target: zero)</li>
                        <li>• Medication error reduction</li>
                        <li>• Hospital readmission rates</li>
                        <li>• Patient safety culture scores</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">Patient Experience</h4>
                      <ul className="text-sm space-y-1 text-orange-700">
                        <li>• Patient satisfaction scores (>95%)</li>
                        <li>• Complaint resolution times</li>
                        <li>• Communication effectiveness ratings</li>
                        <li>• Access and convenience measures</li>
                        <li>• Net Promoter Score (NPS)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Quality Standards</h2>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-200 p-3 text-left">Service Area</th>
                        <th className="border border-gray-200 p-3 text-left">Quality Standard</th>
                        <th className="border border-gray-200 p-3 text-left">Target</th>
                        <th className="border border-gray-200 p-3 text-left">Measurement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 p-3">Appointment Booking</td>
                        <td className="border border-gray-200 p-3">Same-day availability</td>
                        <td className="border border-gray-200 p-3">&gt;80%</td>
                        <td className="border border-gray-200 p-3">Daily capacity monitoring</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Test Result Delivery</td>
                        <td className="border border-gray-200 p-3">Within promised timeframe</td>
                        <td className="border border-gray-200 p-3">>98%</td>
                        <td className="border border-gray-200 p-3">Turnaround time tracking</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Clinical Consultations</td>
                        <td className="border border-gray-200 p-3">On-time start</td>
                        <td className="border border-gray-200 p-3">>95%</td>
                        <td className="border border-gray-200 p-3">Scheduling system analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Customer Support</td>
                        <td className="border border-gray-200 p-3">First contact resolution</td>
                        <td className="border border-gray-200 p-3">>90%</td>
                        <td className="border border-gray-200 p-3">Support ticket analysis</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 p-3">Emergency Response</td>
                        <td className="border border-gray-200 p-3">Critical result notification</td>
                        <td className="border border-gray-200 p-3"><1 hour</td>
                        <td className="border border-gray-200 p-3">Alert system monitoring</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Continuous Improvement Process</h2>
              <div className="space-y-4">
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold mb-4 text-primary">PDSA Cycle Implementation</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">P</span>
                      </div>
                      <h4 className="font-medium text-blue-600">Plan</h4>
                      <p className="text-sm text-gray-600 mt-1">Identify improvement opportunities and develop action plans</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 font-bold">D</span>
                      </div>
                      <h4 className="font-medium text-green-600">Do</h4>
                      <p className="text-sm text-gray-600 mt-1">Implement changes on a small scale or pilot basis</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-orange-600 font-bold">S</span>
                      </div>
                      <h4 className="font-medium text-orange-600">Study</h4>
                      <p className="text-sm text-gray-600 mt-1">Analyze results and measure impact against objectives</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-purple-600 font-bold">A</span>
                      </div>
                      <h4 className="font-medium text-purple-600">Act</h4>
                      <p className="text-sm text-gray-600 mt-1">Standardize successful changes or adjust and repeat cycle</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Risk Management Framework</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment Matrix
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-red-800">High Risk</span>
                        <Badge variant="destructive">Immediate Action</Badge>
                      </div>
                      <p className="text-sm text-red-700 mt-1">Significant patient safety or operational impact</p>
                    </div>
                    <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-orange-800">Medium Risk</span>
                        <Badge className="bg-orange-500">Action Required</Badge>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">Moderate impact requiring management attention</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-yellow-800">Low Risk</span>
                        <Badge className="bg-yellow-500">Monitor</Badge>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">Minor impact with monitoring requirements</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">Risk Controls</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Preventive Controls:</strong> Policies, training, and system safeguards
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Detective Controls:</strong> Monitoring, audits, and alert systems
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Corrective Controls:</strong> Incident response and remediation procedures
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <strong>Recovery Controls:</strong> Business continuity and disaster recovery plans
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Staff Training & Development</h2>
              <div className="space-y-4">
                <div className="p-6 bg-muted rounded-lg">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Competency Framework
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Core Competencies</h4>
                      <ul className="space-y-1">
                        <li>• Patient safety awareness</li>
                        <li>• Communication skills</li>
                        <li>• Information governance</li>
                        <li>• Infection control</li>
                        <li>• Emergency procedures</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Role-Specific Skills</h4>
                      <ul className="space-y-1">
                        <li>• Clinical competencies</li>
                        <li>• Technical proficiencies</li>
                        <li>• Software systems training</li>
                        <li>• Specialized procedures</li>
                        <li>• Quality assurance methods</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-600 mb-2">Leadership Development</h4>
                      <ul className="space-y-1">
                        <li>• Team management</li>
                        <li>• Change leadership</li>
                        <li>• Quality improvement methods</li>
                        <li>• Strategic planning</li>
                        <li>• Performance management</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 text-primary flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Training Schedule
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Induction:</strong> 2-week comprehensive program</li>
                      <li>• <strong>Annual Mandatory:</strong> 40 hours minimum</li>
                      <li>• <strong>CPD Activities:</strong> Role-specific requirements</li>
                      <li>• <strong>Refresher Training:</strong> Quarterly updates</li>
                      <li>• <strong>Emergency Drills:</strong> Monthly practice sessions</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-3 text-primary">Assessment Methods</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Competency-based assessments</li>
                      <li>• Practical skill demonstrations</li>
                      <li>• Written knowledge tests</li>
                      <li>• Peer review and feedback</li>
                      <li>• Annual performance reviews</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Patient Feedback & Engagement</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98.2%</div>
                    <p className="text-sm font-medium">Patient Satisfaction</p>
                    <p className="text-xs text-muted-foreground">Last 12 months average</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
                    <p className="text-sm font-medium">Service Rating</p>
                    <p className="text-xs text-muted-foreground">Patient experience score</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">92%</div>
                    <p className="text-sm font-medium">Would Recommend</p>
                    <p className="text-xs text-muted-foreground">Net Promoter Score</p>
                  </Card>
                </div>

                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Feedback Collection Methods</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Digital Channels</h4>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Post-appointment email surveys</li>
                        <li>• In-app rating and review system</li>
                        <li>• Online patient portal feedback</li>
                        <li>• Social media monitoring</li>
                        <li>• Website feedback forms</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Direct Engagement</h4>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Patient advisory groups</li>
                        <li>• Focus group sessions</li>
                        <li>• Telephone follow-up calls</li>
                        <li>• Exit interviews</li>
                        <li>• Complaint handling process</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Quality Reporting & Transparency</h2>
              <div className="p-6 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                <h3 className="font-medium mb-3">Public Reporting Commitments</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Regular Publications</h4>
                    <ul className="space-y-1">
                      <li>• Monthly quality dashboards</li>
                      <li>• Quarterly patient safety reports</li>
                      <li>• Annual quality improvement summary</li>
                      <li>• Incident learning bulletins</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Transparency Measures</h4>
                    <ul className="space-y-1">
                      <li>• Open access to quality metrics</li>
                      <li>• Public safety performance data</li>
                      <li>• Benchmarking against industry standards</li>
                      <li>• Stakeholder engagement reports</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Quality Team</h2>
              <div className="p-6 bg-muted rounded-lg">
                <p className="mb-4">For quality-related enquiries, feedback, or concerns:</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Quality Director</strong>
                    <p>quality.director@healthplatform.co.uk</p>
                    <p>Strategic quality oversight</p>
                  </div>
                  <div>
                    <strong>Patient Experience Team</strong>
                    <p>patient.experience@healthplatform.co.uk</p>
                    <p>+44 (0) 800 123 4567 (Freephone)</p>
                  </div>
                </div>
                <div className="mt-4">
                  <strong>Quality Improvement Suggestions:</strong>
                  <p>suggestions@healthplatform.co.uk</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We welcome ideas for improving our services and patient care
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

export default QualityStandards;