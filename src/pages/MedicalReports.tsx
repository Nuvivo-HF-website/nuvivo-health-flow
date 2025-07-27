import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, Shield } from "lucide-react";

const MedicalReports = () => {
  const reportTypes = [
    {
      title: "Fitness to Work (Fit Notes)",
      description: "Medical certificates for work absence due to health conditions",
      price: "£45",
      turnaround: "Same day",
      icon: FileText
    },
    {
      title: "DVLA Medical Reports",
      description: "Required medical assessments for driving license applications",
      price: "£75",
      turnaround: "2-3 working days",
      icon: Shield
    },
    {
      title: "Travel Medical Letters",
      description: "Medical clearance letters for international travel",
      price: "£35",
      turnaround: "24 hours",
      icon: Download
    },
    {
      title: "Insurance Medical Reports",
      description: "Comprehensive medical reports for insurance claims",
      price: "£95",
      turnaround: "3-5 working days",
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Medical Reports & Letters</h1>
            <p className="text-xl text-muted-foreground">
              Professional medical documentation for various purposes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((report, index) => {
              const IconComponent = report.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{report.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="font-semibold text-primary">{report.price}</p>
                      <p className="text-sm text-muted-foreground">Turnaround: {report.turnaround}</p>
                    </div>
                    <Button className="w-full">Request Report</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MedicalReports;