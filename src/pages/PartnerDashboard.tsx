import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar,
  Briefcase,
  DollarSign,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Settings,
  FileText,
  Users,
  TestTube,
  Upload,
  Download,
  Gift,
  MessageCircle,
  Copy,
  Share2,
  MessageSquare
} from "lucide-react";
import SimplifiedBookingCalendar from "@/components/SimplifiedBookingCalendar";
import BookingCalendar from "@/components/BookingCalendar";
import ModeToggle from "@/components/ModeToggle";
import MicroAutomations from "@/components/MicroAutomations";

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Mock user data for micro-automations
  const userData = {
    completedBookings: 7,
    profileComplete: false, // Trigger automation
    hasAvailability: true,
    name: "Dr. John Smith",
    isActive: true
  };
  
  // Generate unique referral code (in real app, this would come from backend)
  const referralCode = "NUV-JS123";
  const referralUrl = `${window.location.origin}/join-professional?ref=${referralCode}`;
  
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Mock referral data
  const mockReferrals = [
    {
      id: 1,
      referredName: "Dr. Sarah Wilson",
      joinedDate: "2024-01-10",
      bookingsCompleted: 7,
      rewardPaid: true,
      status: "Active"
    },
    {
      id: 2,
      referredName: "Nurse Emma Taylor", 
      joinedDate: "2024-01-20",
      bookingsCompleted: 3,
      rewardPaid: false,
      status: "Active"
    }
  ];

  // Mock data for demonstration
  const mockServices = [
    {
      id: 1,
      name: "General Consultation",
      description: "Standard GP consultation for general health concerns",
      duration: "30 minutes",
      price: "£65",
      type: "Video",
      isActive: true
    },
    {
      id: 2,
      name: "Blood Pressure Check",
      description: "Home visit for blood pressure monitoring",
      duration: "20 minutes", 
      price: "£45",
      type: "Home Visit",
      isActive: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Partner Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {userData.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Profile Active
              </Badge>
              {/* WhatsApp Support */}
              <Button variant="outline" size="sm" className="md:hidden">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <ModeToggle 
          isSimpleMode={isSimpleMode} 
          onModeChange={setIsSimpleMode}
        />

        {/* Micro Automations */}
        <MicroAutomations
          completedBookings={userData.completedBookings}
          profileComplete={userData.profileComplete}
          hasAvailability={userData.hasAvailability}
        />

        {/* Quick Stats - Mobile optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£2,340</div>
              <p className="text-xs text-muted-foreground">+20.1%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+12%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">⭐⭐⭐⭐⭐</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard - Simplified Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Earnings</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
            </TabsList>

            {/* More Menu - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("documents")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Documents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("referrals")}>
                  <Users className="mr-2 h-4 w-4" />
                  Refer & Earn
                </DropdownMenuItem>
                {!isSimpleMode && (
                  <DropdownMenuItem onClick={() => setActiveTab("tests")}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test Orders
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Calendar Tab - Main Focus */}
          <TabsContent value="calendar" className="space-y-6">
            {isSimpleMode ? (
              <SimplifiedBookingCalendar isSimpleMode={isSimpleMode} />
            ) : (
              <BookingCalendar />
            )}
          </TabsContent>

          {/* Services Tab - Streamlined */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">My Services</h3>
                <p className="text-sm text-muted-foreground">Services you offer to patients</p>
              </div>
              <Button className="animate-fade-in">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>

            <div className="grid gap-4">
              {mockServices.map((service) => (
                <Card key={service.id} className="hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">{service.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span><strong>Duration:</strong> {service.duration}</span>
                          <span><strong>Price:</strong> {service.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Earnings Tab - Simplified */}
          <TabsContent value="earnings" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Earnings Overview</h3>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£1,950</div>
                    <p className="text-sm text-muted-foreground">12 completed appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Next Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£875</div>
                    <p className="text-sm text-muted-foreground">15th January 2024</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£8,420</div>
                    <p className="text-sm text-muted-foreground">Since joining</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">General Consultation</p>
                          <p className="text-sm text-muted-foreground">Sarah Johnson - 12/01/2024</p>
                        </div>
                        <Badge variant="default">£65</Badge>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Statement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Documents & Certifications</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Indemnity Insurance</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">DBS/PVG Check</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Professional Certificates</span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Download Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Referral Template</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Onboarding Guide</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Nuvivo Branding Kit</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Earnings Overview</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£2,340</div>
                    <p className="text-sm text-muted-foreground">15 completed appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Last Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£1,950</div>
                    <p className="text-sm text-muted-foreground">12 completed appointments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Next Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">£875</div>
                    <p className="text-sm text-muted-foreground">15th January 2024</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">General Consultation</p>
                          <p className="text-sm text-muted-foreground">Sarah Johnson - 12/01/2024</p>
                        </div>
                        <Badge variant="default">£65</Badge>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice Summary
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Refer & Earn</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Referral Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      💸 Invite another healthcare professional to join Nuvivo and get £100 when they complete 5 bookings.
                    </div>
                    <div className="space-y-2">
                      <Label>Share your personal invite link:</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={referralUrl} 
                          readOnly
                          className="text-xs"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={copyReferralLink}
                          className="shrink-0"
                        >
                          {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      {copySuccess && (
                        <p className="text-xs text-green-600">Link copied to clipboard!</p>
                      )}
                    </div>
                    <Button className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Referral Link
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Referral Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">2</div>
                        <div className="text-xs text-green-700">Total Referrals</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1</div>
                        <div className="text-xs text-blue-700">Pending Rewards</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-3xl font-bold text-primary">£100</div>
                      <div className="text-sm text-primary">Total Earned</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>My Referrals</CardTitle>
                  <CardDescription>Track your referred partners and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReferrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium">{referral.referredName}</h4>
                            <Badge 
                              variant={referral.status === "Pending Reward" ? "default" : "secondary"}
                            >
                              {referral.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Joined: {referral.joinedDate} • {referral.bookingsCompleted}/5 bookings completed
                          </div>
                        </div>
                        <div className="text-right">
                          {referral.rewardPaid ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              £100 Paid
                            </Badge>
                          ) : referral.bookingsCompleted >= 5 ? (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                              £100 Pending
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {5 - referral.bookingsCompleted} more bookings
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>Terms:</strong> Only verified partners with a minimum of 5 completed bookings are eligible to refer. 
                    Referred partners must also complete 5 bookings to trigger the reward. Self-referrals and duplicate emails are automatically blocked.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Support & Help</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="Brief description of your issue" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="payment">Payment Question</SelectItem>
                          <SelectItem value="booking">Booking Problem</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea placeholder="Describe your issue in detail..." rows={4} />
                    </div>
                    <Button>Submit Ticket</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        View FAQ
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Support WhatsApp
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Download User Guide
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Support Hours:</strong></p>
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Weekend: Emergency support only</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}