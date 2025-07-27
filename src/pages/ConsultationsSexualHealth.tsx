import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";

const ConsultationsSexualHealth = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Sexual Health Consultations</h1>
            <p className="text-xl text-muted-foreground">
              Confidential sexual health services and expert advice
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>STI Testing & Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive STI screening and confidential consultation
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£95 consultation + tests</p>
                  <p className="text-sm text-muted-foreground">30 minutes</p>
                </div>
                <Button className="w-full">Book Consultation</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Erectile Dysfunction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Professional treatment and support for ED concerns
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£120 per consultation</p>
                  <p className="text-sm text-muted-foreground">45 minutes</p>
                </div>
                <Button className="w-full">Book Appointment</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Relationship Counselling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Couples therapy and relationship guidance
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£140 per session</p>
                  <p className="text-sm text-muted-foreground">60 minutes</p>
                </div>
                <Button className="w-full">Book Session</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConsultationsSexualHealth;