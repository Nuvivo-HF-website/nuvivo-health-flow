import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Users, ArrowRight, Clock, Shield, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BookingOptions() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Booking Option</h1>
        <p className="text-lg text-muted-foreground">
          Select how you'd like to book your appointment
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Guest Booking Option */}
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Quick & Easy
            </Badge>
          </div>
          
          <CardHeader className="text-center pt-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Book as Guest</CardTitle>
            <p className="text-muted-foreground">
              Quick booking without creating an account
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-sm">Book in under 5 minutes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm">Instant appointment confirmation</span>
              </div>
              <div className="flex items-center space-x-3">
                <ArrowRight className="w-5 h-5 text-green-600" />
                <span className="text-sm">No account setup required</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/guest-booking')}
              >
                Continue as Guest
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Perfect for one-time appointments
            </p>
          </CardContent>
        </Card>

        {/* Login to Book Option */}
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Full Features
            </Badge>
          </div>
          
          <CardHeader className="text-center pt-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sign In to Book</CardTitle>
            <p className="text-muted-foreground">
              Full account features and booking history
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Secure booking history</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Easy rescheduling & cancellation</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Saved preferences & details</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => navigate('/sign-in?redirect=/booking')}
              >
                Sign In to Book
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Best for regular patients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Both options provide the same high-quality booking experience. 
          You can always create an account after your appointment.
        </p>
      </div>
    </div>
  );
}