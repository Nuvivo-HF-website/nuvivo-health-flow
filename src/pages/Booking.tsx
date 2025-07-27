import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PatientBookingForm from "@/components/PatientBookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, User } from "lucide-react";

const Booking = () => {
  const [bookingComplete, setBookingComplete] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);

  const handleBookingComplete = (patientDetails: any, bookingDetails: any) => {
    setSubmittedBooking({ patientDetails, bookingDetails });
    setBookingComplete(true);
  };

  if (bookingComplete && submittedBooking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground text-lg">
                Your appointment has been successfully scheduled. We've sent a confirmation email to{" "}
                <span className="font-medium">{submittedBooking.patientDetails.email}</span>
              </p>
            </div>

            <Card className="text-left">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Appointment Summary</h3>
                  <Badge variant="secondary">Confirmed</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Patient:</strong> {submittedBooking.patientDetails.fullName}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Date & Time:</strong> {submittedBooking.bookingDetails.appointmentDate?.toLocaleDateString()} at {submittedBooking.bookingDetails.appointmentTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Type:</strong> {submittedBooking.bookingDetails.locationType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Service:</strong> {submittedBooking.bookingDetails.service}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>What's Next:</strong> You'll receive detailed preparation instructions via email. 
                    Please arrive 10 minutes early for your appointment. If you need to reschedule, 
                    please contact us at least 24 hours in advance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Book Your Appointment</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete the form below to schedule your blood test or consultation. 
            We need some essential information to ensure we can provide you with the best possible care.
          </p>
        </div>

        <PatientBookingForm onBookingComplete={handleBookingComplete} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;