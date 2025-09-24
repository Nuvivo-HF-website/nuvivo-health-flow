import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Stethoscope, Phone, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MedicalDisclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              Medical Disclaimer
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Important information about our medical services and limitations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                <strong>Emergency Notice:</strong> If you are experiencing a medical emergency, call 999 immediately. 
                Our services are not intended for emergency medical situations.
              </AlertDescription>
            </Alert>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                General Medical Disclaimer
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  The information, services, and products provided through this platform are for informational and educational purposes only. 
                  They are not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <p>
                  <strong>Always seek the advice of your physician or other qualified healthcare provider</strong> with any questions you may have regarding a medical condition. 
                  Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Limitations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4 border-l-4 border-amber-400">
                  <h3 className="font-semibold text-amber-700 mb-2">Test Results</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Results are based on sample quality and collection method</li>
                    <li>• Normal ranges may vary between laboratories</li>
                    <li>• Results should be interpreted by qualified professionals</li>
                    <li>• False positives and negatives can occur</li>
                  </ul>
                </Card>

                <Card className="p-4 border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-700 mb-2">AI Insights</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• AI analysis is supplementary, not diagnostic</li>
                    <li>• Algorithms may not account for all variables</li>
                    <li>• Human clinical judgment remains essential</li>
                    <li>• Technology limitations may affect accuracy</li>
                  </ul>
                </Card>

                <Card className="p-4 border-l-4 border-green-400">
                  <h3 className="font-semibold text-green-700 mb-2">Telemedicine</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Physical examination limitations apply</li>
                    <li>• Technology issues may affect consultations</li>
                    <li>• Not suitable for all medical conditions</li>
                    <li>• Follow-up care may be necessary</li>
                  </ul>
                </Card>

                <Card className="p-4 border-l-4 border-purple-400">
                  <h3 className="font-semibold text-purple-700 mb-2">Health Monitoring</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Trends and patterns for guidance only</li>
                    <li>• Device accuracy may vary</li>
                    <li>• Not a replacement for regular check-ups</li>
                    <li>• Sudden changes require medical attention</li>
                  </ul>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">When to Seek Immediate Medical Attention</h2>
              <Alert className="border-red-200 bg-red-50 mb-4">
                <Phone className="h-5 w-5 text-red-600" />
                <AlertDescription>
                  <strong>Call 999 immediately if you experience:</strong>
                </AlertDescription>
              </Alert>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• Chest pain or difficulty breathing</li>
                  <li>• Severe abdominal pain</li>
                  <li>• Loss of consciousness or confusion</li>
                  <li>• Severe bleeding or injury</li>
                  <li>• Signs of stroke (FAST test)</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• Severe allergic reactions</li>
                  <li>• Poisoning or overdose</li>
                  <li>• Severe burns</li>
                  <li>• Mental health crisis</li>
                  <li>• Any life-threatening situation</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Professional Standards</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Medical Professionals</h3>
                  <p className="text-sm text-blue-700">
                    All medical professionals on our platform are registered with the General Medical Council (GMC) and follow established clinical guidelines. 
                    However, professional judgment can vary, and second opinions are always encouraged for complex conditions.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Laboratory Standards</h3>
                  <p className="text-sm text-green-700">
                    Our partner laboratories are accredited by UKAS and follow ISO 15189 standards. 
                    However, no test is 100% accurate, and clinical correlation is always required.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Liability Limitations</h2>
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-4">
                  While we strive to provide accurate and reliable services, we cannot guarantee:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                  <li>The accuracy, completeness, or timeliness of any information provided</li>
                  <li>That our services will meet all your healthcare needs</li>
                  <li>That all technical issues or system failures can be prevented</li>
                  <li>That third-party services (laboratories, specialists) will be error-free</li>
                </ul>
                <p className="text-sm text-gray-700 mt-4">
                  Users are responsible for making informed decisions about their healthcare based on multiple sources of information and professional medical advice.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Medication and Treatment Advice</h2>
              <Alert className="border-orange-200 bg-orange-50">
                <Clock className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Important:</strong> Never stop, start, or change medications without consulting your healthcare provider. 
                  Drug interactions and individual responses can vary significantly.
                </AlertDescription>
              </Alert>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Accuracy</h2>
              <p className="text-sm text-gray-700">
                While we implement quality control measures, users are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700 mt-2">
                <li>Providing accurate personal and medical information</li>
                <li>Following sample collection instructions correctly</li>
                <li>Reporting any concerns about test results promptly</li>
                <li>Verifying critical information with healthcare providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact for Medical Concerns</h2>
              <div className="p-6 bg-primary/5 rounded-lg">
                <p className="mb-4">For medical questions or concerns about our services:</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Medical Director:</strong> medical@healthplatform.co.uk</p>
                  <p><strong>Clinical Support:</strong> clinical@healthplatform.co.uk</p>
                  <p><strong>Emergency Line:</strong> For emergencies, always call 999</p>
                  <p className="text-muted-foreground mt-4">
                    This disclaimer was last updated: {new Date().toLocaleDateString('en-GB')}
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

export default MedicalDisclaimer;