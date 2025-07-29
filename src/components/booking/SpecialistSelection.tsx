import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Specialist } from "@/pages/GuestBooking";

// Mock specialists data
const mockSpecialists: Specialist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Practice",
    price: 85,
    qualifications: "MBBS, MRCGP",
    bio: "Experienced GP with 15+ years in primary care and preventive medicine.",
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    price: 150,
    qualifications: "MBBS, MD, FRCP",
    bio: "Consultant cardiologist specializing in heart disease prevention and treatment.",
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    price: 120,
    qualifications: "MBBS, MD, FAAD",
    bio: "Expert in skin conditions, cosmetic dermatology, and skin cancer screening.",
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Mental Health",
    price: 95,
    qualifications: "MBBS, MRCPsych",
    bio: "Psychiatrist focusing on anxiety, depression, and stress management.",
    image: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialty: "Nutrition",
    price: 75,
    qualifications: "BSc, MSc, RD",
    bio: "Registered dietitian specializing in weight management and metabolic health.",
    image: "/placeholder.svg"
  },
  {
    id: "6",
    name: "Dr. David Kumar",
    specialty: "Endocrinology",
    price: 140,
    qualifications: "MBBS, MD, FRCP",
    bio: "Endocrinologist expert in diabetes, thyroid disorders, and hormone health.",
    image: "/placeholder.svg"
  }
];

interface SpecialistSelectionProps {
  onSpecialistSelect: (specialist: Specialist) => void;
}

export function SpecialistSelection({ onSpecialistSelect }: SpecialistSelectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockSpecialists.map((specialist) => (
        <Card key={specialist.id} className="h-full flex flex-col">
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={specialist.image} alt={specialist.name} />
              <AvatarFallback className="text-lg">
                {specialist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{specialist.name}</CardTitle>
            <Badge variant="secondary" className="w-fit mx-auto">
              {specialist.specialty}
            </Badge>
            <p className="text-sm text-muted-foreground">{specialist.qualifications}</p>
          </CardHeader>
          
          <CardContent className="flex-1">
            <p className="text-sm text-center mb-4">{specialist.bio}</p>
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">£{specialist.price}</span>
              <span className="text-sm text-muted-foreground ml-1">per consultation</span>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => onSpecialistSelect(specialist)}
            >
              Book Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}