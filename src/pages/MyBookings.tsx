import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppointmentList } from "@/components/AppointmentList";
import { useAuth } from "@/contexts/AuthContext";

export default function MyBookings() {
  const { user, userProfile } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to view your bookings.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Appointments</h1>
          <p className="text-xl text-muted-foreground">
            View and manage your upcoming and past appointments
          </p>
        </div>
        <AppointmentList viewType="patient" />
      </div>
      <Footer />
    </div>
  );
}