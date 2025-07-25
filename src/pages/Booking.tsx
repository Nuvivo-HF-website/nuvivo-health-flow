import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Book Your Appointment</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Schedule your blood test or consultation with our qualified healthcare professionals. 
            Choose your preferred date, time, and location.
          </p>
        </div>

        <BookingCalendar />
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;