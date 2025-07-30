import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { 
  Settings, 
  Plus, 
  Check, 
  X, 
  Edit, 
  Save,
  DollarSign,
  Clock
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

export function SpecialistServiceManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [specialistServices, setSpecialistServices] = useState<SpecialistService[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Get specialist ID
      const { data: specialist } = await supabase
        .from('specialists')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!specialist) {
        toast({
          title: "Error",
          description: "Specialist profile not found",
          variant: "destructive",
        });
        return;
      }

      // Fetch all available services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category, name');

      if (servicesError) throw servicesError;

      // Fetch specialist's current services
      const { data: specialistServicesData, error: specialistError } = await supabase
        .from('specialist_services')
        .select(`
          *,
          service:services(*)
        `)
        .eq('specialist_id', specialist.id);

      if (specialistError) throw specialistError;

      setAllServices(services || []);
      setSpecialistServices(specialistServicesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (serviceId: string, isCurrentlyAvailable: boolean) => {
    try {
      const { data: specialist } = await supabase
        .from('specialists')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!specialist) return;

      if (isCurrentlyAvailable) {
        // Remove service
        const { error } = await supabase
          .from('specialist_services')
          .delete()
          .eq('specialist_id', specialist.id)
          .eq('service_id', serviceId);

        if (error) throw error;
      } else {
        // Add service
        const { error } = await supabase
          .from('specialist_services')
          .insert({
            specialist_id: specialist.id,
            service_id: serviceId,
            is_available: true
          });

        if (error) throw error;
      }

      await fetchData();
      toast({
        title: "Success",
        description: `Service ${isCurrentlyAvailable ? 'removed' : 'added'} successfully`,
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const updateServiceSettings = async (specialistServiceId: string) => {
    try {
      const { error } = await supabase
        .from('specialist_services')
        .update(editValues[specialistServiceId])
        .eq('id', specialistServiceId);

      if (error) throw error;

      await fetchData();
      setEditingService(null);
      setEditValues({});
      toast({
        title: "Success",
        description: "Service settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating service settings:', error);
      toast({
        title: "Error",
        description: "Failed to update service settings",
        variant: "destructive",
      });
    }
  };

  const startEditing = (specialistService: SpecialistService) => {
    setEditingService(specialistService.id);
    setEditValues({
      [specialistService.id]: {
        custom_price: specialistService.custom_price || specialistService.service.base_price,
        custom_duration: specialistService.custom_duration || specialistService.service.duration_minutes,
        notes: specialistService.notes || '',
        is_available: specialistService.is_available
      }
    });
  };

  const isServiceOffered = (serviceId: string) => {
    return specialistServices.some(ss => ss.service_id === serviceId);
  };

  const getServicesByCategory = () => {
    const categories: {[key: string]: Service[]} = {};
    allServices.forEach(service => {
      if (!categories[service.category]) {
        categories[service.category] = [];
      }
      categories[service.category].push(service);
    });
    return categories;
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const servicesByCategory = getServicesByCategory();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Manage Your Services</h2>
        <p className="text-muted-foreground">
          Select which services you offer and customize pricing and duration for each.
        </p>
      </div>

      {Object.entries(servicesByCategory).map(([category, services]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {formatCategory(category)}
            </CardTitle>
            <CardDescription>
              Manage your {formatCategory(category).toLowerCase()} services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.map(service => {
              const offered = isServiceOffered(service.id);
              const specialistService = specialistServices.find(ss => ss.service_id === service.id);
              const isEditing = editingService === specialistService?.id;

              return (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Switch
                          checked={offered}
                          onCheckedChange={() => toggleService(service.id, offered)}
                        />
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          £{service.base_price}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration_minutes} mins
                        </span>
                        {service.preparation_required && (
                          <Badge variant="outline" className="text-xs">
                            Preparation Required
                          </Badge>
                        )}
                      </div>

                      {offered && specialistService && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">Custom Price (£)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editValues[specialistService.id]?.custom_price || ''}
                                    onChange={(e) => setEditValues(prev => ({
                                      ...prev,
                                      [specialistService.id]: {
                                        ...prev[specialistService.id],
                                        custom_price: parseFloat(e.target.value) || null
                                      }
                                    }))}
                                    placeholder={service.base_price.toString()}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Duration (minutes)</Label>
                                  <Input
                                    type="number"
                                    value={editValues[specialistService.id]?.custom_duration || ''}
                                    onChange={(e) => setEditValues(prev => ({
                                      ...prev,
                                      [specialistService.id]: {
                                        ...prev[specialistService.id],
                                        custom_duration: parseInt(e.target.value) || null
                                      }
                                    }))}
                                    placeholder={service.duration_minutes.toString()}
                                    className="h-8"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Additional Notes</Label>
                                <Textarea
                                  value={editValues[specialistService.id]?.notes || ''}
                                  onChange={(e) => setEditValues(prev => ({
                                    ...prev,
                                    [specialistService.id]: {
                                      ...prev[specialistService.id],
                                      notes: e.target.value
                                    }
                                  }))}
                                  placeholder="Any specific instructions or notes for this service..."
                                  className="h-16 resize-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateServiceSettings(specialistService.id)}
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingService(null);
                                    setEditValues({});
                                  }}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="text-sm">
                                <div className="flex gap-4">
                                  <span>
                                    Price: £{specialistService.custom_price || service.base_price}
                                  </span>
                                  <span>
                                    Duration: {specialistService.custom_duration || service.duration_minutes} mins
                                  </span>
                                </div>
                                {specialistService.notes && (
                                  <p className="text-muted-foreground mt-1">{specialistService.notes}</p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(specialistService)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}