import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Pill, Calendar, AlertCircle, RefreshCw, Phone, MapPin, Plus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface Prescription {
  id: string;
  user_id: string;
  doctor_id?: string;
  consultation_id?: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  quantity?: number;
  refills_remaining: number;
  prescribed_date: string;
  start_date?: string;
  end_date?: string;
  instructions?: string;
  side_effects?: string;
  contraindications?: string;
  pharmacy_name?: string;
  pharmacy_phone?: string;
  prescription_number?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const frequencies = [
  { id: 'once_daily', name: 'Once Daily' },
  { id: 'twice_daily', name: 'Twice Daily' },
  { id: 'three_times_daily', name: 'Three Times Daily' },
  { id: 'four_times_daily', name: 'Four Times Daily' },
  { id: 'as_needed', name: 'As Needed' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'monthly', name: 'Monthly' },
];

const statuses = [
  { id: 'active', name: 'Active', variant: 'default' as const },
  { id: 'completed', name: 'Completed', variant: 'secondary' as const },
  { id: 'cancelled', name: 'Cancelled', variant: 'outline' as const },
  { id: 'expired', name: 'Expired', variant: 'destructive' as const },
];

export function PrescriptionManager() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isAddingPharmacy, setIsAddingPharmacy] = useState(false);
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .order('prescribed_date', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      });
    }
  };

  const updatePrescriptionStatus = async (prescriptionId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ status: newStatus })
        .eq('id', prescriptionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prescription status updated",
      });

      fetchPrescriptions();
    } catch (error) {
      console.error('Error updating prescription:', error);
      toast({
        title: "Error",
        description: "Failed to update prescription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPharmacyInfo = async (prescriptionId: string) => {
    if (!pharmacyName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({
          pharmacy_name: pharmacyName,
          pharmacy_phone: pharmacyPhone || null,
        })
        .eq('id', prescriptionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pharmacy information added",
      });

      setIsAddingPharmacy(false);
      setPharmacyName('');
      setPharmacyPhone('');
      setSelectedPrescription(null);
      fetchPrescriptions();
    } catch (error) {
      console.error('Error adding pharmacy info:', error);
      toast({
        title: "Error",
        description: "Failed to add pharmacy information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestRefill = async (prescriptionId: string) => {
    setLoading(true);
    try {
      // In a real app, this would create a refill request
      // For now, we'll just show a toast
      toast({
        title: "Refill Requested",
        description: "Your refill request has been submitted to your pharmacy",
      });

      // Simulate updating refills remaining
      const prescription = prescriptions.find(p => p.id === prescriptionId);
      if (prescription && prescription.refills_remaining > 0) {
        const { error } = await supabase
          .from('prescriptions')
          .update({ refills_remaining: prescription.refills_remaining - 1 })
          .eq('id', prescriptionId);

        if (error) throw error;
        fetchPrescriptions();
      }
    } catch (error) {
      console.error('Error requesting refill:', error);
      toast({
        title: "Error",
        description: "Failed to request refill",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find(s => s.id === status);
    return (
      <Badge variant={statusInfo?.variant || 'default'}>
        {statusInfo?.name || status}
      </Badge>
    );
  };

  const isExpiringSoon = (prescription: Prescription) => {
    if (!prescription.end_date) return false;
    const endDate = new Date(prescription.end_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (prescription: Prescription) => {
    if (!prescription.end_date) return false;
    const endDate = new Date(prescription.end_date);
    const today = new Date();
    return endDate < today;
  };

  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  const expiringSoon = activePrescriptions.filter(isExpiringSoon);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
          <p className="text-muted-foreground">Manage your medications and pharmacy information</p>
        </div>
      </div>

      {/* Alerts */}
      {expiringSoon.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.map(prescription => (
                <div key={prescription.id} className="text-sm text-yellow-700">
                  <strong>{prescription.medication_name}</strong> expires on{' '}
                  {new Date(prescription.end_date!).toLocaleDateString()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Active Prescriptions
          </CardTitle>
          <CardDescription>Your current medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePrescriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No active prescriptions found.
              </p>
            ) : (
              activePrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className={`p-4 border rounded-lg ${
                    isExpired(prescription) ? 'border-red-200 bg-red-50' :
                    isExpiringSoon(prescription) ? 'border-yellow-200 bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{prescription.medication_name}</h3>
                        {getStatusBadge(prescription.status)}
                        {isExpired(prescription) && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                        {isExpiringSoon(prescription) && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Dosage:</span> {prescription.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span>{' '}
                          {frequencies.find(f => f.id === prescription.frequency)?.name || prescription.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Refills:</span> {prescription.refills_remaining}
                        </div>
                      </div>

                      {prescription.instructions && (
                        <div className="text-sm">
                          <span className="font-medium">Instructions:</span> {prescription.instructions}
                        </div>
                      )}

                      {prescription.end_date && (
                        <div className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Until:</span> {new Date(prescription.end_date).toLocaleDateString()}
                        </div>
                      )}

                      {prescription.pharmacy_name && (
                        <div className="text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">Pharmacy:</span> {prescription.pharmacy_name}
                          {prescription.pharmacy_phone && (
                            <span className="text-muted-foreground">
                              • {prescription.pharmacy_phone}
                            </span>
                          )}
                        </div>
                      )}

                      {prescription.side_effects && (
                        <div className="text-sm text-red-600">
                          <span className="font-medium">Side Effects:</span> {prescription.side_effects}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {prescription.refills_remaining > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => requestRefill(prescription.id)}
                          disabled={loading}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Request Refill
                        </Button>
                      )}
                      
                      {!prescription.pharmacy_name && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPrescription(prescription);
                            setIsAddingPharmacy(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Pharmacy
                        </Button>
                      )}

                      <Select
                        value={prescription.status}
                        onValueChange={(value) => updatePrescriptionStatus(prescription.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Pharmacy Modal */}
      {isAddingPharmacy && selectedPrescription && (
        <Card>
          <CardHeader>
            <CardTitle>Add Pharmacy Information</CardTitle>
            <CardDescription>
              Add pharmacy details for {selectedPrescription.medication_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pharmacy-name">Pharmacy Name *</Label>
              <Input
                id="pharmacy-name"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder="Enter pharmacy name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pharmacy-phone">Pharmacy Phone</Label>
              <Input
                id="pharmacy-phone"
                value={pharmacyPhone}
                onChange={(e) => setPharmacyPhone(e.target.value)}
                placeholder="Enter pharmacy phone number"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => addPharmacyInfo(selectedPrescription.id)}
                disabled={loading || !pharmacyName.trim()}
              >
                {loading ? "Adding..." : "Add Pharmacy"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingPharmacy(false);
                  setSelectedPrescription(null);
                  setPharmacyName('');
                  setPharmacyPhone('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription History */}
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
          <CardDescription>All your past prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prescriptions.filter(p => p.status !== 'active').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No prescription history found.
              </p>
            ) : (
              prescriptions.filter(p => p.status !== 'active').map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex items-center justify-between p-4 border rounded-lg opacity-75"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{prescription.medication_name}</h3>
                      {getStatusBadge(prescription.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Prescribed: {new Date(prescription.prescribed_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prescription.dosage} • {frequencies.find(f => f.id === prescription.frequency)?.name || prescription.frequency}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}