import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  CheckCircle,
  Award,
  Video
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  base_price: number;
  preparation_required: boolean;
  preparation_instructions: string;
}

interface SpecialistService {
  id: string;
  service_id: string;
  custom_price?: number;
  custom_duration?: number;
  is_available: boolean;
  notes?: string;
  service: Service;
}

interface DbSpecialist {
  id: string;
  user_id: string;
  specialty: string;
  bio: string;
  experience_years: number;
  consultation_fee: number;
  consultation_duration: number;
  available_days: string[];
  available_hours: any; // Json type from Supabase
  qualifications: string[];
  is_active: boolean;
  profile: {
    full_name: string;
    avatar_url?: string;
  };
  specialist_services?: SpecialistService[];
}

interface Specialist {
  id: string;
  user_id: string;
  specialty: string;
  bio: string;
  experience_years: number;
  consultation_fee: number;
  consultation_duration: number;
  available_days: string[];
  available_hours: { start: string; end: string };
  qualifications: string[];
  is_active: boolean;
  profile: {
    full_name: string;
    avatar_url?: string;
  };
  specialist_services?: SpecialistService[];
}

interface SpecialistSelectionProps {
  selectedService?: Service;
  onSpecialistSelect: (specialist: any, service?: SpecialistService) => void;
  onViewCalendarFirst?: (specialist: any) => void;
  onBack?: () => void;
}

export function SpecialistSelection({ selectedService, onSpecialistSelect, onBack }: SpecialistSelectionProps) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSpecialists();
  }, [selectedService]);

  useEffect(() => {
    filterSpecialists();
  }, [specialists, searchTerm, selectedSpecialty, priceRange, selectedService]);

  const fetchSpecialists = async () => {
    try {
      // Fetch specialists without the problematic foreign key reference
      let query = supabase
        .from('specialists')
        .select(`
          *,
          specialist_services(
            *,
            service:services(*)
          )
        `)
        .eq('is_active', true);

      const { data: specialistsData, error } = await query;

      if (error) throw error;

      // Get user profiles separately to avoid the foreign key issue
      const userIds = specialistsData?.map(s => s.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      // Transform the data to match our interface
      const transformedData: Specialist[] = (specialistsData || []).map((specialist: any) => {
        const profile = profilesData?.find(p => p.user_id === specialist.user_id);
        return {
          ...specialist,
          available_hours: typeof specialist.available_hours === 'object' 
            ? specialist.available_hours 
            : { start: '09:00', end: '17:00' },
          profile: profile || { full_name: 'Unknown', avatar_url: undefined },
          specialist_services: specialist.specialist_services || [],
          // Add name property for compatibility with AvailabilityCalendar
          name: profile?.full_name || 'Unknown',
          price: specialist.consultation_fee,
          qualifications: specialist.qualifications || [],
          duration: `${specialist.consultation_duration} min`
        };
      });

      // If a specific service is selected, filter specialists who offer that service
      let filteredData = transformedData;
      if (selectedService) {
        filteredData = transformedData.filter(specialist => 
          specialist.specialist_services?.some((ss: SpecialistService) => 
            ss.service_id === selectedService.id && ss.is_available
          )
        );
      }

      setSpecialists(filteredData);
    } catch (error) {
      console.error('Error fetching specialists:', error);
      toast({
        title: "Error",
        description: "Failed to load specialists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSpecialists = () => {
    let filtered = [...specialists];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(specialist =>
        specialist.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialist.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(specialist => 
        specialist.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(specialist => {
        if (selectedService) {
          const specialistService = specialist.specialist_services?.find(
            ss => ss.service_id === selectedService.id && ss.is_available
          );
          const price = specialistService?.custom_price || selectedService.base_price;
          return max ? (price >= min && price <= max) : price >= min;
        } else {
          return max ? (specialist.consultation_fee >= min && specialist.consultation_fee <= max) : specialist.consultation_fee >= min;
        }
      });
    }

    setFilteredSpecialists(filtered);
  };

  const getUniqueSpecialties = () => {
    const specialties = [...new Set(specialists.map(s => s.specialty))];
    return specialties.sort();
  };

  const handleSpecialistSelect = (specialist: Specialist) => {
    if (selectedService) {
      const specialistService = specialist.specialist_services?.find(
        ss => ss.service_id === selectedService.id && ss.is_available
      );
      onSpecialistSelect(specialist, specialistService);
    } else {
      onSpecialistSelect(specialist);
    }
  };

  const formatPrice = (specialist: Specialist, service?: SpecialistService) => {
    if (selectedService && service) {
      return service.custom_price || selectedService.base_price;
    }
    return specialist.consultation_fee;
  };

  const formatDuration = (specialist: Specialist, service?: SpecialistService) => {
    if (selectedService && service) {
      return service.custom_duration || selectedService.duration_minutes;
    }
    return specialist.consultation_duration;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {selectedService ? `Specialists for ${selectedService.name}` : 'Choose a Specialist'}
          </h2>
          <p className="text-muted-foreground">
            {selectedService 
              ? `Find qualified specialists who offer ${selectedService.name.toLowerCase()}`
              : 'Browse our network of qualified healthcare professionals'
            }
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Services
          </Button>
        )}
      </div>

      {/* Selected Service Info */}
      {selectedService && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary">{selectedService.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedService.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedService.duration_minutes} mins
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <DollarSign className="h-4 w-4 mr-1" />
                  From £{selectedService.base_price}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search specialists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {getUniqueSpecialties().map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full sm:w-48">
                <DollarSign className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-100">£0 - £100</SelectItem>
                <SelectItem value="100-200">£100 - £200</SelectItem>
                <SelectItem value="200-300">£200 - £300</SelectItem>
                <SelectItem value="300">£300+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredSpecialists.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No specialists found</h3>
            <p className="text-muted-foreground">
              {selectedService 
                ? `No specialists currently offer ${selectedService.name}. Try browsing other services.`
                : 'Try adjusting your search criteria or browse all specialists.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpecialists.map(specialist => {
            const specialistService = selectedService 
              ? specialist.specialist_services?.find(ss => ss.service_id === selectedService.id && ss.is_available)
              : undefined;

            return (
              <Card key={specialist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={specialist.profile?.avatar_url} />
                      <AvatarFallback>
                        {specialist.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'SP'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{specialist.profile?.full_name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {specialist.specialty}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bio */}
                  {specialist.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {specialist.bio}
                    </p>
                  )}

                  {/* Experience & Qualifications */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {specialist.experience_years} years experience
                    </div>
                    {specialist.qualifications && specialist.qualifications.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {specialist.qualifications.slice(0, 2).map((qual, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {qual}
                          </Badge>
                        ))}
                        {specialist.qualifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{specialist.qualifications.length - 2} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Service-specific info */}
                  {selectedService && specialistService && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">For {selectedService.name}:</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      {specialistService.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {specialistService.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pricing & Duration */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        £{formatPrice(specialist, specialistService)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(specialist, specialistService)} mins
                      </span>
                    </div>
                  </div>

                  {/* Availability indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-green-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Available {specialist.available_days.length} days/week
                    </div>
                    <Button 
                      onClick={() => handleSpecialistSelect(specialist)}
                      className="w-full sm:w-auto"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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