import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Specialist } from "@/pages/GuestBooking";

interface PostcodeResult {
  formatted_address: string;
  thoroughfare?: string;
  locality?: string;
  administrative_area?: string;
  postal_code?: string;
}

interface GuestBookingFormProps {
  specialist: Specialist;
  selectedDateTime: { date: string; time: string };
  onSubmit: (guestDetails: any) => void;
  onBack: () => void;
}

export function GuestBookingForm({ 
  specialist, 
  selectedDateTime, 
  onSubmit, 
  onBack 
}: GuestBookingFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    sexAtBirth: "",
    genderIdentity: "",
    genderSelfDescribe: "",
    dateOfBirth: undefined as Date | undefined,
    postcode: "",
    streetAddress: "",
    city: "",
    county: "",
    notes: "",
  });

  const [showManualAddress, setShowManualAddress] = useState(false);
  const [postcodeResults, setPostcodeResults] = useState<PostcodeResult[]>([]);
  const [isLoadingPostcode, setIsLoadingPostcode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes('@')) newErrors.email = "Valid email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.sexAtBirth) newErrors.sexAtBirth = "Sex at birth is required";
    if (!formData.genderIdentity) newErrors.genderIdentity = "Gender identity is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";

    if (showManualAddress) {
      if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        sexAtBirth: formData.sexAtBirth,
        genderIdentity: formData.genderIdentity,
        genderSelfDescribe: formData.genderSelfDescribe,
        dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0],
        postcode: formData.postcode,
        streetAddress: formData.streetAddress,
        city: formData.city,
        county: formData.county,
        notes: formData.notes,
      });
    }
  };

  // Mock postcode lookup
  const handlePostcodeLookup = async () => {
    if (!formData.postcode.trim()) return;
    
    setIsLoadingPostcode(true);
    // Simulate API call
    setTimeout(() => {
      setPostcodeResults([
        {
          formatted_address: "123 High Street, London, SW1A 1AA",
          thoroughfare: "123 High Street",
          locality: "London",
          administrative_area: "Greater London",
          postal_code: formData.postcode,
        },
        {
          formatted_address: "456 High Street, London, SW1A 1AA", 
          thoroughfare: "456 High Street",
          locality: "London",
          administrative_area: "Greater London",
          postal_code: formData.postcode,
        }
      ]);
      setIsLoadingPostcode(false);
    }, 1000);
  };

  const selectAddress = (result: PostcodeResult) => {
    setFormData(prev => ({
      ...prev,
      streetAddress: result.thoroughfare || "",
      city: result.locality || "",
      county: result.administrative_area || "",
    }));
    setPostcodeResults([]);
  };

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-UK', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Calendar
      </Button>

      {/* Booking Summary */}
      <Card className="mb-6">
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={specialist.image} alt={specialist.name} />
            <AvatarFallback>
              {specialist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{specialist.name}</h3>
            <Badge variant="secondary" className="mb-1">
              {specialist.specialty}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {formatSelectedDate(selectedDateTime.date)} at {selectedDateTime.time}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">£{specialist.price}</p>
            <p className="text-sm text-muted-foreground">per consultation</p>
          </div>
        </CardContent>
      </Card>

      {/* Guest Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please enter your details to confirm your booking
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className={errors.mobile ? "border-destructive" : ""}
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground",
                        errors.dateOfBirth && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? (
                        format(formData.dateOfBirth, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => handleInputChange("dateOfBirth", date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>

            {/* Gender Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sexAtBirth">Sex at Birth *</Label>
                <Select onValueChange={(value) => handleInputChange("sexAtBirth", value)}>
                  <SelectTrigger className={errors.sexAtBirth ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select sex at birth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="intersex">Intersex</SelectItem>
                    <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sexAtBirth && (
                  <p className="text-sm text-destructive mt-1">{errors.sexAtBirth}</p>
                )}
              </div>

              <div>
                <Label htmlFor="genderIdentity">Gender Identity *</Label>
                <Select onValueChange={(value) => handleInputChange("genderIdentity", value)}>
                  <SelectTrigger className={errors.genderIdentity ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select gender identity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="man">Man</SelectItem>
                    <SelectItem value="woman">Woman</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                    <SelectItem value="self-describe">Self-describe</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genderIdentity && (
                  <p className="text-sm text-destructive mt-1">{errors.genderIdentity}</p>
                )}
              </div>
            </div>

            {formData.genderIdentity === "self-describe" && (
              <div>
                <Label htmlFor="genderSelfDescribe">Please specify</Label>
                <Input
                  id="genderSelfDescribe"
                  value={formData.genderSelfDescribe}
                  onChange={(e) => handleInputChange("genderSelfDescribe", e.target.value)}
                  placeholder="Enter your gender identity"
                />
              </div>
            )}

            {/* Address Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange("postcode", e.target.value)}
                    className={`flex-1 ${errors.postcode ? "border-destructive" : ""}`}
                    placeholder="Enter postcode"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePostcodeLookup}
                    disabled={isLoadingPostcode || !formData.postcode.trim()}
                  >
                    {isLoadingPostcode ? "Searching..." : "Search"}
                  </Button>
                </div>
                {errors.postcode && (
                  <p className="text-sm text-destructive mt-1">{errors.postcode}</p>
                )}
              </div>

              {postcodeResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Select your address:</Label>
                  {postcodeResults.map((result, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className="w-full justify-start h-auto py-2 px-3"
                      onClick={() => selectAddress(result)}
                    >
                      {result.formatted_address}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowManualAddress(true)}
                    className="text-sm"
                  >
                    Enter address manually
                  </Button>
                </div>
              )}

              {(showManualAddress || formData.streetAddress) && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="streetAddress">Street Address *</Label>
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                      className={errors.streetAddress ? "border-destructive" : ""}
                    />
                    {errors.streetAddress && (
                      <p className="text-sm text-destructive mt-1">{errors.streetAddress}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City/Town *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="county">County</Label>
                    <Input
                      id="county"
                      value={formData.county}
                      onChange={(e) => handleInputChange("county", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information or special requirements"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              Confirm Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}