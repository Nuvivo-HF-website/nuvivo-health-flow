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
import { Loader2, Plus, X, Upload, Shield, Check, User as UserIcon } from "lucide-react"

/*************************
 * Constants & Helpers
 *************************/
// Removed MEDICAL_SPECIALTIES (not needed for this screen)

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

/** Commented out languages for now
const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Arabic', 'Hindi', 'Mandarin', 'Other'
]
*/

const days = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },  
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
]

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
]

const SPECIALIZATIONS_BY_PROFESSION: Record<string, string[]> = {
  "GP (General Practitioner)": [
    "Family Medicine",
    "Preventive Care",
    "Chronic Disease Management",
    "Minor Surgery",
    "Women's Health",
    "Men's Health",
    "Elderly Care",
    "Travel Medicine"
  ],
  "Nurse": [
    "Critical Care",
    "Pediatric Nursing", 
    "Geriatric Nursing",
    "Mental Health Nursing",
    "Community Nursing",
    "Surgical Nursing",
    "Emergency Nursing",
    "Oncology Nursing"
  ],
  "Physiotherapist": [
    "Sports Therapy",
    "Neurological Physiotherapy",
    "Orthopedic Physiotherapy",
    "Pediatric Physiotherapy",
    "Geriatric Physiotherapy",
    "Respiratory Physiotherapy",
    "Women's Health Physiotherapy",
    "Manual Therapy"
  ],
  "Psychologist": [
    "Clinical Psychology",
    "Counseling Psychology",
    "Child Psychology",
    "Health Psychology",
    "Neuropsychology",
    "Forensic Psychology",
    "Educational Psychology",
    "Occupational Psychology"
  ],
  "Medical Specialist": [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Medicine",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Nephrology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Psychiatry",
    "Pulmonology",
    "Rheumatology",
    "Urology"
  ],
  "Therapist": [
    "Occupational Therapy",
    "Speech Therapy",
    "Art Therapy",
    "Music Therapy",
    "Behavioral Therapy",
    "Cognitive Behavioral Therapy",
    "Family Therapy",
    "Group Therapy"
  ],
  "Nutritionist": [
    "Clinical Nutrition",
    "Sports Nutrition",
    "Pediatric Nutrition",
    "Geriatric Nutrition",
    "Weight Management",
    "Eating Disorders",
    "Community Nutrition",
    "Food Allergies & Intolerances"
  ],
  "Counsellor": [
    "Marriage Counseling",
    "Addiction Counseling",
    "Grief Counseling",
    "Career Counseling",
    "Trauma Counseling",
    "Youth Counseling",
    "Family Counseling",
    "Mental Health Counseling"
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
const convertAvailabilityToNewFormat = (availableDays: string[], availableHours: any) => {
  const availability: Record<string, { enabled: boolean; startTime: string; endTime: string }> = {}
  const hasIndividualDayTimes = typeof availableHours === 'object' && 
    availableHours !== null && 
    Object.keys(availableHours).some(key => DAYS_OF_WEEK.includes(key))
  DAYS_OF_WEEK.forEach(day => {
    const isEnabled = availableDays.includes(day)
    let startTime = '09:00'
    let endTime = '17:00'
    if (hasIndividualDayTimes && (availableHours as any)[day]) {
      startTime = (availableHours as any)[day].startTime || (availableHours as any)[day].start || '09:00'
      endTime = (availableHours as any)[day].endTime || (availableHours as any)[day].end || '17:00'
    } else if (typeof availableHours === 'object' && (availableHours as any).start && (availableHours as any).end) {
      startTime = (availableHours as any).start
      endTime = (availableHours as any).end
    }
    availability[day] = { enabled: isEnabled, startTime, endTime }
  })
  return availability
}

// Convert new -> old availability (array + global fallback)
const convertAvailabilityToOldFormat = (availability: Record<string, { enabled: boolean; startTime: string; endTime: string }>) => {
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
