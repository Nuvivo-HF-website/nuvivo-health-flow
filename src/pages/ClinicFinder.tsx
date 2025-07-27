import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Calendar, 
  Search,
  Filter,
  Navigation,
  Droplets,
  Users,
  Car
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const clinics = [
  // London & South East England
  {
    id: 1,
    name: "Harley Street Blood Centre",
    address: "25 Harley Street, London W1G 9QW",
    city: "London",
    region: "England",
    phone: "020 7636 8333",
    rating: 4.9,
    distance: "0.5 miles",
    openingHours: "Mon-Fri: 7:00-18:00, Sat: 8:00-16:00",
    services: ["Fasting Blood Tests", "Standard Blood Tests", "Health Screenings", "Home Visits"],
    facilities: ["Parking Available", "Wheelchair Access", "Air Conditioning", "WiFi"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.5194,
    lng: -0.1448,
    registrationNumber: "HBC2019001",
    certifications: ["CQC Registered", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 2,
    name: "Canary Wharf Health Hub",
    address: "1 Churchill Place, London E14 5HP",
    city: "London",
    region: "England",
    phone: "020 7712 1234",
    rating: 4.8,
    distance: "2.1 miles",
    openingHours: "Mon-Fri: 6:30-19:00, Sat: 8:00-14:00",
    services: ["Express Blood Tests", "Corporate Health", "Nutrition Testing"],
    facilities: ["Underground Parking", "Cafe", "Express Service"],
    appointments: ["Same Day", "Next Day"],
    lat: 51.5045,
    lng: -0.0194,
    registrationNumber: "CWH2020002",
    certifications: ["CQC Registered", "ISO 15189"]
  },
  {
    id: 3,
    name: "Brighton Medical Centre",
    address: "45 Western Road, Brighton BN1 2EB",
    city: "Brighton",
    region: "England",
    phone: "01273 555 789",
    rating: 4.7,
    distance: "48.3 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-13:00",
    services: ["Standard Blood Tests", "Allergy Testing", "Hormone Testing"],
    facilities: ["Street Parking", "Wheelchair Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 50.8225,
    lng: -0.1372,
    registrationNumber: "BMC2018003",
    certifications: ["CQC Registered", "UKAS Accredited"]
  },
  {
    id: 16,
    name: "Westminster Health Labs",
    address: "67 Victoria Street, London SW1H 0HW",
    city: "London",
    region: "England",
    phone: "020 7834 5678",
    rating: 4.8,
    distance: "1.2 miles",
    openingHours: "Mon-Fri: 7:30-18:30, Sat: 8:30-15:00",
    services: ["Executive Health Checks", "STI Testing", "Travel Medicine"],
    facilities: ["Valet Parking", "Private Rooms", "Same Day Results"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.4975,
    lng: -0.1357,
    registrationNumber: "WHL2021004",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 17,
    name: "Kensington Health Suite",
    address: "123 High Street Kensington, London W8 5SF",
    city: "London",
    region: "England",
    phone: "020 7937 2468",
    rating: 4.9,
    distance: "2.8 miles",
    openingHours: "Mon-Fri: 8:00-19:00, Sat: 9:00-17:00, Sun: 10:00-14:00",
    services: ["Premium Health Screenings", "Genetic Testing", "Wellness Programs"],
    facilities: ["Luxury Waiting Area", "Concierge Service", "Refreshments"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.5008,
    lng: -0.1925,
    registrationNumber: "KHS2022005",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited", "Private Healthcare UK"]
  },
  {
    id: 18,
    name: "Greenwich Peninsula Medical",
    address: "89 Greenwich High Road, London SE10 8JL",
    city: "London",
    region: "England",
    phone: "020 8858 1234",
    rating: 4.6,
    distance: "8.5 miles",
    openingHours: "Mon-Fri: 7:00-18:00, Sat: 8:00-16:00",
    services: ["Community Health", "Family Testing", "Preventive Care"],
    facilities: ["Free Parking", "Play Area", "Family Friendly"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.4892,
    lng: 0.0648,
    registrationNumber: "GPM2019006",
    certifications: ["CQC Good", "ISO 15189"]
  },
  {
    id: 19,
    name: "Richmond Upon Thames Clinic",
    address: "45 The Quadrant, Richmond TW9 1DN",
    city: "Richmond",
    region: "England",
    phone: "020 8940 3456",
    rating: 4.7,
    distance: "12.3 miles",
    openingHours: "Mon-Fri: 8:00-17:30, Sat: 9:00-13:00",
    services: ["Standard Testing", "Sports Medicine", "Occupational Health"],
    facilities: ["Riverside Location", "Public Transport", "Wheelchair Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 51.4613,
    lng: -0.3037,
    registrationNumber: "RTC2020007",
    certifications: ["CQC Good", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 20,
    name: "Oxford Street Medical Centre",
    address: "234 Oxford Street, London W1C 1DE",
    city: "London",
    region: "England",
    phone: "020 7629 7890",
    rating: 4.5,
    distance: "0.8 miles",
    openingHours: "Mon-Fri: 7:00-20:00, Sat: 8:00-18:00",
    services: ["Walk-in Services", "Tourist Health", "Emergency Testing"],
    facilities: ["Central Location", "Extended Hours", "Multilingual Staff"],
    appointments: ["Same Day", "Walk-in"],
    lat: 51.5154,
    lng: -0.1447,
    registrationNumber: "OSM2018008",
    certifications: ["CQC Registered", "ISO 15189"]
  },

  // South East England Extended
  {
    id: 21,
    name: "Canterbury Cathedral Medical",
    address: "78 St. Margaret's Street, Canterbury CT1 2TG",
    city: "Canterbury",
    region: "England",
    phone: "01227 456 789",
    rating: 4.6,
    distance: "58.2 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-13:00",
    services: ["Heritage Health Checks", "Pilgrimage Medical", "Standard Testing"],
    facilities: ["Historic Building", "Tourist Friendly", "Parking Available"],
    appointments: ["Next Day", "Weekly"],
    lat: 51.2802,
    lng: 1.0789,
    registrationNumber: "CCM2019009",
    certifications: ["CQC Good", "ISO 15189"]
  },
  {
    id: 22,
    name: "Guildford Health Plaza",
    address: "156 High Street, Guildford GU1 3HZ",
    city: "Guildford",
    region: "England",
    phone: "01483 567 890",
    rating: 4.8,
    distance: "32.1 miles",
    openingHours: "Mon-Fri: 7:30-18:30, Sat: 8:00-16:00",
    services: ["Corporate Wellness", "University Health", "Comprehensive Panels"],
    facilities: ["Shopping Centre Location", "Student Discounts", "Express Service"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.2362,
    lng: -0.5704,
    registrationNumber: "GHP2021010",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 23,
    name: "Eastbourne Seafront Clinic",
    address: "67 Terminus Road, Eastbourne BN21 3NW",
    city: "Eastbourne",
    region: "England",
    phone: "01323 789 012",
    rating: 4.4,
    distance: "67.8 miles",
    openingHours: "Mon-Fri: 8:30-17:00, Sat: 9:00-13:00",
    services: ["Retirement Health", "Seasonal Testing", "Basic Panels"],
    facilities: ["Seafront Views", "Senior Friendly", "Ground Floor Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 50.7687,
    lng: 0.2854,
    registrationNumber: "ESC2018011",
    certifications: ["CQC Good", "ISO 15189"]
  },

  // Midlands & North England Extended
  {
    id: 4,
    name: "Birmingham Blood Lab",
    address: "78 Corporation Street, Birmingham B4 6SX",
    city: "Birmingham",
    region: "England",
    phone: "0121 234 5678",
    rating: 4.6,
    distance: "95.2 miles",
    openingHours: "Mon-Fri: 7:30-18:00, Sat: 8:00-15:00",
    services: ["Comprehensive Health Panels", "Diabetes Testing", "Cardiac Markers"],
    facilities: ["Multi-storey Parking", "Wheelchair Access", "Children's Area"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 52.4814,
    lng: -1.8998,
    registrationNumber: "BBL2019012",
    certifications: ["CQC Good", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 5,
    name: "Manchester Medical Labs",
    address: "123 Deansgate, Manchester M3 2BW",
    city: "Manchester",
    region: "England",
    phone: "0161 789 0123",
    rating: 4.8,
    distance: "162.5 miles",
    openingHours: "Mon-Fri: 7:00-19:00, Sat: 8:00-16:00",
    services: ["Full Blood Count", "Liver Function", "Kidney Function", "Sports Medicine"],
    facilities: ["Secure Parking", "Fast Track Service", "Online Results"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 53.4794,
    lng: -2.2453,
    registrationNumber: "MML2020013",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 6,
    name: "Liverpool Health Centre",
    address: "56 Bold Street, Liverpool L1 4DS",
    city: "Liverpool",
    region: "England",
    phone: "0151 456 7890",
    rating: 4.5,
    distance: "178.9 miles",
    openingHours: "Mon-Fri: 8:00-17:30, Sat: 9:00-14:00",
    services: ["Standard Blood Tests", "Travel Health", "Occupational Health"],
    facilities: ["Public Transport Links", "Wheelchair Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 53.4048,
    lng: -2.9916,
    registrationNumber: "LHC2018014",
    certifications: ["CQC Good", "ISO 15189"]
  },
  {
    id: 7,
    name: "Leeds Diagnostic Centre",
    address: "89 The Headrow, Leeds LS1 6HW",
    city: "Leeds",
    region: "England",
    phone: "0113 567 8901",
    rating: 4.7,
    distance: "185.4 miles",
    openingHours: "Mon-Fri: 7:30-18:30, Sat: 8:00-15:00",
    services: ["Comprehensive Testing", "Women's Health", "Men's Health"],
    facilities: ["City Centre Parking", "Express Results", "Comfortable Waiting Area"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 53.7997,
    lng: -1.5492,
    registrationNumber: "LDC2019015",
    certifications: ["CQC Good", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 8,
    name: "Newcastle Blood Services",
    address: "34 Grey Street, Newcastle NE1 6AE",
    city: "Newcastle",
    region: "England",
    phone: "0191 234 5678",
    rating: 4.6,
    distance: "248.7 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-13:00",
    services: ["Standard Panels", "Infectious Disease Testing", "Nutritional Analysis"],
    facilities: ["Metro Access", "Wheelchair Access", "Family Friendly"],
    appointments: ["Next Day", "Weekly"],
    lat: 54.9738,
    lng: -1.6131,
    registrationNumber: "NBS2020016",
    certifications: ["CQC Good", "ISO 15189"]
  },
  {
    id: 24,
    name: "Nottingham City Health Lab",
    address: "45 Market Square, Nottingham NG1 2DR",
    city: "Nottingham",
    region: "England",
    phone: "0115 876 5432",
    rating: 4.7,
    distance: "123.4 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-15:00",
    services: ["University Health", "Research Studies", "Student Wellness"],
    facilities: ["City Centre", "Student Rates", "Research Partnership"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 52.9548,
    lng: -1.1581,
    registrationNumber: "NCH2021017",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 25,
    name: "Sheffield Steel City Labs",
    address: "78 Fargate, Sheffield S1 2HD",
    city: "Sheffield",
    region: "England",
    phone: "0114 567 8901",
    rating: 4.6,
    distance: "167.2 miles",
    openingHours: "Mon-Fri: 7:30-18:00, Sat: 8:30-14:00",
    services: ["Industrial Health", "Metalworkers Testing", "Environmental Health"],
    facilities: ["Industrial Access", "Occupational Focus", "Quick Turnaround"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 53.3811,
    lng: -1.4701,
    registrationNumber: "SCL2019018",
    certifications: ["CQC Good", "ISO 15189", "HSE Approved"]
  },
  {
    id: 26,
    name: "Derby County Medical",
    address: "67 Iron Gate, Derby DE1 3GL",
    city: "Derby",
    region: "England",
    phone: "01332 345 678",
    rating: 4.5,
    distance: "128.7 miles",
    openingHours: "Mon-Fri: 8:00-17:30, Sat: 9:00-13:00",
    services: ["Automotive Industry Health", "Standard Testing", "Pre-employment"],
    facilities: ["Industry Partnerships", "Quick Service", "Parking Available"],
    appointments: ["Next Day", "Weekly"],
    lat: 52.9225,
    lng: -1.4746,
    registrationNumber: "DCM2020019",
    certifications: ["CQC Good", "ISO 15189"]
  },
  {
    id: 27,
    name: "Leicester Royal Health",
    address: "123 Granby Street, Leicester LE1 6FB",
    city: "Leicester",
    region: "England",
    phone: "0116 234 5678",
    rating: 4.8,
    distance: "108.9 miles",
    openingHours: "Mon-Fri: 7:00-19:00, Sat: 8:00-16:00",
    services: ["Multicultural Health", "Community Outreach", "Diabetes Screening"],
    facilities: ["Multilingual Staff", "Cultural Sensitivity", "Community Focus"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 52.6369,
    lng: -1.1398,
    registrationNumber: "LRH2021020",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited"]
  },

  // Wales Extended
  {
    id: 9,
    name: "Cardiff Bay Health Lab",
    address: "12 Bute Street, Cardiff CF10 5BZ",
    city: "Cardiff",
    region: "Wales",
    phone: "029 2034 5678",
    rating: 4.8,
    distance: "132.6 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-15:00",
    services: ["Full Health Assessments", "Thyroid Testing", "Vitamin Deficiency"],
    facilities: ["Waterfront Parking", "Bay Views", "Modern Equipment"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.4816,
    lng: -3.1791,
    registrationNumber: "CBH2019021",
    certifications: ["HIW Registered", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 10,
    name: "Swansea Medical Labs",
    address: "67 High Street, Swansea SA1 1LN",
    city: "Swansea",
    region: "Wales",
    phone: "01792 345 678",
    rating: 4.5,
    distance: "162.8 miles",
    openingHours: "Mon-Fri: 8:30-17:00, Sat: 9:00-13:00",
    services: ["Basic Health Checks", "Allergy Panels", "Hormone Analysis"],
    facilities: ["Town Centre Location", "Public Parking", "Bilingual Service"],
    appointments: ["Next Day", "Weekly"],
    lat: 51.6214,
    lng: -3.9436,
    registrationNumber: "SML2018022",
    certifications: ["HIW Registered", "ISO 15189"]
  },
  {
    id: 11,
    name: "Newport Blood Centre",
    address: "23 Commercial Road, Newport NP20 2PS",
    city: "Newport",
    region: "Wales",
    phone: "01633 456 789",
    rating: 4.4,
    distance: "125.3 miles",
    openingHours: "Mon-Fri: 8:00-17:30",
    services: ["Standard Blood Tests", "Health Screenings"],
    facilities: ["Free Parking", "Wheelchair Access"],
    appointments: ["Weekly"],
    lat: 51.5842,
    lng: -2.9977,
    registrationNumber: "NBC2020023",
    certifications: ["HIW Registered", "ISO 15189"]
  },
  {
    id: 28,
    name: "Bangor University Health",
    address: "45 High Street, Bangor LL57 1UL",
    city: "Bangor",
    region: "Wales",
    phone: "01248 567 890",
    rating: 4.6,
    distance: "245.7 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-13:00",
    services: ["Student Health", "Research Participation", "Academic Studies"],
    facilities: ["University Campus", "Student Discounts", "Research Facilities"],
    appointments: ["Next Day", "Weekly"],
    lat: 53.2280,
    lng: -4.1291,
    registrationNumber: "BUH2021024",
    certifications: ["HIW Registered", "ISO 15189", "Academic Partnership"]
  },
  {
    id: 29,
    name: "Wrexham Border Health",
    address: "78 Regent Street, Wrexham LL11 1SA",
    city: "Wrexham",
    region: "Wales",
    phone: "01978 234 567",
    rating: 4.3,
    distance: "198.4 miles",
    openingHours: "Mon-Fri: 8:30-17:00",
    services: ["Cross-border Health", "Industrial Testing", "Community Health"],
    facilities: ["Border Location", "English/Welsh Service", "Industrial Access"],
    appointments: ["Next Day", "Weekly"],
    lat: 53.0478,
    lng: -2.9916,
    registrationNumber: "WBH2019025",
    certifications: ["HIW Registered", "ISO 15189"]
  },

  // Scotland Extended
  {
    id: 12,
    name: "Edinburgh Royal Lab",
    address: "45 Princes Street, Edinburgh EH2 2BY",
    city: "Edinburgh",
    region: "Scotland",
    phone: "0131 225 6789",
    rating: 4.9,
    distance: "345.2 miles",
    openingHours: "Mon-Fri: 7:30-18:30, Sat: 8:00-16:00",
    services: ["Comprehensive Health Panels", "Genetic Testing", "Executive Health"],
    facilities: ["City Centre", "Valet Parking", "Historic Building", "Premium Service"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 55.9533,
    lng: -3.1883,
    registrationNumber: "ERL2019026",
    certifications: ["Healthcare Improvement Scotland", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 13,
    name: "Glasgow Health Hub",
    address: "78 Buchanan Street, Glasgow G1 3BA",
    city: "Glasgow",
    region: "Scotland",
    phone: "0141 334 5678",
    rating: 4.7,
    distance: "389.4 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-15:00",
    services: ["Full Blood Analysis", "Sports Performance", "Wellness Checks"],
    facilities: ["Shopping District", "Public Transport", "Modern Facilities"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 55.8642,
    lng: -4.2518,
    registrationNumber: "GHH2020027",
    certifications: ["Healthcare Improvement Scotland", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 14,
    name: "Aberdeen Medical Centre",
    address: "34 Union Street, Aberdeen AB11 6BD",
    city: "Aberdeen",
    region: "Scotland",
    phone: "01224 567 890",
    rating: 4.6,
    distance: "462.7 miles",
    openingHours: "Mon-Fri: 8:00-17:00, Sat: 9:00-14:00",
    services: ["Standard Testing", "Offshore Worker Health", "Oil Industry Medicals"],
    facilities: ["Industrial Access", "Quick Service", "Specialised Testing"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 57.1497,
    lng: -2.0943,
    registrationNumber: "AMC2018028",
    certifications: ["Healthcare Improvement Scotland", "ISO 15189", "HSE Approved"]
  },
  {
    id: 15,
    name: "Dundee Blood Lab",
    address: "12 Reform Street, Dundee DD1 1RJ",
    city: "Dundee",
    region: "Scotland",
    phone: "01382 234 567",
    rating: 4.5,
    distance: "418.9 miles",
    openingHours: "Mon-Fri: 8:30-17:30",
    services: ["Health Assessments", "University Research", "Student Health"],
    facilities: ["University District", "Student Discounts", "Research Partnership"],
    appointments: ["Next Day", "Weekly"],
    lat: 56.4620,
    lng: -2.9707,
    registrationNumber: "DBL2019029",
    certifications: ["Healthcare Improvement Scotland", "ISO 15189"]
  },
  {
    id: 30,
    name: "Stirling Castle Medical",
    address: "56 Port Street, Stirling FK8 2EJ",
    city: "Stirling",
    region: "Scotland",
    phone: "01786 345 678",
    rating: 4.7,
    distance: "378.5 miles",
    openingHours: "Mon-Fri: 8:00-17:30, Sat: 9:00-14:00",
    services: ["Highland Health", "Tourism Medicine", "Historic Health Tours"],
    facilities: ["Historic Location", "Tourist Services", "Scenic Views"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 56.1165,
    lng: -3.9369,
    registrationNumber: "SCM2021030",
    certifications: ["Healthcare Improvement Scotland", "ISO 15189", "Tourism Approved"]
  },
  {
    id: 31,
    name: "Inverness Highland Health",
    address: "89 High Street, Inverness IV1 1HY",
    city: "Inverness",
    region: "Scotland",
    phone: "01463 567 890",
    rating: 4.4,
    distance: "456.8 miles",
    openingHours: "Mon-Fri: 8:30-17:00, Sat: 9:00-13:00",
    services: ["Highland Community Health", "Rural Medicine", "Remote Diagnostics"],
    facilities: ["Highland Access", "Remote Consultation", "Telemedicine"],
    appointments: ["Next Day", "Weekly"],
    lat: 57.4778,
    lng: -4.2247,
    registrationNumber: "IHH2020031",
    certifications: ["Healthcare Improvement Scotland", "ISO 15189", "Rural Health Certified"]
  },

  // Northern Ireland
  {
    id: 32,
    name: "Belfast City Health Centre",
    address: "123 Royal Avenue, Belfast BT1 1DA",
    city: "Belfast",
    region: "Northern Ireland",
    phone: "028 9032 4567",
    rating: 4.8,
    distance: "312.5 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-15:00",
    services: ["Comprehensive Health Checks", "Peace Process Health", "Community Wellness"],
    facilities: ["City Centre", "Secure Parking", "Cultural Sensitivity"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 54.5973,
    lng: -5.9301,
    registrationNumber: "BCH2019032",
    certifications: ["RQIA Registered", "ISO 15189", "UKAS Accredited"]
  },
  {
    id: 33,
    name: "Derry-Londonderry Border Lab",
    address: "45 Strand Road, Derry BT48 7AB",
    city: "Derry",
    region: "Northern Ireland", 
    phone: "028 7126 7890",
    rating: 4.5,
    distance: "378.9 miles",
    openingHours: "Mon-Fri: 8:30-17:30",
    services: ["Cross-border Health", "EU Health Cards", "Travel Medicine"],
    facilities: ["Border Crossing", "EU Standards", "Bilingual Service"],
    appointments: ["Next Day", "Weekly"],
    lat: 54.9966,
    lng: -7.3086,
    registrationNumber: "DLB2020033",
    certifications: ["RQIA Registered", "ISO 15189", "EU Compliant"]
  },

  // South West England
  {
    id: 34,
    name: "Plymouth Naval Medical",
    address: "67 Union Street, Plymouth PL1 3EZ",
    city: "Plymouth",
    region: "England",
    phone: "01752 567 890",
    rating: 4.6,
    distance: "234.7 miles",
    openingHours: "Mon-Fri: 7:30-18:00, Sat: 8:00-14:00",
    services: ["Naval Health", "Maritime Medicine", "Seafarer Medicals"],
    facilities: ["Naval Access", "Maritime Certified", "Quick Turnaround"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 50.3755,
    lng: -4.1427,
    registrationNumber: "PNM2019034",
    certifications: ["CQC Good", "ISO 15189", "MCA Approved"]
  },
  {
    id: 35,
    name: "Bath Royal Crescent Health",
    address: "45 Gay Street, Bath BA1 2NT",
    city: "Bath",
    region: "England",
    phone: "01225 345 678",
    rating: 4.9,
    distance: "97.8 miles",
    openingHours: "Mon-Fri: 8:00-18:00, Sat: 9:00-16:00",
    services: ["Heritage Health", "Spa Wellness", "Luxury Health Checks"],
    facilities: ["Historic Building", "Spa Services", "Luxury Amenities"],
    appointments: ["Same Day", "Next Day", "Weekly"],
    lat: 51.3811,
    lng: -2.3590,
    registrationNumber: "BRC2021035",
    certifications: ["CQC Outstanding", "ISO 15189", "UKAS Accredited", "UNESCO Heritage"]
  },
  {
    id: 36,
    name: "Exeter Cathedral Medical",
    address: "78 High Street, Exeter EX4 3LS",
    city: "Exeter",
    region: "England",
    phone: "01392 234 567",
    rating: 4.5,
    distance: "178.3 miles",
    openingHours: "Mon-Fri: 8:30-17:30, Sat: 9:00-13:00",
    services: ["Regional Health Hub", "University Health", "Rural Outreach"],
    facilities: ["University Partnership", "Rural Access", "Student Services"],
    appointments: ["Next Day", "Weekly"],
    lat: 50.7184,
    lng: -3.5339,
    registrationNumber: "ECM2020036",
    certifications: ["CQC Good", "ISO 15189", "University Accredited"]
  }
];

const ClinicFinder = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedServices, setSelectedServices] = useState("all");
  const [filteredClinics, setFilteredClinics] = useState(clinics);
  const [postcode, setPostcode] = useState("");
  const [nearestClinics, setNearestClinics] = useState<any[]>([]);
  const { toast } = useToast();

  // Simple distance calculator (approximate for UK postcodes)
  const calculateDistance = (postcode: string, clinicLocation: string) => {
    // This is a simplified distance calculation for demo purposes
    // In a real app, you'd use a proper geocoding service
    const postcodeMap: { [key: string]: { region: string; priority: number } } = {
      'W1': { region: 'London', priority: 1 },
      'SW1': { region: 'London', priority: 1 },
      'E14': { region: 'London', priority: 1 },
      'M3': { region: 'Manchester', priority: 2 },
      'B4': { region: 'Birmingham', priority: 2 },
      'CF10': { region: 'Cardiff', priority: 3 },
      'EH2': { region: 'Edinburgh', priority: 4 }
    };

    const inputPrefix = postcode.replace(/\s/g, '').substring(0, 2).toUpperCase();
    const match = postcodeMap[inputPrefix];
    
    if (match) {
      return clinics
        .filter(clinic => clinic.city.includes(match.region) || clinic.region === 'England')
        .map(clinic => ({
          ...clinic,
          calculatedDistance: match.priority + Math.random() * 5
        }))
        .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
        .slice(0, 3);
    }
    
    return clinics.slice(0, 3);
  };

  const handlePostcodeSearch = () => {
    if (postcode.trim()) {
      const nearest = calculateDistance(postcode, '');
      setNearestClinics(nearest);
      toast({
        title: "Clinics Found",
        description: `Found ${nearest.length} clinics near ${postcode.toUpperCase()}`,
      });
    }
  };

  const handleSearch = () => {
    let filtered = clinics;

    if (searchTerm) {
      filtered = filtered.filter(clinic => 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter(clinic => clinic.region === selectedRegion);
    }

    if (selectedServices !== "all") {
      filtered = filtered.filter(clinic => 
        clinic.services.some(service => service.toLowerCase().includes(selectedServices.toLowerCase()))
      );
    }

    setFilteredClinics(filtered);
  };

  const handleBooking = (clinicId: number) => {
    const clinic = clinics.find(c => c.id === clinicId);
    toast({
      title: "Booking initiated",
      description: `Booking blood draw at ${clinic?.name}`,
    });
  };

  const getDirections = (clinic: any) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Find a Blood Draw Clinic</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Locate partner clinics near you for convenient blood draws. Professional phlebotomists, 
              fast service, and comprehensive testing available across England, Wales, and Scotland.
            </p>
          </div>

          {/* Postcode Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Find Clinics Near Your Postcode
              </CardTitle>
              <CardDescription>
                Enter your postcode to find the nearest blood draw clinics in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your postcode (e.g., SW1A 1AA)"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePostcodeSearch()}
                    className="w-full"
                  />
                </div>
                <Button onClick={handlePostcodeSearch} disabled={!postcode.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Find Nearest
                </Button>
              </div>

              {/* Nearest Clinics Results */}
              {nearestClinics.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">
                    Nearest Clinics to {postcode.toUpperCase()}:
                  </h3>
                  <div className="grid gap-3">
                    {nearestClinics.map((clinic, index) => (
                      <div key={clinic.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <h4 className="font-medium">{clinic.name}</h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{clinic.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{clinic.address}</p>
                          <p className="text-xs text-muted-foreground">{clinic.openingHours}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant="secondary">
                            {clinic.calculatedDistance ? `${clinic.calculatedDistance.toFixed(1)} miles` : clinic.distance}
                          </Badge>
                          <div>
                            <Button 
                              size="sm" 
                              onClick={() => handleBooking(clinic.id)}
                              className="w-full"
                            >
                              Book Here
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Browse All Clinics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by city, clinic name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                    <SelectItem value="Wales">Wales</SelectItem>
                    <SelectItem value="Scotland">Scotland</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedServices} onValueChange={setSelectedServices}>
                  <SelectTrigger className="md:w-48">
                    <SelectValue placeholder="Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="fasting">Fasting Tests</SelectItem>
                    <SelectItem value="standard">Standard Tests</SelectItem>
                    <SelectItem value="health">Health Screenings</SelectItem>
                    <SelectItem value="specialist">Specialist Tests</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} className="md:w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} 
              {selectedRegion !== "all" && ` in ${selectedRegion}`}
            </p>
          </div>

          {/* Clinics Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-primary" />
                        {clinic.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{clinic.rating}</span>
                        </div>
                        <Badge variant="outline">{clinic.region}</Badge>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <MapPin className="w-3 h-3 mr-1" />
                      {clinic.distance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{clinic.address}</p>
                        <p className="text-sm text-muted-foreground">{clinic.city}, {clinic.region}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{clinic.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{clinic.openingHours}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Available Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {clinic.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {clinic.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{clinic.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Facilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {clinic.facilities.slice(0, 3).map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Appointment Availability:</p>
                    <div className="flex gap-1">
                      {clinic.appointments.map((availability, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-green-700 border-green-200">
                          {availability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => navigate('/booking')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Blood Draw
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => getDirections(clinic)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Partner Clinics?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">Expert Phlebotomists</h3>
                  <p className="text-sm text-muted-foreground">Trained professionals ensuring comfortable and safe blood draws</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold mb-2">Quick Service</h3>
                  <p className="text-sm text-muted-foreground">Fast appointments with minimal waiting times</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-semibold mb-2">Convenient Locations</h3>
                  <p className="text-sm text-muted-foreground">Clinics across England, Wales, and Scotland</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Car className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2">Easy Access</h3>
                  <p className="text-sm text-muted-foreground">Parking and public transport links available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicFinder;