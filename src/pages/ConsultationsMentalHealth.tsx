import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Users, Clock } from "lucide-react";

const ConsultationsMentalHealth = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Mental Health & Psychology</h1>
            <p className="text-xl text-muted-foreground">
              Professional mental health support and psychological services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Psychology Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Individual therapy sessions with qualified psychologists
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £120 per session</p>
                  <p className="text-sm text-muted-foreground">60 minutes</p>
                </div>
                <Button className="w-full">Book Consultation</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Counselling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Professional counselling for various life challenges
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £80 per session</p>
                  <p className="text-sm text-muted-foreground">50 minutes</p>
                </div>
                <Button className="w-full">Book Session</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Group Therapy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Structured group sessions for peer support
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">From £40 per session</p>
                  <p className="text-sm text-muted-foreground">90 minutes</p>
                </div>
                <Button className="w-full">Join Group</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConsultationsMentalHealth;