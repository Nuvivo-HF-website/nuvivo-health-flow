import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BloodTestSelection } from "@/components/booking/BloodTestSelection";
import { LocationSelector } from "@/components/booking/LocationSelector";
import { LocalSpecialistSelection } from "@/components/booking/LocalSpecialistSelection";
import { BloodTestCalendar } from "@/components/booking/BloodTestCalendar";
import { GuestBookingForm } from "@/components/booking/GuestBookingForm";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";

export interface BloodTest {
  id: string;
  name: string;
  description: string;
  price: number;
  preparationTime: string;
  fastingRequired: boolean;
  resultsTime: string;
  category: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  postcode: string;
  distance?: number;
  type: 'clinic' | 'hospital' | 'mobile';
}

export interface LocalSpecialist {
  id: string;
  name: string;
  location: Location;
  nextAvailable: string;
  rating: number;
  reviewCount: number;
}

export interface BloodTestBookingData {
  tests: BloodTest[];
  location: Location;
  specialist: LocalSpecialist;
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

export default function BloodTestBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState<BloodTest[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<LocalSpecialist | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; time: string } | null>(null);
  const [bookingData, setBookingData] = useState<BloodTestBookingData | null>(null);

  const handleTestsSelect = (tests: BloodTest[]) => {
    setSelectedTests(tests);
    setCurrentStep(2);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setCurrentStep(3);
  };

  const handleSpecialistSelect = (specialist: LocalSpecialist) => {
    setSelectedSpecialist(specialist);
    setCurrentStep(4);
  };

  const handleTimeSlotSelect = (date: string, time: string) => {
    setSelectedDateTime({ date, time });
    setCurrentStep(5);
  };

  const handleBookingSubmit = (guestDetails: BloodTestBookingData['guestDetails']) => {
    if (selectedTests.length > 0 && selectedLocation && selectedSpecialist && selectedDateTime) {
      const completeBookingData: BloodTestBookingData = {
        tests: selectedTests,
        location: selectedLocation,
        specialist: selectedSpecialist,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        guestDetails,
      };
      setBookingData(completeBookingData);
      setCurrentStep(6);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BloodTestSelection onTestsSelect={handleTestsSelect} />;
      case 2:
        return (
          <LocationSelector
            selectedTests={selectedTests}
            onLocationSelect={handleLocationSelect}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <LocalSpecialistSelection
            location={selectedLocation!}
            selectedTests={selectedTests}
            onSpecialistSelect={handleSpecialistSelect}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <BloodTestCalendar
            specialist={selectedSpecialist!}
            tests={selectedTests}
            onTimeSlotSelect={handleTimeSlotSelect}
            onBack={() => setCurrentStep(3)}
          />
        );
      case 5:
        return (
          <GuestBookingForm
            specialist={{
              id: selectedSpecialist!.id,
              name: selectedSpecialist!.name,
              specialty: "Blood Testing",
              price: selectedTests.reduce((total, test) => total + test.price, 0),
              qualifications: "Phlebotomist",
              bio: `Blood testing specialist at ${selectedSpecialist!.location.name}`,
            }}
            selectedDateTime={selectedDateTime!}
            onSubmit={handleBookingSubmit}
            onBack={() => setCurrentStep(4)}
          />
        );
      case 6:
        return <BookingConfirmation bookingData={{
          specialist: {
            id: selectedSpecialist!.id,
            name: selectedSpecialist!.name,
            specialty: "Blood Testing",
            price: selectedTests.reduce((total, test) => total + test.price, 0),
          },
          date: selectedDateTime!.date,
          time: selectedDateTime!.time,
          guestDetails: bookingData!.guestDetails,
        }} />;
      default:
        return <BloodTestSelection onTestsSelect={handleTestsSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Book Blood Tests</h1>
          <p className="text-xl text-muted-foreground">
            Choose your tests, find a convenient location, and book your appointment
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
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
                {step < 6 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <span className={currentStep >= 1 ? "text-foreground" : ""}>Tests</span>
              <span className={currentStep >= 2 ? "text-foreground" : ""}>Location</span>
              <span className={currentStep >= 3 ? "text-foreground" : ""}>Specialist</span>
              <span className={currentStep >= 4 ? "text-foreground" : ""}>Time</span>
              <span className={currentStep >= 5 ? "text-foreground" : ""}>Details</span>
              <span className={currentStep >= 6 ? "text-foreground" : ""}>Confirm</span>
            </div>
          </div>
        </div>

        {renderCurrentStep()}
      </div>
      <Footer />
    </div>
  );
}