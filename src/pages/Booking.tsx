import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { BookingOptions } from "@/components/booking/BookingOptions";
import { useAuth } from "@/contexts/AuthContext";

export default function Booking() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {user ? (
          // Show existing booking form for logged-in users
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Book an Appointment</h1>
              <p className="text-xl text-muted-foreground">
                Schedule your health consultation with our experienced professionals
              </p>
            </div>
            <BookingForm />
          </>
        ) : (
          // Show booking options for non-logged-in users
          <BookingOptions />
        )}
      </div>
      <Footer />
    </div>
  );
}