import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Clock, Star, ChevronLeft, Car, Train, Building } from "lucide-react";
import { BloodTest, Location } from "@/pages/BloodTestBooking";

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Nuvivo Health Centre - Central London",
    address: "123 Harley Street, Marylebone",
    postcode: "W1G 6BA",
    distance: 0.5,
    type: "clinic"
  },
  {
    id: "2", 
    name: "The London Clinic",
    address: "20 Devonshire Place, Marylebone",
    postcode: "W1G 6BW",
    distance: 0.8,
    type: "clinic"
  },
  {
    id: "3",
    name: "BMI The Princess Grace Hospital",
    address: "42-52 Nottingham Place",
    postcode: "W1U 5NY",
    distance: 1.2,
    type: "hospital"
  },
  {
    id: "4",
    name: "Nuvivo Mobile Service",
    address: "Home Visit Service",
    postcode: "Available in your area",
    distance: 0,
    type: "mobile"
  },
  {
    id: "5",
    name: "Spire London East Hospital",
    address: "9 Alie Street, Whitechapel",
    postcode: "E1 8DE",
    distance: 3.2,
    type: "hospital"
  },
  {
    id: "6",
    name: "Nuvivo Health Centre - Canary Wharf",
    address: "25 Canada Square, Canary Wharf",
    postcode: "E14 5LQ",
    distance: 4.1,
    type: "clinic"
  }
];

interface LocationSelectorProps {
  selectedTests: BloodTest[];
  onLocationSelect: (location: Location) => void;
  onBack: () => void;
}

export function LocationSelector({ selectedTests, onLocationSelect, onBack }: LocationSelectorProps) {
  const [postcode, setPostcode] = useState("");
  const [sortBy, setSortBy] = useState<'distance' | 'type'>('distance');
  const [filterType, setFilterType] = useState<'all' | 'clinic' | 'hospital' | 'mobile'>('all');
  const [locations, setLocations] = useState(mockLocations);

  const totalPrice = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'clinic': return <Building className="w-4 h-4 text-blue-600" />;
      case 'hospital': return <Building className="w-4 h-4 text-red-600" />;
      case 'mobile': return <Car className="w-4 h-4 text-green-600" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'clinic': return 'bg-blue-100 text-blue-800';
      case 'hospital': return 'bg-red-100 text-red-800';
      case 'mobile': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePostcodeSearch = () => {
    // Simulate postcode search - in real app would call API
    if (postcode.trim()) {
      setLocations(mockLocations.map(loc => ({
        ...loc,
        distance: Math.random() * 5 + 0.5 // Random distance for demo
      })));
    }
  };

  const filteredAndSortedLocations = locations
    .filter(location => filterType === 'all' || location.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance || 0) - (b.distance || 0);
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Tests
      </Button>

      {/* Test Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Selected Tests ({selectedTests.length})</h3>
              <p className="text-sm text-muted-foreground">
                {selectedTests.map(test => test.name).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">£{totalPrice}</p>
              <p className="text-sm text-muted-foreground">Total cost</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5" />
            <span>Find Locations Near You</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Enter your postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handlePostcodeSearch()}
              />
            </div>
            <Button onClick={handlePostcodeSearch}>
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={sortBy} onValueChange={(value: 'distance' | 'type') => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="type">By Type</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(value: 'all' | 'clinic' | 'hospital' | 'mobile') => setFilterType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="clinic">Clinics Only</SelectItem>
                <SelectItem value="hospital">Hospitals Only</SelectItem>
                <SelectItem value="mobile">Mobile Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Location Results */}
      <div className="space-y-4">
        {filteredAndSortedLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getLocationIcon(location.type)}
                    <h3 className="text-lg font-semibold">{location.name}</h3>
                    <Badge className={getLocationTypeColor(location.type)}>
                      {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <p className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{location.address}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="w-4 h-4" />
                      <span>{location.postcode}</span>
                    </p>
                    {location.distance !== undefined && location.distance > 0 && (
                      <p className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4" />
                        <span>{location.distance.toFixed(1)} miles away</span>
                      </p>
                    )}
                  </div>

                  {/* Special features based on location type */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {location.type === 'mobile' && (
                      <>
                        <Badge variant="outline" className="text-xs">
                          <Car className="w-3 h-3 mr-1" />
                          Home Visit
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Flexible Times
                        </Badge>
                      </>
                    )}
                    {location.type === 'clinic' && (
                      <>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Same Day Results
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Train className="w-3 h-3 mr-1" />
                          Public Transport
                        </Badge>
                      </>
                    )}
                    {location.type === 'hospital' && (
                      <Badge variant="outline" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Full Medical Facilities
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Button onClick={() => onLocationSelect(location)}>
                    Choose Location
                  </Button>
                  {location.type === 'mobile' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +£15 home visit fee
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardContent className="text-center p-6">
          <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <Building className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p><strong>Clinics:</strong> Quick, convenient, specialist blood testing centers</p>
            </div>
            <div>
              <Building className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <p><strong>Hospitals:</strong> Full medical facilities, extensive testing capabilities</p>
            </div>
            <div>
              <Car className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p><strong>Mobile:</strong> Professional comes to you, perfect for busy schedules</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}