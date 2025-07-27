import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, User, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);

  // Patient details
  const [patientDetails, setPatientDetails] = useState({
    fullName: "",
    dateOfBirth: undefined as Date | undefined,
    sexAtBirth: "",
    email: "",
    phone: "",
    address: { street: "", city: "", postcode: "", country: "United Kingdom" },
    emergencyContact: { name: "", phone: "", relationship: "" },
    medicalNotes: ""
  });

  const availableServices = [
    "Blood Test - Basic Panel",
    "Blood Test - Comprehensive", 
    "Blood Test - Hormone Panel",
    "Blood Test - Vitamin Panel",
    "General Health Consultation",
    "Mental Health Consultation",
    "Nutrition Consultation"
  ];

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const clinicLocations = [
    { value: "london-central", label: "London Central Clinic" },
    { value: "london-west", label: "London West Clinic" },
    { value: "manchester", label: "Manchester Clinic" },
    { value: "birmingham", label: "Birmingham Clinic" }
  ];

  const handleNext = () => {
    if (currentStep === 1 && (!selectedDate || !selectedTime || !selectedService || !selectedLocation)) {
      toast({
        title: "Please complete your booking selection",
        description: "Select date, time, service and location to continue.",
        variant: "destructive"
      });
      return;
    }
    if (currentStep === 2 && (!patientDetails.fullName || !patientDetails.email || !patientDetails.phone || !patientDetails.dateOfBirth || !patientDetails.sexAtBirth)) {
      toast({
        title: "Please complete all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive"
      });
      return;
    }
    if (currentStep === 3 && (!patientDetails.address.street || !patientDetails.address.city || !patientDetails.address.postcode)) {
      toast({
        title: "Please complete your address",
        description: "Address information is required for appointment confirmation.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 3) {
      setBookingComplete(true);
      toast({
        title: "Booking confirmed!",
        description: "We'll send confirmation details to your email.",
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your appointment has been scheduled for {selectedDate?.toDateString()} at {selectedTime}
            </p>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2 text-left">
                  <p><strong>Service:</strong> {selectedService}</p>
                  <p><strong>Location:</strong> {clinicLocations.find(l => l.value === selectedLocation)?.label}</p>
                  <p><strong>Patient:</strong> {patientDetails.fullName}</p>
                  <p><strong>Email:</strong> {patientDetails.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Book Your Appointment</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select your preferred time slot, then provide your details to complete the booking.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {step}
                </div>
                {step < 3 && <div className={cn("w-16 h-0.5 mx-2", step < currentStep ? "bg-primary" : "bg-muted")} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Date, Time & Service */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Select Service *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your service" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Location *</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose clinic location" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinicLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Select Date *</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <Label>Available Times *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext}>Continue to Personal Details</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={patientDetails.fullName}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !patientDetails.dateOfBirth && "text-muted-foreground")}>
                          {patientDetails.dateOfBirth ? format(patientDetails.dateOfBirth, "PPP") : <span>Select date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={patientDetails.dateOfBirth}
                          onSelect={(date) => setPatientDetails(prev => ({ ...prev, dateOfBirth: date }))}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Sex at Birth *</Label>
                    <Select value={patientDetails.sexAtBirth} onValueChange={(value) => setPatientDetails(prev => ({ ...prev, sexAtBirth: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="intersex">Intersex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientDetails.email}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientDetails.phone}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+44 7123 456789"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>Previous</Button>
                  <Button onClick={handleNext}>Continue to Address</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Address & Final Details */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address & Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Address Information *</h3>
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={patientDetails.address.street}
                      onChange={(e) => setPatientDetails(prev => ({ ...prev, address: { ...prev.address, street: e.target.value }}))}
                      placeholder="House number and street name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={patientDetails.address.city}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, address: { ...prev.address, city: e.target.value }}))}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode *</Label>
                      <Input
                        id="postcode"
                        value={patientDetails.address.postcode}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, address: { ...prev.address, postcode: e.target.value }}))}
                        placeholder="SW1A 1AA"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        value={patientDetails.emergencyContact.name}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, name: e.target.value }}))}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={patientDetails.emergencyContact.phone}
                        onChange={(e) => setPatientDetails(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: e.target.value }}))}
                        placeholder="+44 7123 456789"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
                  <Textarea
                    id="medicalNotes"
                    value={patientDetails.medicalNotes}
                    onChange={(e) => setPatientDetails(prev => ({ ...prev, medicalNotes: e.target.value }))}
                    placeholder="Any medical conditions, allergies, or special requirements..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>Previous</Button>
                  <Button onClick={handleNext}>Complete Booking</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;