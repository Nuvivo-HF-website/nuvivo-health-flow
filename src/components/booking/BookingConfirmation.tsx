import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Calendar, Clock, MapPin, Phone, Mail, User } from "lucide-react";
import { BookingData } from "@/pages/GuestBooking";
import { useToast } from "@/components/ui/use-toast";

interface BookingConfirmationProps {
  bookingData: BookingData;
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Send confirmation email (would be handled by backend)
    toast({
      title: "Booking Confirmed!",
      description: "We've sent a confirmation email to your inbox.",
    });
  }, [toast]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-UK', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateOfBirth = (dobStr: string) => {
    const date = new Date(dobStr);
    return date.toLocaleDateString('en-UK');
  };

  const addToGoogleCalendar = () => {
    const startDateTime = new Date(`${bookingData.date}T${bookingData.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes later
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${bookingData.specialist.name}`)}&dates=${startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(`${bookingData.specialist.specialty} consultation`)}&location=${encodeURIComponent('Online/Clinic')}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const addToAppleCalendar = () => {
    const startDateTime = new Date(`${bookingData.date}T${bookingData.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nuvivo Health//EN
BEGIN:VEVENT
UID:${Date.now()}@nuvivo.co.uk
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}Z
DTSTART:${startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}Z
DTEND:${endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}Z
SUMMARY:Appointment with ${bookingData.specialist.name}
DESCRIPTION:${bookingData.specialist.specialty} consultation
LOCATION:Online/Clinic
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointment.ics';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">You're Booked!</h1>
        <p className="text-lg text-muted-foreground">
          Your appointment with {bookingData.specialist.name} is confirmed
        </p>
      </div>

      {/* Appointment Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={bookingData.specialist.image} alt={bookingData.specialist.name} />
              <AvatarFallback>
                {bookingData.specialist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{bookingData.specialist.name}</h3>
              <Badge variant="secondary" className="mb-1">
                {bookingData.specialist.specialty}
              </Badge>
              <p className="text-sm text-muted-foreground">{bookingData.specialist.qualifications}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">£{bookingData.specialist.price}</p>
              <p className="text-sm text-muted-foreground">per consultation</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(bookingData.date)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-sm text-muted-foreground">{bookingData.time} (30 minutes)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">Online/In-clinic</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Full Name</p>
              <p className="text-sm text-muted-foreground">{bookingData.guestDetails.fullName}</p>
            </div>

            <div>
              <p className="font-medium">Date of Birth</p>
              <p className="text-sm text-muted-foreground">
                {formatDateOfBirth(bookingData.guestDetails.dateOfBirth)}
              </p>
            </div>

            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{bookingData.guestDetails.email}</p>
            </div>

            <div>
              <p className="font-medium">Mobile</p>
              <p className="text-sm text-muted-foreground">{bookingData.guestDetails.mobile}</p>
            </div>

            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {bookingData.guestDetails.streetAddress && (
                  <>
                    {bookingData.guestDetails.streetAddress}
                    {bookingData.guestDetails.city && `, ${bookingData.guestDetails.city}`}
                    {bookingData.guestDetails.county && `, ${bookingData.guestDetails.county}`}
                    <br />
                  </>
                )}
                {bookingData.guestDetails.postcode}
              </p>
            </div>

            {bookingData.guestDetails.notes && (
              <div className="md:col-span-2">
                <p className="font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{bookingData.guestDetails.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Confirmation Email</p>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation to your email and will send reminders closer to your appointment.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Need to reschedule or have questions?</p>
              <p className="text-sm text-muted-foreground">
                Email us at{" "}
                <a href="mailto:hello@nuvivo.co.uk" className="text-primary hover:underline">
                  hello@nuvivo.co.uk
                </a>
                {" "}or call{" "}
                <a href="tel:0333305916" className="text-primary hover:underline">
                  0333 305 9916
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={addToGoogleCalendar} variant="outline" className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Add to Google Calendar
        </Button>
        
        <Button onClick={addToAppleCalendar} variant="outline" className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Add to Apple Calendar
        </Button>

        <Button 
          onClick={() => window.location.href = "/"}
          className="flex items-center"
        >
          Return to Home
        </Button>
      </div>

      {/* Optional Account Creation */}
      <Card className="mt-8">
        <CardContent className="text-center p-6">
          <h3 className="text-lg font-semibold mb-2">Want to manage your appointments easily?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create an account to view your booking history, reschedule appointments, and manage your health records.
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/sign-in"}>
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}