import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Calendar, Award } from "lucide-react";

const MobileCorporate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Corporate Health Days</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive workplace health and wellness programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Building className="w-12 h-12 text-primary mb-4" />
                <CardTitle>On-site Health Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete health assessments at your workplace
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £150 per person</p>
                  <p className="text-sm text-muted-foreground">Min 10 employees</p>
                </div>
                <Button className="w-full">Get Quote</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Team Health Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Customized health packages for teams and departments
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £75 per person</p>
                  <p className="text-sm text-muted-foreground">Bulk pricing</p>
                </div>
                <Button className="w-full">Plan Package</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Executive Physicals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive executive health assessments
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £450 per person</p>
                  <p className="text-sm text-muted-foreground">Half day program</p>
                </div>
                <Button className="w-full">Book Executive</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Wellness Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ongoing workplace wellness and health promotion
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">Custom pricing</p>
                  <p className="text-sm text-muted-foreground">Annual programs</p>
                </div>
                <Button className="w-full">Discuss Program</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileCorporate;