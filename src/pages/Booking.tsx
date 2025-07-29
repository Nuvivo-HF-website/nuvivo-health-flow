import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookingOptions } from '@/components/booking/BookingOptions'

export default function Booking() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BookingOptions />
      </main>
      <Footer />
    </div>
  )
}