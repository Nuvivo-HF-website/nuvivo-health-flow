import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Star, ChevronLeft, MapPin, Calendar, Award } from "lucide-react";
import { Location, LocalSpecialist, BloodTest } from "@/pages/BloodTestBooking";

const generateLocalSpecialists = (location: Location): LocalSpecialist[] => {
  if (location.type === 'mobile') {
    return [
      {
        id: "mobile-1",
        name: "Sarah Mitchell",
        location,
        nextAvailable: "Today 2:30 PM",
        rating: 4.9,
        reviewCount: 127
      },
      {
        id: "mobile-2", 
        name: "James Parker",
        location,
        nextAvailable: "Tomorrow 9:00 AM",
        rating: 4.8,
        reviewCount: 93
      }
    ];
  }

  return [
    {
      id: `${location.id}-1`,
      name: "Dr. Emma Thompson",
      location,
      nextAvailable: "Today 11:30 AM",
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: `${location.id}-2`,
      name: "Dr. Michael Chen", 
      location,
      nextAvailable: "Today 2:15 PM",
      rating: 4.8,
      reviewCount: 134
    },
    {
      id: `${location.id}-3`,
      name: "Dr. Lisa Rodriguez",
      location,
      nextAvailable: "Tomorrow 9:00 AM",
      rating: 4.7,
      reviewCount: 98
    },
    {
      id: `${location.id}-4`,
      name: "Dr. David Wilson",
      location,
      nextAvailable: "Tomorrow 1:45 PM",
      rating: 4.9,
      reviewCount: 167
    }
  ];
};

interface LocalSpecialistSelectionProps {
  location: Location;
  selectedTests: BloodTest[];
  onSpecialistSelect: (specialist: LocalSpecialist) => void;
  onBack: () => void;
}

export function LocalSpecialistSelection({ 
  location, 
  selectedTests, 
  onSpecialistSelect, 
  onBack 
}: LocalSpecialistSelectionProps) {
  const [sortBy, setSortBy] = useState<'nextAvailable' | 'rating'>('nextAvailable');
  
  const specialists = generateLocalSpecialists(location);
  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const homeVisitFee = location.type === 'mobile' ? 15 : 0;
  const finalPrice = totalPrice + homeVisitFee;

  const sortedSpecialists = [...specialists].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Sort by availability - today first, then tomorrow, etc.
    const aToday = a.nextAvailable.includes('Today');
    const bToday = b.nextAvailable.includes('Today');
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Locations
      </Button>

      {/* Location & Test Summary */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{location.address}, {location.postcode}</span>
              </div>
              <Badge className={
                location.type === 'clinic' ? 'bg-blue-100 text-blue-800' :
                location.type === 'hospital' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              }>
                {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">£{finalPrice}</p>
              <p className="text-sm text-muted-foreground">
                Tests: £{totalPrice}
                {homeVisitFee > 0 && <span><br />Home visit: £{homeVisitFee}</span>}
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Selected Tests ({selectedTests.length}):</p>
            <p className="text-sm text-muted-foreground">
              {selectedTests.map(test => test.name).join(', ')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sorting Controls */}
      <div className="flex gap-2 mb-6 justify-center">
        <Button
          variant={sortBy === 'nextAvailable' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('nextAvailable')}
        >
          <Clock className="w-4 h-4 mr-2" />
          Earliest Available
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

      {/* Specialists List */}
      <div className="grid gap-4">
        {sortedSpecialists.map((specialist) => (
          <Card key={specialist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" alt={specialist.name} />
                    <AvatarFallback className="text-lg">
                      {specialist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{specialist.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {location.type === 'mobile' ? 'Mobile Phlebotomist' : 'Blood Testing Specialist'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span className="text-muted-foreground">({specialist.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-3">
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Next Available</span>
                    </div>
                    <p className="font-semibold">{specialist.nextAvailable}</p>
                  </div>
                  
                  <Button 
                    onClick={() => onSpecialistSelect(specialist)}
                    className="w-full"
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information Section */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="text-center p-6">
          <Award className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Qualified Professionals</h3>
          <p className="text-sm text-muted-foreground">
            All our {location.type === 'mobile' ? 'mobile phlebotomists' : 'specialists'} are fully qualified and registered with professional bodies.
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
          <p className="text-sm text-muted-foreground">
            {location.type === 'mobile' 
              ? 'We come to you at a time that suits your schedule, including evenings and weekends.'
              : 'Extended opening hours including early morning and evening appointments.'
            }
          </p>
        </Card>
      </div>
    </div>
  );
}