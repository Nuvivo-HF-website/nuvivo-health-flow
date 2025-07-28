import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";

export default function Booking() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-xl text-muted-foreground">
            Schedule your health consultation with our experienced professionals
          </p>
        </div>
        <BookingForm />
      </div>
      <Footer />
    </div>
  );
}