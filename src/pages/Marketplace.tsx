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
    bio: "Specialist in preventive cardiology and heart disease management. Passionate about helping patients maintain healthy hearts through lifestyle and medical interventions.",
    hospital: "Royal London Hospital"
  },
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
    bio: "Leading dermatologist specializing in skin cancer detection and cosmetic procedures. Regular speaker at international conferences.",
    hospital: "Manchester Royal Infirmary"
  },
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
    bio: "Endocrinologist with expertise in diabetes management and hormonal disorders. Focused on personalised treatment plans.",
    hospital: "Queen Elizabeth Hospital"
  },
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
    bio: "Neurologist specializing in movement disorders and epilepsy. Research focus on innovative treatment approaches.",
    hospital: "Royal Infirmary of Edinburgh"
  },
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
    bio: "Psychiatrist with a holistic approach to mental health. Combines traditional therapy with modern treatment methods.",
    hospital: "Bristol Royal Hospital"
  },
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
    bio: "Orthopedic surgeon specializing in sports injuries and joint replacement. Team physician for professional athletes.",
    hospital: "Leeds General Infirmary"
  }
];

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [likedDoctors, setLikedDoctors] = useState<Set<string>>(new Set());

  const specialties = ["All", "Cardiology", "Dermatology", "Endocrinology", "Neurology", "Psychiatry", "Orthopedics"];

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