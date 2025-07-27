import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Heart, MessageCircle, Search, Filter, Clock, Verified } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mockDoctors = [
  // Cardiology Specialists
  {
    id: "1",
    name: "Dr. Sarah Chen",
    specialty: "Cardiology",
    location: "London, UK",
    rating: 4.9,
    reviews: 234,
    experience: "15+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£120/consultation",
    nextAvailable: "Today 3:00 PM",
    tags: ["Heart Health", "Preventive Care", "Hypertension"],
    followers: 1248,
    posts: 89,
    bio: "Specialist in preventive cardiology and heart disease management. GMC Number: 1234567",
    hospital: "Royal London Hospital",
    gmcNumber: "1234567"
  },
  {
    id: "7",
    name: "Dr. Richard Thompson",
    specialty: "Cardiology",
    location: "Edinburgh, UK",
    rating: 4.8,
    reviews: 189,
    experience: "22+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£140/consultation",
    nextAvailable: "Tomorrow 2:00 PM",
    tags: ["Heart Surgery", "Valve Repair", "Arrhythmia"],
    followers: 1567,
    posts: 156,
    bio: "Consultant cardiac surgeon with expertise in minimally invasive procedures. GMC Number: 2345678",
    hospital: "Royal Infirmary of Edinburgh",
    gmcNumber: "2345678"
  },
  {
    id: "8",
    name: "Dr. Maria Rodriguez",
    specialty: "Cardiology",
    location: "Manchester, UK",
    rating: 4.9,
    reviews: 298,
    experience: "18+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£125/consultation",
    nextAvailable: "Wed 10:00 AM",
    tags: ["Interventional Cardiology", "Stents", "Angioplasty"],
    followers: 2134,
    posts: 203,
    bio: "Leading interventional cardiologist specializing in complex coronary procedures. GMC Number: 3456789",
    hospital: "Manchester Royal Infirmary",
    gmcNumber: "3456789"
  },

  // Dermatology Specialists
  {
    id: "2",
    name: "Dr. Michael Roberts",
    specialty: "Dermatology", 
    location: "Manchester, UK",
    rating: 4.8,
    reviews: 189,
    experience: "12+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£95/consultation",
    nextAvailable: "Tomorrow 10:30 AM",
    tags: ["Skin Cancer", "Acne Treatment", "Cosmetic Dermatology"],
    followers: 892,
    posts: 156,
    bio: "Leading dermatologist specializing in skin cancer detection and cosmetic procedures. GMC Number: 4567890",
    hospital: "Manchester Royal Infirmary",
    gmcNumber: "4567890"
  },
  {
    id: "9",
    name: "Dr. Jennifer Walsh",
    specialty: "Dermatology",
    location: "Birmingham, UK",
    rating: 4.7,
    reviews: 167,
    experience: "14+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£110/consultation",
    nextAvailable: "Today 4:30 PM",
    tags: ["Pediatric Dermatology", "Eczema", "Psoriasis"],
    followers: 743,
    posts: 89,
    bio: "Specialist in pediatric and adult dermatology with focus on inflammatory conditions. GMC Number: 5678901",
    hospital: "Birmingham Children's Hospital",
    gmcNumber: "5678901"
  },
  {
    id: "10",
    name: "Dr. Anthony Clarke",
    specialty: "Dermatology",
    location: "London, UK",
    rating: 4.9,
    reviews: 312,
    experience: "20+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£150/consultation",
    nextAvailable: "Today 6:00 PM",
    tags: ["Mohs Surgery", "Melanoma", "Reconstructive Surgery"],
    followers: 1876,
    posts: 245,
    bio: "Consultant dermatologist and Mohs surgeon specializing in skin cancer treatment. GMC Number: 6789012",
    hospital: "Guy's and St Thomas' NHS Foundation Trust",
    gmcNumber: "6789012"
  },

  // Endocrinology Specialists
  {
    id: "3",
    name: "Dr. Emily Watson",
    specialty: "Endocrinology",
    location: "Birmingham, UK",
    rating: 4.9,
    reviews: 127,
    experience: "18+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£85/consultation",
    nextAvailable: "Today 5:15 PM",
    tags: ["Diabetes", "Thyroid", "Hormone Therapy"],
    followers: 675,
    posts: 73,
    bio: "Endocrinologist with expertise in diabetes management and hormonal disorders. GMC Number: 7890123",
    hospital: "Queen Elizabeth Hospital",
    gmcNumber: "7890123"
  },
  {
    id: "11",
    name: "Dr. Hassan Ahmed",
    specialty: "Endocrinology",
    location: "Leeds, UK",
    rating: 4.8,
    reviews: 203,
    experience: "16+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£115/consultation",
    nextAvailable: "Thu 11:00 AM",
    tags: ["PCOS", "Infertility", "Reproductive Endocrinology"],
    followers: 934,
    posts: 134,
    bio: "Specialist in reproductive endocrinology and fertility disorders. GMC Number: 8901234",
    hospital: "Leeds Teaching Hospitals NHS Trust",
    gmcNumber: "8901234"
  },

  // Neurology Specialists
  {
    id: "4",
    name: "Dr. James Kumar",
    specialty: "Neurology",
    location: "Edinburgh, UK", 
    rating: 4.7,
    reviews: 203,
    experience: "20+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£150/consultation",
    nextAvailable: "Wed 2:00 PM",
    tags: ["Migraine", "Epilepsy", "Movement Disorders"],
    followers: 1456,
    posts: 112,
    bio: "Neurologist specializing in movement disorders and epilepsy. GMC Number: 9012345",
    hospital: "Royal Infirmary of Edinburgh",
    gmcNumber: "9012345"
  },
  {
    id: "12",
    name: "Dr. Catherine Murray",
    specialty: "Neurology",
    location: "Glasgow, UK",
    rating: 4.8,
    reviews: 156,
    experience: "19+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£135/consultation",
    nextAvailable: "Tomorrow 9:30 AM",
    tags: ["Stroke", "Multiple Sclerosis", "Dementia"],
    followers: 1123,
    posts: 98,
    bio: "Consultant neurologist specializing in stroke medicine and neurodegenerative diseases. GMC Number: 0123456",
    hospital: "Queen Elizabeth University Hospital",
    gmcNumber: "0123456"
  },

  // Psychiatry Specialists
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialty: "Psychiatry",
    location: "Bristol, UK",
    rating: 4.8,
    reviews: 298,
    experience: "14+ years", 
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£110/consultation",
    nextAvailable: "Today 6:30 PM",
    tags: ["Depression", "Anxiety", "Therapy"],
    followers: 2341,
    posts: 187,
    bio: "Psychiatrist with a holistic approach to mental health. GMC Number: 1357924",
    hospital: "Bristol Royal Hospital",
    gmcNumber: "1357924"
  },
  {
    id: "13",
    name: "Dr. Robert Singh",
    specialty: "Psychiatry",
    location: "Cardiff, UK",
    rating: 4.7,
    reviews: 234,
    experience: "17+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£125/consultation",
    nextAvailable: "Fri 1:00 PM",
    tags: ["ADHD", "Autism", "Child Psychiatry"],
    followers: 1567,
    posts: 123,
    bio: "Child and adolescent psychiatrist specializing in neurodevelopmental disorders. GMC Number: 2468135",
    hospital: "University Hospital of Wales",
    gmcNumber: "2468135"
  },

  // Orthopedics Specialists
  {
    id: "6",
    name: "Dr. David Park",
    specialty: "Orthopedics",
    location: "Leeds, UK",
    rating: 4.6,
    reviews: 156,
    experience: "16+ years",
    avatar: "/placeholder.svg", 
    isVerified: true,
    isOnline: false,
    price: "£130/consultation",
    nextAvailable: "Thu 9:00 AM",
    tags: ["Sports Medicine", "Joint Replacement", "Spine Surgery"],
    followers: 743,
    posts: 94,
    bio: "Orthopedic surgeon specializing in sports injuries and joint replacement. GMC Number: 3691470",
    hospital: "Leeds General Infirmary",
    gmcNumber: "3691470"
  },
  {
    id: "14",
    name: "Dr. Sophie Williams",
    specialty: "Orthopedics",
    location: "Oxford, UK",
    rating: 4.9,
    reviews: 189,
    experience: "21+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£160/consultation",
    nextAvailable: "Tomorrow 11:00 AM",
    tags: ["Hip Replacement", "Knee Surgery", "Arthroscopy"],
    followers: 1234,
    posts: 156,
    bio: "Senior consultant orthopedic surgeon with expertise in joint replacement surgery. GMC Number: 4815162",
    hospital: "John Radcliffe Hospital",
    gmcNumber: "4815162"
  },

  // Gastroenterology Specialists
  {
    id: "15",
    name: "Dr. Ahmed Hassan",
    specialty: "Gastroenterology",
    location: "London, UK",
    rating: 4.8,
    reviews: 167,
    experience: "15+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£140/consultation",
    nextAvailable: "Today 3:45 PM",
    tags: ["IBD", "Endoscopy", "Liver Disease"],
    followers: 876,
    posts: 112,
    bio: "Consultant gastroenterologist specializing in inflammatory bowel disease. GMC Number: 5926384",
    hospital: "King's College Hospital",
    gmcNumber: "5926384"
  },
  {
    id: "16",
    name: "Dr. Rachel Green",
    specialty: "Gastroenterology",
    location: "Newcastle, UK",
    rating: 4.7,
    reviews: 134,
    experience: "13+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£120/consultation",
    nextAvailable: "Wed 2:30 PM",
    tags: ["Hepatology", "Colonoscopy", "GERD"],
    followers: 654,
    posts: 89,
    bio: "Hepatologist and gastroenterologist with expertise in liver disorders. GMC Number: 7051738",
    hospital: "Freeman Hospital",
    gmcNumber: "7051738"
  },

  // Pulmonology Specialists
  {
    id: "17",
    name: "Dr. Mark Johnson",
    specialty: "Pulmonology",
    location: "Liverpool, UK",
    rating: 4.8,
    reviews: 145,
    experience: "18+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£135/consultation",
    nextAvailable: "Today 4:00 PM",
    tags: ["Asthma", "COPD", "Sleep Apnea"],
    followers: 789,
    posts: 67,
    bio: "Respiratory medicine consultant specializing in chronic lung conditions. GMC Number: 8162940",
    hospital: "Royal Liverpool University Hospital",
    gmcNumber: "8162940"
  },
  {
    id: "18",
    name: "Dr. Priya Patel",
    specialty: "Pulmonology",
    location: "Sheffield, UK",
    rating: 4.9,
    reviews: 178,
    experience: "16+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£125/consultation",
    nextAvailable: "Thu 10:15 AM",
    tags: ["Lung Cancer", "Bronchoscopy", "Pulmonary Fibrosis"],
    followers: 923,
    posts: 145,
    bio: "Consultant in respiratory medicine with expertise in lung cancer diagnosis. GMC Number: 9274051",
    hospital: "Sheffield Teaching Hospitals",
    gmcNumber: "9274051"
  },

  // Ophthalmology Specialists
  {
    id: "19",
    name: "Dr. Helen Carter",
    specialty: "Ophthalmology",
    location: "Cambridge, UK",
    rating: 4.9,
    reviews: 223,
    experience: "19+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£145/consultation",
    nextAvailable: "Tomorrow 1:30 PM",
    tags: ["Cataract Surgery", "Retinal Disorders", "Glaucoma"],
    followers: 1456,
    posts: 189,
    bio: "Consultant ophthalmologist specializing in vitreoretinal surgery. GMC Number: 0385162",
    hospital: "Addenbrooke's Hospital",
    gmcNumber: "0385162"
  },
  {
    id: "20",
    name: "Dr. Thomas Brown",
    specialty: "Ophthalmology",
    location: "Nottingham, UK",
    rating: 4.7,
    reviews: 156,
    experience: "14+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£130/consultation",
    nextAvailable: "Fri 9:00 AM",
    tags: ["LASIK", "Corneal Transplant", "Pediatric Ophthalmology"],
    followers: 687,
    posts: 98,
    bio: "Corneal specialist and refractive surgeon with expertise in LASIK procedures. GMC Number: 1496273",
    hospital: "Nottingham University Hospitals",
    gmcNumber: "1496273"
  },

  // Urology Specialists
  {
    id: "21",
    name: "Dr. Peter Wilson",
    specialty: "Urology",
    location: "Southampton, UK",
    rating: 4.8,
    reviews: 189,
    experience: "20+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£155/consultation",
    nextAvailable: "Today 5:30 PM",
    tags: ["Prostate Cancer", "Kidney Stones", "Robotic Surgery"],
    followers: 1123,
    posts: 134,
    bio: "Consultant urologist specializing in minimally invasive and robotic procedures. GMC Number: 2507384",
    hospital: "Southampton General Hospital",
    gmcNumber: "2507384"
  },
  {
    id: "22",
    name: "Dr. Sarah Khan",
    specialty: "Urology",
    location: "Plymouth, UK",
    rating: 4.6,
    reviews: 143,
    experience: "12+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£125/consultation",
    nextAvailable: "Mon 2:00 PM",
    tags: ["Female Urology", "Incontinence", "Pelvic Floor"],
    followers: 567,
    posts: 76,
    bio: "Specialist in female urology and reconstructive pelvic surgery. GMC Number: 3618495",
    hospital: "Derriford Hospital",
    gmcNumber: "3618495"
  },

  // Rheumatology Specialists
  {
    id: "23",
    name: "Dr. Victoria Scott",
    specialty: "Rheumatology",
    location: "Bath, UK",
    rating: 4.8,
    reviews: 167,
    experience: "17+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£140/consultation",
    nextAvailable: "Tomorrow 10:00 AM",
    tags: ["Rheumatoid Arthritis", "Lupus", "Osteoporosis"],
    followers: 834,
    posts: 123,
    bio: "Consultant rheumatologist with expertise in autoimmune and inflammatory conditions. GMC Number: 4729506",
    hospital: "Royal United Hospitals Bath",
    gmcNumber: "4729506"
  },
  {
    id: "24",
    name: "Dr. Christopher Lee",
    specialty: "Rheumatology",
    location: "York, UK",
    rating: 4.7,
    reviews: 134,
    experience: "15+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: false,
    price: "£130/consultation",
    nextAvailable: "Wed 3:15 PM",
    tags: ["Psoriatic Arthritis", "Fibromyalgia", "Gout"],
    followers: 678,
    posts: 89,
    bio: "Rheumatologist specializing in complex arthritis and connective tissue disorders. GMC Number: 5840617",
    hospital: "York Teaching Hospital",
    gmcNumber: "5840617"
  },

  // Oncology Specialists
  {
    id: "25",
    name: "Dr. Andrew Mitchell",
    specialty: "Oncology",
    location: "London, UK",
    rating: 4.9,
    reviews: 298,
    experience: "22+ years",
    avatar: "/placeholder.svg",
    isVerified: true,
    isOnline: true,
    price: "£180/consultation",
    nextAvailable: "Today 2:15 PM",
    tags: ["Breast Cancer", "Chemotherapy", "Immunotherapy"],
    followers: 2456,
    posts: 234,
    bio: "Leading medical oncologist specializing in breast and gynecological cancers. GMC Number: 6951728",
    hospital: "The Royal Marsden Hospital",
    gmcNumber: "6951728"
  }
];

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [likedDoctors, setLikedDoctors] = useState<Set<string>>(new Set());

  const specialties = ["All", "Cardiology", "Dermatology", "Endocrinology", "Neurology", "Psychiatry", "Orthopedics", "Gastroenterology", "Pulmonology", "Ophthalmology", "Urology", "Rheumatology", "Oncology"];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === "" || selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const toggleLike = (doctorId: string) => {
    const newLiked = new Set(likedDoctors);
    if (newLiked.has(doctorId)) {
      newLiked.delete(doctorId);
    } else {
      newLiked.add(doctorId);
    }
    setLikedDoctors(newLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Doctor Marketplace</h1>
          <p className="text-muted-foreground text-lg">Connect with verified medical professionals</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search doctors, specialties, or conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className="rounded-full"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {doctor.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                        {doctor.isVerified && (
                          <Verified className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(doctor.id)}
                    className="p-2"
                  >
                    <Heart className={`w-4 h-4 ${likedDoctors.has(doctor.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span>({doctor.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {doctor.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Social Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{doctor.followers} followers</span>
                  <span>{doctor.posts} posts</span>
                  <span>{doctor.experience}</span>
                </div>

                {/* Availability & Price */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-success" />
                      <span className="text-success font-medium">{doctor.nextAvailable}</span>
                    </div>
                    <span className="font-semibold text-accent">{doctor.price}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => navigate(`/service/cardiology-consultation`)}
                    >
                      Book Consultation
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => navigate(`/service/cardiology-consultation`)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Doctors
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;