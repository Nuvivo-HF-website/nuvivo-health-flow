import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Star, Award, MapPin, Video, Home } from "lucide-react";
import { Specialist } from "@/pages/GuestBooking";

// Enhanced specialist data with next availability and ratings
const mockSpecialists: Specialist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Practice",
    price: 85,
    qualifications: "MBBS, MRCGP",
    bio: "Experienced GP with 15+ years in primary care and preventive medicine.",
    image: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 156,
    nextAvailable: "Today 2:30 PM",
    duration: "30 min",
    locations: ["Online", "Clinic"],
    languages: ["English", "Spanish"]
  },
  {
    id: "2", 
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    price: 150,
    qualifications: "MBBS, MD, FRCP",
    bio: "Consultant cardiologist specializing in heart disease prevention and treatment.",
    image: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 89,
    nextAvailable: "Tomorrow 9:00 AM",
    duration: "45 min",
    locations: ["Online", "Clinic", "Home"],
    languages: ["English", "Mandarin"]
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez", 
    specialty: "Dermatology",
    price: 120,
    qualifications: "MBBS, MD, FAAD",
    bio: "Expert in skin conditions, cosmetic dermatology, and skin cancer screening.",
    image: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 203,
    nextAvailable: "Today 4:45 PM",
    duration: "30 min",
    locations: ["Online", "Clinic"],
    languages: ["English", "French"]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Mental Health", 
    price: 95,
    qualifications: "MBBS, MRCPsych",
    bio: "Psychiatrist focusing on anxiety, depression, and stress management.",
    image: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 134,
    nextAvailable: "Today 6:00 PM",
    duration: "50 min",
    locations: ["Online"],
    languages: ["English"]
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialty: "Nutrition",
    price: 75,
    qualifications: "BSc, MSc, RD",
    bio: "Registered dietitian specializing in weight management and metabolic health.",
    image: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 67,
    nextAvailable: "Tomorrow 11:30 AM",
    duration: "40 min",
    locations: ["Online", "Clinic"],
    languages: ["English"]
  },
  {
    id: "6",
    name: "Dr. David Kumar",
    specialty: "Endocrinology",
    price: 140,
    qualifications: "MBBS, MD, FRCP",
    bio: "Endocrinologist expert in diabetes, thyroid disorders, and hormone health.",
    image: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 112,
    nextAvailable: "Thursday 2:15 PM",
    duration: "40 min",
    locations: ["Online", "Clinic", "Home"],
    languages: ["English", "Hindi"]
  }
];

interface SpecialistSelectionProps {
  onSpecialistSelect: (specialist: Specialist) => void;
  onViewCalendarFirst?: (specialist: Specialist) => void;
}

export function SpecialistSelection({ onSpecialistSelect, onViewCalendarFirst }: SpecialistSelectionProps) {
  const [sortBy, setSortBy] = useState<'nextAvailable' | 'price' | 'rating'>('nextAvailable');

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'Online': return <Video className="w-3 h-3" />;
      case 'Home': return <Home className="w-3 h-3" />;
      case 'Clinic': return <MapPin className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const sortedSpecialists = [...mockSpecialists].sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price - b.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'nextAvailable': 
        // Simple availability sorting - today first, then tomorrow, etc.
        const aToday = a.nextAvailable?.includes('Today');
        const bToday = b.nextAvailable?.includes('Today');
        if (aToday && !bToday) return -1;
        if (!aToday && bToday) return 1;
        return 0;
      default: return 0;
    }
  });

  return (
    <div>
      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <Button
          variant={sortBy === 'nextAvailable' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('nextAvailable')}
        >
          <Clock className="w-4 h-4 mr-2" />
          Earliest Available
        </Button>
        <Button
          variant={sortBy === 'price' ? 'default' : 'outline'}
          size="sm" 
          onClick={() => setSortBy('price')}
        >
          Lowest Price
        </Button>
        <Button
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('rating')}
        >
          <Star className="w-4 h-4 mr-2" />
          Highest Rated
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedSpecialists.map((specialist) => (
          <Card key={specialist.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="relative">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={specialist.image} alt={specialist.name} />
                  <AvatarFallback className="text-lg">
                    {specialist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {specialist.nextAvailable?.includes('Today') && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                    Available Today
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{specialist.name}</CardTitle>
              <Badge variant="secondary" className="w-fit mx-auto">
                {specialist.specialty}
              </Badge>
              <p className="text-sm text-muted-foreground">{specialist.qualifications}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center space-x-1 mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{specialist.rating}</span>
                <span className="text-sm text-muted-foreground">({specialist.reviewCount} reviews)</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-center">{specialist.bio}</p>
              
              {/* Next Available Slot - Prominent */}
              <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Next Available</span>
                </div>
                <p className="font-semibold text-lg">{specialist.nextAvailable}</p>
                <p className="text-sm text-muted-foreground">{specialist.duration} consultation</p>
              </div>

              {/* Available Locations */}
              <div className="flex flex-wrap justify-center gap-2">
                {specialist.locations?.map((location, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs flex items-center space-x-1">
                    {getLocationIcon(location)}
                    <span>{location}</span>
                  </Badge>
                ))}
              </div>

              {/* Languages */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Languages: {specialist.languages?.join(', ')}
                </p>
              </div>
              
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">£{specialist.price}</span>
                <span className="text-sm text-muted-foreground ml-1">per consultation</span>
              </div>
            </CardContent>
            
            <CardFooter className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => onSpecialistSelect(specialist)}
              >
                Book {specialist.nextAvailable}
              </Button>
              
              {onViewCalendarFirst && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onViewCalendarFirst(specialist)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Calendar
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Helpful Information Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Quick Booking</h3>
          <p className="text-sm text-muted-foreground">
            Book in under 3 minutes. Get instant confirmation and reminders.
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <Award className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Qualified Experts</h3>
          <p className="text-sm text-muted-foreground">
            All specialists are GMC registered with verified qualifications.
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <Video className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Flexible Options</h3>
          <p className="text-sm text-muted-foreground">
            Choose online, clinic, or home visits based on your preference.
          </p>
        </Card>
      </div>
    </div>
  );
}