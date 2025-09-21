// src/pages/Marketplace.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Search, Filter, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Types coming from the view
type ViewRow = {
  id: string;
  user_id: string;
  dp_profession: string | null;
  profession: string | null;
  specializations: string[] | null;
  consultation_fee: number | null;
  years_of_experience: number | null;
  bio: string | null;
  clinic_name: string | null;
  available_days: string[] | null;
  available_hours: any | null;
  full_name: string | null;
  avatar_url: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
};

// Fallback table shapes (loose)
type SpecialistRow = {
  id: string;
  user_id: string;
  specialty?: string | null;        // sometimes profession or CSV of specs
  specializations?: string[] | null;// preferred array
  experience_years?: number | null;
  verified?: boolean | null;
  is_active?: boolean | null;
  is_marketplace_ready?: boolean | null;
  verification_status?: string | null;
  consultation_fee?: number | null;
  bio?: string | null;
  clinic_name?: string | null;
  address?: string | null;
  available_days?: string[] | null;
  available_hours?: any | null;
  rating?: number | null;
};

type ProfileRow = {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  profession?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

interface Doctor {
  id: string;
  userId: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  reviews: number;
  experience: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  price?: string;
  nextAvailable?: string | null;
  specializations: string[];
  bio: string;
  hospital: string;
}

const WEEK_ORDER = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;

function computeNextAvailable(
  availableDays: string[] = [],
  availableHours: any = { start: "09:00", end: "17:00" }
) {
  try {
    const now = new Date();
    const daysSet = new Set(availableDays.map((d) => d.toLowerCase()));

    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dow = WEEK_ORDER[d.getDay()];
      if (!daysSet.has(dow)) continue;

      let start = "09:00";
      let end = "17:00";

      if (availableHours && typeof availableHours === "object") {
        if (availableHours[dow]) {
          start = availableHours[dow].startTime || availableHours[dow].start || start;
          end = availableHours[dow].endTime   || availableHours[dow].end   || end;
        } else if (availableHours.start && availableHours.end) {
          start = availableHours.start;
          end   = availableHours.end;
