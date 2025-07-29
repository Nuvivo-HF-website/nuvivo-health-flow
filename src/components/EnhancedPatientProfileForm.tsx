// Enhanced Patient Profile Form with GDPR compliance and comprehensive medical data
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ValidationUtils } from '@/lib/validation';
import { 
  Loader2, Plus, X, User, Phone, MapPin, AlertTriangle, 
  Pill, Heart, Shield, FileText, Calendar, Globe
} from 'lucide-react';

interface EnhancedPatientProfile {
  id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  sex_at_birth?: string;
  gender_identity?: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postcode: string;
  country: string;
  nationality?: string;
  preferred_language: string;
  nhs_number?: string;
  marital_status?: string;
  occupation?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_conditions: string[];
  allergies: string[];
  current_medications: string[];
  lifestyle_factors: any;
  family_medical_history: any;
  insurance_details: any;
  consent_data_processing: boolean;
  consent_marketing: boolean;
  consent_research: boolean;
}

export function EnhancedPatientProfileForm() {
  const { user, requestDataExport, requestDataDeletion } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<EnhancedPatientProfile | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<EnhancedPatientProfile>({
    user_id: user?.id || '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    sex_at_birth: '',
    gender_identity: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    nationality: '',
    preferred_language: 'English',
    nhs_number: '',
    marital_status: '',
    occupation: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: [],
    allergies: [],
    current_medications: [],
    lifestyle_factors: {},
    family_medical_history: {},
    insurance_details: {},
    consent_data_processing: false,
    consent_marketing: false,
    consent_research: false,
  });

  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    if (user) {
      loadPatientProfile();
    }
  }, [user]);

  const loadPatientProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          ...data,
          medical_conditions: data.medical_conditions || [],
          allergies: data.allergies || [],
          current_medications: data.current_medications || [],
          lifestyle_factors: data.lifestyle_factors || {},
          family_medical_history: data.family_medical_history || {},
          insurance_details: data.insurance_details || {},
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];

    if (currentStep === 1) {
      // Personal Information
      const validation = ValidationUtils.validatePatientProfile(formData);
      errors.push(...validation.errors);
    } else if (currentStep === 2) {
      // Medical Information
      if (formData.nhs_number && !ValidationUtils.isValidNHSNumber(formData.nhs_number)) {
        errors.push('Invalid NHS number format');
      }
    } else if (currentStep === 3) {
      // GDPR Consent
      if (!formData.consent_data_processing) {
        errors.push('Data processing consent is required');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      toast({
        title: "Validation errors",
        description: "Please fix the errors before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...formData,
        first_name: ValidationUtils.sanitizeInput(formData.first_name),
        last_name: ValidationUtils.sanitizeInput(formData.last_name),
        address_line_1: ValidationUtils.sanitizeInput(formData.address_line_1),
        address_line_2: formData.address_line_2 ? ValidationUtils.sanitizeInput(formData.address_line_2) : '',
        city: ValidationUtils.sanitizeInput(formData.city),
        gdpr_consent_date: new Date().toISOString(),
        last_data_review: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('patient_profiles')
        .upsert(sanitizedData);

      if (error) throw error;

      toast({
        title: "Profile saved successfully",
        description: "Your patient profile has been updated.",
      });

      await loadPatientProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = (type: 'condition' | 'allergy' | 'medication') => {
    const newItem = type === 'condition' ? newCondition : 
                   type === 'allergy' ? newAllergy : newMedication;
    
    if (!newItem.trim()) return;

    const sanitizedItem = ValidationUtils.sanitizeMedicalText(newItem);
    const field = type === 'condition' ? 'medical_conditions' :
                  type === 'allergy' ? 'allergies' : 'current_medications';

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], sanitizedItem]
    }));

    if (type === 'condition') setNewCondition('');
    else if (type === 'allergy') setNewAllergy('');
    else setNewMedication('');
  };

  const removeItem = (type: 'condition' | 'allergy' | 'medication', index: number) => {
    const field = type === 'condition' ? 'medical_conditions' :
                  type === 'allergy' ? 'allergies' : 'current_medications';

    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sex_at_birth">Sex at Birth</Label>
                <Select 
                  value={formData.sex_at_birth || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sex_at_birth: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex at birth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="intersex">Intersex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender_identity">Gender Identity</Label>
                <Input
                  id="gender_identity"
                  value={formData.gender_identity || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender_identity: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+44 123 456 7890"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nhs_number">NHS Number</Label>
                <Input
                  id="nhs_number"
                  value={formData.nhs_number || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nhs_number: e.target.value }))}
                  placeholder="123 456 7890"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Address & Contact Information</h3>
            </div>

            <div>
              <Label htmlFor="address_line_1">Address Line 1 *</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line_1: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2 || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line_2: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact_name">Emergency Contact Name *</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone *</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Medical Information</h3>
            </div>

            {/* Medical Conditions */}
            <div>
              <Label>Medical Conditions</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Enter medical condition"
                />
                <Button onClick={() => addItem('condition')} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.medical_conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{condition}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('condition', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <Label>Allergies</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Enter allergy"
                />
                <Button onClick={() => addItem('allergy')} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center space-x-1">
                    <span>{allergy}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('allergy', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <Label>Current Medications</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Enter medication"
                />
                <Button onClick={() => addItem('medication')} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.current_medications.map((medication, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{medication}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('medication', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Privacy & Consent (GDPR)</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent_data_processing"
                  checked={formData.consent_data_processing}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, consent_data_processing: !!checked }))
                  }
                />
                <div>
                  <Label htmlFor="consent_data_processing" className="text-sm font-medium">
                    Data Processing Consent (Required) *
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    I consent to the processing of my personal and medical data for the provision of healthcare services.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent_marketing"
                  checked={formData.consent_marketing}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, consent_marketing: !!checked }))
                  }
                />
                <div>
                  <Label htmlFor="consent_marketing" className="text-sm font-medium">
                    Marketing Communications
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    I consent to receiving marketing communications about health services and offers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent_research"
                  checked={formData.consent_research}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, consent_research: !!checked }))
                  }
                />
                <div>
                  <Label htmlFor="consent_research" className="text-sm font-medium">
                    Research Participation
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    I consent to the use of my anonymized data for medical research purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Your Rights Under GDPR</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Right to access your personal data</p>
                <p>• Right to rectification of inaccurate data</p>
                <p>• Right to erasure ("right to be forgotten")</p>
                <p>• Right to restrict processing</p>
                <p>• Right to data portability</p>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <Button variant="outline" size="sm" onClick={requestDataExport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Request Data Export
                </Button>
                <Button variant="outline" size="sm" onClick={requestDataDeletion}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Request Data Deletion
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Patient Profile</CardTitle>
          <CardDescription>
            Complete your comprehensive patient profile with GDPR compliance
          </CardDescription>
          
          {/* Progress indicators */}
          <div className="flex items-center justify-between mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div 
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <h4 className="font-medium text-destructive mb-2">Please fix the following errors:</h4>
                <ul className="list-disc list-inside text-sm text-destructive">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentStep === 4 ? 'Save Profile' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}