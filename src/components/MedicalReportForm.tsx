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
import { CalendarIcon, User, FileText, Clock, CheckCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MedicalReportFormProps {
  reportType: string;
  reportPrice: string;
  onClose: () => void;
}

export default function MedicalReportForm({ reportType, reportPrice, onClose }: MedicalReportFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: undefined as Date | undefined,
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postcode: "",
      country: "United Kingdom"
    },
    
    // Report Details
    reportType: reportType,
    urgency: "standard",
    preferredDelivery: "email",
    
    // Medical Information
    gpName: "",
    gpAddress: "",
    medicalHistory: "",
    currentConditions: "",
    medications: "",
    
    // Specific Requirements based on report type
    workDetails: "", // For fitness to work
    employerName: "", // For fitness to work
    licenseType: "", // For DVLA
    travelDestination: "", // For travel letters
    departureDate: undefined as Date | undefined, // For travel letters
    insuranceCompany: "", // For insurance reports
    claimNumber: "", // For insurance reports
    
    additionalNotes: ""
  });

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.dateOfBirth) {
        toast({
          title: "Please complete all required fields",
          description: "Personal information is required to proceed.",
          variant: "destructive"
        });
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.address.street || !formData.address.city || !formData.address.postcode) {
        toast({
          title: "Please complete your address",
          description: "Address information is required for the report.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 3) {
      // Submit form
      setSubmitted(true);
      toast({
        title: "Report request submitted!",
        description: "We'll process your request and contact you within the specified timeframe.",
      });
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Request Submitted Successfully!</h2>
            <p className="text-muted-foreground">
              Your {reportType.toLowerCase()} request has been received. We'll review your information and contact you shortly.
            </p>
          </div>
          
          <Card className="text-left">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Request Summary</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Report Type:</strong> {reportType}</p>
                <p><strong>Price:</strong> {reportPrice}</p>
                <p><strong>Patient:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Urgency:</strong> {formData.urgency}</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            <p><strong>What's Next:</strong></p>
            <p>• We'll review your request within 24 hours</p>
            <p>• You'll receive payment instructions via email</p>
            <p>• Report will be delivered as specified</p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Request {reportType}
          </CardTitle>
          <p className="text-muted-foreground">Price: {reportPrice}</p>
        </CardHeader>
      </Card>

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
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
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
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      {formData.dateOfBirth ? (
                        format(formData.dateOfBirth, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => updateFormData('dateOfBirth', date)}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value) => updateFormData('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="urgent">Urgent (+£20)</SelectItem>
                    <SelectItem value="same-day">Same Day (+£50)</SelectItem>
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
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+44 7123 456789"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="preferredDelivery">Preferred Delivery Method</Label>
              <Select value={formData.preferredDelivery} onValueChange={(value) => updateFormData('preferredDelivery', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email (PDF)</SelectItem>
                  <SelectItem value="post">Royal Mail (+£5)</SelectItem>
                  <SelectItem value="recorded">Recorded Delivery (+£10)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext}>
                Next: Address & Medical Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Address & Medical Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Address & Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-medium">Address Information *</h3>
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => updateFormData('address.street', e.target.value)}
                  placeholder="House number and street name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => updateFormData('address.city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode *</Label>
                  <Input
                    id="postcode"
                    value={formData.address.postcode}
                    onChange={(e) => updateFormData('address.postcode', e.target.value)}
                    placeholder="SW1A 1AA"
                  />
                </div>
              </div>
            </div>

            {/* GP Information */}
            <div className="space-y-4">
              <h3 className="font-medium">GP Information</h3>
              <div>
                <Label htmlFor="gpName">GP Name</Label>
                <Input
                  id="gpName"
                  value={formData.gpName}
                  onChange={(e) => updateFormData('gpName', e.target.value)}
                  placeholder="Dr. Smith"
                />
              </div>
              <div>
                <Label htmlFor="gpAddress">GP Practice Address</Label>
                <Input
                  id="gpAddress"
                  value={formData.gpAddress}
                  onChange={(e) => updateFormData('gpAddress', e.target.value)}
                  placeholder="Practice name and address"
                />
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentConditions">Current Medical Conditions</Label>
                <Textarea
                  id="currentConditions"
                  value={formData.currentConditions}
                  onChange={(e) => updateFormData('currentConditions', e.target.value)}
                  placeholder="List any current medical conditions..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                  placeholder="List current medications and dosages..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Previous
              </Button>
              <Button onClick={handleNext}>
                Next: Specific Requirements
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Specific Requirements */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Specific Requirements for {reportType}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fitness to Work specific fields */}
            {reportType.includes("Fitness") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input
                    id="employerName"
                    value={formData.employerName}
                    onChange={(e) => updateFormData('employerName', e.target.value)}
                    placeholder="Your employer's name"
                  />
                </div>
                <div>
                  <Label htmlFor="workDetails">Job Role & Requirements</Label>
                  <Textarea
                    id="workDetails"
                    value={formData.workDetails}
                    onChange={(e) => updateFormData('workDetails', e.target.value)}
                    placeholder="Describe your job role and any specific work requirements..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* DVLA specific fields */}
            {reportType.includes("DVLA") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="licenseType">License Type Required</Label>
                  <Select value={formData.licenseType} onValueChange={(value) => updateFormData('licenseType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car (Category B)</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle (Category A)</SelectItem>
                      <SelectItem value="hgv">HGV (Category C)</SelectItem>
                      <SelectItem value="pcv">PCV (Category D)</SelectItem>
                      <SelectItem value="taxi">Taxi/Private Hire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Travel specific fields */}
            {reportType.includes("Travel") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="travelDestination">Travel Destination</Label>
                  <Input
                    id="travelDestination"
                    value={formData.travelDestination}
                    onChange={(e) => updateFormData('travelDestination', e.target.value)}
                    placeholder="Country/countries you're traveling to"
                  />
                </div>
                <div>
                  <Label>Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formData.departureDate && "text-muted-foreground"
                        )}
                      >
                        {formData.departureDate ? (
                          format(formData.departureDate, "PPP")
                        ) : (
                          <span>Select departure date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.departureDate}
                        onSelect={(date) => updateFormData('departureDate', date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Insurance specific fields */}
            {reportType.includes("Insurance") && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="insuranceCompany">Insurance Company</Label>
                  <Input
                    id="insuranceCompany"
                    value={formData.insuranceCompany}
                    onChange={(e) => updateFormData('insuranceCompany', e.target.value)}
                    placeholder="Name of insurance company"
                  />
                </div>
                <div>
                  <Label htmlFor="claimNumber">Claim Number (if applicable)</Label>
                  <Input
                    id="claimNumber"
                    value={formData.claimNumber}
                    onChange={(e) => updateFormData('claimNumber', e.target.value)}
                    placeholder="Insurance claim reference number"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                placeholder="Any additional information or special requirements..."
                rows={4}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Previous
              </Button>
              <Button onClick={handleNext}>
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}