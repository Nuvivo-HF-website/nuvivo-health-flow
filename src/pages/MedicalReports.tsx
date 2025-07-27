import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MedicalReportForm from "@/components/MedicalReportForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Download, Clock, Shield, Car, Plane, Heart, Briefcase } from "lucide-react";

const MedicalReports = () => {
  const [selectedReport, setSelectedReport] = useState<{type: string, price: string} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const reportTypes = [
    {
      title: "Fitness to Work (Fit Notes)",
      description: "Medical certificates for work absence due to health conditions",
      price: "£45",
      turnaround: "Same day",
      icon: Briefcase,
      features: ["Work capability assessment", "Return to work recommendations", "Adjustments advice"]
    },
    {
      title: "DVLA Medical Reports",
      description: "Required medical assessments for driving license applications",
      price: "£75",
      turnaround: "2-3 working days",
      icon: Car,
      features: ["Vision assessment", "Medical conditions review", "Driving capability evaluation"]
    },
    {
      title: "Travel Medical Letters",
      description: "Medical clearance letters for international travel",
      price: "£35",
      turnaround: "24 hours",
      icon: Plane,
      features: ["Vaccination status", "Medical conditions summary", "Travel fitness certification"]
    },
    {
      title: "Insurance Medical Reports",
      description: "Comprehensive medical reports for insurance claims",
      price: "£95",
      turnaround: "3-5 working days",
      icon: Shield,
      features: ["Detailed medical history", "Current condition assessment", "Prognosis and treatment plan"]
    },
    {
      title: "Private Medical Reports",
      description: "Detailed medical assessments for personal use",
      price: "£65",
      turnaround: "2-3 working days",
      icon: Heart,
      features: ["Comprehensive health review", "Medical history summary", "Health recommendations"]
    },
    {
      title: "Occupational Health Reports",
      description: "Workplace health assessments and clearance certificates",
      price: "£55",
      turnaround: "1-2 working days",
      icon: FileText,
      features: ["Pre-employment screening", "Health surveillance", "Risk assessment"]
    }
  ];

  const handleRequestReport = (report: any) => {
    setSelectedReport({ type: report.title, price: report.price });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Medical Reports & Letters</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional medical documentation for various purposes. Our qualified doctors provide comprehensive reports 
              for work, travel, insurance, and personal requirements.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="text-center p-4">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Fast Turnaround</h3>
              <p className="text-sm text-muted-foreground">Most reports completed within 24-48 hours</p>
            </Card>
            <Card className="text-center p-4">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">GMC Registered</h3>
              <p className="text-sm text-muted-foreground">All reports by qualified medical professionals</p>
            </Card>
            <Card className="text-center p-4">
              <Download className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Digital Delivery</h3>
              <p className="text-sm text-muted-foreground">Secure PDF delivery via email</p>
            </Card>
            <Card className="text-center p-4">
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Official Format</h3>
              <p className="text-sm text-muted-foreground">Accepted by all major institutions</p>
            </Card>
          </div>

          {/* Report Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report, index) => {
              const IconComponent = report.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-center">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-center">{report.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Includes:</h4>
                      <ul className="text-sm space-y-1">
                        {report.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2 text-center border-t pt-4">
                      <p className="font-semibold text-primary text-lg">{report.price}</p>
                      <p className="text-sm text-muted-foreground">Turnaround: {report.turnaround}</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleRequestReport(report)}
                    >
                      Request Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Process Information */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <h3 className="font-semibold">Complete Request</h3>
                <p className="text-sm text-muted-foreground">Fill out our comprehensive medical report request form</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <h3 className="font-semibold">Medical Review</h3>
                <p className="text-sm text-muted-foreground">Our qualified doctors review your information and medical history</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <h3 className="font-semibold">Report Generation</h3>
                <p className="text-sm text-muted-foreground">Professional medical report is prepared according to requirements</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  4
                </div>
                <h3 className="font-semibold">Secure Delivery</h3>
                <p className="text-sm text-muted-foreground">Report delivered securely via your preferred method</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Report Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Medical Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <MedicalReportForm
              reportType={selectedReport.type}
              reportPrice={selectedReport.price}
              onClose={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default MedicalReports;