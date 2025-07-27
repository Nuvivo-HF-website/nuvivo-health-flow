import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Clock, Shield, MapPin } from "lucide-react";

const MobileHomeCollection = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Home Blood Collection</h1>
            <p className="text-xl text-muted-foreground">
              Professional blood sample collection in the comfort of your home
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Home className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Standard Home Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Professional phlebotomist visits your home for blood collection
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£45 collection fee</p>
                  <p className="text-sm text-muted-foreground">+ test costs</p>
                </div>
                <Button className="w-full">Book Home Visit</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Same Day Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Urgent blood collection service available same day
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£75 collection fee</p>
                  <p className="text-sm text-muted-foreground">+ test costs</p>
                </div>
                <Button className="w-full">Book Urgent</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Premium Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Senior phlebotomist with specialized training
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£65 collection fee</p>
                  <p className="text-sm text-muted-foreground">+ test costs</p>
                </div>
                <Button className="w-full">Book Premium</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Mobile Clinic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Fully equipped mobile clinic for complex procedures
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£120 visit fee</p>
                  <p className="text-sm text-muted-foreground">+ procedure costs</p>
                </div>
                <Button className="w-full">Book Mobile Clinic</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileHomeCollection;