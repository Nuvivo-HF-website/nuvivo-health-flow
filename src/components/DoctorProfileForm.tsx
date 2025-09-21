import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { doctorService, DoctorProfile } from '@/services/doctorService'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X, Upload, Shield, Check, User as UserIcon, Trash2 } from "lucide-react"

/**
 * BACKEND FLAGS (RLS-friendly)
 * - doctor_profiles.is_marketplace_ready (boolean)
 * - doctor_profiles.verification_status ('incomplete' | 'pending_review' | 'approved' | 'rejected')
 * - doctor_profiles.is_active (boolean)
 */

const STORAGE_BUCKET = 'provider_documents'

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
] as const

const days = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },  
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
] as const

// Profession -> Specializations mapping (from your registration flow)
const PROFESSIONS = [
  "GP (General Practitioner)",
  "Nurse",
  "Physiotherapist", 
  "Psychologist",
  "Medical Specialist",
  "Therapist",
  "Nutritionist",
  "Counsellor"
] as const

const SPECIALIZATIONS_BY_PROFESSION: Record<string, string[]> = {
  "GP (General Practitioner)": [
    "Family Medicine","Preventive Care","Chronic Disease Management","Minor Surgery",
    "Women's Health","Men's Health","Elderly Care","Travel Medicine"
  ],
  "Nurse": [
    "Critical Care","Pediatric Nursing","Geriatric Nursing","Mental Health Nursing",
    "Community Nursing","Surgical Nursing","Emergency Nursing","Oncology Nursing"
  ],
  "Physiotherapist": [
    "Sports Therapy","Neurological Physiotherapy","Orthopedic Physiotherapy","Pediatric Physiotherapy",
    "Geriatric Physiotherapy","Respiratory Physiotherapy","Women's Health Physiotherapy","Manual Therapy"
  ],
  "Psychologist": [
    "Clinical Psychology","Counseling Psychology","Child Psychology","Health Psychology",
    "Neuropsychology","Forensic Psychology","Educational Psychology","Occupational Psychology"
  ],
  "Medical Specialist": [
    "Cardiology","Dermatology","Endocrinology","Gastroenterology","General Medicine","Geriatrics","Hematology",
    "Infectious Disease","Nephrology","Neurology","Oncology","Orthopedics","Psychiatry","Pulmonology",
    "Rheumatology","Urology"
  ],
  "Therapist": [
    "Occupational Therapy","Speech Therapy","Art Therapy","Music Therapy",
    "Behavioral Therapy","Cognitive Behavioral Therapy","Family Therapy","Group Therapy"
  ],
  "Nutritionist": [
    "Clinical Nutrition","Sports Nutrition","Pediatric Nutrition","Geriatric Nutrition",
    "Weight Management","Eating Disorders","Community Nutrition","Food Allergies & Intolerances"
  ],
  "Counsellor": [
    "Marriage Counseling","Addiction Counseling","Grief Counseling","Career Counseling",
    "Trauma Counseling","Youth Counseling","Family Counseling","Mental Health Counseling"
  ]
}

const getRegistrationBodyInfo = (profession: string) => {
  switch (profession) {
    case "GP (General Practitioner)":
    case "Medical Specialist":
      return { label: "GMC Number", placeholder: "Enter your GMC number" }
    case "Nurse":
      return { label: "NMC Number", placeholder: "Enter your NMC number" }
    case "Physiotherapist":
    case "Psychologist":
    case "Therapist":
    case "Nutritionist":
      return { label: "HCPC Registration Number", placeholder: "Enter your HCPC registration number" }
    case "Counsellor":
      return { label: "BACP/UKCP Registration Number", placeholder: "Enter your BACP/UKCP registration number" }
    default:
      return { label: "Professional Registration Number", placeholder: "Enter your registration number" }
  }
}

// Convert old -> new availability (per-day)
const convertAvailabilityToNewFormat = (
  availableDays: string[] = [],
  availableHours: any = { start: '09:00', end: '17:00' }
) => {
  const availability: Record<string, { enabled: boolean; startTime: string; endTime: string }> = {}
  const hasIndividualDayTimes =
    typeof availableHours === 'object' &&
    availableHours !== null &&
    Object.keys(availableHours).some(key => DAYS_OF_WEEK.includes(key as any))

  DAYS_OF_WEEK.forEach(day => {
    const isEnabled = availableDays.includes(day)
    let startTime = '09:00'
    let endTime = '17:00'

    if (hasIndividualDayTimes && availableHours[day]) {
      startTime = availableHours[day].startTime || availableHours[day].start || '09:00'
      endTime = availableHours[day].endTime || availableHours[day].end || '17:00'
    } else if (typeof availableHours === 'object' && availableHours.start && availableHours.end) {
      startTime = availableHours.start
      endTime = availableHours.end
    }

    availability[day] = { enabled: isEnabled, startTime, endTime }
  })

  return availability
}

// Convert new -> old availability (array + global fallback)
const convertAvailabilityToOldFormat = (
  availability: Record<string, { enabled: boolean; startTime: string; endTime: string }>
) => {
  const enabledDays = Object.entries(availability)
    .filter(([_, config]) => config.enabled)
    .map(([day]) => day)

  const availableHours: any = {}
  Object.entries(availability).forEach(([day, config]) => {
    if (config.enabled) {
      availableHours[day] = { startTime: config.startTime, endTime: config.endTime }
    }
  })

  const firstEnabledDay = Object.values(availability).find(config => config.enabled)
  if (firstEnabledDay) {
    availableHours.start = firstEnabledDay.startTime
    availableHours.end = firstEnabledDay.endTime
  } else {
    availableHours.start = '09:00'
    availableHours.end = '17:00'
  }

  return { availableDays: enabledDays, availableHours }
}

/*************************
 * Component
 *************************/
export function DoctorProfileForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)

  // Avatar upload state
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  // Document upload state
  const [indemnityUrl, setIndemnityUrl] = useState<string>('')
  const [dbsUrl, setDbsUrl] = useState<string>('')
  const indemnityInputRef = useRef<HTMLInputElement | null>(null)
  const dbsInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadingKind, setUploadingKind] = useState<null | 'indemnity' | 'dbs' | 'avatar'>(null)

  const [missing, setMissing] = useState<string[]>([])

  const fieldClass =
    "bg-white border border-muted-foreground/40 focus:border-primary/60 " +
    "outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0"

  const dashedBoxClass =
    "border-2 border-dashed border-muted-foreground/40 hover:border-muted-foreground " +
    "rounded-lg p-6 text-center cursor-pointer transition"

  const [formData, setFormData] = useState({
    // Personal
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',

    // Profession & regs
    profession: '' as (typeof PROFESSIONS)[number] | '',
    specializations: [] as string[],
    qualification: '',
    license_number: '', // GMC/NMC/HCPC/BACP etc.
    years_of_experience: '',

    // Pricing & bio
    consultation_fee: '',
    bio: '',

    // Clinic + address
    clinic_name: '',
    clinic_address: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',

    // Availability
    availability: {
      monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    },

    languages: ['English'],

    // Documents (store STORAGE OBJECT PATH, not public URL)
    indemnity_document_url: '',
    dbs_pvg_document_url: '',
  })

  // --- computed helpers
  const computeMissing = (fd: typeof formData) => {
    const out: string[] = []
    if (!fd.first_name?.trim()) out.push('First name')
    if (!fd.last_name?.trim()) out.push('Last name')

    if (!fd.profession) out.push('Profession')
    if (!fd.license_number?.trim()) out.push(getRegistrationBodyInfo(fd.profession).label)
    if (!fd.consultation_fee || Number(fd.consultation_fee) <= 0) out.push('Consultation fee')

    const specs = SPECIALIZATIONS_BY_PROFESSION[fd.profession] || []
    if (specs.length > 0 && fd.specializations.length === 0) {
      out.push('At least one specialization')
    }

    const hasAnyDay = Object.values(fd.availability).some(d => d.enabled)
    if (!hasAnyDay) out.push('Availability (enable at least one day)')

    if (!fd.indemnity_document_url) out.push('Indemnity Insurance document')
    if (!fd.dbs_pvg_document_url) out.push('DBS/PVG document')
    return out
  }

  const currentRegInfo = getRegistrationBodyInfo(formData.profession)
  const getCurrentSpecializations = () => SPECIALIZATIONS_BY_PROFESSION[formData.profession] || []

  // --- lifecycle
  useEffect(() => {
    if (user?.id) void loadDoctorProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    setMissing(computeMissing(formData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formData)])

  // Signed URL helper for storage paths
  const signIfPath = async (maybePath: string | undefined | null) => {
    if (!maybePath) return ''
    if (/^https?:\/\//i.test(maybePath)) return maybePath
    const { data } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(maybePath, 60 * 60 * 24 * 7) // 7 days
    return data?.signedUrl || ''
  }

  const loadDoctorProfile = async () => {
    if (!user?.id) return
    try {
      setProfileLoading(true)
      const { data, error } = await doctorService.getDoctorProfile(user.id)
      if (error) console.error('Error loading doctor profile:', error)

      if (data) {
        setDoctorProfile(data)

        // signed previews
        setIndemnityUrl(await signIfPath((data as any).indemnity_document_url || ''))
        setDbsUrl(await signIfPath((data as any).dbs_pvg_document_url || ''))
        setAvatarUrl(await signIfPath((data as any).avatar_url || ''))

        const availableHours = (data as any).available_hours ?? { start: '09:00', end: '17:00' }
        const availableDays = (data as any).available_days ?? []

        setFormData(prev => ({
          ...prev,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          avatar_url: (data as any).avatar_url || '',
          profession:
          (data as any).profession ||
          (data as any).specialty ||
          prev.profession ||
          'Medical Specialist',
          specializations: Array.isArray((data as any).specializations)
          ? (data as any).specializations
          : ((data as any).specialty || (data as any).profession
          ? [ (data as any).specialty || (data as any).profession ]
          : []),
          qualification: data.qualification || '',
          license_number: data.license_number || (data as any).registration_number || '',
          years_of_experience: data.years_of_experience?.toString() || '',
          consultation_fee: data.consultation_fee?.toString() || '',
          bio: data.bio || '',
          clinic_name: data.clinic_name || '',
          clinic_address: data.clinic_address || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          postcode: data.postcode || '',
          country: data.country || 'United Kingdom',
          availability: convertAvailabilityToNewFormat(availableDays, availableHours) as any,
          languages: (data as any).languages || ['English'],
          indemnity_document_url: (data as any).indemnity_document_url || '',
          dbs_pvg_document_url: (data as any).dbs_pvg_document_url || '',
        }))
        return
      }

      // Fallback: attempt migration from specialists
      const { data: specialistData, error: specialistError } = await supabase
        .from('specialists')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (specialistData && !specialistError) {
        const doctorProfileData: any = {
          user_id: user.id,
          first_name: user.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          profession: 'Medical Specialist',
          specializations: [], // start empty
          qualification: '',
          license_number: specialistData.registration_number || '',
          years_of_experience: specialistData.experience_years || null,
          phone: '',
          address_line_1: '',
          address_line_2: '',
          city: '',
          postcode: '',
          country: 'United Kingdom',
          clinic_name: '',
          clinic_address: '',
          consultation_fee: specialistData.consultation_fee || 100,
          available_hours: { start: '09:00', end: '17:00' },
          available_days: specialistData.available_days || ['monday','tuesday','wednesday','thursday','friday'],
          bio: specialistData.bio || '',
          languages: ['English'],
          is_marketplace_ready: false,
          verification_status: 'incomplete',
          is_active: false
        }

        const { data: newDoctorProfile, error: createError } = await doctorService.createDoctorProfile(doctorProfileData)
        if (!createError && newDoctorProfile) {
          setDoctorProfile(newDoctorProfile)
          setFormData(prev => ({
            ...prev,
            first_name: doctorProfileData.first_name,
            last_name: doctorProfileData.last_name,
            phone: '',
            avatar_url: '',
            profession: doctorProfileData.profession,
            specializations: [],
            qualification: doctorProfileData.qualification,
            license_number: doctorProfileData.license_number,
            years_of_experience: doctorProfileData.years_of_experience?.toString() || '',
            consultation_fee: String(doctorProfileData.consultation_fee ?? ''),
            bio: doctorProfileData.bio,
            clinic_name: doctorProfileData.clinic_name,
            clinic_address: doctorProfileData.clinic_address,
            address_line_1: doctorProfileData.address_line_1,
            address_line_2: doctorProfileData.address_line_2,
            city: doctorProfileData.city,
            postcode: doctorProfileData.postcode,
            country: doctorProfileData.country,
            availability: convertAvailabilityToNewFormat(doctorProfileData.available_days, doctorProfileData.available_hours) as any,
            languages: doctorProfileData.languages,
            indemnity_document_url: '',
            dbs_pvg_document_url: ''
          }))
        }
      }
    } catch (error) {
      console.error('Error loading doctor profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }))
  }

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day as keyof typeof prev.availability], [field]: value }
      }
    }))
  }

  const handleAvatarRemove = async () => {
    setAvatarUrl('')
    setFormData(prev => ({ ...prev, avatar_url: '' }))
    toast({ title: 'Profile photo removed', description: 'Your avatar has been removed.' })
  }

  // Secure upload with type/size checks, randomized safe name, single-flight guard, and signed display URL
  const uploadToBucket = async (file: File, kind: 'indemnity' | 'dbs' | 'avatar') => {
    if (!user?.id) return null

    const MAX_BYTES = 10 * 1024 * 1024 // 10MB
    const ALLOW_MIME = kind === 'avatar'
      ? ['image/jpeg', 'image/png']
      : ['application/pdf', 'image/jpeg', 'image/png']

    if (!ALLOW_MIME.includes(file.type)) {
      toast({ title: 'Upload blocked', description: 'Unsupported file type.', variant: 'destructive' })
      return null
    }
    if (file.size > MAX_BYTES) {
      toast({ title: 'File too large', description: 'Max size is 10MB.', variant: 'destructive' })
      return null
    }

    const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : ''
    const uuid = (globalThis as any)?.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const safeName = `${uuid}${ext.replace(/[^.\w-]/g, '')}`

    const prefix = kind === 'avatar' ? 'avatar' : kind
    const objectPath = `${user.id}/${prefix}-${safeName}`

    try {
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(objectPath, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: '3600',
      })
      if (error) {
        toast({ title: 'Upload failed', description: error.message, variant: 'destructive' })
        return null
      }
      return objectPath // store the path in DB; signed for display
    } catch (e: any) {
      toast({ title: 'Upload error', description: e?.message || 'Unexpected error', variant: 'destructive' })
      return null
    }
  }

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>, kind: 'indemnity' | 'dbs' | 'avatar') => {
    if (uploadingKind) return
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingKind(kind)
      const path = await uploadToBucket(file, kind)
      if (!path) return
      const signed = await signIfPath(path)

      if (kind === 'indemnity') {
        setIndemnityUrl(signed)
        setFormData(prev => ({ ...prev, indemnity_document_url: path }))
        toast({ title: 'Document uploaded', description: 'Indemnity insurance uploaded successfully.' })
      } else if (kind === 'dbs') {
        setDbsUrl(signed)
        setFormData(prev => ({ ...prev, dbs_pvg_document_url: path }))
        toast({ title: 'Document uploaded', description: 'DBS/PVG uploaded successfully.' })
      } else {
        setAvatarUrl(signed)
        setFormData(prev => ({ ...prev, avatar_url: path }))
        toast({ title: 'Profile photo updated', description: 'Your avatar has been uploaded.' })
      }
    } finally {
      setUploadingKind(null)
      e.target.value = '' // allow re-uploading same file
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      toast({ title: 'Error', description: 'You must be logged in to update your profile.', variant: 'destructive' })
      return
    }

    try {
      setLoading(true)
      const { availableDays, availableHours } = convertAvailabilityToOldFormat(formData.availability as any)
      const marketplaceReady = computeMissing(formData).length === 0

      // doctor_profiles payload — profession stored explicitly, specializations as text[]
      const profileData: any = {
  user_id: user.id,
  first_name: formData.first_name,
  last_name: formData.last_name,
  phone: formData.phone,

  profession: formData.profession,
  specialty: formData.profession,                 // 👈 legacy shim so old readers see it
  specializations: [...formData.specializations], // ensure array, not string

  qualification: formData.qualification,
  license_number: formData.license_number,
  years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
  consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : null,
  bio: formData.bio,
  clinic_name: formData.clinic_name,
  clinic_address: formData.clinic_address,
  address_line_1: formData.address_line_1,
  address_line_2: formData.address_line_2,
  city: formData.city,
  postcode: formData.postcode,
  country: formData.country,
  available_hours: availableHours,
  available_days: availableDays,
  languages: formData.languages,
  indemnity_document_url: formData.indemnity_document_url || null,
  dbs_pvg_document_url: formData.dbs_pvg_document_url || null,
  is_marketplace_ready: marketplaceReady,
  verification_status: marketplaceReady ? 'pending_review' : 'incomplete',
  is_active: false,
  avatar_url: formData.avatar_url || null,
}

// (optional but very useful)
console.debug('doctor_profiles payload →', profileData)


      // 1) Upsert into doctor_profiles
      let result
      if (doctorProfile) {
        result = await doctorService.updateDoctorProfile(doctorProfile.id, profileData)
      } else {
        result = await doctorService.createDoctorProfile(profileData)
      }
      if (result.error) throw result.error

      setDoctorProfile(result.data)

      // 2) Mirror key fields into profiles (used by marketplace cards)
      const addressStr = formData.address_line_1
        ? `${formData.address_line_1}${formData.address_line_2 ? ', ' + formData.address_line_2 : ''}, ${formData.city} ${formData.postcode}`
        : null

      const { error: profErr } = await supabase
        .from('profiles')
        .update({
          profession: formData.profession || null,
          avatar_url: formData.avatar_url || null,
          address: addressStr,
          city: formData.city || null,
          country: formData.country || 'United Kingdom',
          full_name: `${formData.first_name ?? ''} ${formData.last_name ?? ''}`.trim() || null,
        })
        .eq('user_id', user.id)

      if (profErr) console.warn('profiles mirror update failed:', profErr)

      toast({
        title: 'Success',
        description: doctorProfile ? 'Profile updated successfully!' : 'Profile created successfully!'
      })
    } catch (error) {
      console.error('Error saving doctor profile:', error)
      toast({ title: 'Error', description: 'Failed to save profile. Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Round Avatar */}
          <div className="relative">
            <div
              className="h-20 w-20 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-muted-foreground/30"
              onClick={() => avatarInputRef.current?.click()}
              role="button"
              title="Upload profile photo"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            {avatarUrl && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full shadow"
                onClick={handleAvatarRemove}
                title="Remove profile photo"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 rounded-full shadow"
              onClick={() => avatarInputRef.current?.click()}
              disabled={!!uploadingKind}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={avatarInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFilePick(e, 'avatar')}
              disabled={!!uploadingKind}
            />
          </div>

          <div>
            <CardTitle>Doctor / Professional Profile</CardTitle>
            {!doctorProfile && (
              <CardDescription className="text-amber-600">
                Complete your professional profile to start offering consultations
              </CardDescription>
            )}
          </div>
        </div>

        {/* Incomplete/Ready banner */}
        {missing.length > 0 ? (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
            <p className="font-medium">Your profile is incomplete.</p>
            <p className="text-sm mt-1">
              The account won’t be activated or shown in the marketplace until you provide the required items:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm">
              {missing.map(item => (<li key={item}>{item}</li>))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-emerald-900">
            <p className="font-medium">Profile ready for review.</p>
            <p className="text-sm mt-1">We’ll verify your documents before activating and listing your profile.</p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" className={fieldClass} value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
              </div>
              <div className="w-full">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" className={fieldClass} value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" className={fieldClass} value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="h-5 w-5"/> Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profession */}
              <div className="space-y-2">
                <Label htmlFor="profession">Profession *</Label>
                <Select value={formData.profession} onValueChange={(value) => handleInputChange('profession', value)}>
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Qualification */}
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input id="qualification" className={fieldClass} value={formData.qualification} onChange={(e) => handleInputChange('qualification', e.target.value)} placeholder="e.g., MBBS, MD" />
              </div>

              {/* Dynamic Registration Number */}
              <div>
                <Label htmlFor="license_number">{currentRegInfo.label} *</Label>
                <Input id="license_number" className={fieldClass} value={formData.license_number} onChange={(e) => handleInputChange('license_number', e.target.value)} placeholder={currentRegInfo.placeholder} />
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input id="years_of_experience" type="number" className={fieldClass} value={formData.years_of_experience} onChange={(e) => handleInputChange('years_of_experience', e.target.value)} />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="consultation_fee">Price of Service (£ per consultation) *</Label>
                <Input id="consultation_fee" type="number" step="0.01" className={fieldClass} value={formData.consultation_fee} onChange={(e) => handleInputChange('consultation_fee', e.target.value)} placeholder="150" />
              </div>
            </div>

            {/* Specializations grid (multi-select) */}
            {formData.profession && getCurrentSpecializations().length > 0 && (
              <div className="space-y-3">
                <Label>Specializations (Select multiple) *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {getCurrentSpecializations().map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox id={spec} checked={formData.specializations.includes(spec)} onCheckedChange={() => handleSpecializationToggle(spec)} />
                      <Label htmlFor={spec} className="text-sm">{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" className={fieldClass} value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Tell patients about yourself..." rows={4} />
            </div>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Documents</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Indemnity */}
              <div className="space-y-2">
                <Label>Indemnity Insurance *</Label>
                <div
                  className={dashedBoxClass}
                  onClick={() => !uploadingKind && indemnityInputRef.current?.click()}>
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{uploadingKind === 'indemnity' ? 'Uploading...' : 'Click to upload or drag and drop'}</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                  {indemnityUrl && <p className="text-xs mt-2 break-all">Uploaded (preview): {indemnityUrl}</p>}
                </div>
                <input
                  ref={indemnityInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFilePick(e, 'indemnity')}
                  disabled={!!uploadingKind}
                />
              </div>

              {/* DBS / PVG */}
              <div className="space-y-2">
                <Label>DBS / PVG Check *</Label>
                <div
                  className={dashedBoxClass}
                  onClick={() => !uploadingKind && dbsInputRef.current?.click()}>
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{uploadingKind === 'dbs' ? 'Uploading...' : 'Click to upload or drag and drop'}</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
                  {dbsUrl && <p className="text-xs mt-2 break-all">Uploaded (preview): {dbsUrl}</p>}
                </div>
                <input
                  ref={dbsInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleFilePick(e, 'dbs')}
                  disabled={!!uploadingKind}
                />
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Clinic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinic_name">Clinic Name</Label>
                <Input id="clinic_name" className={fieldClass} value={formData.clinic_name} onChange={(e) => handleInputChange('clinic_name', e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="clinic_address">Clinic Address (Optional)</Label>
              <Textarea id="clinic_address" className={fieldClass} value={formData.clinic_address} onChange={(e) => handleInputChange('clinic_address', e.target.value)} rows={2} />
            </div>
          </div>

          {/* Personal Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address_line_1">Address Line 1</Label>
                <Input id="address_line_1" className={fieldClass} value={formData.address_line_1} onChange={(e) => handleInputChange('address_line_1', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                <Input id="address_line_2" className={fieldClass} value={formData.address_line_2} onChange={(e) => handleInputChange('address_line_2', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" className={fieldClass} value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input id="postcode" className={fieldClass} value={formData.postcode} onChange={(e) => handleInputChange('postcode', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            <div className="space-y-3">
              {days.map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Checkbox
                    id={key}
                    checked={(formData.availability as any)[key].enabled}
                    onCheckedChange={(checked) => handleAvailabilityChange(key, 'enabled', checked)}
                  />
                  <Label htmlFor={key} className="w-20">{label}</Label>
                  {(formData.availability as any)[key].enabled && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={(formData.availability as any)[key].startTime}
                        onChange={(e) => handleAvailabilityChange(key, 'startTime', e.target.value)}
                        className={`w-28 ${fieldClass}`}
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={(formData.availability as any)[key].endTime}
                        onChange={(e) => handleAvailabilityChange(key, 'endTime', e.target.value)}
                        className={`w-28 ${fieldClass}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              By saving this profile, you agree to our Terms of Service and Privacy Policy. Your documents may be reviewed before activation.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (doctorProfile ? 'Update Profile' : 'Create Profile')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default DoctorProfileForm
