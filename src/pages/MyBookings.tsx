import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function MyBookings() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Bookings</h1>
          <p className="text-xl text-muted-foreground">
            View and manage your appointments and consultations
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Bookings
            </CardTitle>
            <CardDescription>
              Your upcoming and past appointments will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground">
              Book a consultation to see your appointments here
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}