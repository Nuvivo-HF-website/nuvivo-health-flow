import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CalendarIcon, User, MapPin, Clock, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PatientDetails {
  fullName: string;
  dateOfBirth: Date | undefined;
  sexAtBirth: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalNotes: string;
}

interface BookingDetails {
  service: string;
  appointmentDate: Date | undefined;
  appointmentTime: string;
  location: string;
  locationType: string;
}

interface PatientBookingFormProps {
  selectedService?: string;
  onBookingComplete?: (patientDetails: PatientDetails, bookingDetails: BookingDetails) => void;
}

export default function PatientBookingForm({ 
  selectedService = "",
  onBookingComplete 
}: PatientBookingFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Patient Details State
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    fullName: "",
    dateOfBirth: undefined,
    sexAtBirth: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postcode: "",
      country: "United Kingdom"
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    medicalNotes: ""
  });

  // Booking Details State
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    service: selectedService,
    appointmentDate: undefined,
    appointmentTime: "",
    location: "",
    locationType: ""
  });

  const availableServices = [
    "Blood Test - Basic Panel",
    "Blood Test - Comprehensive",
    "Blood Test - Hormone Panel",
    "Blood Test - Vitamin Panel",
    "General Health Consultation",
    "Mental Health Consultation",
    "Nutrition Consultation",
    "Sexual Health Consultation",
    "Second Opinion Consultation"
  ];

  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          patientDetails.fullName &&
          patientDetails.dateOfBirth &&
          patientDetails.sexAtBirth &&
          patientDetails.email &&
          patientDetails.phone
        );
      case 2:
        return !!(
          patientDetails.address.street &&
          patientDetails.address.city &&
          patientDetails.address.postcode &&
          patientDetails.emergencyContact.name &&
          patientDetails.emergencyContact.phone
        );
      case 3:
        return !!(
          bookingDetails.service &&
          bookingDetails.appointmentDate &&
          bookingDetails.appointmentTime &&
          bookingDetails.locationType
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Please complete all required fields",
        description: "All fields marked with * are required to continue.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      onBookingComplete?.(patientDetails, bookingDetails);
      toast({
        title: "Booking submitted successfully!",
        description: "We'll send you a confirmation email shortly with your appointment details.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-2",
                  step < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={patientDetails.fullName}
                  onChange={(e) => setPatientDetails(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name as it appears on ID"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date of Birth *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !patientDetails.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        {patientDetails.dateOfBirth ? (
                          format(patientDetails.dateOfBirth, "PPP")
                        ) : (
                          <span>Select date</span>
                        )}
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
                  <Label htmlFor="sexAtBirth">Sex at Birth *</Label>
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
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext}>
                Next: Address Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Address & Emergency Contact */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address & Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-medium">Address Information *</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={patientDetails.address.street}
                    onChange={(e) => setPatientDetails(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    placeholder="House number and street name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={patientDetails.address.city}
                      onChange={(e) => setPatientDetails(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={patientDetails.address.postcode}
                      onChange={(e) => setPatientDetails(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, postcode: e.target.value }
                      }))}
                      placeholder="SW1A 1AA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="font-medium">Emergency Contact *</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    value={patientDetails.emergencyContact.name}
                    onChange={(e) => setPatientDetails(prev => ({ 
                      ...prev, 
                      emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                    }))}
                    placeholder="Emergency contact full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={patientDetails.emergencyContact.phone}
                      onChange={(e) => setPatientDetails(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      placeholder="+44 7123 456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select 
                      value={patientDetails.emergencyContact.relationship} 
                      onValueChange={(value) => setPatientDetails(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, relationship: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Notes */}
            <div>
              <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
              <Textarea
                id="medicalNotes"
                value={patientDetails.medicalNotes}
                onChange={(e) => setPatientDetails(prev => ({ ...prev, medicalNotes: e.target.value }))}
                placeholder="Any medical conditions, allergies, or special requirements we should know about..."
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Previous
              </Button>
              <Button onClick={handleNext}>
                Next: Appointment Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Appointment Details */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="service">Service *</Label>
              <Select 
                value={bookingDetails.service} 
                onValueChange={(value) => setBookingDetails(prev => ({ ...prev, service: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !bookingDetails.appointmentDate && "text-muted-foreground"
                      )}
                    >
                      {bookingDetails.appointmentDate ? (
                        format(bookingDetails.appointmentDate, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingDetails.appointmentDate}
                      onSelect={(date) => setBookingDetails(prev => ({ ...prev, appointmentDate: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="appointmentTime">Time *</Label>
                <Select 
                  value={bookingDetails.appointmentTime} 
                  onValueChange={(value) => setBookingDetails(prev => ({ ...prev, appointmentTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="locationType">Appointment Type *</Label>
              <Select 
                value={bookingDetails.locationType} 
                onValueChange={(value) => setBookingDetails(prev => ({ ...prev, locationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic">Clinic Visit</SelectItem>
                  <SelectItem value="home">Home Visit</SelectItem>
                  <SelectItem value="video">Video Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bookingDetails.locationType === "clinic" && (
              <div>
                <Label htmlFor="location">Clinic Location *</Label>
                <Select 
                  value={bookingDetails.location} 
                  onValueChange={(value) => setBookingDetails(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="london-central">London Central Clinic</SelectItem>
                    <SelectItem value="london-west">London West Clinic</SelectItem>
                    <SelectItem value="manchester">Manchester Clinic</SelectItem>
                    <SelectItem value="birmingham">Birmingham Clinic</SelectItem>
                    <SelectItem value="leeds">Leeds Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Previous
              </Button>
              <Button onClick={handleSubmit}>
                Complete Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}