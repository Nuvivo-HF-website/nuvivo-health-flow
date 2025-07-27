import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Clock, Shield } from "lucide-react";

const MobileSampleDropoff = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Sample Drop-Off Support</h1>
            <p className="text-xl text-muted-foreground">
              Convenient sample collection and laboratory delivery service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Package className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Standard Pickup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Collection of pre-prepared samples from your location
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£25 pickup fee</p>
                  <p className="text-sm text-muted-foreground">Next working day</p>
                </div>
                <Button className="w-full">Schedule Pickup</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Express Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Same-day collection and delivery to laboratory
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£45 express fee</p>
                  <p className="text-sm text-muted-foreground">Same day</p>
                </div>
                <Button className="w-full">Book Express</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Scheduled Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Regular weekly pickup service for ongoing monitoring
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£80 per month</p>
                  <p className="text-sm text-muted-foreground">Weekly pickups</p>
                </div>
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Temperature Controlled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Specialized transport for temperature-sensitive samples
                </p>
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">£65 pickup fee</p>
                  <p className="text-sm text-muted-foreground">Climate controlled</p>
                </div>
                <Button className="w-full">Book Special</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileSampleDropoff;