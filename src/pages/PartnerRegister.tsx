import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // if you don't have this, swap for <textarea className="...">
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type AccountType = "individual" | "clinic";

export default function PartnerProfessionalDetails() {
  const navigate = useNavigate();

  // Pull data from first page
  const baseDataRaw = sessionStorage.getItem("partnerRegisterData");
  const baseData = baseDataRaw ? JSON.parse(baseDataRaw) as {
    accountType: AccountType;
    firstName?: string;
    lastName?: string;
    clinicName?: string;
    email: string;
    mobile: string;
    password: string;
  } : null;

  React.useEffect(() => {
    if (!baseData) {
      // if user landed here directly, push them back
      navigate("/partner-register");
    }
  }, [baseData, navigate]);

  if (!baseData) return null;

  const isClinic = baseData.accountType === "clinic";

  // --- Individual (doctor/professional) fields ---
  const [indData, setIndData] = React.useState({
    professionalTitle: "",
    regulatoryBody: "",     // e.g., GMC/GDC/HCPC
    registrationNumber: "",
    specialty: "",
    yearsExperience: "",
    bio: "",
    consultationModes: [] as string[], // you can model as checkboxes if you want
    baseLocation: "",
    priceFrom: "",
    website: "",
  });

  // --- Clinic fields (DIFFERENT FROM DOCTOR) ---
  const [clinicData, setClinicData] = React.useState({
    clinicName: baseData.clinicName || "",
    clinicType: "Clinic",               // Clinic | Health Centre | Private Hospital
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    website: "",
    landline: "",
    openingHours: "",
    servicesOffered: "",
    cqcNumber: "",                      // UK regulator (optional/required—set as you wish)
    numberOfDoctors: 1,                 // REQUIRED
    numberOfLocations: 1,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isClinic) {
      // Minimal validation
      if (!clinicData.clinicName || !clinicData.address1 || !clinicData.city || !clinicData.postcode) {
        toast({
          title: "Missing information",
          description: "Please complete clinic name and address details.",
          variant: "destructive",
        });
        return;
      }
      if (!clinicData.numberOfDoctors || clinicData.numberOfDoctors < 1) {
        toast({
          title: "Number of doctors",
          description: "Please enter how many doctors the clinic wants to register (at least 1).",
          variant: "destructive",
        });
        return;
      }

      sessionStorage.setItem(
        "partnerProfessionalDetails",
        JSON.stringify({ type: "clinic", ...clinicData })
      );
    } else {
      // Individual checks
      if (!indData.regulatoryBody || !indData.registrationNumber || !indData.specialty) {
        toast({
          title: "Missing professional details",
          description: "Please enter regulatory body, registration number, and specialty.",
          variant: "destructive",
        });
        return;
      }

      sessionStorage.setItem(
        "partnerProfessionalDetails",
        JSON.stringify({ type: "individual", ...indData })
      );
    }

    // Continue to the next step (review/submit or onboarding)
    navigate("/partner-review"); // create this route or change to your next step
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isClinic ? "Clinic Details" : "Professional Details"}
          </h1>
          <p className="text-muted-foreground">
            {isClinic
              ? "Provide essential information about your clinic to complete registration."
              : "Provide your professional credentials and practice details."}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isClinic ? "Clinic Profile" : "Professional Profile"}</CardTitle>
            <CardDescription>
              {isClinic
                ? "These details help us set up your clinic’s partner account correctly."
                : "These details help us set up your professional profile."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* CLINIC FORM */}
              {isClinic && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Clinic Name *</Label>
                      <Input
                        id="clinicName"
                        value={clinicData.clinicName}
                        onChange={(e) =>
                          setClinicData((s) => ({ ...s, clinicName: e.target.value }))
                        }
                        placeholder="Active Health Clinic"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Clinic Type</Label>
                      <Select
                        value={clinicData.clinicType}
                        onValueChange={(v) => setClinicData((s) => ({ ...s, clinicType: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clinic">Clinic</SelectItem>
                          <SelectItem value="Health Centre">Health Centre</SelectItem>
                          <SelectItem value="Private Hospital">Private Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Input
                      placeholder="Address line 1"
                      value={clinicData.address1}
                      onChange={(e) => setClinicData((s) => ({ ...s, address1: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Address line 2 (optional)"
                      value={clinicData.address2}
                      onChange={(e) => setClinicData((s) => ({ ...s, address2: e.target.value }))}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={clinicData.city}
                        onChange={(e) => setClinicData((s) => ({ ...s, city: e.target.value }))}
                        required
                      />
                      <Input
                        placeholder="Postcode"
                        value={clinicData.postcode}
                        onChange={(e) => setClinicData((s) => ({ ...s, postcode: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://yourclinic.co.uk"
                        value={clinicData.website}
                        onChange={(e) =>
                          setClinicData((s) => ({ ...s, website: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landline">Clinic Landline</Label>
                      <Input
                        id="landline"
                        type="tel"
                        placeholder="+44 20 XXXX XXXX"
                        value={clinicData.landline}
                        onChange={(e) =>
                          setClinicData((s) => ({ ...s, landline: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfDoctors">Number of Doctors *</Label>
                      <Input
                        id="numberOfDoctors"
                        type="number"
                        min={1}
                        value={clinicData.numberOfDoctors}
                        onChange={(e) =>
                          setClinicData((s) => ({
                            ...s,
                            numberOfDoctors: Number(e.target.value || 0),
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfLocations">Number of Locations</Label>
                      <Input
                        id="numberOfLocations"
                        type="number"
                        min={1}
                        value={clinicData.numberOfLocations}
                        onChange={(e) =>
                          setClinicData((s) => ({
                            ...s,
                            numberOfLocations: Number(e.target.value || 0),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openingHours">Opening Hours</Label>
                      <Input
                        id="openingHours"
                        placeholder="Mon–Fri 08:00–18:00"
                        value={clinicData.openingHours}
                        onChange={(e) =>
                          setClinicData((s) => ({ ...s, openingHours: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cqcNumber">CQC Registration (optional)</Label>
                      <Input
                        id="cqcNumber"
                        value={clinicData.cqcNumber}
                        onChange={(e) =>
                          setClinicData((s) => ({ ...s, cqcNumber: e.target.value }))
                        }
                        placeholder="e.g., 1-123456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="servicesOffered">Services Offered</Label>
                    <Textarea
                      id="servicesOffered"
                      placeholder="Briefly describe the services your clinic provides"
                      value={clinicData.servicesOffered}
                      onChange={(e) =>
                        setClinicData((s) => ({ ...s, servicesOffered: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}

              {/* INDIVIDUAL FORM */}
              {!isClinic && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="professionalTitle">Professional Title</Label>
                      <Input
                        id="professionalTitle"
                        placeholder="Dr / Mr / Ms / Therapist"
                        value={indData.professionalTitle}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, professionalTitle: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regulatoryBody">Regulatory Body *</Label>
                      <Input
                        id="regulatoryBody"
                        placeholder="GMC / GDC / HCPC"
                        value={indData.regulatoryBody}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, regulatoryBody: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number *</Label>
                      <Input
                        id="registrationNumber"
                        value={indData.registrationNumber}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, registrationNumber: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Input
                        id="specialty"
                        placeholder="e.g., Cardiology, Endocrinology"
                        value={indData.specialty}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, specialty: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of Experience</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        min={0}
                        value={indData.yearsExperience}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, yearsExperience: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseLocation">Base Location</Label>
                      <Input
                        id="baseLocation"
                        placeholder="City / Region"
                        value={indData.baseLocation}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, baseLocation: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Short Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell patients about your expertise and approach"
                      value={indData.bio}
                      onChange={(e) => setIndData((s) => ({ ...s, bio: e.target.value }))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceFrom">Price From (£)</Label>
                      <Input
                        id="priceFrom"
                        type="number"
                        min={0}
                        value={indData.priceFrom}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, priceFrom: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://example.com"
                        value={indData.website}
                        onChange={(e) =>
                          setIndData((s) => ({ ...s, website: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg">
                  Continue
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
