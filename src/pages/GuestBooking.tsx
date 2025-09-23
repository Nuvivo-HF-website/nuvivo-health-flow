import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpecialistSelection } from "@/components/booking/SpecialistSelection";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";
import { GuestBookingForm } from "@/components/booking/GuestBookingForm";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { useToast } from "@/components/ui/use-toast";

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  price: number;
  image?: string;
  qualifications?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  nextAvailable?: string;
  duration?: string;
  locations?: string[];
  languages?: string[];
  available_days?: string[];
  available_hours?: {
    start: string;
    end: string;
  };
  experience_years?: number;
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface BookingData {
  specialist: Specialist;
  date: string;
  time: string;
  guestDetails: {
    fullName: string;
    email: string;
    mobile: string;
    sexAtBirth: string;
    genderIdentity: string;
    genderSelfDescribe?: string;
    dateOfBirth: string;
    postcode: string;
    streetAddress?: string;
    city?: string;
    county?: string;
    notes?: string;
  };
}

export default function GuestBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; time: string } | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [viewCalendarFirst, setViewCalendarFirst] = useState(false);

  const handleSpecialistSelect = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setViewCalendarFirst(false);
    setCurrentStep(2);
  };

  const handleViewCalendarFirst = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setViewCalendarFirst(true);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (date: string, time: string) => {
    setSelectedDateTime({ date, time });
    setCurrentStep(3);
  };

  const { toast } = useToast();

  const handleBookingSubmit = async (guestDetails: BookingData['guestDetails']) => {
    if (selectedSpecialist && selectedDateTime) {
      const completeBookingData: BookingData = {
        specialist: selectedSpecialist,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        guestDetails,
      };
      
      // For demo purposes, log the booking data (would normally save to database)
      console.log('Guest booking submitted:', completeBookingData);
      
      toast({
        title: "Booking Received",
        description: "Your booking request has been submitted successfully!",
      });

      setBookingData(completeBookingData);
      setCurrentStep(4);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SpecialistSelection 
            onSpecialistSelect={handleSpecialistSelect}
            onViewCalendarFirst={handleViewCalendarFirst}
          />
        );
      case 2:
        return (
          <AvailabilityCalendar
            specialist={selectedSpecialist!}
            onTimeSlotSelect={handleTimeSlotSelect}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <GuestBookingForm
            specialist={selectedSpecialist!}
            selectedDateTime={selectedDateTime!}
            onSubmit={handleBookingSubmit}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return <BookingConfirmation bookingData={bookingData!} />;
      default:
        return <SpecialistSelection onSpecialistSelect={handleSpecialistSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-xl text-muted-foreground">
            Choose a specialist and book your consultation in just a few steps
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-8 text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? "text-foreground" : ""}>Select Specialist</span>
              <span className={currentStep >= 2 ? "text-foreground" : ""}>Choose Time</span>
              <span className={currentStep >= 3 ? "text-foreground" : ""}>Your Details</span>
              <span className={currentStep >= 4 ? "text-foreground" : ""}>Confirmation</span>
            </div>
          </div>
        </div>

        {renderCurrentStep()}
      </div>
      <Footer />
    </div>
  );
}