import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ConsultationBooking } from '@/components/ConsultationBooking'

export default function Booking() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule a consultation with our healthcare professionals. Choose from various specialties and get expert medical advice.
          </p>
        </div>
        <ConsultationBooking />
      </main>
      <Footer />
    </div>
  )
}